import {
  Schema,
  model,
  type HydratedDocument,
} from "mongoose";

export const paymentMethodTypes = [
  "bank_transfer",
  "crypto",
] as const;

export type PaymentMethodType =
  (typeof paymentMethodTypes)[number];

export type PaymentDetail = {
  label: string;
  value: string;
};

export type PaymentMethod = {
  displayName: string;
  type: PaymentMethodType;
  currency: string;
  instructions: string;
  details: PaymentDetail[];
  enabled: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

export type PaymentMethodDocument =
  HydratedDocument<PaymentMethod>;

const paymentDetailSchema = new Schema<PaymentDetail>(
  {
    label: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    value: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
  },
  { _id: false },
);

const paymentMethodSchema = new Schema<PaymentMethod>(
  {
    displayName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    type: {
      type: String,
      enum: paymentMethodTypes,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      maxlength: 12,
    },
    instructions: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000,
    },
    details: {
      type: [paymentDetailSchema],
      default: [],
    },
    enabled: {
      type: Boolean,
      default: true,
      index: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const PaymentMethodModel = model<PaymentMethod>(
  "PaymentMethod",
  paymentMethodSchema,
);