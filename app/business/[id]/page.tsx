import Link from "next/link";
import styles from "./page.module.css";
import BusinessComments from "./BusinessComments";
import { API_URL } from "@/lib/api/config";
import { toBusinessTypeLabel } from "@/lib/constants/businessTypes";

type BusinessDetail = {
  id: string;
  name: string;
  description: string;
  category: string;
  address: string;
  location: string;
  phone: string;
  email: string;
  logo: string;
  rating: number;
  reviewsCount: number;
  coordinates?: { lat: number; lng: number } | null;
  photos?: string[];
};

type ReviewStats = {
  rating: number;
  reviewsCount: number;
};

function extractPayload(raw: unknown): Record<string, unknown> | null {
  const root = typeof raw === "object" && raw !== null ? (raw as Record<string, unknown>) : null;
  const candidate = root && typeof root.data === "object" && root.data !== null
    ? root.data
    : root && typeof root.result === "object" && root.result !== null
      ? root.result
      : raw;
  return typeof candidate === "object" && candidate !== null ? (candidate as Record<string, unknown>) : null;
}

function toBusinessDetail(payload: Record<string, unknown>, fallbackId: string): BusinessDetail {
  const city = String(payload.city ?? payload.City ?? "");
  const businessType = toBusinessTypeLabel(payload.businessType ?? payload.BusinessType ?? payload.type ?? payload.Type);

  return {
    id: String(payload.id ?? payload.Id ?? payload.businessId ?? payload.BusinessId ?? fallbackId),
    name: String(payload.name ?? payload.Name ?? payload.businessName ?? payload.BusinessName ?? "Business"),
    description: String(payload.description ?? payload.Description ?? ""),
    category: businessType || "General",
    address: String(payload.address ?? payload.Address ?? city),
    location: city,
    phone: String(payload.phone ?? payload.Phone ?? payload.phoneNumber ?? payload.PhoneNumber ?? ""),
    email: String(payload.email ?? payload.Email ?? ""),
    logo: String(payload.logo ?? payload.Logo ?? payload.imageUrl ?? payload.ImageUrl ?? ""),
    rating: Number(payload.rating ?? payload.Rating ?? 0),
    reviewsCount: Number(payload.reviewsCount ?? payload.ReviewsCount ?? 0),
    coordinates:
      typeof payload.coordinates === "object" && payload.coordinates !== null
        ? (payload.coordinates as { lat: number; lng: number })
        : null,
    photos: Array.isArray(payload.photos) ? (payload.photos as string[]) : [],
  };
}

function extractList(raw: unknown): unknown[] {
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "object" && raw !== null) {
    const root = raw as Record<string, unknown>;
    const candidate = root.data ?? root.result ?? root.items;
    return Array.isArray(candidate) ? candidate : [];
  }
  return [];
}

function toRate(value: unknown): number | null {
  const n = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
  if (!Number.isFinite(n)) return null;
  return Math.max(1, Math.min(5, n));
}

async function getReviewStats(businessId: string): Promise<ReviewStats> {
  try {
    const res = await fetch(`${API_URL}/api/comments?businessId=${encodeURIComponent(businessId)}&limit=100`, {
      cache: "no-store",
    });
    if (!res.ok) return { rating: 0, reviewsCount: 0 };
    const raw = (await res.json().catch(() => [])) as unknown;
    const list = extractList(raw);
    if (list.length === 0) return { rating: 0, reviewsCount: 0 };

    const rates = list
      .map((entry) => {
        const row = typeof entry === "object" && entry !== null ? (entry as Record<string, unknown>) : {};
        return toRate(row.rate ?? row.Rate ?? row.rating ?? row.Rating);
      })
      .filter((rate): rate is number => rate !== null);

    if (rates.length === 0) return { rating: 0, reviewsCount: list.length };
    const avg = rates.reduce((sum, value) => sum + value, 0) / rates.length;
    return {
      rating: Math.round(avg * 10) / 10,
      reviewsCount: list.length,
    };
  } catch {
    return { rating: 0, reviewsCount: 0 };
  }
}

