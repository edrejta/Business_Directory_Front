import { API_URL } from "./config";
import type { Business } from "@/lib/types/business";

export class ApiError extends Error {
  status: number;
  body?: unknown;

  constructor(status: number, message: string, body?: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

type PublicFetchOptions = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
};

function asRecord(v: unknown): Record<string, any> {
  return (v && typeof v === "object" ? (v as Record<string, any>) : {}) as Record<string, any>;
}

function toStringOrUndefined(v: unknown): string | undefined {
  if (v === null || v === undefined) return undefined;
  const s = String(v).trim();
  return s ? s : undefined;
}

function unwrapPayload(raw: unknown): unknown {
  const root = asRecord(raw);
  return root.data ?? root.result ?? raw;
}

function normalizeBusiness(raw: unknown): Business {
  const item = asRecord(raw);

  const id = item.id ?? item.Id ?? "";
  const name = item.name ?? item.Name ?? item.businessName ?? item.BusinessName ?? "Business";
  const type =
    item.type ??
    item.Type ??
    item.businessType ??
    item.BusinessType ??
    item.category ??
    item.Category ??
    "Unknown";

  return {
    id: String(id),
    ownerId: toStringOrUndefined(item.ownerId ?? item.OwnerId ?? item.OwnerID),
    name: String(name),
    city: String(item.city ?? item.City ?? ""),
    type: String(type),
    address: toStringOrUndefined(item.address ?? item.Address),
    businessUrl: toStringOrUndefined(item.businessUrl ?? item.BusinessUrl ?? item.websiteUrl ?? item.WebsiteUrl),
    description: toStringOrUndefined(item.description ?? item.Description),
    phoneNumber: toStringOrUndefined(item.phoneNumber ?? item.PhoneNumber),
    email: toStringOrUndefined(item.email ?? item.Email),
    openDays: toStringOrUndefined(item.openDays ?? item.OpenDays),
    imageUrl: toStringOrUndefined(item.imageUrl ?? item.ImageUrl),
    businessNumber: toStringOrUndefined(
      item.businessNumber ?? item.BusinessNumber ?? item.businesssNumber ?? item.BusinesssNumber,
    ),
    status: (toStringOrUndefined(item.status ?? item.Status) ?? "Pending") as Business["status"],
    createdAt: toStringOrUndefined(item.createdAt ?? item.CreatedAt),
    suspensionReason: toStringOrUndefined(item.suspensionReason ?? item.SuspensionReason),
    isFavorite: typeof item.isFavorite === "boolean" ? item.isFavorite : undefined,
  } as Business;
}

async function parseJsonSafe(res: Response): Promise<any> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function publicJson<T>(path: string, options: PublicFetchOptions = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await parseJsonSafe(res);
    throw new ApiError(res.status, body?.message ?? res.statusText, body);
  }

  return (await res.json()) as T;
}

export async function getApprovedBusinesses(params?: {
  search?: string;
  city?: string;
  type?: string;
}): Promise<Business[]> {
  const qs = new URLSearchParams();
  if (params?.search) qs.set("search", params.search);
  if (params?.city) qs.set("city", params.city);
  if (params?.type) qs.set("type", params.type);

  const payload = await publicJson<any>(`/api/businesses/public${qs.toString() ? `?${qs}` : ""}`);
  const unwrapped = unwrapPayload(payload);

  const list = Array.isArray(unwrapped) ? unwrapped : [];
  return list.map(normalizeBusiness);
}

export async function getApprovedBusinessById(id: string): Promise<Business> {
  const payload = await publicJson<any>(`/api/businesses/public`);
  const unwrapped = unwrapPayload(payload);

  const list = Array.isArray(unwrapped) ? unwrapped : [];
  const found = list.find((x) => {
    const r = asRecord(x);
    const rid = r.id ?? r.Id;
    return String(rid ?? "") === id;
  });

  if (!found) {
    throw new ApiError(404, "Business not found", payload);
  }

  return normalizeBusiness(found);
}

export async function getHealthStatus(): Promise<any> {
  return publicJson<any>(`/health`);
}