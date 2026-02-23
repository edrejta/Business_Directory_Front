import { authenticatedJson } from "@/lib/api/client";
import type { Business, CreateBusinessInput, UpdateBusinessInput } from "@/lib/types/business";

const asRecord = (v: unknown): Record<string, unknown> =>
  typeof v === "object" && v !== null ? (v as Record<string, unknown>) : {};

const unwrapPayload = (raw: unknown): unknown => {
  const root = asRecord(raw);
  return (root.data ?? root.result ?? raw) as unknown;
};

const normalizeBusiness = (raw: unknown): Business => {
  const r = asRecord(raw);

  return {
    Id: String(r.id ?? ""),
    OwnerId: String(r.ownerId ?? ""),
    BusinessName: String(r.businessName ?? ""),
    Address: String(r.address ?? ""),
    City: String(r.city ?? ""),
    Email: String(r.email ?? ""),
    PhoneNumber: String(r.phoneNumber ?? ""),
    BusinessType: Number(r.businessType ?? 0),
    Description: String(r.description ?? ""),
    ImageUrl: String(r.imageUrl ?? ""),
    Status: String(r.status ?? ""),
    CreatedAt: String(r.createdAt ?? ""),
  };
};

export async function createBusiness(input: CreateBusinessInput): Promise<Business> {
  const payload: CreateBusinessInput = {
    BusinessName: input.BusinessName,
    Address: input.Address,
    City: input.City,
    Email: input.Email,
    PhoneNumber: input.PhoneNumber,
    Description: input.Description,
    BusinessType: input.BusinessType ?? 0,
    ImageUrl: input.ImageUrl ?? "",
  };

  const raw = await authenticatedJson("/api/businesses", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return normalizeBusiness(unwrapPayload(raw));
}

export async function updateBusiness(id: string, input: UpdateBusinessInput): Promise<Business> {
  const payload: UpdateBusinessInput = {
    BusinessName: input.BusinessName,
    Address: input.Address,
    City: input.City,
    Email: input.Email,
    PhoneNumber: input.PhoneNumber,
    Description: input.Description,
    BusinessType: input.BusinessType ?? 0,
    ImageUrl: input.ImageUrl ?? "",
  };

  const raw = await authenticatedJson(`/api/businesses/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  return normalizeBusiness(unwrapPayload(raw));
}

export function deleteBusiness(id: string) {
  return authenticatedJson<{ message?: string }>(`/api/businesses/${id}`, { method: "DELETE" });
}

export async function getMyBusinesses(status?: string): Promise<Business[]> {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  const raw = await authenticatedJson(`/api/businesses/mine${query}`);

  const data = unwrapPayload(raw);
  const list = Array.isArray(data) ? data : Array.isArray(raw) ? raw : [];

  return list.map(normalizeBusiness).filter((b) => b.Id.length > 0);
}

export async function getBusinessById(id: string): Promise<Business> {
  const raw = await authenticatedJson(`/api/businesses/${id}`);
  return normalizeBusiness(unwrapPayload(raw));
}

export async function getMyBusinessById(id: string): Promise<Business> {
  const raw = await authenticatedJson(`/api/businesses/mine/${encodeURIComponent(id)}`);
  return normalizeBusiness(unwrapPayload(raw));
}