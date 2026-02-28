export type BusinessIdLike = {
  id?: unknown;
  Id?: unknown;
  businessId?: unknown;
  BusinessId?: unknown;
};

function toTextId(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return "";
}

/**
 * Backend payloads are inconsistent; resolve the first known ID field in priority order.
 */
export function resolveBusinessId(item: BusinessIdLike): string {
  return toTextId(item.id ?? item.Id ?? item.businessId ?? item.BusinessId);
}
