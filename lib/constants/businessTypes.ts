const BUSINESS_TYPE_LABELS: Record<number, string> = {
  0: "Unknown",
  1: "Restaurant",
  2: "Cafe",
  3: "Shop",
  4: "Service",
  99: "Other",
};

export function toBusinessTypeLabel(value: unknown): string {
  if (typeof value === "number" && Number.isFinite(value)) {
    return BUSINESS_TYPE_LABELS[value] ?? String(value);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return "";
    const numeric = Number(trimmed);
    if (Number.isFinite(numeric)) {
      return BUSINESS_TYPE_LABELS[numeric] ?? trimmed;
    }
    return trimmed;
  }

  return "";
}
