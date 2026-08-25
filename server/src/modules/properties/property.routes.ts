import { Router } from "express";

import { authenticate } from "../../middleware/authenticate.js";
import { requireAdmin } from "../../middleware/require-admin.js";
import { validateBody } from "../../middleware/validate.js";
import {
  archiveApartmentController,
  archiveHotelController,
  createApartmentController,
  createHotelController,
  getApartmentController,
  getHotelController,
  listApartmentsController,
  listHotelsController,
  updateApartmentController,
  updateHotelController,
} from "./property.controller.js";
import {
  createApartmentSchema,
  createHotelSchema,
  updateApartmentSchema,
  updateHotelSchema,
} from "./property.validation.js";

export const propertyRouter = Router();

propertyRouter.use(authenticate, requireAdmin);

propertyRouter
  .route("/hotels")
  .post(validateBody(createHotelSchema), createHotelController)
  .get(listHotelsController);

propertyRouter
  .route("/hotels/:id")
  .get(getHotelController)
  .patch(validateBody(updateHotelSchema), updateHotelController)
  .delete(archiveHotelController);

propertyRouter
  .route("/apartments")
  .post(
    validateBody(createApartmentSchema),
    createApartmentController,
  )
  .get(listApartmentsController);

propertyRouter
  .route("/apartments/:id")
  .get(getApartmentController)
  .patch(
    validateBody(updateApartmentSchema),
    updateApartmentController,
  )
  .delete(archiveApartmentController);