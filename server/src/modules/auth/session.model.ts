import { model, Schema, type Document, type Types } from "mongoose";

export interface SessionDocument extends Document {
  userId: Types.ObjectId;
  sessionId: string;
  tokenHash: string;
  expiresAt: Date;
  userAgent?: string;
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema<SessionDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    tokenHash: {
      type: String,
      required: true,
      select: false
    },
    expiresAt: {
      type: Date,
      required: true,
      index: {
        expires: 0
      }
    },
    userAgent: String,
    ipAddress: String
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const Session = model<SessionDocument>("Session", sessionSchema);