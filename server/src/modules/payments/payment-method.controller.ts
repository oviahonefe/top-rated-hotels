import type { Request, RequestHandler } from "express";

import { AppError } from "../../utils/app-error.js";
import { asyncHandler } from "../../utils/async-handler.js";
import {
  archivePaymentMethod,
  createPaymentMethod,
  listAdminPaymentMethods,
  listAvailablePaymentMethods,
  updatePaymentMethod,
} from "./payment-method.service.js";
import type {
  CreatePaymentMethodInput,
  UpdatePaymentMethodInput,
} from "./payment-method.validation.js";

function getPaymentMethodId(req: Request) {
  const id = req.params.id;

  if (typeof id !== "string" || !id.trim()) {
    throw new AppError(
      "A valid payment method ID is required.",
      400,
    );
  }

  return id;
}

export const createPaymentMethodController: RequestHandler =
  asyncHandler(async (req, res) => {
    const paymentMethod = await createPaymentMethod(
      req.body as CreatePaymentMethodInput,
    );

    res.status(201).json({
      success: true,
      data: paymentMethod,
    });
  });

export const listAdminPaymentMethodsController: RequestHandler =
  asyncHandler(async (_req, res) => {
    const paymentMethods =
      await listAdminPaymentMethods();

    res.status(200).json({
      success: true,
      data: paymentMethods,
    });
  });

export const listAvailablePaymentMethodsController: RequestHandler =
  asyncHandler(async (_req, res) => {
    const paymentMethods =
      await listAvailablePaymentMethods();

    res.status(200).json({
      success: true,
      data: paymentMethods,
    });
  });

export const updatePaymentMethodController: RequestHandler =
  asyncHandler(async (req, res) => {
    const paymentMethod = await updatePaymentMethod(
      getPaymentMethodId(req),
      req.body as UpdatePaymentMethodInput,
    );

    res.status(200).json({
      success: true,
      data: paymentMethod,
    });
  });

export const archivePaymentMethodController: RequestHandler =
  asyncHandler(async (req, res) => {
    const paymentMethod = await archivePaymentMethod(
      getPaymentMethodId(req),
    );

    res.status(200).json({
      success: true,
      data: paymentMethod,
    });
  });