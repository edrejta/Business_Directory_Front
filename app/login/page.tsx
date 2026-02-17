"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthPageLayout from "@/components/AuthPageLayout";
import LoginForm from "@/components/LoginForm";
import { useAuth } from "@/context/AuthContext";
import { loginSchema } from "@/lib/validation/auth";

export default function LoginPage() {
  const router = useRouter();
  const { login, user, isLoading, getRedirectPath } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (user) {
      router.replace(getRedirectPath(user.role));
    }
  }, [user, isLoading, router, getRedirectPath]);

  async function handleSubmit(data: { email: string; password: string }) {
    setError(null);
    setFieldErrors({});
    const parsed = loginSchema.safeParse(data);
    if (!parsed.success) {
      const fl = parsed.error.flatten();
      setFieldErrors({
        email: fl.fieldErrors.email?.[0],
        password: fl.fieldErrors.password?.[0],
      });
      setError(parsed.error.issues[0]?.message ?? "Të dhëna të pavlefshme.");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await login(parsed.data);
      router.push(getRedirectPath(response.role));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Email ose fjalëkalim i gabuar.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isLoading && user) return null;

  return (
    <AuthPageLayout>
      <h1 className="animate-title-reveal mb-2 text-2xl font-bold tracking-tight text-espresso">
        Hyr
      </h1>
      <div className="mb-5 h-0.5 w-full overflow-hidden rounded bg-oak/30">
        <span className="animate-line-draw block h-full bg-gradient-to-r from-transparent via-oak/50 to-transparent" />
      </div>
      <LoginForm
        onSubmit={handleSubmit}
        error={error}
        isLoading={isSubmitting}
        fieldErrors={fieldErrors}
      />
      <p className="animate-fade-up mt-4 text-center text-sm text-espresso/80 [animation-delay:80ms]">
        Nuk ke llogari?{" "}
        <Link href="/register" className="font-semibold text-espresso underline hover:no-underline">
          Regjistrohu
        </Link>
      </p>
    </AuthPageLayout>
  );
}
