import { Router } from "express";

import { authenticate } from "../../middleware/authenticate.js";
import { validateBody } from "../../middleware/validate.js";
import {
  createFavoriteController,
  listFavoritesController,
  recommendationsController,
  removeFavoriteController,
} from "./favorite.controller.js";
import { createFavoriteSchema } from "./favorite.validation.js";

export const favoriteRouter = Router();

favoriteRouter.use(authenticate);

favoriteRouter.get(
  "/favorites",
  listFavoritesController,
);

favoriteRouter.post(
  "/favorites",
  validateBody(createFavoriteSchema),
  createFavoriteController,
);

favoriteRouter.delete(
  "/favorites/:propertyKind/:propertyId",
  removeFavoriteController,
);

favoriteRouter.get(
  "/recommendations",
  recommendationsController,
);