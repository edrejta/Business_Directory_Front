import { toBusinessTypeLabel } from "@/lib/constants/businessTypes";
import { resolveBusinessId } from "@/lib/utils/businessId";

export type Business = {
  id: string;
  name: string;
  logo?: string;
  description?: string;
  rating?: number;
  category?: string;
  location?: string;
  address?: string;
  phone?: string;
  coordinates?: { lat: number; lng: number } | null;
};

export type ApiBusiness = {
  id?: string;
  Id?: string;
  businessId?: string;
  BusinessId?: string;
  businessName?: string;
  BusinessName?: string;
  name?: string;
  Name?: string;
  description?: string;
  Description?: string;
  businessType?: string;
  BusinessType?: string;
  category?: string;
  Category?: string;
  type?: string;
  Type?: string;
  city?: string;
  City?: string;
  address?: string;
  Address?: string;
  phone?: string;
  Phone?: string;
  phoneNumber?: string;
  PhoneNumber?: string;
  logo?: string;
  Logo?: string;
  imageUrl?: string;
  ImageUrl?: string;
  lat?: number | string;
  lng?: number | string;
  Lat?: number | string;
  Lng?: number | string;
  latitude?: number | string;
  longitude?: number | string;
  Latitude?: number | string;
  Longitude?: number | string;
  coordinates?: { lat: number; lng: number } | null;
};

export const LISTINGS_PAGE_SIZE = 2;

const toText = (value: unknown) => {
  if (typeof value === "string") return value;
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return "";
};

const toNumber = (value: unknown) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
};

const isValidCoordinate = (lat: number, lng: number) =>
  Number.isFinite(lat) &&
  Number.isFinite(lng) &&
  lat >= -90 &&
  lat <= 90 &&
  lng >= -180 &&
  lng <= 180;

function extractCoordinates(item: ApiBusiness): { lat: number; lng: number } | null {
  const candidates: Array<{ lat: unknown; lng: unknown }> = [];

  if (item.coordinates) {
    candidates.push({ lat: item.coordinates.lat, lng: item.coordinates.lng });
  }

  candidates.push(
    { lat: item.lat, lng: item.lng },
    { lat: item.Lat, lng: item.Lng },
    { lat: item.latitude, lng: item.longitude },
    { lat: item.Latitude, lng: item.Longitude },
  );

  for (const candidate of candidates) {
    const lat = toNumber(candidate.lat);
    const lng = toNumber(candidate.lng);
    if (lat !== null && lng !== null && isValidCoordinate(lat, lng)) {
      return { lat, lng };
    }
  }

  return null;
}

/**
 * Removes "near me" style phrases and compresses whitespace so search terms stay backend-friendly.
 */
export function normalizeSearchKeyword(rawKeyword: string) {
  return rawKeyword
    .trim()
    .replace(/near me/gi, "")
    .replace(/afër meje/gi, "")
    .replace(/afer meje/gi, "")
    .replace(/prane meje/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Normalizes mixed-case backend payload fields into a stable frontend business contract.
 */
export function normalizeBusiness(item: ApiBusiness): Business {
  const city = toText(item.city ?? item.City);
  const address = toText(item.address ?? item.Address);
  const coordinates = extractCoordinates(item);

  return {
    id: resolveBusinessId(item),
    name: toText(item.businessName ?? item.BusinessName ?? item.name ?? item.Name) || "Business",
    description: toText(item.description ?? item.Description) || undefined,
    category:
      toBusinessTypeLabel(item.category ?? item.Category ?? item.businessType ?? item.BusinessType ?? item.type ?? item.Type) ||
      undefined,
    location: city || undefined,
    address: address || undefined,
    phone: toText(item.phoneNumber ?? item.PhoneNumber ?? item.phone ?? item.Phone) || undefined,
    logo: toText(item.imageUrl ?? item.ImageUrl ?? item.logo ?? item.Logo) || undefined,
    coordinates,
  };
}

export function normalizeCities(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((entry) => {
      if (typeof entry === "string") return entry;
      if (typeof entry === "object" && entry !== null) {
        const row = entry as Record<string, unknown>;
        return toText(row.name ?? row.Name ?? row.city ?? row.City);
      }
      return "";
    })
    .filter((value) => value.length > 0);
}

function normalizeCityKey(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function getCityAliases(city: string): string[] {
  const normalized = normalizeCityKey(city);
  if (normalized === "prishtine" || normalized === "prishtina") {
    return ["Prishtine", "Prishtina", "Prishtinë"];
  }
  return [city];
}

/**
 * Resolves city aliases (for example Prishtine/Prishtina/Prishtinë) to a candidate value from backend lists.
 */
export function resolveCityFromCandidates(city: string, candidates: string[]): string {
  const aliases = getCityAliases(city).map(normalizeCityKey);
  const match = candidates.find((entry) => aliases.includes(normalizeCityKey(entry)));
  return match ?? city;
}
