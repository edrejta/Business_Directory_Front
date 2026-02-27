import Link from "next/link";
import styles from "./page.module.css";
import BusinessComments from "./BusinessComments";
import { API_URL } from "@/lib/api/config";

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
  const businessType = String(payload.businessType ?? payload.BusinessType ?? payload.type ?? payload.Type ?? "");

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

async function getBusiness(id: string): Promise<BusinessDetail | null> {
  try {
    const byIdRes = await fetch(`${API_URL}/api/businesses/${encodeURIComponent(id)}`, { cache: "no-store" });
    if (byIdRes.ok) {
      const byIdRaw = (await byIdRes.json().catch(() => null)) as unknown;
      const byIdPayload = extractPayload(byIdRaw);
      if (byIdPayload) {
        return toBusinessDetail(byIdPayload, id);
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
    return payload ? toBusinessDetail(payload, id) : null;
  } catch {
    return null;
  }
}

function stars(rating: number): string {
  const full = Math.max(0, Math.min(5, Math.round(rating)));
  return "*".repeat(full) + ".".repeat(5 - full);
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
        <p className={styles.rating}>
          {stars(item.rating)} ({item.reviewsCount} reviews)
        </p>

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
          <a className={`${styles.btn} ${styles.btnPrimary}`} href={`tel:${item.phone}`}>
            Call Now
          </a>
          <a className={`${styles.btn} ${styles.btnAccent}`} href={`https://wa.me/${item.phone.replace(/\D/g, "")}`}>
            WhatsApp
          </a>
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
