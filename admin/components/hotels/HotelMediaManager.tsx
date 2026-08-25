"use client";

import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { apiFormRequest, apiRequest, ApiClientError } from "@/lib/api-client";
import type { PropertyImage } from "@/lib/api-types";
import { useAdminAuth } from "@/providers/AuthProvider";

type HotelMediaManagerProps = {
  propertyKind: "hotels" | "apartments";
  hotelId: string;
  hotelName: string;
  images: PropertyImage[];
  onImagesUpdated: (images: PropertyImage[]) => void;
};

export default function HotelMediaManager({
 propertyKind,
  hotelId,
  hotelName,
  images,
  onImagesUpdated,
}: HotelMediaManagerProps) {
  const { authenticatedRequestToken } = useAdminAuth();
  const [altText, setAltText] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [actionPublicId, setActionPublicId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    const availableSlots = 5 - images.length;

    setErrorMessage("");

    if (files.length > availableSlots) {
      setErrorMessage(
        `You can add ${availableSlots} more image${availableSlots === 1 ? "" : "s"}.`,
      );
      setSelectedFiles(files.slice(0, availableSlots));
      return;
    }

    setSelectedFiles(files);
  }

  async function uploadImages() {
    if (selectedFiles.length === 0) {
      setErrorMessage("Select at least one JPEG, PNG, or WebP image.");
      return;
    }

    setIsUploading(true);
    setErrorMessage("");

    try {
      const token = await authenticatedRequestToken();
      const formData = new FormData();

      selectedFiles.forEach((file) => formData.append("images", file));
      formData.append("altText", altText.trim() || `${hotelName} image`);

      const updatedImages = await apiFormRequest<PropertyImage[]>(
        `/admin/properties/${propertyKind}/${hotelId}/images`
        formData,
        token,
      );

      onImagesUpdated(updatedImages);
      setSelectedFiles([]);
      setAltText("");
    } catch (error) {
      setErrorMessage(
        error instanceof ApiClientError
          ? error.message
          : "Unable to upload property images.",
      );
    } finally {
      setIsUploading(false);
    }
  }

  async function setPrimaryImage(publicId: string) {
    setActionPublicId(publicId);
    setErrorMessage("");

    try {
      const token = await authenticatedRequestToken();

      const updatedImages = await apiRequest<PropertyImage[]>(
        `/admin/properties/${propertyKind}/${hotelId}/images/primary`
        {
          method: "PATCH",
          token,
          body: { publicId },
        },
      );

      onImagesUpdated(updatedImages);
    } catch (error) {
      setErrorMessage(
        error instanceof ApiClientError
          ? error.message
          : "Unable to update the primary image.",
      );
    } finally {
      setActionPublicId(null);
    }
  }

  async function deleteImage(publicId: string) {
    const confirmed = window.confirm(
      "Remove this image from the hotel and cloud storage?",
    );

    if (!confirmed) {
      return;
    }

    setActionPublicId(publicId);
    setErrorMessage("");

    try {
      const token = await authenticatedRequestToken();

      const updatedImages = await apiRequest<PropertyImage[]>(
        `/admin/properties/${propertyKind}/${hotelId}/images`
        {
          method: "DELETE",
          token,
          body: { publicId },
        },
      );

      onImagesUpdated(updatedImages);
    } catch (error) {
      setErrorMessage(
        error instanceof ApiClientError
          ? error.message
          : "Unable to remove this image.",
      );
    } finally {
      setActionPublicId(null);
    }
  }

  return (
    <section className="border border-slate-200 bg-white p-6 sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-950">Property images</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Upload up to five JPEG, PNG, or WebP images. The primary image is
            shown first to guests.
          </p>
        </div>

        <p className="text-sm font-bold text-slate-700">
          {images.length} / 5 images
        </p>
      </div>

      {images.length > 0 ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {images.map((image) => {
            const canManage = Boolean(image.publicId);
            const isWorking = actionPublicId === image.publicId;

            return (
              <article
                key={image.publicId || image.url}
                className="overflow-hidden border border-slate-200 bg-slate-50"
              >
                <div className="relative aspect-[4/3] bg-slate-100">
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />

                  {image.isPrimary ? (
                    <span className="absolute left-3 top-3 bg-orange-600 px-3 py-1 text-xs font-bold text-white">
                      Primary image
                    </span>
                  ) : null}
                </div>

                <div className="p-4">
                  <p className="truncate text-sm font-medium text-slate-600">
                    {image.alt}
                  </p>

                  {canManage ? (
                    <div className="mt-4 flex gap-4">
                      {!image.isPrimary ? (
                        <button
                          type="button"
                          disabled={isWorking}
                          onClick={() => void setPrimaryImage(image.publicId!)}
                          className="text-sm font-bold text-orange-600 transition hover:text-orange-700 disabled:opacity-50"
                        >
                          Make primary
                        </button>
                      ) : null}

                      <button
                        type="button"
                        disabled={isWorking}
                        onClick={() => void deleteImage(image.publicId!)}
                        className="text-sm font-bold text-red-600 transition hover:text-red-700 disabled:opacity-50"
                      >
                        {isWorking ? "Removing..." : "Remove"}
                      </button>
                    </div>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-6 border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-sm text-slate-600">
          No images have been uploaded for this hotel.
        </div>
      )}

      {images.length < 5 ? (
        <div className="mt-6 border-t border-slate-200 pt-6">
          <div className="grid gap-5">
            <label className="block">
              <span className="text-sm font-semibold text-slate-800">
                Image files
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleFileChange}
                className="mt-2 block w-full text-sm text-slate-600 file:mr-4 file:border-0 file:bg-slate-950 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-800"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-800">
                Image description
              </span>
              <input
                value={altText}
                onChange={(event) => setAltText(event.target.value)}
                placeholder={`${hotelName} interior`}
                className="mt-2 h-12 w-full border border-slate-300 px-4 text-sm text-slate-950 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </label>

            {selectedFiles.length > 0 ? (
              <p className="text-sm font-medium text-slate-600">
                Selected: {selectedFiles.map((file) => file.name).join(", ")}
              </p>
            ) : null}

            <button
              type="button"
              onClick={() => void uploadImages()}
              disabled={isUploading || selectedFiles.length === 0}
              className="h-11 w-full bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {isUploading ? "Uploading..." : "Upload images"}
            </button>
          </div>
        </div>
      ) : null}

      {errorMessage ? (
        <p
          role="alert"
          className="mt-5 border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {errorMessage}
        </p>
      ) : null}
    </section>
  );
}