import slugify from "slugify";

import { AppError } from "../../utils/app-error.js";
import {
  ApartmentModel,
  type Apartment,
} from "./apartment.model.js";
import {
  HotelModel,
  type Hotel,
} from "./hotel.model.js";
import type {
  CreateApartmentInput,
  CreateHotelInput,
  UpdateApartmentInput,
  UpdateHotelInput,
} from "./property.validation.js";

function createBaseSlug(name: string) {
  return slugify(name, {
    lower: true,
    strict: true,
    trim: true,
  });
}

async function createUniqueSlug(
  name: string,
  exists: (slug: string) => Promise<boolean>,
) {
  const baseSlug = createBaseSlug(name) || "property";
  let slug = baseSlug;
  let suffix = 2;

  while (await exists(slug)) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

function normalizeKeywords(keywords: string[]) {
  return [...new Set(keywords.map((item) => item.toLowerCase()))];
}

function normalizeImages<
  T extends { url: string; alt: string; isPrimary: boolean },
>(images: T[]) {
  if (images.length === 0) {
    return [];
  }

  const primaryIndex = images.findIndex(
    (image) => image.isPrimary,
  );

  return images.map((image, index) => ({
    ...image,
    isPrimary:
      primaryIndex === -1 ? index === 0 : index === primaryIndex,
  }));
}

export async function createHotel(
  input: CreateHotelInput,
) {
  const slug = await createUniqueSlug(
    input.name,
    async (candidate) =>
      Boolean(await HotelModel.exists({ slug: candidate })),
  );

  return HotelModel.create({
    ...input,
    slug,
    source: "admin",
    images: normalizeImages(input.images),
    searchKeywords: normalizeKeywords(input.searchKeywords),
  });
}

export async function listHotels() {
  return HotelModel.find()
    .sort({ createdAt: -1 })
    .lean();
}

export async function getHotelById(id: string) {
  const hotel = await HotelModel.findById(id).lean();

  if (!hotel) {
    throw new AppError("Hotel not found.", 404);
  }

  return hotel;
}

export async function updateHotel(
  id: string,
  input: UpdateHotelInput,
) {
  const update: Partial<Hotel> = {
    ...input,
  };

  if (input.name) {
    update.slug = await createUniqueSlug(
      input.name,
      async (candidate) =>
        Boolean(
          await HotelModel.exists({
            slug: candidate,
            _id: { $ne: id },
          }),
        ),
    );
  }

  if (input.images) {
    update.images = normalizeImages(input.images);
  }

  if (input.searchKeywords) {
    update.searchKeywords = normalizeKeywords(
      input.searchKeywords,
    );
  }

  const hotel = await HotelModel.findByIdAndUpdate(
    id,
    { $set: update },
    { new: true, runValidators: true },
  );

  if (!hotel) {
    throw new AppError("Hotel not found.", 404);
  }

  return hotel;
}

export async function archiveHotel(id: string) {
  return updateHotel(id, { status: "archived" });
}

export async function createApartment(
  input: CreateApartmentInput,
) {
  const slug = await createUniqueSlug(
    input.name,
    async (candidate) =>
      Boolean(await ApartmentModel.exists({ slug: candidate })),
  );

  return ApartmentModel.create({
    ...input,
    slug,
    source: "admin",
    images: normalizeImages(input.images),
    searchKeywords: normalizeKeywords(input.searchKeywords),
  });
}

export async function listApartments() {
  return ApartmentModel.find()
    .sort({ createdAt: -1 })
    .lean();
}

export async function getApartmentById(id: string) {
  const apartment = await ApartmentModel.findById(id).lean();

  if (!apartment) {
    throw new AppError("Apartment not found.", 404);
  }

  return apartment;
}

export async function updateApartment(
  id: string,
  input: UpdateApartmentInput,
) {
  const update: Partial<Apartment> = {
    ...input,
  };

  if (input.name) {
    update.slug = await createUniqueSlug(
      input.name,
      async (candidate) =>
        Boolean(
          await ApartmentModel.exists({
            slug: candidate,
            _id: { $ne: id },
          }),
        ),
    );
  }

  if (input.images) {
    update.images = normalizeImages(input.images);
  }

  if (input.searchKeywords) {
    update.searchKeywords = normalizeKeywords(
      input.searchKeywords,
    );
  }

  const apartment = await ApartmentModel.findByIdAndUpdate(
    id,
    { $set: update },
    { new: true, runValidators: true },
  );

  if (!apartment) {
    throw new AppError("Apartment not found.", 404);
  }

  return apartment;
}

export async function archiveApartment(id: string) {
  return updateApartment(id, { status: "archived" });
}