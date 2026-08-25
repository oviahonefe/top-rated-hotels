"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest, ApiClientError } from "@/lib/api-client";
import type {
  AdminHotel,
  PropertyStatus,
  PropertyTier,
} from "@/lib/api-types";
import { useAdminAuth } from "@/providers/AuthProvider";

type RoomDraft = {
  name: string;
  description: string;
  maxGuests: string;
  bedrooms: string;
  bathrooms: string;
  bedSummary: string;
  amenities: string;
  nightlyRate: string;
  totalUnits: string;
};

const createRoomDraft = (): RoomDraft => ({
  name: "",
  description: "",
  maxGuests: "2",
  bedrooms: "1",
  bathrooms: "1",
  bedSummary: "",
  amenities: "",
  nightlyRate: "",
  totalUnits: "1",
});

function splitValues(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function HotelForm() {
  const router = useRouter();
  const { authenticatedRequestToken } = useAdminAuth();

  const [rooms, setRooms] = useState<RoomDraft[]>([createRoomDraft()]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function updateRoom(
    roomIndex: number,
    field: keyof RoomDraft,
    value: string,
  ) {
    setRooms((current) =>
      current.map((room, index) =>
        index === roomIndex ? { ...room, [field]: value } : room,
      ),
    );
  }

  function removeRoom(roomIndex: number) {
    setRooms((current) => current.filter((_, index) => index !== roomIndex));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);

    const name = String(formData.get("name") || "").trim();
    const summary = String(formData.get("summary") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const country = String(formData.get("country") || "").trim();
    const city = String(formData.get("city") || "").trim();
    const region = String(formData.get("region") || "").trim();
    const addressLine1 = String(formData.get("addressLine1") || "").trim();
    const postalCode = String(formData.get("postalCode") || "").trim();

    if (!name || !summary || !description || !country || !city) {
      setErrorMessage("Complete all required hotel and location fields.");
      return;
    }

    const incompleteRoom = rooms.some(
      (room) =>
        !room.name.trim() ||
        !room.maxGuests ||
        !room.nightlyRate ||
        !room.totalUnits,
    );

    if (incompleteRoom) {
      setErrorMessage(
        "Every room type needs a name, guest capacity, nightly rate, and total units.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const token = await authenticatedRequestToken();

      const payload = {
        name,
        summary,
        description,
        status: formData.get("status") as PropertyStatus,
        tier: formData.get("tier") as PropertyTier,
        starRating: Number(formData.get("starRating")),
        featured: formData.get("featured") === "on",
        address: {
          country,
          city,
          ...(region ? { region } : {}),
          ...(addressLine1 ? { addressLine1 } : {}),
          ...(postalCode ? { postalCode } : {}),
        },
        amenities: splitValues(String(formData.get("amenities") || "")),
        searchKeywords: splitValues(
          String(formData.get("searchKeywords") || ""),
        ),
        images: [],
        rooms: rooms.map((room) => ({
          name: room.name.trim(),
          ...(room.description.trim()
            ? { description: room.description.trim() }
            : {}),
          maxGuests: Number(room.maxGuests),
          bedrooms: Number(room.bedrooms || 0),
          bathrooms: Number(room.bathrooms || 0),
          ...(room.bedSummary.trim()
            ? { bedSummary: room.bedSummary.trim() }
            : {}),
          amenities: splitValues(room.amenities),
          platformNightlyRateCents: Math.round(
            Number(room.nightlyRate) * 100,
          ),
          totalUnits: Number(room.totalUnits),
          isActive: true,
        })),
      };

      const hotel = await apiRequest<AdminHotel>("/admin/properties/hotels", {
        method: "POST",
        token,
        body: payload,
      });

      router.replace(`/hotels/${hotel._id}/edit?created=1`);
    } catch (error) {
      setErrorMessage(
        error instanceof ApiClientError
          ? error.message
          : "Unable to create this hotel. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8">
      <section className="border border-slate-200 bg-white p-6 sm:p-8">
        <h2 className="text-xl font-bold text-slate-950">Hotel details</h2>

        <div className="mt-6 grid gap-5">
          <Field
            label="Hotel name"
            name="name"
            placeholder="Example: Marina Collection Suites"
            required
          />

          <Field
            label="Short summary"
            name="summary"
            placeholder="A concise guest-facing summary, up to 320 characters."
            required
          />

          <TextArea
            label="Full description"
            name="description"
            placeholder="Describe the hotel, its experience, and the reasons guests would choose it."
            required
          />

          <div className="grid gap-5 sm:grid-cols-3">
            <SelectField
              label="Publishing status"
              name="status"
              defaultValue="draft"
              options={[
                ["draft", "Draft"],
                ["published", "Published"],
              ]}
            />

            <SelectField
              label="Property tier"
              name="tier"
              defaultValue="standard"
              options={[
                ["standard", "Standard"],
                ["premium", "Premium"],
                ["luxury", "Luxury"],
                ["signature", "Signature"],
              ]}
            />

            <SelectField
              label="Star rating"
              name="starRating"
              defaultValue="4"
              options={[
                ["1", "1 star"],
                ["2", "2 stars"],
                ["3", "3 stars"],
                ["4", "4 stars"],
                ["5", "5 stars"],
              ]}
            />
          </div>

          <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              name="featured"
              className="h-4 w-4 accent-orange-600"
            />
            Feature this hotel in curated listings
          </label>
        </div>
      </section>

      <section className="border border-slate-200 bg-white p-6 sm:p-8">
        <h2 className="text-xl font-bold text-slate-950">Location</h2>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Field label="Country" name="country" placeholder="Spain" required />
          <Field label="City" name="city" placeholder="Malaga" required />
          <Field label="Region" name="region" placeholder="Andalusia" />
          <Field
            label="Postal code"
            name="postalCode"
            placeholder="29001"
          />
        </div>

        <div className="mt-5">
          <Field
            label="Address line"
            name="addressLine1"
            placeholder="Optional internal address reference"
          />
        </div>
      </section>

      <section className="border border-slate-200 bg-white p-6 sm:p-8">
        <h2 className="text-xl font-bold text-slate-950">
          Property amenities and discovery
        </h2>

        <div className="mt-6 grid gap-5">
          <Field
            label="Property amenities"
            name="amenities"
            placeholder="Pool, 24-hour reception, airport transfer"
            hint="Separate each amenity with a comma."
          />

          <Field
            label="Search keywords"
            name="searchKeywords"
            placeholder="malaga, marina, family stay"
            hint="Separate each keyword with a comma."
          />
        </div>
      </section>

      <section className="border border-slate-200 bg-white p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-950">Room types</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Every hotel must have at least one bookable room type.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setRooms((current) => [...current, createRoomDraft()])}
            className="h-10 border border-slate-300 px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
          >
            Add room type
          </button>
        </div>

        <div className="mt-6 grid gap-6">
          {rooms.map((room, index) => (
            <fieldset
              key={index}
              className="border border-slate-200 bg-slate-50 p-5"
            >
              <div className="flex items-center justify-between gap-4">
                <legend className="text-base font-bold text-slate-950">
                  Room type {index + 1}
                </legend>

                {rooms.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => removeRoom(index)}
                    className="text-sm font-bold text-red-600 transition hover:text-red-700"
                  >
                    Remove
                  </button>
                ) : null}
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <ControlledField
                  label="Room name"
                  value={room.name}
                  onChange={(value) => updateRoom(index, "name", value)}
                  placeholder="Deluxe sea-view suite"
                  required
                />

                <ControlledField
                  label="Maximum guests"
                  type="number"
                  min="1"
                  value={room.maxGuests}
                  onChange={(value) => updateRoom(index, "maxGuests", value)}
                  required
                />

                <ControlledField
                  label="Bedrooms"
                  type="number"
                  min="0"
                  value={room.bedrooms}
                  onChange={(value) => updateRoom(index, "bedrooms", value)}
                />

                <ControlledField
                  label="Bathrooms"
                  type="number"
                  min="0"
                  step="0.5"
                  value={room.bathrooms}
                  onChange={(value) => updateRoom(index, "bathrooms", value)}
                />

                <ControlledField
                  label="Nightly rate"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={room.nightlyRate}
                  onChange={(value) => updateRoom(index, "nightlyRate", value)}
                  placeholder="250.00"
                  required
                />

                <ControlledField
                  label="Total units"
                  type="number"
                  min="1"
                  value={room.totalUnits}
                  onChange={(value) => updateRoom(index, "totalUnits", value)}
                  required
                />
              </div>

              <div className="mt-5 grid gap-5">
                <ControlledField
                  label="Bed summary"
                  value={room.bedSummary}
                  onChange={(value) => updateRoom(index, "bedSummary", value)}
                  placeholder="1 king bed and 1 sofa bed"
                />

                <ControlledField
                  label="Room amenities"
                  value={room.amenities}
                  onChange={(value) => updateRoom(index, "amenities", value)}
                  placeholder="Balcony, breakfast, Wi-Fi"
                  hint="Separate each amenity with a comma."
                />

                <ControlledTextArea
                  label="Room description"
                  value={room.description}
                  onChange={(value) => updateRoom(index, "description", value)}
                  placeholder="Optional guest-facing room details."
                />
              </div>
            </fieldset>
          ))}
        </div>
      </section>

      {errorMessage ? (
        <p
          role="alert"
          className="border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {errorMessage}
        </p>
      ) : null}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => router.push("/hotels")}
          className="h-12 border border-slate-300 px-5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="h-12 bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Creating hotel..." : "Create hotel"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  placeholder,
  hint,
  required = false,
}: {
  label: string;
  name: string;
  placeholder: string;
  hint?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-800">
        {label}
        {required ? <span className="text-red-600"> *</span> : null}
      </span>
      <input
        name={name}
        required={required}
        placeholder={placeholder}
        className="mt-2 h-12 w-full border border-slate-300 px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
      />
      {hint ? <span className="mt-2 block text-xs text-slate-500">{hint}</span> : null}
    </label>
  );
}

function ControlledField({
  label,
  value,
  onChange,
  placeholder,
  hint,
  required = false,
  type = "text",
  min,
  step,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  required?: boolean;
  type?: "text" | "number";
  min?: string;
  step?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-800">
        {label}
        {required ? <span className="text-red-600"> *</span> : null}
      </span>
      <input
        type={type}
        min={min}
        step={step}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        placeholder={placeholder}
        className="mt-2 h-12 w-full border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
      />
      {hint ? <span className="mt-2 block text-xs text-slate-500">{hint}</span> : null}
    </label>
  );
}

function TextArea({
  label,
  name,
  placeholder,
  required = false,
}: {
  label: string;
  name: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-800">
        {label}
        {required ? <span className="text-red-600"> *</span> : null}
      </span>
      <textarea
        name={name}
        required={required}
        rows={6}
        placeholder={placeholder}
        className="mt-2 w-full resize-y border border-slate-300 px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
      />
    </label>
  );
}

function ControlledTextArea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        placeholder={placeholder}
        className="mt-2 w-full resize-y border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
      />
    </label>
  );
}

function SelectField({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue: string;
  options: [string, string][];
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue}
        className="mt-2 h-12 w-full border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-950 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
      >
        {options.map(([value, optionLabel]) => (
          <option key={value} value={value}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}
