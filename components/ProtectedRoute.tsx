"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // wait until auth state loads
    if (!user) {
      router.replace("/login"); // redirect if not logged in
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) return null; // optional: add a spinner instead of null
  return <>{children}</>;
}