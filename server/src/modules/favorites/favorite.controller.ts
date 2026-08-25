import type { Request, RequestHandler } from "express";

import { AppError } from "../../utils/app-error.js";
import { asyncHandler } from "../../utils/async-handler.js";
import {
  createFavorite,
  getRecommendations,
  listFavorites,
  removeFavorite,
} from "./favorite.service.js";
import type { CreateFavoriteInput } from "./favorite.validation.js";

function getUserId(req: Request) {
  if (!req.auth?.userId) {
    throw new AppError("Authentication is required.", 401);
  }

  return req.auth.userId;
}

function getPropertyParams(req: Request): {
  propertyId: string;
  propertyKind: "hotel" | "apartment";
} {
  const propertyId = req.params.propertyId;
  const propertyKind = req.params.propertyKind;

  if (typeof propertyId !== "string" || !propertyId) {
    throw new AppError("Property ID is required.", 400);
  }

  if (
    propertyKind !== "hotel" &&
    propertyKind !== "apartment"
  ) {
    throw new AppError("Property kind is invalid.", 400);
  }

  return {
    propertyId,
    propertyKind,
  };
}

export const createFavoriteController: RequestHandler =
  asyncHandler(async (req, res) => {
    const favorite = await createFavorite(
      getUserId(req),
      req.body as CreateFavoriteInput,
    );

    res.status(201).json({
      success: true,
      data: favorite,
    });
  });

export const listFavoritesController: RequestHandler =
  asyncHandler(async (req, res) => {
    const favorites = await listFavorites(getUserId(req));

    res.status(200).json({
      success: true,
      data: favorites,
    });
  });

export const removeFavoriteController: RequestHandler =
  asyncHandler(async (req, res) => {
    const { propertyId, propertyKind } =
      getPropertyParams(req);

    await removeFavorite(
      getUserId(req),
      propertyId,
      propertyKind,
    );

    res.status(200).json({
      success: true,
      message: "Property removed from favorites.",
    });
  });

export const recommendationsController: RequestHandler =
  asyncHandler(async (req, res) => {
    const recommendations = await getRecommendations(
      getUserId(req),
    );

    res.status(200).json({
      success: true,
      data: recommendations,
    });
  });