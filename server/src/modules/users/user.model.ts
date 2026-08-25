import { model, Schema, type Document, type Types } from "mongoose";

export type UserRole = "user" | "admin" | "super_admin";

export interface UserDocument extends Document {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  emailVerified: boolean;
  profileImageUrl?: string;
  favorites: Types.ObjectId[];
  emailVerification?: {
    otpHash: string;
    expiresAt: Date;
    sentAt: Date;
  };
  passwordReset?: {
    otpHash: string;
    expiresAt: Date;
    sentAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const otpSchema = new Schema(
  {
    otpHash: {
      type: String,
      required: true,
      select: false
    },
    expiresAt: {
      type: Date,
      required: true
    },
    sentAt: {
      type: Date,
      required: true
    }
  },
  { _id: false }
);

const userSchema = new Schema<UserDocument>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true
    },
    passwordHash: {
      type: String,
      required: true,
      select: false
    },
    role: {
      type: String,
      enum: ["user", "admin", "super_admin"],
      default: "user",
      index: true
    },
    emailVerified: {
      type: Boolean,
      default: false
    },
    profileImageUrl: {
      type: String,
      default: null
    },
    favorites: [
      {
        type: Schema.Types.ObjectId,
        ref: "Property"
      }
    ],
    emailVerification: {
      type: otpSchema,
      default: null
    },
    passwordReset: {
      type: otpSchema,
      default: null
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const User = model<UserDocument>("User", userSchema);