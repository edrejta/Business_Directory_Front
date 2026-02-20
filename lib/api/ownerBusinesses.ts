import { authenticatedFetch, authenticatedJson } from "@/lib/api/client";
import type { OwnerBusiness, UpsertBusinessInput } from "@/lib/types/business";

const BASE = "/api/businesses";

function normalizeStatus(s: any): OwnerBusiness["status"] {
  if (typeof s === "string") return s as any;
  if (s === 0) return "Pending";
  if (s === 1) return "Approved";
  if (s === 2) return "Rejected";
  return "Pending";
}

function mapBusiness(dto: any): OwnerBusiness {
  return {
    id: dto.id,
    ownerId: dto.ownerId,
    businessName: dto.businessName ?? dto.BusinessName ?? dto.name ?? dto.title ?? "",
    address: dto.address ?? dto.Address ?? "",
    city: dto.city ?? dto.City ?? "",
    email: dto.email ?? dto.Email ?? "",
    phoneNumber: dto.phoneNumber ?? dto.PhoneNumber ?? dto.phone ?? "",
    businessType: dto.businessType ?? dto.BusinessType ?? 0,
    description: dto.description ?? dto.Description ?? "",
    imageUrl: dto.imageUrl ?? dto.ImageUrl ?? "",
    status: normalizeStatus(dto.status ?? dto.Status),
    createdAt: dto.createdAt ?? dto.CreatedAt,
  };
}

function toBackendPayload(input: any) {
  return {
    businessName: input.businessName ?? input.name ?? "",
    address: input.address ?? "",
    city: input.city ?? "",
    email: input.email ?? "",
    phoneNumber: input.phoneNumber ?? input.phone ?? "",
    businessType: input.businessType ?? 0,
    description: input.description ?? "",
    imageUrl: input.imageUrl ?? "",
  };
}

export async function getMyBusinesses(): Promise<OwnerBusiness[]> {
  const res = await authenticatedJson<any[]>(`${BASE}/mine`);
  return (res ?? []).map(mapBusiness);
}

export async function getBusinessById(id: string | number): Promise<OwnerBusiness> {
  const dto = await authenticatedJson<any>(`${BASE}/${id}`);
  return mapBusiness(dto);
}

export async function createBusiness(input: UpsertBusinessInput): Promise<OwnerBusiness> {
  const created = await authenticatedJson<any>(BASE, {
    method: "POST",
    body: JSON.stringify(toBackendPayload(input)),
  });
  return mapBusiness(created);
}

export async function updateBusiness(
  id: string | number,
  input: UpsertBusinessInput
): Promise<OwnerBusiness> {
  const updated = await authenticatedJson<any>(`${BASE}/${id}`, {
    method: "PUT",
    body: JSON.stringify(toBackendPayload(input)),
  });
  return mapBusiness(updated);
}

export async function deleteBusiness(id: string | number): Promise<void> {
  const res = await authenticatedFetch(`${BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.message ?? "Ndodhi një gabim gjatë fshirjes.");
  }
}