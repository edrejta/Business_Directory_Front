"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5003";

export default function BusinessOffersPage(props: any) {
  const { params } = props as { params: { id: string } };
  const { id } = params;
  const router = useRouter();
  const [offers, setOffers] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/promotions?businessId=${encodeURIComponent(id)}`);
        if (!res.ok) return;
        const data = await res.json().catch(() => []);
        setOffers(Array.isArray(data) ? data : data.data ?? []);
      } catch {}
    };
    void load();
  }, [id]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      // Minimal create payload — backend may require more fields
      const res = await fetch(`${API_BASE}/api/promotions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, businessId: id }),
      });
      if (!res.ok) throw new Error("Failed");
      router.refresh();
    } catch (err) {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-4xl p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-4">Manage Offers</h1>
      <form onSubmit={handleCreate} className="mb-4">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Offer title" className="border rounded px-2 py-1 mr-2" />
        <button disabled={loading} className="rounded bg-espresso px-3 py-1 text-paper">{loading ? "Saving..." : "Create"}</button>
      </form>

      <ul className="grid gap-3">
        {offers.map((o) => (
          <li key={o.id} className="rounded border p-3">
            <div className="font-semibold">{o.title ?? o.name ?? "Offer"}</div>
            <div className="text-sm text-espresso/70">{o.category ?? ""}</div>
          </li>
        ))}
      </ul>
    </main>
  );
}
