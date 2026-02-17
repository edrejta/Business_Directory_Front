"use client";

import { useState, FormEvent } from "react";

export interface LoginFormProps {
  onSubmit: (data: { email: string; password: string }) => void;
  error?: string | null;
  isLoading?: boolean;
  fieldErrors?: { email?: string; password?: string };
}

export default function LoginForm({ onSubmit, error, isLoading = false, fieldErrors }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit({ email, password });
  }

  return (
    <form className="auth-form-fields space-y-4" onSubmit={handleSubmit}>
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
        <span className="mb-1 block text-sm font-medium text-espresso">Fjalëkalim</span>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
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
        className="w-full rounded-full bg-espresso px-4 py-2.5 font-semibold text-paper transition hover:bg-[#2d1f15] disabled:opacity-70 animate-btn-pulse"
      >
        {isLoading ? "Duke u ngarkuar..." : "Hyr"}
      </button>
    </form>
  );
}
