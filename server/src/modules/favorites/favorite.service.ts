import { Types } from "mongoose";

import { AppError } from "../../utils/app-error.js";
import { BookingModel } from "../bookings/booking.model.js";
import {
  ApartmentModel,
  type Apartment,
} from "../properties/apartment.model.js";
import {
  HotelModel,
  type Hotel,
} from "../properties/hotel.model.js";
import { listPublicProperties } from "../properties/public-property.service.js";
import { FavoriteModel } from "./favorite.model.js";
import type { CreateFavoriteInput } from "./favorite.validation.js";

function getPrimaryImageUrl(
  images: Array<{
    url: string;
    isPrimary: boolean;
  }>,
) {
  return (
    images.find(
      (image: { url: string; isPrimary: boolean }) =>
        image.isPrimary,
    )?.url ?? images[0]?.url
  );
}

function toFavoriteProperty(
  property: (Hotel | Apartment) & { _id: unknown },
  kind: "hotel" | "apartment",
) {
  return {
    id: String(property._id),
    kind,
    name: property.name,
    slug: property.slug,
    summary: property.summary,
    tier: property.tier,
    city: property.address.city,
    country: property.address.country,
    image: getPrimaryImageUrl(property.images),
  };
}

async function ensurePublishedPropertyExists(
  propertyId: string,
  propertyKind: "hotel" | "apartment",
) {
  if (!Types.ObjectId.isValid(propertyId)) {
    throw new AppError("Property ID is invalid.", 400);
  }

  if (propertyKind === "hotel") {
    const hotel = await HotelModel.exists({
      _id: propertyId,
      status: "published",
    });

    if (!hotel) {
      throw new AppError(
        "Property not found or unavailable.",
        404,
      );
    }

    return;
  }

  const apartment = await ApartmentModel.exists({
    _id: propertyId,
    status: "published",
  });

  if (!apartment) {
    throw new AppError(
      "Property not found or unavailable.",
      404,
    );
  }
}

export async function createFavorite(
  userId: string,
  input: CreateFavoriteInput,
) {
  if (!Types.ObjectId.isValid(userId)) {
    throw new AppError("User session is invalid.", 401);
  }

  await ensurePublishedPropertyExists(
    input.propertyId,
    input.propertyKind,
  );

  return FavoriteModel.findOneAndUpdate(
    {
      userId: new Types.ObjectId(userId),
      propertyId: new Types.ObjectId(input.propertyId),
      propertyKind: input.propertyKind,
    },
    {
      $setOnInsert: {
        userId: new Types.ObjectId(userId),
        propertyId: new Types.ObjectId(input.propertyId),
        propertyKind: input.propertyKind,
      },
    },
    {
      new: true,
      upsert: true,
    },
  );
}

export async function removeFavorite(
  userId: string,
  propertyId: string,
  propertyKind: "hotel" | "apartment",
) {
  if (!Types.ObjectId.isValid(propertyId)) {
    throw new AppError("Property ID is invalid.", 400);
  }

  const result = await FavoriteModel.deleteOne({
    userId,
    propertyId,
    propertyKind,
  });

  if (result.deletedCount === 0) {
    throw new AppError("Favorite not found.", 404);
  }
}

export async function listFavorites(userId: string) {
  const favorites = await FavoriteModel.find({
    userId,
  })
    .sort({ createdAt: -1 })
    .lean();

  const result = await Promise.all(
    favorites.map(async (favorite) => {
      if (favorite.propertyKind === "hotel") {
        const hotel = await HotelModel.findOne({
          _id: favorite.propertyId,
          status: "published",
        }).lean();

        if (!hotel) {
          return null;
        }

        return {
          favoriteId: String(favorite._id),
          savedAt: favorite.createdAt,
          property: toFavoriteProperty(
            hotel as Hotel & { _id: unknown },
            "hotel",
          ),
        };
      }

      const apartment = await ApartmentModel.findOne({
        _id: favorite.propertyId,
        status: "published",
      }).lean();

      if (!apartment) {
        return null;
      }

      return {
        favoriteId: String(favorite._id),
        savedAt: favorite.createdAt,
        property: toFavoriteProperty(
          apartment as Apartment & { _id: unknown },
          "apartment",
        ),
      };
    }),
  );

  return result.filter(
    (
      item,
    ): item is NonNullable<typeof item> => item !== null,
  );
}

export async function getRecommendations(userId: string) {
  const [bookings, favorites] = await Promise.all([
    BookingModel.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean(),
    FavoriteModel.find({ userId }).lean(),
  ]);

  const favoriteKeys = new Set(
    favorites.map(
      (favorite) =>
        `${favorite.propertyKind}:${String(
          favorite.propertyId,
        )}`,
    ),
  );

  const cities = [
    ...new Set(
      bookings
        .map((booking) =>
          booking.propertyLocation.split(",")[0]?.trim(),
        )
        .filter(
          (city): city is string =>
            Boolean(city && city.length > 0),
        ),
    ),
  ].slice(0, 3);

  const results = await Promise.all(
    cities.length > 0
      ? cities.map((city) =>
          listPublicProperties({
            city,
            type: "all",
            page: 1,
            limit: 12,
          }),
        )
      : [
          listPublicProperties({
            type: "all",
            featured: true,
            page: 1,
            limit: 12,
          }),
        ],
  );

  const seen = new Set<string>();

  return results
    .flatMap((result) => result.properties)
    .filter((property) => {
      const key = `${property.kind}:${property.id}`;

      if (seen.has(key) || favoriteKeys.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    })
    .slice(0, 12);
}