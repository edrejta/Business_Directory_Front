"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";

export default function DashboardAdmin() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== 2) {
      if (user.role === 0) router.replace("/dashboard-user");
      else if (user.role === 1) router.replace("/dashboard-business");
    }
  }, [isLoading, router, user]);

  if (isLoading || !user) return null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen px-6 py-10">
        <div className="animate-soft-pop mx-auto max-w-6xl rounded-2xl border border-oak/35 bg-paper/90 p-8 shadow-panel">
          <h1 className="animate-fade-up text-3xl font-bold text-espresso">
            Mirë se erdhe, {user.username ?? "admin"}.
          </h1>
          <p className="animate-fade-up mt-3 text-espresso/80 [animation-delay:130ms]">
            Dashboard Admin – panel administrimi për monitorim dhe menaxhim të sistemit.
          </p>
        </div>
      </main>
    </>
  );
}
