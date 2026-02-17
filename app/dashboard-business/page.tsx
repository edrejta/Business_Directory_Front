"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";

export default function DashboardBusiness() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== 1) {
      if (user.role === 0) router.replace("/dashboard-user");
      else if (user.role === 2) router.replace("/dashboard-admin");
    }
  }, [isLoading, router, user]);

  if (isLoading || !user) return null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen px-6 py-10">
        <div className="animate-soft-pop mx-auto max-w-6xl rounded-2xl border border-oak/35 bg-paper/90 p-8 shadow-panel">
          <h1 className="animate-fade-up text-3xl font-bold text-espresso">
            Mirë se erdhe, {user.username ?? "biznes"}.
          </h1>
          <p className="animate-fade-up mt-3 text-espresso/80 [animation-delay:130ms]">
            Dashboard Business Owner – ketu menaxhon biznesin dhe listimet e tua.
          </p>
        </div>
      </main>
    </>
  );
}
