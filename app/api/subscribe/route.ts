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

  const targets = [`${API_URL}/api/subscribe`];

  let lastStatus = 502;
  let lastMessage = "Subscription failed.";

  for (const target of targets) {
    try {
      const response = await fetch(target, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        cache: "no-store",
      });

      const payload = (await response.json().catch(() => ({}))) as { message?: string };

      if (!response.ok) {
        lastStatus = response.status || 502;
        lastMessage = payload?.message?.trim() || response.statusText || "Subscription failed.";
        continue;
      }

      return NextResponse.json(
        { message: payload?.message?.trim() || "Subscribed successfully." },
        { status: 200 },
      );
    } catch {
      lastStatus = 502;
      lastMessage = "Backend not reachable.";
    }
  }

  return NextResponse.json({ message: lastMessage }, { status: lastStatus });
}
