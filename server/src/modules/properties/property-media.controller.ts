import type {
  Request,
  RequestHandler,
} from "express";
import { z } from "zod";

import { AppError } from "../../utils/app-error.js";
import { asyncHandler } from "../../utils/async-handler.js";
import {
  deletePropertyImage,
  setPrimaryPropertyImage,
  uploadPropertyImages,
} from "./property-media.service.js";

function getPropertyParams(req: Request): {
  propertyKind: "hotels" | "apartments";
  propertyId: string;
} {
  const propertyKind = req.params.propertyKind;
  const propertyId = req.params.propertyId;

  if (
    propertyKind !== "hotels" &&
    propertyKind !== "apartments"
  ) {
    throw new AppError("Property kind is invalid.", 400);
  }

  if (typeof propertyId !== "string" || !propertyId) {
    throw new AppError("Property ID is required.", 400);
  }

  return {
    propertyKind,
    propertyId,
  };
}

const imageActionSchema = z.object({
  publicId: z.string().trim().min(1),
});

export const uploadPropertyImagesController: RequestHandler =
  asyncHandler(async (req, res) => {
    const files = Array.isArray(req.files)
      ? req.files
      : [];

    const images = await uploadPropertyImages({
      ...getPropertyParams(req),
      files,
      altText:
        typeof req.body.altText === "string"
          ? req.body.altText
          : undefined,
    });

    res.status(201).json({
      success: true,
      data: images,
    });
  });

export const setPrimaryPropertyImageController: RequestHandler =
  asyncHandler(async (req, res) => {
    const body = imageActionSchema.parse(req.body);

    const images = await setPrimaryPropertyImage({
      ...getPropertyParams(req),
      publicId: body.publicId,
    });

    res.status(200).json({
      success: true,
      data: images,
    });
  });

export const deletePropertyImageController: RequestHandler =
  asyncHandler(async (req, res) => {
    const body = imageActionSchema.parse(req.body);

    const images = await deletePropertyImage({
      ...getPropertyParams(req),
      publicId: body.publicId,
    });

    res.status(200).json({
      success: true,
      data: images,
    });
  });