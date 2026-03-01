import { API_URL } from "@/lib/api/config";
import { saveToken } from "@/lib/auth/storage";

export interface AuthResponse {
  token: string;
  id: string;
  username: string;
  email: string;
  role: number;
}

async function extractErrorMessage(res: Response, fallback: string): Promise<string> {
  try {
    const data = await res.json();
    if (data && typeof data === "object" && "message" in data && typeof (data as any).message === "string") {
      return (data as any).message;
    }
  } catch {return null;}

  try {
    const text = await res.text();
    if (text) return text;
  } catch {return null;}

  return fallback;
}

export async function login(input: { email: string; password: string }): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const errorText = await extractErrorMessage(res, "Login failed");
    throw new Error(errorText);
  }

  const data = (await res.json()) as AuthResponse;
  if (data?.token) saveToken(data.token);
  return data;
}

export async function register(input: {
  username: string;
  email: string;
  password: string;
  role: number;
}): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const errorText = await extractErrorMessage(res, "Register failed");
    throw new Error(errorText);
  }

  const data = (await res.json()) as AuthResponse;
  if (data?.token) saveToken(data.token);
  return data;
}

export function saveAuthToken(data: AuthResponse): void {
  if (data?.token) saveToken(data.token);
}