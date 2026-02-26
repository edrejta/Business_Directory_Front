"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import * as ownerApi from "@/lib/api/ownerBusinesses";

type DealForm = {
  title: string;
  description: string;
  category: "Discounts" | "FlashSales" | "EarlyAccess";
  originalPrice: string;
  discountedPrice: string;
  expiresAt: string;
};

type OpenDaysForm = {
  mondayOpen: boolean;
  tuesdayOpen: boolean;
  wednesdayOpen: boolean;
  thursdayOpen: boolean;
  fridayOpen: boolean;
  saturdayOpen: boolean;
  sundayOpen: boolean;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5003";

const initialForm: DealForm = {
  title: "",
  description: "",
  category: "Discounts",
  originalPrice: "",
  discountedPrice: "",
  expiresAt: "",
};

export default function DashboardBusiness() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState<DealForm>(initialForm);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [openDays, setOpenDays] = useState<OpenDaysForm>({
    mondayOpen: true,
    tuesdayOpen: true,
    wednesdayOpen: true,
    thursdayOpen: true,
    fridayOpen: true,
    saturdayOpen: false,
    sundayOpen: false,
  });
  const [openDaysLoading, setOpenDaysLoading] = useState(false);
  const [openDaysMessage, setOpenDaysMessage] = useState<string | null>(null);
  const [ownerBusinesses, setOwnerBusinesses] = useState<Array<{ id: string; businessName: string; status: string }>>([]);
  const [ownerLoading, setOwnerLoading] = useState(false);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);

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

  useEffect(() => {
    const loadOpenDays = async () => {
      if (!user?.token) return;
      setOpenDaysLoading(true);
      try {
        const response = await fetch(`${API_BASE}/api/owner/opendays`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (!response.ok) return;
        const payload = (await response.json()) as OpenDaysForm;
        setOpenDays({
          mondayOpen: !!payload.mondayOpen,
          tuesdayOpen: !!payload.tuesdayOpen,
          wednesdayOpen: !!payload.wednesdayOpen,
          thursdayOpen: !!payload.thursdayOpen,
          fridayOpen: !!payload.fridayOpen,
          saturdayOpen: !!payload.saturdayOpen,
          sundayOpen: !!payload.sundayOpen,
        });
      } finally {
        setOpenDaysLoading(false);
      }
    };
    void loadOpenDays();
  }, [user?.token]);

  useEffect(() => {
    const loadMyBusinesses = async () => {
      if (!user?.token) return;
      setOwnerLoading(true);
      try {
        const list = await ownerApi.getMyBusinesses();
        setOwnerBusinesses(list.map((b) => ({ id: b.id, businessName: b.businessName, status: b.status })));
        if (list.length > 0) setSelectedBusinessId((prev) => prev ?? list[0].id);
      } catch (e) {
        // ignore failures silently for now
      } finally {
        setOwnerLoading(false);
      }
    };
    void loadMyBusinesses();
  }, [user?.token]);

  if (isLoading || !user) return null;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setSubmitting(true);

    try {
      const response = await fetch(`${API_BASE}/api/promotions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          category: form.category,
          originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
          discountedPrice: form.discountedPrice ? Number(form.discountedPrice) : null,
          expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as { message?: string };
      if (!response.ok) {
        throw new Error(payload.message ?? "Failed to create deal.");
      }

      setMessage(`Deal u krijua me sukses te /${form.category === "FlashSales" ? "flash-sales" : form.category === "EarlyAccess" ? "early-access" : "discounts"}`);
      setForm(initialForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ndodhi nje gabim.");
    } finally {
      setSubmitting(false);
    }
  };

  const onSaveOpenDays = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.token) return;
    setOpenDaysMessage(null);
    setOpenDaysLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/owner/opendays`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(openDays),
      });
      const payload = (await response.json().catch(() => ({}))) as { message?: string };
      if (!response.ok) {
        throw new Error(payload.message ?? "Failed to save open days.");
      }
      setOpenDaysMessage("Open days u ruajten me sukses.");
    } catch (err) {
      setOpenDaysMessage(err instanceof Error ? err.message : "Ndodhi nje gabim.");
    } finally {
      setOpenDaysLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen px-6 py-10">
        <div className="mx-auto max-w-5xl rounded-2xl border border-oak/35 bg-paper/95 p-8 shadow-panel">
        

          <hr className="my-8 border-oak/20" />

          <h2 className="text-2xl font-bold text-espresso">Your Businesses</h2>
          {ownerLoading ? (
            <p className="mt-2 text-espresso/80">Loading your businesses...</p>
          ) : ownerBusinesses.length === 0 ? (
            <p className="mt-2 text-espresso/80">You have no businesses yet. Use "Shto biznes" to add one.</p>
          ) : (
            <ul className="mt-4 grid gap-3">
                  {ownerBusinesses.map((b) => (
                    <li key={b.id} className="rounded-lg border bg-white px-4 py-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <a className="font-semibold text-espresso" href={`/business/${b.id}`}>
                            {b.businessName}
                          </a>
                          <div className="text-xs text-espresso/70">{b.status}</div>
                        </div>
                        <div className="flex gap-2">
                          <a className="text-sm text-blue-600" href={`/business/${b.id}/edit`}>
                            Edit
                          </a>
                          <a className="text-sm text-blue-600" href={`/business/${b.id}/offers`}>
                            Manage Offers
                          </a>
                        </div>
                      </div>
                    </li>
                  ))}
            </ul>
          )}

          <hr className="my-8 border-oak/20" />
          
           </div>
      </main>
    </>
  );
}
