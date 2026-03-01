export const AUTH_TOKEN_KEY = "token";
export const AUTH_EMAIL_KEY = "auth_email";
export const AUTH_USERNAME_KEY = "auth_username";
export const AUTH_ROLE_KEY = "auth_role";

export function saveToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function clearToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function saveEmail(email: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_EMAIL_KEY, email);
}

export function getEmail(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_EMAIL_KEY);
}

export function clearEmail(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_EMAIL_KEY);
}

export function saveUsername(username: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_USERNAME_KEY, username);
}

export function getUsername(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_USERNAME_KEY);
}

export function clearUsername(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_USERNAME_KEY);
}

export function saveRole(role: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_ROLE_KEY, role);
}

export function getRole(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_ROLE_KEY);
}

export function clearRole(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_ROLE_KEY);
}

export function clearAuth(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_EMAIL_KEY);
  localStorage.removeItem(AUTH_USERNAME_KEY);
  localStorage.removeItem(AUTH_ROLE_KEY);
}