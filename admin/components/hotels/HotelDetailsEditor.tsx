"use client";

import { FormEvent, useState } from "react";
import { apiRequest, ApiClientError } from "@/lib/api-client";
import type {
  AdminHotel,
  PropertyStatus,
  PropertyTier,
} from "@/lib/api-types";
import { useAdminAuth } from "@/providers/AuthProvider";

type HotelDetailsEditorProps = {
  hotel: AdminHotel;
  onUpdated: (hotel: AdminHotel) => void;
};

function toCommaList(values: string[]) {
  return values.join(", ");
}

function fromCommaList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function HotelDetailsEditor({
  hotel,
  onUpdated,
}: HotelDetailsEditorProps) {
  const { authenticatedRequestToken } = useAdminAuth();

  const [name, setName] = useState(hotel.name);
  const [summary, setSummary] = useState(hotel.summary);
  const [description, setDescription] = useState(hotel.description);
  const [status, setStatus] = useState<PropertyStatus>(hotel.status);
  const [tier, setTier] = useState<PropertyTier>(hotel.tier);
  const [starRating, setStarRating] = useState(String(hotel.starRating));
  const [country, setCountry] = useState(hotel.address.country);
  const [city, setCity] = useState(hotel.address.city);
  const [region, setRegion] = useState(hotel.address.region ?? "");
  const [addressLine1, setAddressLine1] = useState(
    hotel.address.addressLine1 ?? "",
  );
  const [postalCode, setPostalCode] = useState(
    hotel.address.postalCode ?? "",
  );
  const [amenities, setAmenities] = useState(toCommaList(hotel.amenities));
  const [searchKeywords, setSearchKeywords] = useState(
    toCommaList(hotel.searchKeywords),
  );
  const [featured, setFeatured] = useState(hotel.featured);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setErrorMessage("");

    if (!name.trim() || !summary.trim() || !description.trim()) {
      setErrorMessage("Name, summary, and description are required.");
      return;
    }

    if (!country.trim() || !city.trim()) {
      setErrorMessage("Country and city are required.");
      return;
    }

    setIsSaving(true);

    try {
      const token = await authenticatedRequestToken();

      const updatedHotel = await apiRequest<AdminHotel>(
        `/admin/properties/hotels/${hotel._id}`,
        {
          method: "PATCH",
          token,
          body: {
            name: name.trim(),
            summary: summary.trim(),
            description: description.trim(),
            status,
            tier,
            starRating: Number(starRating),
            featured,
            address: {
              country: country.trim(),
              city: city.trim(),
              ...(region.trim() ? { region: region.trim() } : {}),
              ...(addressLine1.trim()
                ? { addressLine1: addressLine1.trim() }
                : {}),
              ...(postalCode.trim() ? { postalCode: postalCode.trim() } : {}),
            },
            amenities: fromCommaList(amenities),
            searchKeywords: fromCommaList(searchKeywords),
          },
        },
      );

      onUpdated(updatedHotel);
      setMessage("Hotel details saved successfully.");
    } catch (error) {
      setErrorMessage(
        error instanceof ApiClientError
          ? error.message
          : "Unable to save hotel details.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-slate-200 bg-white p-6 sm:p-8"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-950">
            Hotel information
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Update the live property record used by hotel listing and booking
            services.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="h-11 bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Save changes"}
        </button>
      </div>

      <div className="mt-8 grid gap-5">
        <InputField
          label="Hotel name"
          value={name}
          onChange={setName}
          required
        />

        <TextAreaField
          label="Short summary"
          value={summary}
          onChange={setSummary}
          rows={3}
          required
        />

        <TextAreaField
          label="Full description"
          value={description}
          onChange={setDescription}
          rows={7}
          required
        />

        <div className="grid gap-5 sm:grid-cols-3">
          <SelectField
            label="Status"
            value={status}
            onChange={(value) => setStatus(value as PropertyStatus)}
            options={[
              ["draft", "Draft"],
              ["published", "Published"],
              ["archived", "Archived"],
            ]}
          />

          <SelectField
            label="Tier"
            value={tier}
            onChange={(value) => setTier(value as PropertyTier)}
            options={[
              ["standard", "Standard"],
              ["premium", "Premium"],
              ["luxury", "Luxury"],
              ["signature", "Signature"],
            ]}
          />

          <SelectField
            label="Star rating"
            value={starRating}
            onChange={setStarRating}
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
            checked={featured}
            onChange={(event) => setFeatured(event.target.checked)}
            className="h-4 w-4 accent-orange-600"
          />
          Feature this hotel in curated guest listings
        </label>

        <div className="border-t border-slate-200 pt-8">
          <h3 className="text-base font-bold text-slate-950">Location</h3>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <InputField
              label="Country"
              value={country}
              onChange={setCountry}
              required
            />

            <InputField label="City" value={city} onChange={setCity} required />

            <InputField label="Region" value={region} onChange={setRegion} />

            <InputField
              label="Postal code"
              value={postalCode}
              onChange={setPostalCode}
            />
          </div>

          <div className="mt-5">
            <InputField
              label="Address line"
              value={addressLine1}
              onChange={setAddressLine1}
            />
          </div>
        </div>

        <div className="border-t border-slate-200 pt-8">
          <h3 className="text-base font-bold text-slate-950">
            Discovery information
          </h3>

          <div className="mt-5 grid gap-5">
            <InputField
              label="Property amenities"
              value={amenities}
              onChange={setAmenities}
              hint="Separate amenities with commas."
            />

            <InputField
              label="Search keywords"
              value={searchKeywords}
              onChange={setSearchKeywords}
              hint="Separate search keywords with commas."
            />
          </div>
        </div>
      </div>

      {message ? (
        <p className="mt-6 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          {message}
        </p>
      ) : null}

      {errorMessage ? (
        <p
          role="alert"
          className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {errorMessage}
        </p>
      ) : null}
    </form>
  );
}

function InputField({
  label,
  value,
  onChange,
  hint,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
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
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        className="mt-2 h-12 w-full border border-slate-300 px-4 text-sm text-slate-950 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
      />

      {hint ? (
        <span className="mt-2 block text-xs text-slate-500">{hint}</span>
      ) : null}
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  rows,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows: number;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-800">
        {label}
        {required ? <span className="text-red-600"> *</span> : null}
      </span>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        rows={rows}
        className="mt-2 w-full resize-y border border-slate-300 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: [string, string][];
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-800">{label}</span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-12 w-full border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-950 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}