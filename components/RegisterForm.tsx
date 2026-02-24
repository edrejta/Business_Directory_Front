"use client";

import { useState, FormEvent } from "react";
import { SIGNUP_ROLES } from "@/lib/constants/roles";

export interface RegisterFormProps {
  onSubmit: (data: { username: string; email: string; password: string; role: 0 | 1 }) => void;
  error?: string | null;
  isLoading?: boolean;
  fieldErrors?: { username?: string; email?: string; password?: string; role?: string };
}

export default function RegisterForm({
  onSubmit,
  error,
  isLoading = false,
  fieldErrors,
}: RegisterFormProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<0 | 1>(0);
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit({ username, email, password, role });
  }

  return (
    <form className="auth-form-fields space-y-4" onSubmit={handleSubmit}>
      <label className="animate-register-field block">
        <span className="mb-1 block text-sm font-medium text-espresso">Emri i përdoruesit</span>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="johndoe"
          required
          className={`w-full rounded-lg border bg-white/70 px-3 py-2 outline-none transition focus:ring-1 ${
            fieldErrors?.username ? "border-red-500 focus:border-red-500 focus:ring-red-500/30" : "border-oak/45 focus:border-espresso focus:ring-espresso/30"
          }`}
          aria-label="Emri i përdoruesit"
          aria-invalid={!!fieldErrors?.username}
        />
        {fieldErrors?.username && (
          <p className="mt-1 text-sm text-red-600" role="alert">{fieldErrors.username}</p>
        )}
      </label>
      <label className="animate-register-field block">
        <span className="mb-1 block text-sm font-medium text-espresso">Email</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@example.com"
          required
          className={`w-full rounded-lg border bg-white/70 px-3 py-2 outline-none transition focus:ring-1 ${
            fieldErrors?.email ? "border-red-500 focus:border-red-500 focus:ring-red-500/30" : "border-oak/45 focus:border-espresso focus:ring-espresso/30"
          }`}
          aria-label="Email"
          aria-invalid={!!fieldErrors?.email}
        />
        {fieldErrors?.email && (
          <p className="mt-1 text-sm text-red-600" role="alert">{fieldErrors.email}</p>
        )}
      </label>
      <label className="animate-register-field block">
        <span className="mb-1 block text-sm font-medium text-espresso">Roli</span>
        <select
          value={role}
          onChange={(e) => setRole(Number(e.target.value) as 0 | 1)}
          className={`w-full rounded-lg border bg-white/70 px-3 py-2 outline-none transition focus:ring-1 ${
            fieldErrors?.role ? "border-red-500 focus:border-red-500 focus:ring-red-500/30" : "border-oak/45 focus:border-espresso focus:ring-espresso/30"
          }`}
          aria-label="Roli"
          aria-invalid={!!fieldErrors?.role}
        >
          {SIGNUP_ROLES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
        {fieldErrors?.role && (
          <p className="mt-1 text-sm text-red-600" role="alert">{fieldErrors.role}</p>
        )}
      </label>
      <label className="animate-register-field block">
        <span className="mb-1 block text-sm font-medium text-espresso">Fjalëkalim</span>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={8}
            className={`w-full rounded-lg border bg-white/70 px-3 py-2 pr-10 outline-none transition focus:ring-1 ${
              fieldErrors?.password ? "border-red-500 focus:border-red-500 focus:ring-red-500/30" : "border-oak/45 focus:border-espresso focus:ring-espresso/30"
            }`}
            aria-label="Fjalëkalim"
            aria-invalid={!!fieldErrors?.password}
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-oak transition hover:bg-sand/50 hover:text-espresso"
            aria-label={showPassword ? "Fsheh fjalëkalimin" : "Shfaq fjalëkalimin"}
          >
            <span className="text-lg leading-none" aria-hidden>{showPassword ? "🙈" : "👁"}</span>
          </button>
        </div>
        {fieldErrors?.password && (
          <p className="mt-1 text-sm text-red-600" role="alert">{fieldErrors.password}</p>
        )}
      </label>
      {error && (
        <p className="animate-register-field text-sm font-semibold text-red-600" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={isLoading}
        className="mt-2 w-full shrink-0 rounded-full bg-espresso px-4 py-2.5 font-semibold text-paper transition hover:bg-[#2d1f15] disabled:opacity-70 animate-btn-pulse"
      >
        {isLoading ? "Duke u ngarkuar..." : "Regjistrohu"}
      </button>
    </form>
  );
}
