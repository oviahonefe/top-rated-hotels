import { Router } from "express";

import { authenticate } from "../../middleware/authenticate.js";
import { requireAdmin } from "../../middleware/require-admin.js";
import { validateBody } from "../../middleware/validate.js";
import {
  archivePaymentMethodController,
  createPaymentMethodController,
  listAdminPaymentMethodsController,
  listAvailablePaymentMethodsController,
  updatePaymentMethodController,
} from "./payment-method.controller.js";
import {
  createPaymentMethodSchema,
  updatePaymentMethodSchema,
} from "./payment-method.validation.js";

export const paymentMethodRouter = Router();

paymentMethodRouter.get(
  "/",
  authenticate,
  listAvailablePaymentMethodsController,
);

paymentMethodRouter.get(
  "/admin",
  authenticate,
  requireAdmin,
  listAdminPaymentMethodsController,
);

paymentMethodRouter.post(
  "/admin",
  authenticate,
  requireAdmin,
  validateBody(createPaymentMethodSchema),
  createPaymentMethodController,
);

paymentMethodRouter.patch(
  "/admin/:id",
  authenticate,
  requireAdmin,
  validateBody(updatePaymentMethodSchema),
  updatePaymentMethodController,
);

paymentMethodRouter.delete(
  "/admin/:id",
  authenticate,
  requireAdmin,
  archivePaymentMethodController,
);