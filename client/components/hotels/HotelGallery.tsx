"use client";

import Image from "next/image";
import { useState } from "react";

type HotelGalleryProps = {
  hotelName: string;
  images: string[];
};

export default function HotelGallery({
  hotelName,
  images,
}: HotelGalleryProps) {
  const uniqueImages = Array.from(new Set(images));
  const [activeImage, setActiveImage] = useState(0);

  if (uniqueImages.length === 0) {
    return null;
  }

  return (
    <section aria-label={`${hotelName} photo gallery`}>
      <div className="relative aspect-[16/9] overflow-hidden border border-border bg-surface">
        <Image
          src={uniqueImages[activeImage]}
          alt={`${hotelName} image ${activeImage + 1}`}
          fill
          priority
          sizes="(max-width: 1320px) 100vw, 82rem"
          className="object-cover"
        />
      </div>

      <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-5">
        {uniqueImages.slice(0, 5).map((image, index) => (
          <button
            key={`gallery-image-${index}`}
            type="button"
            aria-label={`Show image ${index + 1}`}
            onClick={() => setActiveImage(index)}
            className={`relative aspect-[4/3] overflow-hidden border-2 transition ${
              activeImage === index
                ? "border-accent"
                : "border-transparent hover:border-primary"
            }`}
          >
            <Image
              src={image}
              alt=""
              fill
              sizes="160px"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </section>
  );
}