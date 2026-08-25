"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest, ApiClientError } from "@/lib/api-client";
import type {
  AdminApartment,
  PropertyStatus,
  PropertyTier,
} from "@/lib/api-types";
import { useAdminAuth } from "@/providers/AuthProvider";

function splitValues(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function ApartmentForm() {
  const router = useRouter();
  const { authenticatedRequestToken } = useAdminAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);

    const name = String(formData.get("name") || "").trim();
    const summary = String(formData.get("summary") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const country = String(formData.get("country") || "").trim();
    const city = String(formData.get("city") || "").trim();
    const nightlyRate = Number(formData.get("nightlyRate"));

    if (!name || !summary || !description || !country || !city) {
      setErrorMessage("Complete all required apartment and location fields.");
      return;
    }

    if (!Number.isFinite(nightlyRate) || nightlyRate <= 0) {
      setErrorMessage("Enter a valid nightly rate greater than zero.");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = await authenticatedRequestToken();

      const apartment = await apiRequest<AdminApartment>(
    "/admin/properties/apartments",
    {
    method: "POST",
    token,
      body: {
          name,
          summary,
          description,
          status: formData.get("status") as PropertyStatus,
          tier: formData.get("tier") as PropertyTier,
          featured: formData.get("featured") === "on",
          address: {
            country,
            city,
            ...(String(formData.get("region") || "").trim()
              ? { region: String(formData.get("region")).trim() }
              : {}),
            ...(String(formData.get("addressLine1") || "").trim()
              ? { addressLine1: String(formData.get("addressLine1")).trim() }
              : {}),
            ...(String(formData.get("postalCode") || "").trim()
              ? { postalCode: String(formData.get("postalCode")).trim() }
              : {}),
          },
          maxGuests: Number(formData.get("maxGuests")),
          bedrooms: Number(formData.get("bedrooms")),
          bathrooms: Number(formData.get("bathrooms")),
          ...(String(formData.get("bedSummary") || "").trim()
            ? { bedSummary: String(formData.get("bedSummary")).trim() }
            : {}),
          platformNightlyRateCents: Math.round(nightlyRate * 100),
          totalUnits: Number(formData.get("totalUnits")),
          amenities: splitValues(String(formData.get("amenities") || "")),
          searchKeywords: splitValues(
            String(formData.get("searchKeywords") || ""),
          ),
          images: [],
        },
      },
    );

      router.replace(`/apartments/${apartment._id}/edit?created=1`);
    } catch (error) {
      setErrorMessage(
        error instanceof ApiClientError
          ? error.message
          : "Unable to create this apartment.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8">
      <section className="border border-slate-200 bg-white p-6 sm:p-8">
        <h2 className="text-xl font-bold text-slate-950">
          Apartment details
        </h2>

        <div className="mt-6 grid gap-5">
          <InputField
            label="Apartment name"
            name="name"
            placeholder="Example: Malaga Harbour Apartment"
            required
          />

          <TextAreaField
            label="Short summary"
            name="summary"
            placeholder="A concise guest-facing summary, up to 320 characters."
            rows={3}
            required
          />

          <TextAreaField
            label="Full description"
            name="description"
            placeholder="Describe the apartment, its location, and guest experience."
            rows={6}
            required
          />

          <div className="grid gap-5 sm:grid-cols-2">
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
          </div>

          <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              name="featured"
              className="h-4 w-4 accent-orange-600"
            />
            Feature this apartment in curated guest listings
          </label>
        </div>
      </section>

      <section className="border border-slate-200 bg-white p-6 sm:p-8">
        <h2 className="text-xl font-bold text-slate-950">Location</h2>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <InputField label="Country" name="country" placeholder="Spain" required />
          <InputField label="City" name="city" placeholder="Malaga" required />
          <InputField label="Region" name="region" placeholder="Andalusia" />
          <InputField label="Postal code" name="postalCode" placeholder="29001" />
        </div>

        <div className="mt-5">
          <InputField
            label="Address line"
            name="addressLine1"
            placeholder="Optional internal address reference"
          />
        </div>
      </section>

      <section className="border border-slate-200 bg-white p-6 sm:p-8">
        <h2 className="text-xl font-bold text-slate-950">
          Capacity and pricing
        </h2>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <NumberField
            label="Maximum guests"
            name="maxGuests"
            defaultValue="2"
            min="1"
            required
          />
          <NumberField
            label="Bedrooms"
            name="bedrooms"
            defaultValue="1"
            min="0"
            required
          />
          <NumberField
            label="Bathrooms"
            name="bathrooms"
            defaultValue="1"
            min="0"
            step="0.5"
            required
          />
          <NumberField
            label="Total units"
            name="totalUnits"
            defaultValue="1"
            min="1"
            required
          />
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <InputField
            label="Bed summary"
            name="bedSummary"
            placeholder="1 king bed and 1 sofa bed"
          />
          <NumberField
            label="Nightly rate"
            name="nightlyRate"
            placeholder="250.00"
            min="0.01"
            step="0.01"
            required
          />
        </div>
      </section>

      <section className="border border-slate-200 bg-white p-6 sm:p-8">
        <h2 className="text-xl font-bold text-slate-950">
          Amenities and discovery
        </h2>

        <div className="mt-6 grid gap-5">
          <InputField
            label="Apartment amenities"
            name="amenities"
            placeholder="Kitchen, balcony, Wi-Fi, washing machine"
            hint="Separate each amenity with a comma."
          />

          <InputField
            label="Search keywords"
            name="searchKeywords"
            placeholder="malaga, harbour, extended stay"
            hint="Separate each keyword with a comma."
          />
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
          onClick={() => router.push("/apartments")}
          className="h-12 border border-slate-300 px-5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="h-12 bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Creating apartment..." : "Create apartment"}
        </button>
      </div>
    </form>
  );
}

function InputField({
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

function NumberField({
  label,
  name,
  defaultValue,
  placeholder,
  min,
  step,
  required = false,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  min: string;
  step?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-800">
        {label}
        {required ? <span className="text-red-600"> *</span> : null}
      </span>
      <input
        type="number"
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        min={min}
        step={step}
        required={required}
        className="mt-2 h-12 w-full border border-slate-300 px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
      />
    </label>
  );
}

function TextAreaField({
  label,
  name,
  placeholder,
  rows,
  required = false,
}: {
  label: string;
  name: string;
  placeholder: string;
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
        name={name}
        rows={rows}
        required={required}
        placeholder={placeholder}
        className="mt-2 w-full resize-y border border-slate-300 px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
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