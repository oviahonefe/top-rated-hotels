import { Router } from "express";
import multer from "multer";

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
import {
  deletePropertyImageController,
  setPrimaryPropertyImageController,
  uploadPropertyImagesController,
} from "./property-media.controller.js";

export const propertyRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: 5,
    fileSize: 8 * 1024 * 1024,
  },
  fileFilter: (_req, file, callback) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      callback(
        new Error(
          "Only JPEG, PNG, and WebP images are allowed.",
        ),
      );
      return;
    }

    callback(null, true);
  },
});

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

propertyRouter.post(
  "/:propertyKind/:propertyId/images",
  upload.array("images", 5),
  uploadPropertyImagesController,
);

propertyRouter.patch(
  "/:propertyKind/:propertyId/images/primary",
  setPrimaryPropertyImageController,
);

propertyRouter.delete(
  "/:propertyKind/:propertyId/images",
  deletePropertyImageController,
);