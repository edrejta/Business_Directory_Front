import { API_URL } from "@/lib/api/config";

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
    if (data && typeof data === 'object' && 'message' in data && typeof data.message === 'string') {
      return data.message;
    }
  } catch {
    // Ignore JSON parse failures and try text next.
  }

  if (typeof res.text === 'function') {
    try {
      const text = await res.text();
      if (text) return text;
    } catch {
      // Ignore text read failures and use fallback.
    }
  }

  return fallback;
}

/** Dergon JSON te rregullt: { "email": string, "password": string }. */
export async function login(input: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const { email, password } = input;
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const errorText = await extractErrorMessage(res, 'Login failed');
    throw new Error(errorText);
  }
  return res.json();
}

/** Dergon JSON te rregullt: { "username": string, "email": string, "password": string, "role": number }. */
export async function register(input: {
  username: string;
  email: string;
  password: string;
  role: number;
}): Promise<AuthResponse> {
  const { username, email, password, role } = input;
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password, role }),
  });
  if (!res.ok) {
    const errorText = await extractErrorMessage(res, 'Register failed');
    throw new Error(errorText);
  }
  return res.json();
}

/** Ruaj token-in ne localStorage pas login/register per perdorim me pas */
export function saveAuthToken(data: AuthResponse): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', data.token);
  }
}
