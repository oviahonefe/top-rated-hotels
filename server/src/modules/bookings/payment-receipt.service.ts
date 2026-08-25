import { cloudinary, isCloudinaryConfigured } from "../../config/cloudinary.js";
import { AppError } from "../../utils/app-error.js";
import type { BookingPaymentReceipt } from "./booking.model.js";

function getResourceType(mimeType: string): "image" | "raw" {
  return mimeType === "application/pdf" ? "raw" : "image";
}

export async function uploadPaymentReceipt(
  file: Express.Multer.File,
  bookingReference: string,
): Promise<BookingPaymentReceipt> {
  if (!isCloudinaryConfigured) {
    throw new AppError("Receipt storage is not configured.", 503);
  }

  const resourceType = getResourceType(file.mimetype);

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `top-rated-hotels/payment-receipts/${bookingReference}`,
        resource_type: resourceType,
        overwrite: false,
        use_filename: false,
        unique_filename: true,
      },
      (error, result) => {
        if (error || !result?.secure_url || !result.public_id) {
          reject(error ?? new Error("Receipt upload failed."));
          return;
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          resourceType,
          originalFilename: file.originalname,
          mimeType: file.mimetype,
          uploadedAt: new Date(),
        });
      },
    );

    stream.end(file.buffer);
  });
}

export async function deletePaymentReceipt(
  receipt?: BookingPaymentReceipt,
) {
  if (!receipt?.publicId || !isCloudinaryConfigured) {
    return;
  }

  await cloudinary.uploader
    .destroy(receipt.publicId, {
      resource_type: receipt.resourceType,
    })
    .catch(() => undefined);
}