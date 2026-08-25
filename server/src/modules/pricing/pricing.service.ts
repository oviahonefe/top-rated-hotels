import { AppError } from "../../utils/app-error.js";

import type { PropertyTier } from "../properties/property.types.js";

export const MINIMUM_STAY_NIGHTS = 4;
export const MINIMUM_BOOKING_TOTAL_CENTS = 1_200_000;

const tierMultipliers: Record<PropertyTier, number> = {
  standard: 1,
  premium: 1.17,
  luxury: 1.34,
  signature: 1.51,
};

type CreatePriceQuoteInput = {
  checkInDate: Date;
  checkOutDate: Date;
  platformNightlyRateCents: number;
  tier: PropertyTier;
};

export type PriceQuote = {
  currency: "USD";
  nights: number;
  nightlyRateCents: number;
  tierMultiplier: number;
  accommodationSubtotalCents: number;
  minimumBookingApplied: boolean;
  totalCents: number;
};

function getNights(
  checkInDate: Date,
  checkOutDate: Date,
) {
  const milliseconds = checkOutDate.getTime() - checkInDate.getTime();
  const nights = Math.ceil(milliseconds / 86_400_000);

  if (!Number.isInteger(nights) || nights <= 0) {
    throw new AppError(
      "Check-out must be after check-in.",
      400,
    );
  }

  return nights;
}

export function createPriceQuote(
  input: CreatePriceQuoteInput,
): PriceQuote {
  const nights = getNights(
    input.checkInDate,
    input.checkOutDate,
  );

  if (nights < MINIMUM_STAY_NIGHTS) {
    throw new AppError(
      `A booking must be at least ${MINIMUM_STAY_NIGHTS} nights.`,
      400,
    );
  }

  if (
    !Number.isInteger(input.platformNightlyRateCents) ||
    input.platformNightlyRateCents < 1
  ) {
    throw new AppError(
      "The property has an invalid platform nightly rate.",
      500,
    );
  }

  const tierMultiplier = tierMultipliers[input.tier];

  const accommodationSubtotalCents = Math.round(
    input.platformNightlyRateCents *
      tierMultiplier *
      nights,
  );

  const totalCents = Math.max(
    accommodationSubtotalCents,
    MINIMUM_BOOKING_TOTAL_CENTS,
  );

  return {
    currency: "USD",
    nights,
    nightlyRateCents: input.platformNightlyRateCents,
    tierMultiplier,
    accommodationSubtotalCents,
    minimumBookingApplied:
      totalCents === MINIMUM_BOOKING_TOTAL_CENTS &&
      accommodationSubtotalCents <
        MINIMUM_BOOKING_TOTAL_CENTS,
    totalCents,
  };
}