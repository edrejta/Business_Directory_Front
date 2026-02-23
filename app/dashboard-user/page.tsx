"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";

export default function DashboardUserPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== 0) {
      if (user.role === 1) router.replace("/dashboard-business");
      else if (user.role === 2) router.replace("/dashboard-admin");
      else router.replace("/");
    }
  }, [isLoading, router, user]);

  if (isLoading || !user) return null;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl p-4 md:p-8">
        <h1 className="text-2xl font-bold">Mirë se erdhe, {user.username ?? "përdorues"}.</h1>
        <p className="mt-1 text-sm text-gray-600">Këtu mund të eksplorosh bizneset e aprovuara.</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Link href="/businesses" className="rounded-xl border bg-white p-4 shadow-sm hover:bg-gray-50">
            <div className="text-base font-semibold">Shiko bizneset</div>
            <div className="mt-1 text-sm text-gray-600">Listë publike e bizneseve të aprovuara.</div>
          </Link>

          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="text-base font-semibold">Këshillë</div>
            <div className="mt-1 text-sm text-gray-600">
              Filtroni sipas qytetit, tipit ose emrit për të gjetur më shpejt.
            </div>
          </div>
        </div>
      </main>
    </>
  );
}