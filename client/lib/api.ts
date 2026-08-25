import type {
  ApartmentDetail,
  HotelDetail,
  PropertyCatalogueResponse,
  PropertySearchParams,
  PublicProperty,
} from "@/types/property";

const apiBaseUrl = (
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:5000/api/v1"
).replace(/\/+$/, "");

export const ACCESS_TOKEN_KEY = "top_rated_hotels_access_token";
export const USER_KEY = "top_rated_hotels_user";
export const AUTH_CHANGED_EVENT = "top-rated-hotels-auth-changed";

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data?: T;
};

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function getAccessToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

function createSearchParams(
  values: Record<string, string | number | boolean | undefined>,
) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(values)) {
    if (value !== undefined && value !== "" && value !== "all") {
      params.set(key, String(value));
    }
  }

  const query = params.toString();
  return query ? `?${query}` : "";
}

async function parseResponse<T>(response: Response): Promise<ApiEnvelope<T>> {
  return (await response.json().catch(() => null)) as ApiEnvelope<T>;
}

async function refreshAccessToken() {
  const response = await fetch(`${apiBaseUrl}/auth/refresh`, {
    method: "POST",
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  const payload = await parseResponse<{
    accessToken: string;
    user: unknown;
  }>(response);

  if (!response.ok || !payload.data?.accessToken) {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(ACCESS_TOKEN_KEY);
      window.localStorage.removeItem(USER_KEY);
      window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
    }

    return null;
  }

  if (typeof window !== "undefined") {
    window.localStorage.setItem(
      ACCESS_TOKEN_KEY,
      payload.data.accessToken,
    );
    window.localStorage.setItem(
      USER_KEY,
      JSON.stringify(payload.data.user),
    );
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
  }

  return payload.data.accessToken;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  retryAfterRefresh = true,
): Promise<T> {
  const token = getAccessToken();

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (
    response.status === 401 &&
    retryAfterRefresh &&
    !path.startsWith("/auth/")
  ) {
    const refreshedToken = await refreshAccessToken();

    if (refreshedToken) {
      return apiRequest<T>(path, options, false);
    }
  }

  const payload = await parseResponse<T>(response);

  if (!response.ok) {
    throw new ApiError(
      payload?.message ?? "Unable to complete this request.",
      response.status,
    );
  }

  return payload.data as T;
}

export function getPrimaryImage(property: PublicProperty) {
  return (
    property.images.find((image) => image.isPrimary) ??
    property.images[0] ??
    null
  );
}

export function formatUsd(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export async function getProperties(
  params: PropertySearchParams = {},
) {
  return apiRequest<PropertyCatalogueResponse>(
    `/properties${createSearchParams({
      q: params.q,
      city: params.city,
      country: params.country,
      type: params.type ?? "all",
      tier: params.tier,
      guests: params.guests,
      featured: params.featured,
      page: params.page ?? 1,
      limit: params.limit ?? 12,
    })}`,
  );
}

export function getFeaturedProperties() {
  return apiRequest<PropertyCatalogueResponse>(
    "/properties/featured",
  );
}

export function getHotelDetail(slug: string) {
  return apiRequest<HotelDetail>(
    `/properties/hotels/${encodeURIComponent(slug)}`,
  );
}

export function getApartmentDetail(slug: string) {
  return apiRequest<ApartmentDetail>(
    `/properties/apartments/${encodeURIComponent(slug)}`,
  );
}