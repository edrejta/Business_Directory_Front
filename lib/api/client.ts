import { getToken } from "@/lib/auth/storage";
import { clearSessionAndRedirect } from "@/lib/auth/session";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5003";

export type AuthenticatedFetchOptions = RequestInit & {
  requireAuth?: boolean;
};

type ErrorObj = { message?: unknown; error?: unknown };
function isErrorObj(v: unknown): v is ErrorObj {
  return typeof v === "object" && v !== null;
}

export async function authenticatedFetch(
  path: string,
  options: AuthenticatedFetchOptions = {}
): Promise<Response> {
  const { requireAuth = true, headers = {}, ...rest } = options;

  const token =
    typeof window !== "undefined"
      ? getToken() ?? localStorage.getItem("token")
      : null;

  const requestHeaders = new Headers(headers);

  if (requireAuth && token) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  if (!requestHeaders.has("Content-Type") && typeof rest.body === "string") {
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
    const data = (await response.json()) as unknown;

    if (typeof data === "string" && data.trim()) {
      message = data;
    } else if (isErrorObj(data)) {
      if (typeof data.message === "string" && data.message.trim()) {
        message = data.message;
      } else if (typeof data.error === "string" && data.error.trim()) {
        message = data.error;
      }
    }
  } catch {
  }

  throw new Error(message);
}