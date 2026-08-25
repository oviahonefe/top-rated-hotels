import { Types } from "mongoose";

import { AppError } from "../../utils/app-error.js";
import {
  PaymentMethodModel,
  type PaymentMethod,
} from "./payment-method.model.js";
import type {
  CreatePaymentMethodInput,
  UpdatePaymentMethodInput,
} from "./payment-method.validation.js";

function normalizeCurrency(value: string) {
  return value.trim().toUpperCase();
}

export async function createPaymentMethod(
  input: CreatePaymentMethodInput,
) {
  return PaymentMethodModel.create({
    ...input,
    currency: normalizeCurrency(input.currency),
  });
}

export async function listAdminPaymentMethods() {
  return PaymentMethodModel.find()
    .sort({ enabled: -1, sortOrder: 1, createdAt: -1 })
    .lean();
}

export async function listAvailablePaymentMethods() {
  return PaymentMethodModel.find({
    enabled: true,
  })
    .sort({ sortOrder: 1, createdAt: -1 })
    .lean();
}

export async function updatePaymentMethod(
  id: string,
  input: UpdatePaymentMethodInput,
) {
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError("Payment method ID is invalid.", 400);
  }

  const update: Partial<PaymentMethod> = {
    ...input,
  };

  if (input.currency) {
    update.currency = normalizeCurrency(input.currency);
  }

  const paymentMethod =
    await PaymentMethodModel.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true },
    );

  if (!paymentMethod) {
    throw new AppError("Payment method not found.", 404);
  }

  return paymentMethod;
}

export async function archivePaymentMethod(id: string) {
  return updatePaymentMethod(id, {
    enabled: false,
  });
}

export async function getEnabledPaymentMethod(id: string) {
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError("Payment method ID is invalid.", 400);
  }

  const paymentMethod = await PaymentMethodModel.findOne({
    _id: id,
    enabled: true,
  }).lean();

  if (!paymentMethod) {
    throw new AppError(
      "The selected payment method is unavailable.",
      400,
    );
  }

  return paymentMethod;
}