"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import * as ownerApi from "@/lib/api/ownerBusinesses";

// Client component that shows phone number. If the public payload didn't include a phone,
// and the current user is the owner, it fetches owner business details to read `phoneNumber`.
export default function OwnerContactViewer({
  businessId,
  initialPhone,
}: {
  businessId: string;
  initialPhone?: string;
}) {
  const { user } = useAuth();
  const [phone, setPhone] = useState<string | undefined>(initialPhone ?? undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // if we already have a phone (from public payload), keep it
    if (phone) return;
    // only fetch owner detail if current user is owner
    if (user?.role !== 1) return;

    setLoading(true);
    ownerApi
      .getBusinessById(businessId)
      .then((dto) => {
        // owner API maps to `phoneNumber` in owner dto
        const p = (dto as any).phoneNumber ?? (dto as any).phone ?? undefined;
        if (p) setPhone(String(p));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [businessId, user, phone]);

  if (loading) return <strong>loading...</strong>;
  return (
    <strong>
      {phone ? (
        <a href={`tel:${phone}`} className="no-underline text-inherit">
          {phone}
        </a>
      ) : (
        "-"
      )}
    </strong>
  );
}
