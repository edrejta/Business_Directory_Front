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

const unwrapPayload = (raw: unknown): unknown => {
  const root = asRecord(raw);
  return root.data ?? root.result ?? raw;
};

const normalizeBusiness = (raw: unknown): Business => {
  const item = asRecord(raw);

  return {
    Id: String(item.Id ?? item.id ?? ""),
    OwnerId: String(item.OwnerId ?? item.ownerId ?? ""),
    BusinessName: String(item.BusinessName ?? item.businessName ?? item.Name ?? item.name ?? "Business"),
    Address: String(item.Address ?? item.address ?? ""),
    City: String(item.City ?? item.city ?? ""),
    Email: String(item.Email ?? item.email ?? ""),
    PhoneNumber: String(item.PhoneNumber ?? item.phoneNumber ?? ""),
    BusinessType: Number(item.BusinessType ?? item.businessType ?? item.Type ?? item.type ?? 0),
    Description: String(item.Description ?? item.description ?? ""),
    ImageUrl: String(item.ImageUrl ?? item.imageUrl ?? ""),
    Status: String(item.Status ?? item.status ?? ""),
    CreatedAt: String(item.CreatedAt ?? item.createdAt ?? ""),
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
  const data = await publicJson<unknown>(`/api/businesses${query ? `?${query}` : ""}`, options);
  const list = Array.isArray(data) ? data : [];
  return list.map(normalizeBusiness).filter((item) => item.Id.length > 0);
}

export async function getApprovedBusinessById(id: string, options: PublicFetchOptions = {}) {
  const data = await publicJson<unknown>(`/api/businesses/${id}`, options);
  const business = normalizeBusiness(data);
  if (!business.Id) {
    throw new ApiError("Business not found", 404);
  }
  return business;
}
