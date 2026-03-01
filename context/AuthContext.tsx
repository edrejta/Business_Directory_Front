"use client";

import React, { createContext, useContext, useMemo, useState, useCallback } from "react";
import { saveToken, getToken, clearAuth } from "@/lib/auth/storage";
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
const AUTH_ROLE_KEY = "role";
const AUTH_BUNDLE_KEY = "auth";

function persistAuth(data: AuthResponse) {
  saveToken(data.token);

  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_ROLE_KEY, String(data.role));

    if (data.username) localStorage.setItem(AUTH_USERNAME_KEY, data.username);
    else localStorage.removeItem(AUTH_USERNAME_KEY);

    if (data.email) localStorage.setItem(AUTH_EMAIL_KEY, data.email);
    else localStorage.removeItem(AUTH_EMAIL_KEY);

    localStorage.setItem(
      AUTH_BUNDLE_KEY,
      JSON.stringify({
        token: data.token,
        role: data.role,
        username: data.username,
        email: data.email,
      }),
    );

    document.cookie = `token=${encodeURIComponent(data.token)}; path=/; max-age=${ONE_DAY}; samesite=lax`;
    document.cookie = `role=${data.role}; path=/; max-age=${ONE_DAY}; samesite=lax`;
  }
}

function clearPersistedAuth() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_ROLE_KEY);
    localStorage.removeItem(AUTH_USERNAME_KEY);
    localStorage.removeItem(AUTH_EMAIL_KEY);
    localStorage.removeItem(AUTH_BUNDLE_KEY);

    document.cookie = "token=; path=/; max-age=0; samesite=lax";
    document.cookie = "role=; path=/; max-age=0; samesite=lax";
  }

  clearAuth();
}

function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(AUTH_BUNDLE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as Partial<AuthUser>;
      if (parsed?.token && typeof parsed.role === "number") {
        return {
          token: parsed.token,
          role: parsed.role,
          username: parsed.username,
          email: parsed.email,
        };
      }
    } catch {
      return null;
    }
  }

  const token = getToken();
  const roleStr = localStorage.getItem(AUTH_ROLE_KEY);
  const username = localStorage.getItem(AUTH_USERNAME_KEY) || undefined;
  const email = localStorage.getItem(AUTH_EMAIL_KEY) || undefined;

  if (!token || roleStr === null) return null;
  return { token, role: Number(roleStr), username, email };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());
  const [isLoading] = useState(false);

  const loginUser = useCallback((data: AuthResponse) => {
    persistAuth(data);
    setUser({
      token: data.token,
      role: data.role,
      username: data.username,
      email: data.email,
    });
  }, []);

  const login = useCallback(
    async (input: LoginInput): Promise<AuthResponse> => {
      const data = await authApi.login(input);
      loginUser(data);
      return data;
    },
    [loginUser],
  );

  const register = useCallback(
    async (input: RegisterInput): Promise<AuthResponse> => {
      const data = await authApi.register(input);
      loginUser(data);
      return data;
    },
    [loginUser],
  );

  const logoutUser = useCallback(() => {
    setUser(null);
    clearPersistedAuth();
    clearSessionAndRedirect();
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      token: user?.token ?? null,
      isLoading,
      isAuthenticated: !!user?.token,
      login,
      register,
      logout: logoutUser,
      loginUser,
      logoutUser,
      getRedirectPath,
    }),
    [user, isLoading, login, register, logoutUser, loginUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
