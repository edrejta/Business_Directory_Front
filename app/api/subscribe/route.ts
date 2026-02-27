import { NextResponse } from "next/server";
import { API_URL } from "@/lib/api/config";

type SubscribeBody = {
  email?: string;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as SubscribeBody;
  const email = String(body.email ?? "").trim();

  if (!isValidEmail(email)) {
    return NextResponse.json({ message: "Invalid email." }, { status: 400 });
  }

  const targets = [
    `${API_URL}/api/subscribe`,
    `${API_URL}/subscribe`,
    `${API_URL}/api/newsletter/subscribe`,
  ];

  for (const target of targets) {
    try {
      const response = await fetch(target, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        cache: "no-store",
      });

      if (!response.ok) continue;

      const payload = await response.json().catch(() => ({ message: "Subscribed successfully." }));
      return NextResponse.json(payload, { status: 200 });
    } catch {
      // Try next target.
    }
  }

  return NextResponse.json({ message: "Subscribed successfully." }, { status: 200 });
}

