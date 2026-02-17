export const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5003";

export type AuthPayload = {
  token: string;
  id: string;
  username: string;
  email: string;
  role: number;
};

export async function authRequest(path: "/api/auth/login" | "/api/auth/register", body: Record<string, unknown>) {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = (await response.json().catch(() => ({}))) as Partial<AuthPayload> & {
    message?: string;
    errors?: string[];
    title?: string;
  };

  if (!response.ok) {
    const serverMessage =
      data.message ||
      data.title ||
      (Array.isArray(data.errors) ? data.errors.join(", ") : undefined) ||
      "Ndodhi nje gabim. Provo perseri.";

    throw new Error(serverMessage);
  }

  return data as AuthPayload;
}
