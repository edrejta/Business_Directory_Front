import { authenticatedJson } from "@/lib/api/client";
import type { UpdateUserInput, UserProfile } from "@/lib/types/user";

export function getMe() {
  return authenticatedJson<UserProfile>("/api/users/me");
}

export function getUserById(id: string) {
  return authenticatedJson<UserProfile>(`/api/users/${id}`);
}

export function updateUser(id: string, input: UpdateUserInput) {
  return authenticatedJson<UserProfile>(`/api/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}
