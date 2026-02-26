"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import "./deals.css";

type DealCategory = "Discounts" | "FlashSales" | "EarlyAccess";

type Promotion = {
  id: string;
  businessId?: string;
  businessName?: string;
  title: string;
  description: string;
  category?: DealCategory;
  discountPercent?: number;
  expiresAt?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";

const CATEGORY_FILTERS: Array<{ value: DealCategory; label: string }> = [
  { value: "Discounts", label: "Discounts" },
  { value: "FlashSales", label: "Flash Sale" },
  { value: "EarlyAccess", label: "Early Access" },
];

function categoryLabel(category?: DealCategory) {
  if (category === "FlashSales") return "Flash Sale";
  if (category === "EarlyAccess") return "Early Access";
  return "Discount";
}

function categorySymbol(category?: DealCategory) {
  if (category === "FlashSales") return "\u2737";
  if (category === "EarlyAccess") return "\u23F0";
  return "\u{1F3F7}";
}

function daysLeft(expiresAt?: string) {
  if (!expiresAt) return "No deadline";
  const diffMs = new Date(expiresAt).getTime() - Date.now();
  if (diffMs <= 0) return "Expired";
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return `${days} day${days === 1 ? "" : "s"} left`;
}

export default function DealsPage() {
  const [deals, setDeals] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<DealCategory[]>([]);

  useEffect(() => {
    let mounted = true;

    const loadDeals = async () => {
      try {
        const response = await fetch(`${API_BASE}/promotions`, { cache: "no-store" });
        const data = (await response.json().catch(() => [])) as Promotion[];
        if (!mounted) return;
        setDeals(Array.isArray(data) ? data : []);
      } catch {
        if (!mounted) return;
        setDeals([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void loadDeals();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredDeals = useMemo(() => {
    const withCategory = deals.filter((item) => item.category);
    if (selectedCategories.length === 0) return withCategory;
    return withCategory.filter((item) => item.category && selectedCategories.includes(item.category));
  }, [deals, selectedCategories]);

  return (
    <main className="deals-page">
      <section className="deals-wrap">
        <header className="deals-head">
          <p>LIVE DEALS</p>
          <h1>Deals</h1>
          <span>All deals below are loaded from database.</span>
        </header>

        <div className="deals-checklist">
          {CATEGORY_FILTERS.map((item) => {
            const active = selectedCategories.includes(item.value);
            return (
              <button
                key={item.value}
                type="button"
                className={active ? "active" : ""}
                onClick={() =>
                  setSelectedCategories((prev) =>
                    prev.includes(item.value) ? prev.filter((x) => x !== item.value) : [...prev, item.value],
                  )
                }
              >
                <span>{active ? "\u2611" : "\u2610"}</span>
                {item.label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <p className="deals-empty">Loading deals...</p>
        ) : filteredDeals.length === 0 ? (
          <p className="deals-empty">No deals found for selected type.</p>
        ) : (
          <div className="deals-grid">
            {filteredDeals.map((deal) => (
              <article key={deal.id} className="deal-card">
                <div className="deal-symbol" aria-hidden="true">
                  {categorySymbol(deal.category)}
                </div>
                <small>{categoryLabel(deal.category)}</small>
                <h2>{deal.title}</h2>
                <p>{deal.description}</p>
                <h3>{deal.businessName || "Business"}</h3>
                <div className="deal-footer">
                  <span>{daysLeft(deal.expiresAt)}</span>
                  <Link href={deal.businessId ? `/business/${deal.businessId}` : "/login"}>Claim</Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
