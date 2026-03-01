import { clearAuth } from "./storage";

const AUTH_USERNAME_KEY = "username";
const AUTH_EMAIL_KEY = "email";

/**
 * Clears all auth data (localStorage + cookies) and redirects to /login.
 * Use on 401 from API or on explicit logout.
 */
export function clearSessionAndRedirect(): void {
  if (typeof window === "undefined") return;

  clearAuth();
  localStorage.removeItem("role");
  localStorage.removeItem(AUTH_USERNAME_KEY);
  localStorage.removeItem(AUTH_EMAIL_KEY);
  document.cookie = "token=; path=/; max-age=0; samesite=lax";
  document.cookie = "role=; path=/; max-age=0; samesite=lax";

  window.location.href = "/login";
}
