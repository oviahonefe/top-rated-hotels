import type { Request, RequestHandler } from "express";

import { AppError } from "../../utils/app-error.js";
import { asyncHandler } from "../../utils/async-handler.js";
import {
  archiveApartment,
  archiveHotel,
  createApartment,
  createHotel,
  getApartmentById,
  getHotelById,
  listApartments,
  listHotels,
  updateApartment,
  updateHotel,
} from "./property.service.js";
import type {
  CreateApartmentInput,
  CreateHotelInput,
  UpdateApartmentInput,
  UpdateHotelInput,
} from "./property.validation.js";

function getPropertyId(req: Request) {
  const id = req.params.id;

  if (typeof id !== "string" || !id.trim()) {
    throw new AppError("A valid property ID is required.", 400);
  }

  return id;
}

export const createHotelController: RequestHandler =
  asyncHandler(async (req, res) => {
    const hotel = await createHotel(req.body as CreateHotelInput);

    res.status(201).json({
      success: true,
      data: hotel,
    });
  });

export const listHotelsController: RequestHandler =
  asyncHandler(async (_req, res) => {
    const hotels = await listHotels();

    res.status(200).json({
      success: true,
      data: hotels,
    });
  });

export const getHotelController: RequestHandler =
  asyncHandler(async (req, res) => {
    const hotel = await getHotelById(getPropertyId(req));

    res.status(200).json({
      success: true,
      data: hotel,
    });
  });

export const updateHotelController: RequestHandler =
  asyncHandler(async (req, res) => {
    const hotel = await updateHotel(
      getPropertyId(req),
      req.body as UpdateHotelInput,
    );

    res.status(200).json({
      success: true,
      data: hotel,
    });
  });

export const archiveHotelController: RequestHandler =
  asyncHandler(async (req, res) => {
    const hotel = await archiveHotel(getPropertyId(req));

    res.status(200).json({
      success: true,
      data: hotel,
    });
  });

export const createApartmentController: RequestHandler =
  asyncHandler(async (req, res) => {
    const apartment = await createApartment(
      req.body as CreateApartmentInput,
    );

    res.status(201).json({
      success: true,
      data: apartment,
    });
  });

export const listApartmentsController: RequestHandler =
  asyncHandler(async (_req, res) => {
    const apartments = await listApartments();

    res.status(200).json({
      success: true,
      data: apartments,
    });
  });

export const getApartmentController: RequestHandler =
  asyncHandler(async (req, res) => {
    const apartment = await getApartmentById(
      getPropertyId(req),
    );

    res.status(200).json({
      success: true,
      data: apartment,
    });
  });

export const updateApartmentController: RequestHandler =
  asyncHandler(async (req, res) => {
    const apartment = await updateApartment(
      getPropertyId(req),
      req.body as UpdateApartmentInput,
    );

    res.status(200).json({
      success: true,
      data: apartment,
    });
  });

export const archiveApartmentController: RequestHandler =
  asyncHandler(async (req, res) => {
    const apartment = await archiveApartment(
      getPropertyId(req),
    );

    res.status(200).json({
      success: true,
      data: apartment,
    });
  });