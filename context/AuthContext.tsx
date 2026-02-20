"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { saveToken, getToken } from "@/lib/auth/storage";
import { clearSessionAndRedirect } from "@/lib/auth/session";
import { getRedirectPath } from "@/lib/auth/redirect";
import * as authApi from "@/lib/api/auth";
import type { RegisterInput, LoginInput, AuthResponse } from "@/lib/types/auth";

type AuthUser = {
  token: string;
  role: number;
  username?: string;
  email?: string;
};

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (input: LoginInput) => Promise<AuthResponse>;
  register: (input: RegisterInput) => Promise<AuthResponse>;
  logout: () => void;
  loginUser: (data: AuthResponse) => void;
  logoutUser: () => void;
  getRedirectPath: (role: number) => string;
}

const AuthContext = createContext<AuthContextType | null>(null);

const ONE_DAY = 60 * 60 * 24;
const AUTH_USERNAME_KEY = "username";
const AUTH_EMAIL_KEY = "email";

function persistAuth(data: AuthResponse) {
  saveToken(data.token);
  if (typeof window !== "undefined") {
    localStorage.setItem("role", String(data.role));
    if (data.username) localStorage.setItem(AUTH_USERNAME_KEY, data.username);
    if (data.email) localStorage.setItem(AUTH_EMAIL_KEY, data.email);
    document.cookie = `token=${encodeURIComponent(data.token)}; path=/; max-age=${ONE_DAY}; samesite=lax`;
    document.cookie = `role=${data.role}; path=/; max-age=${ONE_DAY}; samesite=lax`;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;
    const username = typeof window !== "undefined" ? localStorage.getItem(AUTH_USERNAME_KEY) || undefined : undefined;
    const email = typeof window !== "undefined" ? localStorage.getItem(AUTH_EMAIL_KEY) || undefined : undefined;

    if (token && role !== null) {
      setUser({ token, role: Number(role), username, email });
    }
    setIsLoading(false);
  }, []);

  function loginUser(data: AuthResponse) {
    persistAuth(data);
    setUser({
      token: data.token,
      role: data.role,
      username: data.username,
      email: data.email,
    });
  }

  async function login(input: LoginInput): Promise<AuthResponse> {
    const data = await authApi.login(input);
    loginUser(data);
    return data;
  }

  async function register(input: RegisterInput): Promise<AuthResponse> {
    const data = await authApi.register(input);
    loginUser(data);
    return data;
  }

  function logoutUser() {
    setUser(null);
    clearSessionAndRedirect();
  }

  const value = useMemo(
    () => ({
      user,
      token: user?.token ?? null,
      isLoading,
      isAuthenticated: !!user,
      login,
      register,
      logout: logoutUser,
      loginUser,
      logoutUser,
      getRedirectPath,
    }),
    [user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
