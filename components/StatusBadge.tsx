"use client";

type Props = {
  status: string;
};

function normalize(status: string) {
  return (status || "").toLowerCase();
}

export default function StatusBadge({ status }: Props) {
  const s = normalize(status);

  const label =
    s === "approved" ? "Approved" :
    s === "pending" ? "Pending" :
    s === "suspended" ? "Suspended" :
    status || "Unknown";

  const className =
    s === "approved"
      ? "inline-flex items-center rounded-full border px-2 py-1 text-xs"
      : s === "suspended"
      ? "inline-flex items-center rounded-full border px-2 py-1 text-xs"
      : "inline-flex items-center rounded-full border px-2 py-1 text-xs";

  return <span className={className}>{label}</span>;
}
