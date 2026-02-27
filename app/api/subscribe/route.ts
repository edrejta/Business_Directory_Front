import { NextResponse } from "next/server";
import { API_URL } from "@/lib/api/config";

type SubscribeBody = { email?: string };

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as SubscribeBody;
  const email = (body.email ?? "").trim();

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ message: "Invalid email." }, { status: 400 });
  }

  const targets = Array.from(
    new Set([
      `${API_URL}/api/subscribe`,
      `${API_URL}/subscribe`,
      "http://localhost:5003/api/subscribe",
      "http://localhost:5003/subscribe",
      "https://localhost:7066/api/subscribe",
      "https://localhost:7066/subscribe",
    ]),
  );

  for (const target of targets) {
    try {
      const response = await fetch(target, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        cache: "no-store",
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        // Try alternate endpoint before failing.
        continue;
      }

      return NextResponse.json({ ok: true, message: "Subscribed successfully.", data: payload }, { status: 200 });
    } catch {
      // Try alternate endpoint/fallback.
    }
  }

  return NextResponse.json({ ok: false, message: "Subscription service unavailable." }, { status: 200 });
}
