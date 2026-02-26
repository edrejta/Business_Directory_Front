import { API_URL } from "@/lib/api/config";
import { getToken } from "@/lib/auth/storage";

export type PromotionCategory = "Discounts" | "FlashSales" | "EarlyAccess";

export type Promotion = {
  id: string;
  businessId: string;
  businessName?: string;
  title: string;
  description: string;
  category: PromotionCategory | string;
  originalPrice: number | null;
  discountedPrice: number | null;
  discountPercent: number | null;
  startsAt: string | null;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
};

async function readJsonSafe(res: Response) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getMyPromotions(businessId: string, category?: string): Promise<Promotion[]> {
  const qs = new URLSearchParams();
  qs.set("businessId", businessId);
  if (category) qs.set("category", category);

  const res = await fetch(`${API_URL}/api/promotions/mine?${qs.toString()}`, {
    headers: { ...authHeaders() },
  });

  if (!res.ok) {
    const body = await readJsonSafe(res);
    const msg =
      (typeof body === "object" && body && "message" in body && typeof (body as any).message === "string"
        ? (body as any).message
        : res.statusText) || "Nuk u arrit të ngarkohen deal-et.";
    throw new Error(`Nuk u arrit të ngarkohen deal-et (${res.status}) - ${msg}`);
  }

  return (await res.json()) as Promotion[];
}

export async function createPromotion(payload: any): Promise<Promotion> {
  const res = await fetch(`${API_URL}/api/promotions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });

  const body = (await res.json().catch(() => ({}))) as any;
  if (!res.ok) throw new Error(body?.message ?? `Failed to create deal (${res.status}).`);

  return body as Promotion;
}

export async function updatePromotion(id: string, payload: any): Promise<Promotion> {
  const res = await fetch(`${API_URL}/api/promotions/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });

  const body = (await res.json().catch(() => ({}))) as any;
  if (!res.ok) throw new Error(body?.message ?? `Failed to update deal (${res.status}).`);

  return body as Promotion;
}

export async function deletePromotion(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/promotions/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
  });

  if (!res.ok) {
    const body = await readJsonSafe(res);
    const msg =
      (typeof body === "object" && body && "message" in body && typeof (body as any).message === "string"
        ? (body as any).message
        : res.statusText) || "Nuk u arrit të fshihet deal-i.";
    throw new Error(`Nuk u arrit të fshihet deal-i (${res.status}) - ${msg}`);
  }
}