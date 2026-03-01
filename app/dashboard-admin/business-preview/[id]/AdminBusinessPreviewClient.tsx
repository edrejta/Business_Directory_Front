"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { authenticatedJson } from "@/lib/api/client";
import { approveAdminBusiness, deleteAdminBusiness } from "@/lib/api/admin";
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
  // openDays remains in raw host but not shown anywhere
  openDays?: string;
};

type AdminBusinessPreviewClientProps = {
  id: string;
};

function asText(value: unknown): string {
  return typeof value === "string" ? value : "";
}

// we no longer show or style status badges on the preview page
function badgeForStatus(status?: string) {
  return null;
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
    businessNumber: asText(
      raw.businessNumber ?? raw.BusinessNumber ?? raw.businesssNumber ?? raw.BusinesssNumber,
    ),
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
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);

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
        // first grab the admin view (guaranteed to work for pending businesses)
        const adminResp = await authenticatedJson<Record<string, unknown>>(
          `/api/admin/businesses/${id}`,
        );
        if (!mounted) return;
        let merged = normalizeBusiness(adminResp);

        // then try to fetch the full business record via the normal API. this may
        // 404 for pending/non-public entries, so we just swallow any errors.
        try {
          const extraResp = await authenticatedJson<Record<string, unknown>>(
            `/api/businesses/${id}`,
            { requireAuth: false },
          );
          if (mounted) {
            const extra = normalizeBusiness(extraResp);
            // only copy values that are non-empty so we don't erase the
            // richer admin data with a mostly-empty public record.
            for (const key of Object.keys(extra) as Array<keyof PreviewBusiness>) {
              const val = extra[key];
              if (val !== undefined && val !== "") {
                merged[key] = val;
              }
            }
          }
        } catch {
          // ignore - we already have at least the admin data
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


  const handleApprove = async () => {
    setApproving(true);
    setError(null);
    try {
      await approveAdminBusiness(id);
      router.replace("/dashboard-admin#pending-review");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve business.");
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async () => {
    if (!confirm("Are you sure you want to reject this business? This action cannot be undone.")) {
      return;
    }
    setRejecting(true);
    setError(null);
    try {
      await deleteAdminBusiness(id);
      router.replace("/dashboard-admin#pending-review");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reject business.");
    } finally {
      setRejecting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f3e0d6] px-4 py-6 text-[var(--coffee-text)]">
      <div className="mx-auto max-w-2xl rounded-2xl border border-[var(--coffee-border)] bg-[var(--coffee-surface)] p-5 shadow-sm">
        <div className="mb-6 space-y-2">
          <div className="flex items-center justify-between border-b pb-3">
            <Link href="/dashboard-admin#pending-review" className="inline-flex items-center text-sm underline">
              ← Back
            </Link>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">Business Preview</h1>
            </div>
            <div className="w-24" />
          </div>
          {business && business.businessType && (
            <div className="pt-2 text-sm text-[var(--coffee-muted)]">
              <span className="inline-block rounded-full bg-[var(--coffee-border)] px-3 py-1 text-xs font-medium">
                {business.businessType}
              </span>
            </div>
          )}
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

            <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="font-medium">Business name</dt>
                <dd>{business.businessName || business.name || "-"}</dd>
              </div>

              <div>
                <dt className="font-medium">Type</dt>
                <dd>{business.businessType || "Unspecified"}</dd>
              </div>
              <div>
                <dt className="font-medium">City</dt>
                <dd>{business.city || "-"}</dd>
              </div>


              <div>
                <dt className="font-medium">Added</dt>
                <dd>
                  {business.createdAt
                    ? new Date(business.createdAt).toLocaleString()
                    : "-"}
                </dd>
              </div>

              <div>
                <dt className="font-medium">Business number</dt>
                <dd>{business.businessNumber || "-"}</dd>
              </div>

              <div>
                <dt className="font-medium">Email</dt>
                <dd>{business.email || "-"}</dd>
              </div>

              <div>
                <dt className="font-medium">Website</dt>
                <dd>
                  {business.businessUrl ? (
                    <a
                      href={business.businessUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {business.businessUrl}
                    </a>
                  ) : (
                    "-"
                  )}
                </dd>
              </div>

              {/* phone number moved toward bottom */}
              <div className="sm:col-span-2">
                <dt className="font-medium">Phone number</dt>
                <dd>{business.phoneNumber || "-"}</dd>
              </div>

              <div className="sm:col-span-2">
                <dt className="font-medium">Address</dt>
                <dd>{business.address || "-"}</dd>
              </div>

              <div className="sm:col-span-2">
                <dt className="font-medium">Description</dt>
                <dd>{business.description || "-"}</dd>
              </div>

            </dl>
          </div>
        )}
        {business && (
          <div className="flex justify-end mt-6 space-x-3">
            <button
              type="button"
              disabled={approving || rejecting}
              onClick={handleReject}
              className="rounded-lg border-2 border-[rgb(82.4,80,72.7)] px-4 py-2 text-base font-semibold text-[rgb(90.6,89,84.7)] bg-transparent hover:bg-[rgb(227,218,208)] hover:text-[rgb(90.6,89,84.7)] disabled:opacity-60"
            >
              Reject
            </button>
            <button
              type="button"
              disabled={approving || rejecting}
              onClick={handleApprove}
              className="rounded-lg bg-[rgb(67,48,33)] px-5 py-2 text-base font-semibold text-white hover:bg-[rgb(55,39,27)] disabled:opacity-60"
            >
              Approve
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
