"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import * as ownerApi from "@/lib/api/ownerBusinesses";

type OpenDaysShape = {
  mondayOpen?: boolean;
  tuesdayOpen?: boolean;
  wednesdayOpen?: boolean;
  thursdayOpen?: boolean;
  fridayOpen?: boolean;
  saturdayOpen?: boolean;
  sundayOpen?: boolean;
} | null | undefined;

function formatOpenDays(openDays: NonNullable<OpenDaysShape>): string {
  const keys: Array<keyof NonNullable<OpenDaysShape>> = [
    "mondayOpen",
    "tuesdayOpen",
    "wednesdayOpen",
    "thursdayOpen",
    "fridayOpen",
    "saturdayOpen",
    "sundayOpen",
  ];
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const activeIndexes = keys.map((k, i) => ((openDays as any)[k] ? i : -1)).filter((i) => i >= 0);
  if (activeIndexes.length === 0) return "Closed";

  const runs: Array<[number, number]> = [];
  let start = activeIndexes[0];
  let prev = activeIndexes[0];
  for (let i = 1; i < activeIndexes.length; i++) {
    const cur = activeIndexes[i];
    if (cur === prev + 1) {
      prev = cur;
      continue;
    }
    runs.push([start, prev]);
    start = cur;
    prev = cur;
  }
  runs.push([start, prev]);

  if (runs.length === 1) {
    const [s, e] = runs[0];
    return s === e ? labels[s] : `${labels[s]} - ${labels[e]}`;
  }

  return activeIndexes.map((i) => labels[i]).join(", ");
}

function allTrue(openDays: OpenDaysShape) {
  if (!openDays) return false;
  return (
    !!openDays.mondayOpen &&
    !!openDays.tuesdayOpen &&
    !!openDays.wednesdayOpen &&
    !!openDays.thursdayOpen &&
    !!openDays.fridayOpen &&
    !!openDays.saturdayOpen &&
    !!openDays.sundayOpen
  );
}

export default function OwnerOpenDaysViewer({
  businessId,
  initialOpenDays,
}: {
  businessId: string;
  initialOpenDays?: OpenDaysShape;
}) {
  const { user } = useAuth();
  const [openDays, setOpenDays] = useState<OpenDaysShape>(initialOpenDays ?? undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // if we already have a specific partial openDays, keep it
    if (initialOpenDays && !allTrue(initialOpenDays)) return;

    // otherwise, if user is owner, try to fetch owner business openDays
    if (user?.role === 1) {
      setLoading(true);
      // Use owner endpoint `/api/owner/opendays?businessId=...` which returns open-days directly for the business.
      // This is more direct than fetching the whole business DTO.
      const fetchOpenDays = async () => {
        try {
          const res = await fetch(`/api/owner/opendays?businessId=${encodeURIComponent(businessId)}`, {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          if (!res.ok) return;
          const payload = (await res.json().catch(() => null)) as OpenDaysShape | null;
          if (payload) {
            // If the owner endpoint returns all days true (generic), try fetching the full business DTO
            // which may contain the actual per-business openDays.
            if (
              payload.mondayOpen &&
              payload.tuesdayOpen &&
              payload.wednesdayOpen &&
              payload.thursdayOpen &&
              payload.fridayOpen &&
              payload.saturdayOpen &&
              payload.sundayOpen
            ) {
              try {
                const dto = await ownerApi.getBusinessById(businessId);
                const dtoOpen = (dto as any).openDays as OpenDaysShape | undefined;
                if (dtoOpen) {
                  setOpenDays(dtoOpen);
                  return;
                }
              } catch (err) {
                // ignore and fall back to payload
              }
            }
          }
          setOpenDays(payload ?? undefined);
        } catch (err) {
          // ignore
        } finally {
          setLoading(false);
        }
      };
      void fetchOpenDays();
    }
  }, [businessId, initialOpenDays, user]);

  if (loading) return <p>Working days: loading...</p>;

  if (openDays) {
    if (allTrue(openDays)) return <p>Working days: Open daily</p>;
    return <p>Working days: {formatOpenDays(openDays as NonNullable<OpenDaysShape>)}</p>;
  }

  return <p>Working days: Not specified</p>;
}
