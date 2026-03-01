"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { authenticatedJson } from "@/lib/api/client";
import { toBusinessTypeLabel } from "@/lib/constants/businessTypes";

type PreviewBusiness = {
  id: string;
  name?: string;
  businessName?: string;
  city?: string;
  businessType?: string;
  status?: string;
  description?: string;
  address?: string;
  imageUrl?: string;
  createdAt?: string;
  businessNumber?: string;
  businessUrl?: string;
  phoneNumber?: string;
  email?: string;
  openDays?: string;
};

type AdminBusinessPreviewClientProps = {
  id: string;
};

function asText(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function normalizeBusiness(raw: Record<string, unknown>): PreviewBusiness {
  const typeRaw = asText(raw.businessType ?? raw.BusinessType ?? raw.type ?? raw.Type);

  return {
    id: asText(raw.id ?? raw.Id),
    name: asText(raw.name ?? raw.Name),
    businessName: asText(raw.businessName ?? raw.BusinessName),
    city: asText(raw.city ?? raw.City),
    businessType: toBusinessTypeLabel(typeRaw) || undefined,
    status: asText(raw.status ?? raw.Status),
    description: asText(raw.description ?? raw.Description),
    address: asText(raw.address ?? raw.Address),
    imageUrl: asText(raw.imageUrl ?? raw.ImageUrl),
    createdAt: asText(raw.createdAt ?? raw.CreatedAt),
    businessNumber: asText(raw.businessNumber ?? raw.BusinessNumber ?? raw.businesssNumber ?? raw.BusinesssNumber),
    businessUrl: asText(raw.businessUrl ?? raw.BusinessUrl ?? raw.websiteUrl ?? raw.WebsiteUrl),
    phoneNumber: asText(raw.phoneNumber ?? raw.PhoneNumber ?? raw.phone ?? raw.Phone),
    email: asText(raw.email ?? raw.Email),
    openDays: asText(raw.openDays ?? raw.OpenDays),
  };
}

export default function AdminBusinessPreviewClient({ id }: AdminBusinessPreviewClientProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [business, setBusiness] = useState<PreviewBusiness | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== 2) {
      router.replace("/dashboard-admin");
      return;
    }

    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const adminResp = await authenticatedJson<Record<string, unknown>>(`/api/admin/businesses/${id}`);
        const merged = normalizeBusiness(adminResp);

        try {
          const publicResp = await authenticatedJson<Record<string, unknown>>(`/api/businesses/${id}`, {
            requireAuth: false,
          });
          const extra = normalizeBusiness(publicResp);

          for (const key of Object.keys(extra) as Array<keyof PreviewBusiness>) {
            const value = extra[key];
            if (value !== undefined && value !== "") {
              merged[key] = value;
            }
          }
        } catch {
          // Public endpoint can fail for pending businesses; admin payload is enough.
        }

        if (mounted) {
          setBusiness(merged);
        }
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Failed to load business preview.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void load();
    return () => {
      mounted = false;
    };
  }, [id, isLoading, router, user]);

  return (
    <main className="min-h-screen bg-[var(--coffee-bg)] px-4 py-6 text-[var(--coffee-text)]">
      <div className="mx-auto max-w-2xl rounded-2xl border border-[var(--coffee-border)] bg-[var(--coffee-surface)] p-5 shadow-sm">
        <div className="mb-4 space-y-2">
          <Link href="/dashboard-admin#pending-review" className="inline-flex items-center text-sm underline">
            ← Back
          </Link>
          <h1 className="text-xl font-semibold">Business Preview</h1>
        </div>

        {loading && <p className="text-sm">Loading...</p>}
        {!loading && error && <p className="text-sm text-red-700">{error}</p>}

        {!loading && !error && business && (
          <div className="space-y-4">
            {business.imageUrl ? (
              <img
                src={business.imageUrl}
                alt={business.businessName || business.name || "Business image"}
                className="h-56 w-full rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-56 items-center justify-center rounded-xl border border-[var(--coffee-border)] text-sm text-[var(--coffee-muted)]">
                No photo available
              </div>
            )}

            <div className="space-y-2 text-sm">
              <p><strong>Name:</strong> {business.businessName || business.name || "-"}</p>
              <p><strong>City:</strong> {business.city || "-"}</p>
              <p><strong>Category:</strong> {business.businessType || "-"}</p>
              <p><strong>Status:</strong> {business.status || "-"}</p>
              <p><strong>Business number:</strong> {business.businessNumber || "-"}</p>
              <p><strong>Email:</strong> {business.email || "-"}</p>
              <p><strong>Phone:</strong> {business.phoneNumber || "-"}</p>
              <p><strong>Website:</strong> {business.businessUrl || "-"}</p>
              <p><strong>Address:</strong> {business.address || "-"}</p>
              <p><strong>Description:</strong> {business.description || "-"}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
