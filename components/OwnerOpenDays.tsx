"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import * as ownerApi from "@/lib/api/ownerBusinesses";

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5003";

export default function OwnerOpenDays({ businessId }: { businessId?: string }) {
  const { user } = useAuth();
  const [openDays, setOpenDays] = useState({
    mondayOpen: true,
    tuesdayOpen: true,
    wednesdayOpen: true,
    thursdayOpen: true,
    fridayOpen: true,
    saturdayOpen: false,
    sundayOpen: false,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!user?.token) return;
      setLoading(true);
      try {
        if (businessId) {
          const dto = await ownerApi.getBusinessById(businessId);
          setBusinessName(dto.businessName ?? null);
          setOpenDays((prev) => ({ ...prev, ...(dto.openDays ?? {}) } as any));
        } else {
          const res = await fetch(`${API_BASE}/api/owner/opendays`, {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          if (!res.ok) return;
          const payload = (await res.json().catch(() => ({}))) as Record<string, unknown>;
          setOpenDays((prev) => ({ ...prev, ...payload } as any));
        }
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [user?.token, businessId]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!user?.token) return;
    setLoading(true);
    setMessage(null);
    try {
      if (businessId) {
        const input: any = { openDays };
        if (businessName) input.businessName = businessName;
        await ownerApi.updateBusiness(businessId, input as any);
        setMessage("Open days saved successfully.");
      } else {
        const res = await fetch(`${API_BASE}/api/owner/opendays`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
          body: JSON.stringify(openDays),
        });
        const payload = (await res.json().catch(() => ({}))) as { message?: string };
        if (!res.ok) throw new Error(payload.message ?? "Failed to save open days.");
        setMessage("Open days saved successfully.");
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Error saving open days.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={save} className="mt-4 grid gap-2">
      <h3 className="text-lg font-semibold">Open Days</h3>
      {(
        [
          ["mondayOpen", "Monday"],
          ["tuesdayOpen", "Tuesday"],
          ["wednesdayOpen", "Wednesday"],
          ["thursdayOpen", "Thursday"],
          ["fridayOpen", "Friday"],
          ["saturdayOpen", "Saturday"],
          ["sundayOpen", "Sunday"],
        ] as Array<[keyof typeof openDays, string]>
      ).map(([key, label]) => (
        <label key={key as string} className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={!!openDays[key]}
            onChange={(e) => setOpenDays((prev) => ({ ...prev, [key]: e.target.checked }))}
          />
          <span>{label}</span>
        </label>
      ))}

      <div className="mt-2 flex items-center gap-2">
        <button disabled={loading} className="rounded-lg bg-espresso px-3 py-1 text-sm text-paper" type="submit">
          {loading ? "Saving..." : "Save Open Days"}
        </button>
        {message ? <div className="text-sm text-espresso/80">{message}</div> : null}
      </div>
    </form>
  );
}