async function getBusiness(id: string): Promise<BusinessDetail | null> {
  try {
    const byIdRes = await fetch(`${API_URL}/api/businesses/${encodeURIComponent(id)}`, { cache: "no-store" });
    if (byIdRes.ok) {
      const byIdRaw = (await byIdRes.json().catch(() => null)) as unknown;
      const byIdPayload = extractPayload(byIdRaw);
      if (byIdPayload) {
        const detail = toBusinessDetail(byIdPayload, id);
        const reviewStats = await getReviewStats(detail.id);
        return { ...detail, ...reviewStats };
      }
    }

    const listRes = await fetch(`${API_URL}/api/businesses/public`, { cache: "no-store" });
    if (!listRes.ok) return null;
    const listRaw = (await listRes.json().catch(() => [])) as unknown;
    const root = typeof listRaw === "object" && listRaw !== null ? (listRaw as Record<string, unknown>) : {};
    const list = Array.isArray(root.data ?? root.result ?? root.items ?? listRaw)
      ? (root.data ?? root.result ?? root.items ?? listRaw)
      : [];
    const payload = (list as Record<string, unknown>[]).find(
      (item) => String(item.id ?? item.Id ?? item.businessId ?? item.BusinessId ?? "") === id,
    );
    if (!payload) return null;
    const detail = toBusinessDetail(payload, id);
    const reviewStats = await getReviewStats(detail.id);
    return { ...detail, ...reviewStats };
  } catch {
    return null;
  }
}

function stars(rating: number): string {
  const full = Math.max(0, Math.min(5, Math.round(rating)));
  return "\u2605".repeat(full) + "\u2606".repeat(5 - full);
}

export default async function BusinessDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getBusiness(id);

  if (!item) {
    return (
      <main className={styles.page}>
        <section className={styles.error}>
          <h1>Biznesi nuk u gjet.</h1>
          <Link href="/homepage">Kthehu te homepage</Link>
        </section>
      </main>
    );
  }

  const mapsTarget = item.coordinates
    ? `${item.coordinates.lat},${item.coordinates.lng}`
    : encodeURIComponent(`${item.address}, ${item.location}`);

  const photos = [
    ...(Array.isArray(item.photos) ? item.photos : []),
    ...(item.logo?.trim() ? [item.logo.trim()] : []),
  ].filter((p, idx, arr) => p.length > 0 && arr.indexOf(p) === idx);

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <p className={styles.crumb}>
          <Link href="/homepage">Home</Link> &nbsp;&gt;&nbsp; <span>{item.name}</span>
        </p>

        <span className={styles.chip}>{item.category}</span>
        <h1 className={styles.title}>{item.name}</h1>
        <h2 className={styles.sectionTitle}>Description</h2>
        <p className={styles.desc}>{item.description || "Nuk ka pershkrim per momentin."}</p>
        {item.reviewsCount > 0 ? (
          <p className={styles.rating}>
            {stars(item.rating)} ({item.reviewsCount} {item.reviewsCount === 1 ? "review" : "reviews"})
          </p>
        ) : null}

        {photos.length > 0 && (
          <>
            <h2 className={styles.sectionTitle}>Photos</h2>
            <div className={styles.photos}>
              {photos.map((src, idx) => (
                <img key={`${src}-${idx}`} src={src} alt={`${item.name} photo ${idx + 1}`} />
              ))}
            </div>
          </>
        )}

        <div className={styles.grid}>
          <div className={styles.box}>
            <span className={styles.boxLabel}>Address</span>
            <strong>{item.address}</strong>
          </div>
          <div className={styles.box}>
            <span className={styles.boxLabel}>Location</span>
            <strong>{item.location}</strong>
          </div>
          <div className={styles.box}>
            <span className={styles.boxLabel}>Phone</span>
            <strong>{item.phone}</strong>
          </div>
          <div className={styles.box}>
            <span className={styles.boxLabel}>Email</span>
            <strong>{item.email}</strong>
          </div>
        </div>

        <div className={styles.actions}>
          <a className={styles.btn} href={`https://maps.google.com/?q=${mapsTarget}`} target="_blank" rel="noreferrer">
            Get Directions
          </a>
        </div>

        <Link href="/homepage" className={styles.back}>
          &larr; Back to all businesses
        </Link>

        <BusinessComments businessId={item.id} />
      </section>
    </main>
  );
}
