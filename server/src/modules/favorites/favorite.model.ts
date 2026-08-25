import {
  Schema,
  model,
  type HydratedDocument,
  Types,
} from "mongoose";

export type Favorite = {
  userId: Types.ObjectId;
  propertyId: Types.ObjectId;
  propertyKind: "hotel" | "apartment";
  createdAt: Date;
  updatedAt: Date;
};

export type FavoriteDocument = HydratedDocument<Favorite>;

const favoriteSchema = new Schema<Favorite>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    propertyId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    propertyKind: {
      type: String,
      enum: ["hotel", "apartment"],
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

favoriteSchema.index(
  {
    userId: 1,
    propertyId: 1,
    propertyKind: 1,
  },
  {
    unique: true,
  },
);

export const FavoriteModel = model<Favorite>(
  "Favorite",
  favoriteSchema,
);