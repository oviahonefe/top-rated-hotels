import type { ClientSession } from "mongoose";
import { Types } from "mongoose";

import {
  AvailabilityModel,
  type PropertyKind,
} from "./availability.model.js";
import { AppError } from "../../utils/app-error.js";

type InventoryReservationInput = {
  propertyId: Types.ObjectId;
  propertyKind: PropertyKind;
  unitKey: string;
  checkInDate: Date;
  checkOutDate: Date;
  totalInventory: number;
  session: ClientSession;
};

function getUtcDate(date: Date) {
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
    ),
  );
}

function getStayDates(checkInDate: Date, checkOutDate: Date) {
  const dates: Date[] = [];
  const cursor = getUtcDate(checkInDate);
  const end = getUtcDate(checkOutDate);

  while (cursor < end) {
    dates.push(new Date(cursor));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return dates;
}

export async function reserveInventory(
  input: InventoryReservationInput,
) {
  const stayDates = getStayDates(
    input.checkInDate,
    input.checkOutDate,
  );

  for (const date of stayDates) {
    const identity = {
      propertyId: input.propertyId,
      propertyKind: input.propertyKind,
      unitKey: input.unitKey,
      date,
    };

    await AvailabilityModel.updateOne(
      identity,
      {
        $setOnInsert: {
          totalInventory: input.totalInventory,
          reservedInventory: 0,
          isBlocked: false,
        },
      },
      {
        upsert: true,
        session: input.session,
      },
    );

    const reserved = await AvailabilityModel.findOneAndUpdate(
      {
        ...identity,
        isBlocked: false,
        $expr: {
          $lt: [
            "$reservedInventory",
            "$totalInventory",
          ],
        },
      },
      {
        $inc: {
          reservedInventory: 1,
        },
      },
      {
        new: true,
        session: input.session,
      },
    );

    if (!reserved) {
      throw new AppError(
        "This property is no longer available for every selected night.",
        409,
      );
    }
  }
}

export async function releaseInventory(
  input: Omit<InventoryReservationInput, "totalInventory">,
) {
  const stayDates = getStayDates(
    input.checkInDate,
    input.checkOutDate,
  );

  for (const date of stayDates) {
    await AvailabilityModel.updateOne(
      {
        propertyId: input.propertyId,
        propertyKind: input.propertyKind,
        unitKey: input.unitKey,
        date,
        reservedInventory: { $gt: 0 },
      },
      {
        $inc: {
          reservedInventory: -1,
        },
      },
      {
        session: input.session,
      },
    );
  }
}

export async function getAvailabilityForRange(input: {
  propertyId: string;
  propertyKind: PropertyKind;
  unitKey: string;
  checkInDate: Date;
  checkOutDate: Date;
}) {
  const stayDates = getStayDates(
    input.checkInDate,
    input.checkOutDate,
  );

  const entries = await AvailabilityModel.find({
    propertyId: new Types.ObjectId(input.propertyId),
    propertyKind: input.propertyKind,
    unitKey: input.unitKey,
    date: {
      $in: stayDates,
    },
  }).lean();

  return entries;
}