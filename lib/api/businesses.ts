import { API_URL } from "./config";
import type { Business, CreateBusinessInput, UpdateBusinessInput } from "@/lib/types/business";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      msg = data?.message ?? data?.error ?? msg;
    } catch {
    }
    throw new ApiError(msg, res.status);
  }
  return res.json();
}

function authHeaders(token?: string) {
  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
}


function normalizeBusiness(dto: any): Business {
  return {
    id: dto.id ?? dto.Id,
    name: dto.name ?? dto.Name,
    city: dto.city ?? dto.City,
    type: dto.type ?? dto.Type,
    description: dto.description ?? dto.Description ?? null,

   
    businessNumber: dto.businessNumber ?? dto.BusinessNumber ?? null,
    businessUrl: dto.businessUrl ?? dto.BusinessUrl ?? null,

    status: dto.status ?? dto.Status,
    createdAt: dto.createdAt ?? dto.CreatedAt,
    updatedAt: dto.updatedAt ?? dto.UpdatedAt,
  };
}

export async function getMyBusinesses(token: string): Promise<Business[]> {
  const res = await fetch(`${API_URL}/api/businesses/my`, {
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    cache: "no-store",
  });

  const data = await handleResponse<any>(res);
  const items = data?.data ?? data; 
  return (items ?? []).map(normalizeBusiness);
}

export async function createBusiness(token: string, input: CreateBusinessInput): Promise<Business> {
  const payload = {
    Name: input.name,
    City: input.city,
    Type: input.type,
    Description: input.description ?? null,

    BusinessNumber: input.businessNumber,
    BusinessUrl: input.businessUrl ?? null,
  };

  const res = await fetch(`${API_URL}/api/businesses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify(payload),
  });

  const data = await handleResponse<any>(res);
  const dto = data?.data ?? data;
  return normalizeBusiness(dto);
}

export async function updateBusiness(token: string, businessId: string, input: UpdateBusinessInput): Promise<Business> {
  const payload: any = {
    ...(input.name !== undefined ? { Name: input.name } : {}),
    ...(input.city !== undefined ? { City: input.city } : {}),
    ...(input.type !== undefined ? { Type: input.type } : {}),
    ...(input.description !== undefined ? { Description: input.description } : {}),

    ...(input.businessUrl !== undefined ? { BusinessUrl: input.businessUrl } : {}),
  };

  const res = await fetch(`${API_URL}/api/businesses/${businessId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify(payload),
  });

  const data = await handleResponse<any>(res);
  const dto = data?.data ?? data;
  return normalizeBusiness(dto);
}