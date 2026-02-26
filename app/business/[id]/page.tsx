import Link from "next/link";
import BusinessFeedback from "@/components/BusinessFeedback";
import styles from "./page.module.css";

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

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5003";

async function getBusiness(id: string): Promise<BusinessDetail | null> {
  try {
    const res = await fetch(`${API_BASE}/api/businesses/public`, { cache: "no-store" });
    if (!res.ok) return null;
    const raw = (await res.json().catch(() => [])) as unknown;
    const root = typeof raw === "object" && raw !== null ? (raw as Record<string, unknown>) : {};
    const list = Array.isArray(root.data ?? root.result ?? raw) ? (root.data ?? root.result ?? raw) : [];
    const payload = (list as Record<string, unknown>[]).find((item) => String(item.id ?? item.Id ?? "") === id);
    if (!payload) return null;

    const city = String(payload.city ?? payload.City ?? "");
    const businessType = String(payload.businessType ?? payload.BusinessType ?? payload.type ?? payload.Type ?? "");

    return {
      id: String(payload.id ?? payload.Id ?? id),
      name: String(payload.name ?? payload.Name ?? "Business"),
      description: String(payload.description ?? payload.Description ?? ""),
      category: businessType || "General",
      address: String(payload.address ?? payload.Address),
      location: city,
      phone: String(payload.phone ?? payload.Phone ?? ""),
      email: String(payload.email ?? payload.Email ?? ""),
      logo: String(payload.logo ?? payload.Logo ?? ""),
      rating: Number(payload.rating ?? payload.Rating ?? 0),
      reviewsCount: Number(payload.reviewsCount ?? payload.ReviewsCount ?? 0),
      coordinates:
        typeof payload.coordinates === "object" && payload.coordinates !== null
          ? (payload.coordinates as { lat: number; lng: number })
          : null,
      photos: Array.isArray(payload.photos) ? (payload.photos as string[]) : [],
    };
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
    
        </div>

        <BusinessFeedback businessId={item.id} businessName={item.name} />

        <Link href="/homepage" className={styles.back}>
          &larr; Back to all businesses
        </Link>
      </section>
    </main>
  );
}
