import { authenticatedFetch, authenticatedJson } from "@/lib/api/client";
import type { OwnerBusiness, UpsertBusinessInput } from "@/lib/types/business";

const BASE = "/api/businesses";

type BusinessDtoApi = {
  id: string;
  ownerId?: string;
  businessName?: string;
  BusinessName?: string;
  address?: string;
  Address?: string;
  city?: string;
  City?: string;
  email?: string;
  Email?: string;
  phoneNumber?: string;
  PhoneNumber?: string;
  businessType?: number;
  BusinessType?: number;
  description?: string;
  Description?: string;
  imageUrl?: string;
  ImageUrl?: string;
  status?: unknown;
  Status?: unknown;
  createdAt?: string;
  CreatedAt?: string;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function normalizeStatus(s: unknown): OwnerBusiness["status"] {
  if (typeof s === "string") return s as OwnerBusiness["status"];
  if (typeof s === "number") {
    if (s === 0) return "Pending";
    if (s === 1) return "Approved";
    if (s === 2) return "Rejected";
  }
  return "Pending";
}

function mapBusiness(dto: BusinessDtoApi): OwnerBusiness {
  const statusRaw = dto.status ?? dto.Status;

  return {
    id: dto.id,
    ownerId: dto.ownerId,
    businessName: dto.businessName ?? dto.BusinessName ?? "",
    address: dto.address ?? dto.Address ?? "",
    city: dto.city ?? dto.City ?? "",
    email: dto.email ?? dto.Email ?? "",
    phoneNumber: dto.phoneNumber ?? dto.PhoneNumber ?? "",
    businessType: dto.businessType ?? dto.BusinessType ?? 0,
    description: dto.description ?? dto.Description ?? "",
    imageUrl: dto.imageUrl ?? dto.ImageUrl ?? "",
    photos: (dto as any).photos ?? (dto as any).Photos ?? (dto as any).images ?? (dto as any).Images ?? [],
    status: normalizeStatus(statusRaw),
    createdAt: dto.createdAt ?? dto.CreatedAt,
  };
}

function toBackendPayload(input: UpsertBusinessInput) {
  return {
    businessName: input.businessName,
    address: input.address ?? "",
    city: input.city ?? "",
    email: input.email ?? "",
    phoneNumber: input.phoneNumber ?? "",
    businessType: input.businessType ?? 0,
    description: input.description ?? "",
    imageUrl: input.imageUrl ?? "",
    photos: input.photos ?? undefined,
  };
}

export async function getMyBusinesses(): Promise<OwnerBusiness[]> {
  const res = await authenticatedJson<unknown>(`${BASE}/mine`);

  if (!Array.isArray(res)) return [];
  return res
    .filter(isRecord)
    .map((x) => mapBusiness(x as BusinessDtoApi));
}

export async function getBusinessById(id: string | number): Promise<OwnerBusiness> {
  const dto = await authenticatedJson<unknown>(`${BASE}/${id}`);
  if (!isRecord(dto)) throw new Error("Përgjigje e pavlefshme nga serveri.");
  return mapBusiness(dto as BusinessDtoApi);
}

export async function createBusiness(input: UpsertBusinessInput): Promise<OwnerBusiness> {
  const created = await authenticatedJson<unknown>(BASE, {
    method: "POST",
    body: JSON.stringify(toBackendPayload(input)),
  });

  if (!isRecord(created)) throw new Error("Përgjigje e pavlefshme nga serveri.");
  return mapBusiness(created as BusinessDtoApi);
}

// Create an owner-submitted update request. Backend should store this as a
// pending update (do not overwrite published business until admin approval).
export async function createUpdateRequest(
  id: string | number,
  input: UpsertBusinessInput
): Promise<OwnerBusiness> {
  const created = await authenticatedJson<unknown>(`${BASE}/${id}/updates`, {
    method: "POST",
    body: JSON.stringify(toBackendPayload(input)),
  });

  if (!isRecord(created)) throw new Error("Përgjigje e pavlefshme nga serveri.");
  return mapBusiness(created as BusinessDtoApi);
}

export async function updateBusiness(
  id: string | number,
  input: UpsertBusinessInput
): Promise<OwnerBusiness> {
  const updated = await authenticatedJson<unknown>(`${BASE}/${id}`, {
    method: "PUT",
    body: JSON.stringify(toBackendPayload(input)),
  });

  if (!isRecord(updated)) throw new Error("Përgjigje e pavlefshme nga serveri.");
  return mapBusiness(updated as BusinessDtoApi);
}

export async function deleteBusiness(id: string | number): Promise<void> {
  const res = await authenticatedFetch(`${BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(data?.message ?? "Ndodhi një gabim gjatë fshirjes.");
  }
}
