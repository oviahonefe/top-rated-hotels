import { Router } from "express";

import {
  getFeaturedPropertiesController,
  getPublicApartmentController,
  getPublicHotelController,
  listPublicPropertiesController,
} from "./public-property.controller.js";

export const publicPropertyRouter = Router();

publicPropertyRouter.get(
  "/featured",
  getFeaturedPropertiesController,
);

publicPropertyRouter.get(
  "/",
  listPublicPropertiesController,
);

publicPropertyRouter.get(
  "/hotels/:slug",
  getPublicHotelController,
);

publicPropertyRouter.get(
  "/apartments/:slug",
  getPublicApartmentController,
);