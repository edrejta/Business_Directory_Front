"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import BusinessForm from "@/components/BusinessForm";
import { useAuth } from "@/context/AuthContext";
import type { UpsertBusinessInput } from "@/lib/types/business";
import * as ownerApi from "@/lib/api/ownerBusinesses";

export default function AddBusinessPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== 1) {
      // Non-owners: redirect to their dashboard
      if (user.role === 0) router.replace("/dashboard-user");
      else if (user.role === 2) router.replace("/dashboard-admin");
    }
  }, [isLoading, router, user]);

  if (isLoading || !user) return null;

  async function handleCreate(input: UpsertBusinessInput) {
    await ownerApi.createBusiness(input);
    // After create, go to owner dashboard where the new business will appear
    router.push("/dashboard-business");
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl p-4 md:p-8">
        <h1 className="mb-4 text-2xl font-bold">Shto biznes</h1>
        <BusinessForm mode="create" onCancel={() => router.push("/dashboard-business")} onSubmit={handleCreate} />
      </main>
    </>
  );
}
