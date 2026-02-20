const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5003";

export interface AuthResponse {
  token: string;
  id: string;
  username: string;
  email: string;
  role: number;
}

type ErrorJson = { message?: string; error?: string } | string;

function hasJson(res: Response): res is Response & { json: () => Promise<unknown> } {
  return typeof (res as unknown as { json?: unknown }).json === "function";
}

async function readErrorMessage(res: Response): Promise<string> {
  // Only use json() (tests mock this). Never call text().
  if (hasJson(res)) {
    try {
      const data = (await res.json()) as ErrorJson;

      if (typeof data === "string" && data.trim()) return data;
      if (data && typeof (data as any).message === "string") return (data as any).message;
      if (data && typeof (data as any).error === "string") return (data as any).error;
    } catch {
    }
  }

  if (res.status === 401) return "Email ose fjalëkalim i gabuar.";
  return "Ndodhi një gabim.";
}

/** Dërgon JSON të rregullt: { "email": string, "password": string }. */
export async function login(input: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const msg = await readErrorMessage(res);
    throw new Error(msg);
  }

  return (await res.json()) as AuthResponse;
}

/** Dërgon JSON të rregullt: { "username": string, "email": string, "password": string, "role": number }. */
export async function register(input: {
  username: string;
  email: string;
  password: string;
  role: number;
}): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const msg = await readErrorMessage(res);
    throw new Error(msg);
  }

  return (await res.json()) as AuthResponse;
}

/** Ruaj token-in në localStorage pas login/register për përdorim më pas */
export function saveAuthToken(data: AuthResponse): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", data.token);
  }
}