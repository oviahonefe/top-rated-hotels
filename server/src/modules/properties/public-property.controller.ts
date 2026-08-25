import type { RequestHandler } from "express";

import { AppError } from "../../utils/app-error.js";
import { asyncHandler } from "../../utils/async-handler.js";
import {
  getFeaturedProperties,
  getPublicApartmentBySlug,
  getPublicHotelBySlug,
  listPublicProperties,
} from "./public-property.service.js";
import { catalogueQuerySchema } from "./public-property.validation.js";

function getSlug(value: string | string[] | undefined) {
  if (typeof value !== "string" || !value.trim()) {
    throw new AppError("A valid property slug is required.", 400);
  }

  return value.trim().toLowerCase();
}

export const listPublicPropertiesController: RequestHandler =
  asyncHandler(async (req, res) => {
    const query = catalogueQuerySchema.parse(req.query);
    const result = await listPublicProperties(query);

    res.status(200).json({
      success: true,
      data: result,
    });
  });

export const getFeaturedPropertiesController: RequestHandler =
  asyncHandler(async (req, res) => {
    const result = await getFeaturedProperties(8);

    res.status(200).json({
      success: true,
      data: result,
    });
  });

export const getPublicHotelController: RequestHandler =
  asyncHandler(async (req, res) => {
    const hotel = await getPublicHotelBySlug(
      getSlug(req.params.slug),
    );

    if (!hotel) {
      throw new AppError("Hotel not found.", 404);
    }

    res.status(200).json({
      success: true,
      data: hotel,
    });
  });

export const getPublicApartmentController: RequestHandler =
  asyncHandler(async (req, res) => {
    const apartment = await getPublicApartmentBySlug(
      getSlug(req.params.slug),
    );

    if (!apartment) {
      throw new AppError("Apartment not found.", 404);
    }

    res.status(200).json({
      success: true,
      data: apartment,
    });
  });