"use client";

import Link from "next/link";
import OwnerOpenDays from "./OwnerOpenDays";
import { useAuth } from "@/context/AuthContext";

export default function OwnerBusinessActions({ id }: { id: string }) {
  const { user } = useAuth();

  if (!user || user.role !== 1) return null;

  return (
    <div className="mt-6">
      <div className="flex items-center gap-3">
        <Link href={`/business/${id}/edit`} className="rounded-lg border px-3 py-1 text-sm">
          Edit Business
        </Link>
      </div>
    </div>
  );
}
