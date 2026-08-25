import { Router } from "express";

import { authenticate } from "../../middleware/authenticate.js";
import { requireAdmin } from "../../middleware/require-admin.js";
import { validateBody } from "../../middleware/validate.js";
import {
  getOccupancyController,
  setInventoryBlockController,
  setInventoryController,
} from "./inventory.controller.js";
import {
  setInventoryBlockSchema,
  setInventorySchema,
} from "./inventory.validation.js";

export const inventoryRouter = Router();

inventoryRouter.use(authenticate, requireAdmin);

inventoryRouter.get(
  "/occupancy",
  getOccupancyController,
);

inventoryRouter.post(
  "/blocks",
  validateBody(setInventoryBlockSchema),
  setInventoryBlockController,
);

inventoryRouter.post(
  "/inventory",
  validateBody(setInventorySchema),
  setInventoryController,
);