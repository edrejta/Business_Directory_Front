import { API_URL } from "./config";
import type { Business, CreateBusinessInput, UpdateBusinessInput } from "@/lib/types/business";

export class ApiError extends Error {
  status: number;
  body?: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

function authHeaders(token: string) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function normalizeBusiness(b: any): Business {
  const name = b?.name ?? b?.businessName ?? b?.BusinessName ?? "";
  const type =
    b?.type ??
    (typeof b?.businessType === "string" ? b.businessType : undefined) ??
    (typeof b?.BusinessType === "string" ? b.BusinessType : undefined) ??
    (typeof b?.businessType === "number" ? String(b.businessType) : undefined) ??
    (typeof b?.BusinessType === "number" ? String(b.BusinessType) : undefined) ??
    "";

  return {
    id: String(b?.id ?? b?.Id ?? ""),
    ownerId: String(b?.ownerId ?? b?.OwnerId ?? ""),

    name: String(name),
    type: String(type),

    city: String(b?.city ?? b?.City ?? ""),
    address: b?.address ?? b?.Address ?? null,

    businessUrl: b?.businessUrl ?? b?.BusinessUrl ?? b?.websiteUrl ?? b?.WebsiteUrl ?? null,
    description: b?.description ?? b?.Description ?? null,

    phoneNumber: b?.phoneNumber ?? b?.PhoneNumber ?? null,
    imageUrl: b?.imageUrl ?? b?.ImageUrl ?? null,

    businessNumber: String(
      b?.businessNumber ?? b?.BusinessNumber ?? b?.businesssNumber ?? b?.BusinesssNumber ?? "",
    ),

    status: String(b?.status ?? b?.Status ?? ""),
    createdAt: String(b?.createdAt ?? b?.CreatedAt ?? ""),

    suspensionReason: b?.suspensionReason ?? b?.SuspensionReason ?? null,
    isFavorite: Boolean(b?.isFavorite ?? b?.IsFavorite ?? false),
  };
}

async function readJsonSafe(res: Response) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function getMyBusinesses(token: string): Promise<Business[]> {
  const res = await fetch(`${API_URL}/api/Businesses/mine`, {
    method: "GET",
    headers: authHeaders(token),
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await readJsonSafe(res);
    throw new ApiError("Failed to load businesses", res.status, body);
  }

  const data = await res.json();
  const list = Array.isArray(data) ? data : data?.data ?? [];
  return list.map(normalizeBusiness);
}

export async function getMyBusinessById(id: string, token: string): Promise<Business> {
  const res = await fetch(`${API_URL}/api/Businesses/mine/${id}`, {
    method: "GET",
    headers: authHeaders(token),
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await readJsonSafe(res);
    throw new ApiError("Failed to load business", res.status, body);
  }

  const data = await res.json();
  return normalizeBusiness(data);
}

export async function createBusiness(token: string, input: CreateBusinessInput): Promise<Business> {
  const res = await fetch(`${API_URL}/api/Businesses`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({
      name: input.name,
      type: input.type,
      city: input.city,
      address: input.address ?? null,
      businessUrl: input.businessUrl ?? null,
      description: input.description ?? null,
      phoneNumber: (input as any).phoneNumber ?? null,
      imageUrl: (input as any).imageUrl ?? null,
      businessNumber: input.businessNumber,
    }),
  });

  if (!res.ok) {
    const body = await readJsonSafe(res);
    throw new ApiError("Failed to create business", res.status, body);
  }

  const data = await res.json();
  return normalizeBusiness(data);
}

export async function updateBusiness(
  token: string,
  id: string,
  input: UpdateBusinessInput,
): Promise<Business> {
  const res = await fetch(`${API_URL}/api/Businesses/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify({
      name: input.name,
      type: input.type,
      city: input.city,
      address: input.address ?? null,
      businessUrl: input.businessUrl ?? null,
      description: input.description ?? null,
      phoneNumber: (input as any).phoneNumber ?? null,
      imageUrl: (input as any).imageUrl ?? null,
    }),
  });

  if (!res.ok) {
    const body = await readJsonSafe(res);
    throw new ApiError("Failed to update business", res.status, body);
  }

  const data = await res.json();
  return normalizeBusiness(data);
}

export async function deleteBusiness(token: string, id: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/Businesses/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });

  if (!res.ok) {
    const body = await readJsonSafe(res);
    throw new ApiError("Failed to delete business", res.status, body);
  }
}