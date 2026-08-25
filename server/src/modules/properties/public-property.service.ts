import {
  ApartmentModel,
  type Apartment,
} from "./apartment.model.js";
import {
  HotelModel,
  type Hotel,
} from "./hotel.model.js";
import type { CatalogueQuery } from "./public-property.validation.js";
import type { RoomOption } from "./property.types.js";


type PublicPropertyKind = "hotel" | "apartment";

type PublicProperty = {
  id: string;
  kind: PublicPropertyKind;
  name: string;
  slug: string;
  summary: string;
  tier: string;
  address: {
    country: string;
    city: string;
    region?: string;
  };
  featured: boolean;
  images: Array<{
    url: string;
    alt: string;
    isPrimary: boolean;
  }>;
  amenities: string[];
  starRating?: number;
  maxGuests?: number;
  bedrooms?: number;
  bathrooms?: number;
  fromNightlyRateCents: number;
};

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getPrimaryImage<
  T extends {
    url: string;
    alt: string;
    isPrimary: boolean;
  },
>(images: T[]) {
  return images.find((image) => image.isPrimary) ?? images[0];
}

function mapHotel(hotel: Record<string, any>): PublicProperty {
  const activeRooms = hotel.rooms.filter(
    (room: RoomOption) => room.isActive,
  );

  const rates = activeRooms.map(
    (room: RoomOption) => room.platformNightlyRateCents,
  );

  return {
    id: String(hotel._id),
    kind: "hotel",
    name: hotel.name,
    slug: hotel.slug,
    summary: hotel.summary,
    tier: hotel.tier,
    address: {
      country: hotel.address.country,
      city: hotel.address.city,
      region: hotel.address.region,
    },
    featured: hotel.featured,
    images: hotel.images,
    amenities: hotel.amenities,
    starRating: hotel.starRating,
    maxGuests: Math.max(
      0,
      ...activeRooms.map(
        (room: RoomOption) => room.maxGuests,
      ),
    ),
    fromNightlyRateCents: Math.min(...rates),
  };
}

function mapApartment(
  apartment: Record<string, any>,
): PublicProperty {
  return {
    id: String(apartment._id),
    kind: "apartment",
    name: apartment.name,
    slug: apartment.slug,
    summary: apartment.summary,
    tier: apartment.tier,
    address: {
      country: apartment.address.country,
      city: apartment.address.city,
      region: apartment.address.region,
    },
    featured: apartment.featured,
    images: apartment.images,
    amenities: apartment.amenities,
    maxGuests: apartment.maxGuests,
    bedrooms: apartment.bedrooms,
    bathrooms: apartment.bathrooms,
    fromNightlyRateCents:
      apartment.platformNightlyRateCents,
  };
}

function buildBaseFilter(query: CatalogueQuery) {
  const filter: Record<string, unknown> = {
    status: "published",
  };

  if (query.tier) {
    filter.tier = query.tier;
  }

  if (typeof query.featured === "boolean") {
    filter.featured = query.featured;
  }

  if (query.city) {
    filter["address.city"] = {
      $regex: escapeRegex(query.city),
      $options: "i",
    };
  }

  if (query.country) {
    filter["address.country"] = {
      $regex: escapeRegex(query.country),
      $options: "i",
    };
  }

  if (query.q) {
    const searchPattern = {
      $regex: escapeRegex(query.q),
      $options: "i",
    };

    filter.$or = [
      { name: searchPattern },
      { summary: searchPattern },
      { "address.city": searchPattern },
      { "address.country": searchPattern },
      { searchKeywords: searchPattern },
      { amenities: searchPattern },
    ];
  }

  return filter;
}

export async function listPublicProperties(
  query: CatalogueQuery,
) {
  const baseFilter = buildBaseFilter(query);
  const skip = (query.page - 1) * query.limit;

  const hotelFilter: Record<string, unknown> = {
    ...baseFilter,
  };

  const apartmentFilter: Record<string, unknown> = {
    ...baseFilter,
  };

  if (query.guests) {
    hotelFilter.rooms = {
      $elemMatch: {
        isActive: true,
        maxGuests: { $gte: query.guests },
      },
    };

    apartmentFilter.maxGuests = {
      $gte: query.guests,
    };
  }

  const shouldIncludeHotels =
    query.type === "all" || query.type === "hotel";

  const shouldIncludeApartments =
    query.type === "all" || query.type === "apartment";

  const [hotels, apartments, hotelCount, apartmentCount] =
    await Promise.all([
      shouldIncludeHotels
        ? HotelModel.find(hotelFilter).lean()
        : Promise.resolve([]),
      shouldIncludeApartments
        ? ApartmentModel.find(apartmentFilter).lean()
        : Promise.resolve([]),
      shouldIncludeHotels
        ? HotelModel.countDocuments(hotelFilter)
        : Promise.resolve(0),
      shouldIncludeApartments
        ? ApartmentModel.countDocuments(apartmentFilter)
        : Promise.resolve(0),
    ]);

  const properties = [
    ...hotels.map((hotel) => mapHotel(hotel)),
    ...apartments.map((apartment) =>
      mapApartment(apartment),
    ),
  ]
    .sort((left, right) => {
      if (left.featured !== right.featured) {
        return Number(right.featured) - Number(left.featured);
      }

      return left.name.localeCompare(right.name);
    })
    .slice(skip, skip + query.limit);

  const total = hotelCount + apartmentCount;

  return {
    properties,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / query.limit)),
    },
  };
}

export async function getPublicHotelBySlug(slug: string) {
  const hotel = await HotelModel.findOne({
    slug,
    status: "published",
  }).lean();

  return hotel
    ? mapHotel(hotel)
    : null;
}

export async function getPublicApartmentBySlug(slug: string) {
  const apartment = await ApartmentModel.findOne({
    slug,
    status: "published",
  }).lean();

  return apartment
    ? mapApartment(apartment)
    : null;
}

export async function getFeaturedProperties(limit = 8) {
  return listPublicProperties({
    type: "all",
    featured: true,
    page: 1,
    limit,
  });
}