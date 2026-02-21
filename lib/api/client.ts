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

  const text = await response.text();

  let data: any = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text };
  }

  if (!response.ok) {
    const validationErrors =
      data?.errors && typeof data.errors === "object"
        ? Object.entries(data.errors)
            .map(([k, v]) => `${k}: ${(Array.isArray(v) ? v.join(", ") : String(v))}`)
            .join(" | ")
        : null;

    throw new Error(validationErrors || data?.message || data?.title || "Ndodhi një gabim.");
  }

  return data as T;
}
