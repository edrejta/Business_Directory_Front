import { API_URL } from "@/lib/api/config";
import type { Business } from "@/lib/types/business";

export interface PublicBusinessFilters {
  search?: string;
  city?: string;
  type?: string;
}

type PublicFetchOptions = RequestInit & {
  next?: {
    revalidate?: number;
    tags?: string[];
  };
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

const asRecord = (value: unknown): Record<string, unknown> =>
  typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {};

const toStringOrUndefined = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim().length > 0 ? value : undefined;

const unwrapPayload = (raw: unknown): unknown => {
  const root = asRecord(raw);
  return root.data ?? root.result ?? raw;
};

const normalizeBusiness = (raw: unknown): Business => {
  const item = asRecord(raw);

  return {
    id: String(item.id ?? item.Id ?? ""),
    ownerId: toStringOrUndefined(item.ownerId ?? item.OwnerId) ?? "",
    name: String(item.name ?? item.Name ?? "Business"),
    city: String(item.city ?? item.City ?? ""),
    type: String(item.type ?? item.Type ?? item.businessType ?? item.BusinessType ?? "Unknown"),
    address: toStringOrUndefined(item.address ?? item.Address),
    businessUrl: toStringOrUndefined(item.businessUrl ?? item.BusinessUrl ?? item.websiteUrl ?? item.WebsiteUrl),
    description: toStringOrUndefined(item.description ?? item.Description),
    phoneNumber: toStringOrUndefined(item.phoneNumber ?? item.PhoneNumber),
    imageUrl: toStringOrUndefined(item.imageUrl ?? item.ImageUrl),
    businessNumber: String(item.businessNumber ?? item.BusinessNumber ?? item.businesssNumber ?? item.BusinesssNumber ?? ""),
    status: (toStringOrUndefined(item.status ?? item.Status) ?? "Pending") as Business["status"],
    createdAt: String(item.createdAt ?? item.CreatedAt ?? new Date().toISOString()),
    suspensionReason: toStringOrUndefined(item.suspensionReason ?? item.SuspensionReason),
    isFavorite: typeof item.isFavorite === "boolean" ? item.isFavorite : undefined,
  };
};

async function publicJson<T>(path: string, options: PublicFetchOptions = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, options);
  const data = (await response.json().catch(() => ({}))) as T & { message?: string };

  if (!response.ok) {
    throw new ApiError(data.message ?? "Ndodhi një gabim.", response.status);
  }

  return unwrapPayload(data) as T;
}

export function getHealthStatus() {
  return publicJson<{ status: string }>("/health");
}

export async function getApprovedBusinesses(filters: PublicBusinessFilters = {}, options: PublicFetchOptions = {}) {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.city) params.set("city", filters.city);
  if (filters.type) params.set("type", filters.type);

  const query = params.toString();
  const data = await publicJson<unknown>(`/api/businesses/public${query ? `?${query}` : ""}`, options);
  const list = Array.isArray(data) ? data : [];
  return list.map(normalizeBusiness).filter((item) => item.id.length > 0);
}

export async function getApprovedBusinessById(id: string, options: PublicFetchOptions = {}) {
  const data = await publicJson<unknown>("/api/businesses/public", options);
  const list = Array.isArray(data) ? data : [];
  const business = list.map(normalizeBusiness).find((item) => item.id === id);
  if (!business) {
    throw new ApiError("Business not found", 404);
  }
  return business;
}
