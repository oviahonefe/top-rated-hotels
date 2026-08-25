import { Types } from "mongoose";

import { AppError } from "../../utils/app-error.js";
import { ApartmentModel } from "../properties/apartment.model.js";
import { HotelModel } from "../properties/hotel.model.js";
import {
  AvailabilityModel,
  type PropertyKind,
} from "./availability.model.js";
import type {
  OccupancyQuery,
  SetInventoryBlockInput,
  SetInventoryInput,
} from "./inventory.validation.js";

type ResolvedInventoryUnit = {
  propertyId: Types.ObjectId;
  propertyKind: PropertyKind;
  unitKey: string;
  defaultInventory: number;
};

function parseDate(value: string, label: string) {
  const date = new Date(`${value}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime())) {
    throw new AppError(`${label} is invalid.`, 400);
  }

  return date;
}

function getStayDates(startDate: Date, endDate: Date) {
  if (endDate <= startDate) {
    throw new AppError(
      "End date must be after start date.",
      400,
    );
  }

  const dates: Date[] = [];
  const cursor = new Date(startDate);

  while (cursor < endDate) {
    dates.push(new Date(cursor));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return dates;
}

function getDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

async function resolveInventoryUnit(input: {
  propertyId: string;
  propertyKind: PropertyKind;
  unitKey: string;
}): Promise<ResolvedInventoryUnit> {
  if (!Types.ObjectId.isValid(input.propertyId)) {
    throw new AppError("Property ID is invalid.", 400);
  }

  if (input.propertyKind === "apartment") {
    if (input.unitKey !== "default") {
      throw new AppError(
        "Apartments must use the default unit.",
        400,
      );
    }

    const apartment = await ApartmentModel.findById(
      input.propertyId,
    ).lean();

    if (!apartment) {
      throw new AppError("Apartment not found.", 404);
    }

    return {
      propertyId: new Types.ObjectId(String(apartment._id)),
      propertyKind: "apartment",
      unitKey: "default",
      defaultInventory: apartment.totalUnits,
    };
  }

  const hotel = await HotelModel.findById(
    input.propertyId,
  ).lean();

  if (!hotel) {
    throw new AppError("Hotel not found.", 404);
  }

  const room = hotel.rooms.find((item) => {
    const roomId = (item as typeof item & {
      _id?: unknown;
    })._id;

    return String(roomId) === input.unitKey;
  });

  if (!room) {
    throw new AppError("Hotel room type not found.", 404);
  }

  return {
    propertyId: new Types.ObjectId(String(hotel._id)),
    propertyKind: "hotel",
    unitKey: input.unitKey,
    defaultInventory: room.totalUnits,
  };
}

async function ensureDateEntry(input: {
  unit: ResolvedInventoryUnit;
  date: Date;
}) {
  await AvailabilityModel.updateOne(
    {
      propertyId: input.unit.propertyId,
      propertyKind: input.unit.propertyKind,
      unitKey: input.unit.unitKey,
      date: input.date,
    },
    {
      $setOnInsert: {
        totalInventory: input.unit.defaultInventory,
        reservedInventory: 0,
        isBlocked: false,
      },
    },
    { upsert: true },
  );
}

export async function setInventoryBlock(
  input: SetInventoryBlockInput,
) {
  const unit = await resolveInventoryUnit(input);
  const dates = getStayDates(
    parseDate(input.startDate, "Start date"),
    parseDate(input.endDate, "End date"),
  );

  for (const date of dates) {
    await ensureDateEntry({ unit, date });

    const update = input.isBlocked
      ? {
          $set: {
            isBlocked: true,
            blockReason: input.reason?.trim(),
          },
        }
      : {
          $set: {
            isBlocked: false,
          },
          $unset: {
            blockReason: 1,
          },
        };

    await AvailabilityModel.updateOne(
      {
        propertyId: unit.propertyId,
        propertyKind: unit.propertyKind,
        unitKey: unit.unitKey,
        date,
      },
      update,
    );
  }

  return {
    updatedDates: dates.length,
    isBlocked: input.isBlocked,
  };
}

export async function setInventory(
  input: SetInventoryInput,
) {
  const unit = await resolveInventoryUnit(input);
  const dates = getStayDates(
    parseDate(input.startDate, "Start date"),
    parseDate(input.endDate, "End date"),
  );

  for (const date of dates) {
    await ensureDateEntry({ unit, date });

    const updated = await AvailabilityModel.findOneAndUpdate(
      {
        propertyId: unit.propertyId,
        propertyKind: unit.propertyKind,
        unitKey: unit.unitKey,
        date,
        reservedInventory: {
          $lte: input.totalInventory,
        },
      },
      {
        $set: {
          totalInventory: input.totalInventory,
        },
      },
      {
        new: true,
      },
    );

    if (!updated) {
      throw new AppError(
        "Inventory cannot be reduced below existing reservations.",
        409,
      );
    }
  }

  return {
    updatedDates: dates.length,
    totalInventory: input.totalInventory,
  };
}

export async function getOccupancy(
  input: OccupancyQuery,
) {
  const unit = await resolveInventoryUnit(input);
  const dates = getStayDates(
    parseDate(input.startDate, "Start date"),
    parseDate(input.endDate, "End date"),
  );

  const entries = await AvailabilityModel.find({
    propertyId: unit.propertyId,
    propertyKind: unit.propertyKind,
    unitKey: unit.unitKey,
    date: {
      $in: dates,
    },
  }).lean();

  const byDate = new Map(
    entries.map((entry) => [
      getDateKey(entry.date),
      entry,
    ]),
  );

  return {
    propertyId: String(unit.propertyId),
    propertyKind: unit.propertyKind,
    unitKey: unit.unitKey,
    dates: dates.map((date) => {
      const entry = byDate.get(getDateKey(date));

      const totalInventory =
        entry?.totalInventory ?? unit.defaultInventory;

      const reservedInventory =
        entry?.reservedInventory ?? 0;

      return {
        date: getDateKey(date),
        totalInventory,
        reservedInventory,
        availableInventory: Math.max(
          0,
          totalInventory - reservedInventory,
        ),
        isBlocked: entry?.isBlocked ?? false,
        blockReason: entry?.blockReason,
      };
    }),
  };
}