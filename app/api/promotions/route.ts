import { NextResponse } from "next/server";
import { API_URL } from "@/lib/api/config";

type PromotionLike = Record<string, unknown>;

function toArray(payload: unknown): PromotionLike[] {
  if (Array.isArray(payload)) return payload as PromotionLike[];
  if (payload && typeof payload === "object") {
    const row = payload as Record<string, unknown>;
    if (Array.isArray(row.data)) return row.data as PromotionLike[];
    if (Array.isArray(row.result)) return row.result as PromotionLike[];
    if (Array.isArray(row.items)) return row.items as PromotionLike[];
  }
  return [];
}

function normalizePromotion(item: PromotionLike): Record<string, unknown> {
  const business =
    item.business && typeof item.business === "object"
      ? (item.business as Record<string, unknown>)
      : item.Business && typeof item.Business === "object"
        ? (item.Business as Record<string, unknown>)
        : null;

  return {
    ...item,
    id: String(item.id ?? item.Id ?? ""),
    businessId: String(item.businessId ?? item.BusinessId ?? ""),
    businessName: String(
      item.businessName ?? item.BusinessName ?? business?.businessName ?? business?.BusinessName ?? "Business",
    ),
    title: String(item.title ?? item.Title ?? ""),
    description: String(item.description ?? item.Description ?? ""),
    category: String(item.category ?? item.Category ?? ""),
    discountPercent: Number(item.discountPercent ?? item.DiscountPercent ?? 0),
    expiresAt: String(item.expiresAt ?? item.ExpiresAt ?? ""),
  };
}

export async function GET(request: Request) {
  const query = new URL(request.url).search;
  const targets = [`${API_URL}/api/promotions${query}`, `${API_URL}/promotions${query}`];

  for (const target of targets) {
    try {
      const response = await fetch(target, { cache: "no-store" });
      if (!response.ok) continue;

      const payload = await response.json().catch(() => []);
      return NextResponse.json(toArray(payload).map(normalizePromotion), { status: 200 });
    } catch {
      // Try next target.
    }
  }

  return NextResponse.json([], { status: 200 });
}

