import { getToken } from "@/lib/auth/storage";
import { clearSessionAndRedirect } from "@/lib/auth/session";
import { API_URL } from "@/lib/api/config";

export type AuthenticatedFetchOptions = RequestInit & {
  /** If false, do not add Authorization header (e.g. for public endpoints). Default true. */
  requireAuth?: boolean;
};

/**
 * Fetch that adds Authorization: Bearer <token> when token exists.
 * On 401: clears session and redirects to /login.
 * On 403: throws with message "Nuk ke të drejtë."
 */
export async function authenticatedFetch(
  path: string,
  options: AuthenticatedFetchOptions = {}
): Promise<Response> {
  const { requireAuth = true, headers = {}, ...rest } = options;
  const token = typeof window !== "undefined" ? getToken() : null;

  const requestHeaders = new Headers(headers);
  if (requireAuth && token) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }
  if (!requestHeaders.has("Content-Type") && (rest.body as string | undefined) && typeof rest.body === "string") {
    requestHeaders.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: requestHeaders,
  });

  if (response.status === 401) {
    clearSessionAndRedirect();
    throw new Error("Session u mbyll. Hyr përsëri.");
  }

  if (response.status === 403) {
    throw new Error("Nuk ke të drejtë.");
  }

  return response;
}

/**
 * authenticatedFetch + parse JSON. Throws on non-ok (except 401/403 handled above).
 */
export async function authenticatedJson<T>(path: string, options: AuthenticatedFetchOptions = {}): Promise<T> {
  const response = await authenticatedFetch(path, options);
  const data = (await response.json().catch(() => ({}))) as T & { message?: string };
  if (!response.ok) {
    throw new Error((data as { message?: string }).message ?? "Ndodhi një gabim.");
  }
  return data as T;
}
