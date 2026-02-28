import { API_URL } from "./config";
import { getToken } from "@/lib/auth/storage";
import { toBusinessTypeLabel } from "@/lib/constants/businessTypes";
import type { Business, CreateBusinessInput, UpdateBusinessInput } from "@/lib/types/business";

export class ApiError extends Error {
  status: number;
  body?: unknown;

  constructor(status: number, message: string, body?: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

async function readTextSafe(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return "";
  }
}

async function parseJsonSafeFromText(text: string): Promise<any> {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function fetchJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);
  const text = await readTextSafe(res);

  if (!res.ok) {
    const body = await parseJsonSafeFromText(text);
    throw new ApiError(res.status, body?.message ?? res.statusText, body);
  }

  if (!text) return undefined as unknown as T;
  return (await parseJsonSafeFromText(text)) as T;
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function unwrapList(payload: any): any[] {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.data)) return payload.data;
  if (payload && Array.isArray(payload.result)) return payload.result;
  return [];
}

function normalizeBusiness(b: any): Business {
  return {
    id: String(b.id ?? b.Id ?? ""),
    ownerId: (b.ownerId ?? b.OwnerId ?? b.OwnerID ?? undefined) as any,
    name: String(b.name ?? b.Name ?? b.businessName ?? b.BusinessName ?? ""),
    city: String(b.city ?? b.City ?? ""),
    type: toBusinessTypeLabel(b.type ?? b.Type ?? b.businessType ?? b.BusinessType),
    address: (b.address ?? b.Address ?? undefined) as any,
    businessNumber: (b.businessNumber ?? b.BusinessNumber ?? b.businesssNumber ?? b.BusinesssNumber ?? undefined) as any,
    businessUrl: (b.businessUrl ?? b.BusinessUrl ?? b.websiteUrl ?? b.WebsiteUrl ?? undefined) as any,
    phoneNumber: (b.phoneNumber ?? b.PhoneNumber ?? undefined) as any,
    email: (b.email ?? b.Email ?? undefined) as any,
    openDays: (b.openDays ?? b.OpenDays ?? undefined) as any,
    imageUrl: (b.imageUrl ?? b.ImageUrl ?? undefined) as any,
    description: (b.description ?? b.Description ?? undefined) as any,
    status: (b.status ?? b.Status ?? undefined) as any,
    createdAt: (b.createdAt ?? b.CreatedAt ?? undefined) as any,
    suspensionReason: (b.suspensionReason ?? b.SuspensionReason ?? undefined) as any,
    isFavorite: typeof b.isFavorite === "boolean" ? b.isFavorite : undefined,
  };
}

export async function getMyBusinesses(): Promise<Business[]> {
  const url = `${API_URL}/api/businesses/mine`;

  const payload = await fetchJson<any>(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
  });

  return unwrapList(payload).map(normalizeBusiness);
}

export async function createBusiness(input: CreateBusinessInput): Promise<Business> {
  const url = `${API_URL}/api/businesses`;

  const payload = await fetchJson<any>(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(input),
  });

  return normalizeBusiness(payload);
}

export async function updateBusiness(id: string, input: UpdateBusinessInput): Promise<Business> {
  const url = `${API_URL}/api/businesses/${encodeURIComponent(id)}`;

  const payload = await fetchJson<any>(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(input),
  });

  return normalizeBusiness(payload);
}

export async function deleteBusiness(id: string): Promise<void> {
  const url = `${API_URL}/api/businesses/${encodeURIComponent(id)}`;

  await fetchJson<void>(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
  });
}
