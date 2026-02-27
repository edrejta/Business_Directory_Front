import { NextResponse } from "next/server";
import { API_URL } from "@/lib/api/config";

type PromotionLike = {
  id?: string;
  title?: string;
  description?: string;
};

function toArray(payload: unknown): PromotionLike[] {
  if (Array.isArray(payload)) return payload as PromotionLike[];
  if (payload && typeof payload === "object") {
    const row = payload as Record<string, unknown>;
    if (Array.isArray(row.data)) return row.data as PromotionLike[];
    if (Array.isArray(row.result)) return row.result as PromotionLike[];
  }
  return [];
}

export async function GET(request: Request) {
  const query = new URL(request.url).search;
  const targets = [`${API_URL}/api/promotions${query}`, `${API_URL}/promotions${query}`];

  for (const target of targets) {
    try {
      const response = await fetch(target, { cache: "no-store" });
      if (!response.ok) continue;

      const payload = await response.json().catch(() => []);
      return NextResponse.json(toArray(payload), { status: 200 });
    } catch {
      // Try the next target/fallback.
    }
  }

  return NextResponse.json([], { status: 200 });
}
