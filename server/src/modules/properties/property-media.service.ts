import { Types } from "mongoose";

import {
  cloudinary,
  isCloudinaryConfigured,
} from "../../config/cloudinary.js";
import { AppError } from "../../utils/app-error.js";
import { ApartmentModel } from "./apartment.model.js";
import { HotelModel } from "./hotel.model.js";
import type { PropertyImage } from "./property.types.js";

type PropertyMediaKind = "hotels" | "apartments";

type ImagePropertyDocument = {
  _id: unknown;
  name: string;
  images: PropertyImage[];
  save: () => Promise<unknown>;
};

function normalizeKind(kind: PropertyMediaKind) {
  return kind === "hotels" ? "hotel" : "apartment";
}

async function getProperty(
  propertyKind: PropertyMediaKind,
  propertyId: string,
): Promise<ImagePropertyDocument> {
  if (!Types.ObjectId.isValid(propertyId)) {
    throw new AppError("Property ID is invalid.", 400);
  }

  const property =
    propertyKind === "hotels"
      ? await HotelModel.findById(propertyId)
      : await ApartmentModel.findById(propertyId);

  if (!property) {
    throw new AppError("Property not found.", 404);
  }

  return property as unknown as ImagePropertyDocument;
}

function uploadImage(
  file: Express.Multer.File,
  folder: string,
) {
  return new Promise<{
    url: string;
    publicId: string;
  }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        overwrite: false,
        transformation: [
          {
            width: 2400,
            height: 1600,
            crop: "limit",
          },
          {
            fetch_format: "auto",
            quality: "auto",
          },
        ],
      },
      (error, result) => {
        if (error || !result) {
          reject(
            error ??
              new Error("Cloudinary image upload failed."),
          );
          return;
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      },
    );

    stream.end(file.buffer);
  });
}

export async function uploadPropertyImages(input: {
  propertyKind: PropertyMediaKind;
  propertyId: string;
  files: Express.Multer.File[];
  altText?: string;
}) {
  if (!isCloudinaryConfigured) {
    throw new AppError(
      "Image storage is not configured.",
      503,
    );
  }

  if (input.files.length === 0) {
    throw new AppError("At least one image is required.", 400);
  }

  const property = await getProperty(
    input.propertyKind,
    input.propertyId,
  );

  if (property.images.length + input.files.length > 5) {
    throw new AppError(
      "A property can have a maximum of five images.",
      400,
    );
  }

  const folder = [
    "top-rated-hotels",
    normalizeKind(input.propertyKind),
    String(property._id),
  ].join("/");

  const uploaded: Array<{
    url: string;
    publicId: string;
  }> = [];

  try {
    for (const file of input.files) {
      uploaded.push(await uploadImage(file, folder));
    }
  } catch (error) {
    await Promise.allSettled(
      uploaded.map((image) =>
        cloudinary.uploader.destroy(image.publicId),
      ),
    );

    throw new AppError(
      error instanceof Error
        ? error.message
        : "Image upload failed.",
      500,
    );
  }

  const imageAlt =
    input.altText?.trim() || `${property.name} image`;

  const hasPrimaryImage = property.images.some(
    (image) => image.isPrimary,
  );

  property.images = [
    ...property.images,
    ...uploaded.map((image, index) => ({
      url: image.url,
      publicId: image.publicId,
      alt: imageAlt,
      isPrimary: !hasPrimaryImage && index === 0,
    })),
  ];

  await property.save();

  return property.images;
}

export async function setPrimaryPropertyImage(input: {
  propertyKind: PropertyMediaKind;
  propertyId: string;
  publicId: string;
}) {
  const property = await getProperty(
    input.propertyKind,
    input.propertyId,
  );

  const exists = property.images.some(
    (image) => image.publicId === input.publicId,
  );

  if (!exists) {
    throw new AppError("Image not found.", 404);
  }

  property.images = property.images.map((image) => ({
    ...image,
    isPrimary: image.publicId === input.publicId,
  }));

  await property.save();

  return property.images;
}

export async function deletePropertyImage(input: {
  propertyKind: PropertyMediaKind;
  propertyId: string;
  publicId: string;
}) {
  const property = await getProperty(
    input.propertyKind,
    input.propertyId,
  );

  const image = property.images.find(
    (item) => item.publicId === input.publicId,
  );

  if (!image) {
    throw new AppError("Image not found.", 404);
  }

  if (image.publicId) {
    const result = await cloudinary.uploader.destroy(
      image.publicId,
    );

    if (
      result.result !== "ok" &&
      result.result !== "not found"
    ) {
      throw new AppError(
        "Image could not be removed from storage.",
        502,
      );
    }
  }

  const remainingImages = property.images.filter(
    (item) => item.publicId !== input.publicId,
  );

  const firstRemainingImage = remainingImages[0];

  if (image.isPrimary && firstRemainingImage) {
    remainingImages[0] = {
      ...firstRemainingImage,
      isPrimary: true,
    };
  }

  property.images = remainingImages;

  await property.save();

  return property.images;
}