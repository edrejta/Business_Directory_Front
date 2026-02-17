import type { RegisterInput, LoginInput, AuthResponse } from "@/lib/types/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5003";

async function handleResponse<T>(response: Response): Promise<T> {
  const data = (await response.json().catch(() => ({}))) as AuthResponse & { message?: string };
  if (!response.ok) {
    throw new Error(data.message ?? "Ndodhi një gabim.");
  }
  return data as T;
}

export async function register(input: RegisterInput): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return handleResponse<AuthResponse>(response);
}

export async function login(input: LoginInput): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = (await response.json().catch(() => ({}))) as AuthResponse & { message?: string };
  if (!response.ok) {
    const message = response.status === 401 ? "Email ose fjalëkalim i gabuar." : (data.message ?? "Ndodhi një gabim.");
    throw new Error(message);
  }
  return data as AuthResponse;
}
