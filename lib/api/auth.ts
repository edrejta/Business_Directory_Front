const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:5003';

export interface AuthResponse {
  token: string;
  id: string;
  username: string;
  email: string;
  role: number;
}

/** Dërgon JSON të rregullt: { "email": string, "password": string }. */
export async function login(input: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const { email, password } = input;
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Login failed: ${errorText}`);
  }
  return res.json();
}

/** Dërgon JSON të rregullt: { "username": string, "email": string, "password": string, "role": number }. */
export async function register(input: {
  username: string;
  email: string;
  password: string;
  role: number;
}): Promise<AuthResponse> {
  const { username, email, password, role } = input;
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password, role }),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Register failed: ${errorText}`);
  }
  return res.json();
}

/** Ruaj token-in në localStorage pas login/register për përdorim më pas */
export function saveAuthToken(data: AuthResponse): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', data.token);
  }
}
