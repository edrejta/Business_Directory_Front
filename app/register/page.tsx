"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthPageLayout from "@/components/AuthPageLayout";
import RegisterForm from "@/components/RegisterForm";
import { useAuth } from "@/context/AuthContext";
import { registerSchema } from "@/lib/validation/auth";

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, user, isLoading, getRedirectPath } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ username?: string; email?: string; password?: string; role?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (user) {
      router.replace(getRedirectPath(user.role));
    }
  }, [user, isLoading, router, getRedirectPath]);

  async function handleSubmit(data: {
    username: string;
    email: string;
    password: string;
    role: 0 | 1;
  }) {
    setError(null);
    setFieldErrors({});
    const parsed = registerSchema.safeParse(data);
    if (!parsed.success) {
      const fl = parsed.error.flatten();
      setFieldErrors({
        username: fl.fieldErrors.username?.[0],
        email: fl.fieldErrors.email?.[0],
        password: fl.fieldErrors.password?.[0],
        role: fl.fieldErrors.role?.[0],
      });
      setError(parsed.error.issues[0]?.message ?? "Të dhëna të pavlefshme.");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await registerUser({
        ...parsed.data,
        role: parsed.data.role ?? 0,
      });
      router.push(getRedirectPath(response.role));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Një përdorues me këtë email ekziston tashmë.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isLoading && user) return null;

  return (
    <AuthPageLayout>
      <h1 className="animate-title-reveal mb-2 text-2xl font-bold tracking-tight text-espresso">
        Regjistrohu
      </h1>
      <div className="mb-5 h-0.5 w-full overflow-hidden rounded bg-oak/30">
        <span className="animate-line-draw block h-full bg-gradient-to-r from-transparent via-oak/50 to-transparent" />
      </div>
      <RegisterForm
        onSubmit={handleSubmit}
        error={error}
        isLoading={isSubmitting}
        fieldErrors={fieldErrors}
      />
      <p className="animate-fade-up mt-4 text-center text-sm text-espresso/80 [animation-delay:80ms]">
        Ke llogari?{" "}
        <Link href="/login" className="font-semibold text-espresso underline hover:no-underline">
          Hyr
        </Link>
      </p>
    </AuthPageLayout>
  );
}
