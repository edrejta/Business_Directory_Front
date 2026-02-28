"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toBusinessTypeLabel } from "@/lib/constants/businessTypes";
import {
  REQUEST_FAILED_MESSAGE,
  UNABLE_TO_REACH_BACKEND_MESSAGE,
} from "@/lib/constants/messages";
import styles from "./page.module.css";

type Business = {
  id: string;
  name: string;
  description?: string;
  category?: string;
  location?: string;
  address?: string;
};

type ApiBusiness = {
  id?: string;
  Id?: string;
  businessName?: string;
  BusinessName?: string;
  name?: string;
  Name?: string;
  description?: string;
  Description?: string;
  businessType?: string;
  BusinessType?: string;
  category?: string;
  Category?: string;
  type?: string;
  Type?: string;
  city?: string;
  City?: string;
  address?: string;
  Address?: string;
};

type ApiResult<T> = {
  data: T;
  error: string | null;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";

const toText = (value: unknown) => {
  if (typeof value === "string") return value;
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return "";
};

function normalizeSearchKeyword(rawKeyword: string) {
  return rawKeyword
    .trim()
    .replace(/near me/gi, "")
    .replace(/afër meje/gi, "")
    .replace(/afer meje/gi, "")
    .replace(/prane meje/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchJson<T>(path: string, fallback: T): Promise<ApiResult<T>> {
  try {
    const response = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
    const raw = (await response.json().catch(() => fallback)) as T & {
      message?: string;
      data?: unknown;
      result?: unknown;
    };
    if (!response.ok) {
      return { data: fallback, error: raw?.message ?? REQUEST_FAILED_MESSAGE };
    }
    const payload = (raw.data ?? raw.result ?? raw) as T;
    return { data: payload, error: null };
  } catch {
    return { data: fallback, error: UNABLE_TO_REACH_BACKEND_MESSAGE };
  }
}

function normalizeBusiness(item: ApiBusiness): Business {
  return {
    id: toText(item.id ?? item.Id),
    name: toText(item.businessName ?? item.BusinessName ?? item.name ?? item.Name) || "Business",
    description: toText(item.description ?? item.Description) || undefined,
    category:
      toBusinessTypeLabel(item.category ?? item.Category ?? item.businessType ?? item.BusinessType ?? item.type ?? item.Type) ||
      undefined,
    location: toText(item.city ?? item.City) || undefined,
    address: toText(item.address ?? item.Address) || undefined,
  };
}

export default function AllBusinessesPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const runSearch = async (keyword?: string) => {
    setLoading(true);
    const params = new URLSearchParams();
    const normalizedQuery = normalizeSearchKeyword(keyword ?? query);
    if (normalizedQuery) params.set("search", normalizedQuery);

    const { data, error: apiError } = await fetchJson<ApiBusiness[]>(
      `/api/businesses/public${params.toString() ? `?${params.toString()}` : ""}`,
      [],
    );
    const normalized = Array.isArray(data) ? data.map(normalizeBusiness).filter((item) => item.id.length > 0) : [];

    setResults(normalized);
    setError(apiError);
    setLoading(false);
  };

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const { data, error: apiError } = await fetchJson<ApiBusiness[]>("/api/businesses/public", []);
      if (!mounted) return;
      const normalized = Array.isArray(data) ? data.map(normalizeBusiness).filter((item) => item.id.length > 0) : [];
      setResults(normalized);
      setError(apiError);
      setLoading(false);
    };

    void load();
    return () => {
      mounted = false;
    };
  }, []);

  const statusMessage = useMemo(() => {
    if (loading) return "Loading...";
    if (error) return error;
    if (results.length === 0) return "No businesses found.";
    return null;
  }, [loading, error, results.length]);

  const countLabel = useMemo(() => (results.length === 1 ? "1 business" : `${results.length} businesses`), [results.length]);

  return (
    <main className={styles.page}>
      <div className={styles.wrap}>
        <Link href="/homepage" className={styles.homeLink}>
          Home
        </Link>

        <section className={styles.head}>
          <h1>All Businesses</h1>
          <p>{countLabel}</p>
        </section>

        <section className={styles.controls}>
          <form
            className={styles.searchRow}
            onSubmit={(event) => {
              event.preventDefault();
              const normalized = normalizeSearchKeyword(query);
              setQuery(normalized);
              void runSearch(normalized);
            }}
          >
            <input
              className={styles.searchInput}
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search for business, product, or service"
            />
            <button type="submit" className={styles.button}>
              Search
            </button>
            <button
              type="button"
              className={styles.ghostButton}
              onClick={() => {
                setQuery("");
                void runSearch("");
              }}
            >
              Clear
            </button>
          </form>
        </section>

        {statusMessage ? <p className={styles.status}>{statusMessage}</p> : null}

        {!loading && !error && results.length > 0 ? (
          <section className={styles.grid}>
            {results.map((item) => (
              <article key={item.id} className={styles.card}>
                <h2>{item.name}</h2>
                <p className={styles.meta}>
                  {item.location || "Unknown city"} · {item.category || "Unknown category"}
                </p>
                <p className={styles.desc}>{item.description || "No description provided yet."}</p>

                <div className={styles.actionRow}>
                  <a
                    className={styles.actionLink}
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      item.address || item.location || item.name,
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open ${item.name} location`}
                    title="Location"
                  >
                    Location
                  </a>

                  <Link href={`/business/${item.id}`} className={styles.actionLink} aria-label={`View ${item.name}`}>
                    View
                  </Link>

                  <Link
                    href={`/opendays?businessId=${item.id}`}
                    className={styles.actionLink}
                    aria-label={`Check ${item.name} open days`}
                  >
                    Open Days
                  </Link>
                </div>
              </article>
            ))}
          </section>
        ) : null}
      </div>
    </main>
  );
}
