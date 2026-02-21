"use client";

type Props = {
  status?: string | null;
};

export default function StatusBadge({ status }: Props) {
  const s = (status ?? "Pending").toLowerCase();

  const cls =
    s === "approved"
      ? "bg-green-100 text-green-800 border-green-200"
      : s === "rejected"
      ? "bg-red-100 text-red-800 border-red-200"
      : s === "suspended"
      ? "bg-yellow-100 text-yellow-800 border-yellow-200"
      : "bg-gray-100 text-gray-800 border-gray-200"; 

  const label =
    s === "approved" ? "Approved" : s === "rejected" ? "Rejected" : s === "suspended" ? "Suspended" : "Pending";

  return <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${cls}`}>{label}</span>;
}