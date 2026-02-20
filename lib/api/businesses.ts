import { authenticatedJson } from "@/lib/api/client";
import type { Business, CreateBusinessInput, UpdateBusinessInput } from "@/lib/types/business";

export function createBusiness(input: CreateBusinessInput) {
  return authenticatedJson<Business>("/api/businesses", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateBusiness(id: string, input: UpdateBusinessInput) {
  return authenticatedJson<Business>(`/api/businesses/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export function deleteBusiness(id: string) {
  return authenticatedJson<{ message?: string }>(`/api/businesses/${id}`, {
    method: "DELETE",
  });
}

export function getMyBusinesses(status?: string) {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return authenticatedJson<Business[]>(`/api/businesses/mine${query}`);
}
