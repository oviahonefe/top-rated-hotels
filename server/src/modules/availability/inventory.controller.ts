import type { RequestHandler } from "express";

import { asyncHandler } from "../../utils/async-handler.js";
import {
  getOccupancy,
  setInventory,
  setInventoryBlock,
} from "./inventory.service.js";
import {
  occupancyQuerySchema,
  type SetInventoryBlockInput,
  type SetInventoryInput,
} from "./inventory.validation.js";

export const setInventoryBlockController: RequestHandler =
  asyncHandler(async (req, res) => {
    const data = await setInventoryBlock(
      req.body as SetInventoryBlockInput,
    );

    res.status(200).json({
      success: true,
      data,
    });
  });

export const setInventoryController: RequestHandler =
  asyncHandler(async (req, res) => {
    const data = await setInventory(
      req.body as SetInventoryInput,
    );

    res.status(200).json({
      success: true,
      data,
    });
  });

export const getOccupancyController: RequestHandler =
  asyncHandler(async (req, res) => {
    const query = occupancyQuerySchema.parse(req.query);
    const data = await getOccupancy(query);

    res.status(200).json({
      success: true,
      data,
    });
  });