import { getToken } from "@/lib/auth/storage";
import { clearSessionAndRedirect } from "@/lib/auth/session";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "https://localhost:5003";

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
  const token = typeof window !== "undefined" ? getToken() ?? localStorage.getItem("token") : null;

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
export async function authenticatedJson<T>(
  path: string,
  options: AuthenticatedFetchOptions = {}
): Promise<T> {
  const response = await authenticatedFetch(path, options);

  if (response.ok) {
    return (await response.json()) as T;
  }

  let message = "Ndodhi një gabim.";

  try {
    const data = (await response.json()) as { message?: string; error?: string } | string;
    if (typeof data === "string" && data.trim()) message = data;
    else if (data && typeof (data as any).message === "string") message = (data as any).message;
    else if (data && typeof (data as any).error === "string") message = (data as any).error;
  } catch {
    const anyRes = response as unknown as { text?: () => Promise<string> };
    if (typeof anyRes.text === "function") {
      try {
        const t = await anyRes.text();
        if (t.trim()) message = t;
      } catch {
      }
    }
  }

  throw new Error(message);
}