import type { BusinessStatus } from "@/lib/types/business";

export default function StatusBadge({ status }: { status: BusinessStatus }) {
  const base =
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border";

  const styles: Record<BusinessStatus, string> = {
    Pending: "bg-yellow-50 text-yellow-800 border-yellow-200",
    Approved: "bg-green-50 text-green-800 border-green-200",
    Rejected: "bg-red-50 text-red-800 border-red-200",
  };

  return <span className={`${base} ${styles[status]}`}>{status}</span>;
}