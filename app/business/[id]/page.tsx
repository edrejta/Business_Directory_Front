import Link from "next/link";
import styles from "./page.module.css";
import { getApprovedBusinessById } from "@/lib/api/public";

type BusinessDetail = {
  id: string;
  name: string;
  description: string;
  category: string;
  address: string;
  location: string;
  phone: string;
  email: string;
  openDays: string;
  logo: string;
  rating: number;
  reviewsCount: number;
  coordinates?: { lat: number; lng: number } | null;
  photos?: string[];
};

function toStringSafe(v: unknown): string {
  if (v === null || v === undefined) return "";
  return String(v);
}

function stars(rating: number): string {
  const full = Math.max(0, Math.min(5, Math.round(rating)));
  return "*".repeat(full) + ".".repeat(5 - full);
}

const DAY_ORDER = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

const DAY_AL: Record<(typeof DAY_ORDER)[number], string> = {
  Mon: "E Hënë",
  Tue: "E Martë",
  Wed: "E Mërkurë",
  Thu: "E Enjte",
  Fri: "E Premte",
  Sat: "E Shtunë",
  Sun: "E Diel",
};

function normalizeDayToken(token: string): (typeof DAY_ORDER)[number] | null {
  const t = token.trim().toLowerCase();
  if (!t) return null;

  if (t.startsWith("mon")) return "Mon";
  if (t.startsWith("tue")) return "Tue";
  if (t.startsWith("wed")) return "Wed";
  if (t.startsWith("thu")) return "Thu";
  if (t.startsWith("fri")) return "Fri";
  if (t.startsWith("sat")) return "Sat";
  if (t.startsWith("sun")) return "Sun";
  return null;
}

function expandRange(start: (typeof DAY_ORDER)[number], end: (typeof DAY_ORDER)[number]) {
  const s = DAY_ORDER.indexOf(start);
  const e = DAY_ORDER.indexOf(end);
  if (s === -1 || e === -1) return [];
  if (s <= e) return DAY_ORDER.slice(s, e + 1);
  return [...DAY_ORDER.slice(s), ...DAY_ORDER.slice(0, e + 1)];
}

function parseOpenDaysToAlbanianLines(input: string): string[] {
  const raw = (input ?? "").trim();
  if (!raw) return [];

  const normalized = raw.replace("–", "-");

  if (normalized.includes("-")) {
    const [a, b] = normalized.split("-").map((x) => x.trim());
    const start = normalizeDayToken(a);
    const end = normalizeDayToken(b);
    if (start && end) {
      return expandRange(start, end).map((d) => DAY_AL[d]);
    }
  }

  const tokens = normalized
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);

  const set = new Set<(typeof DAY_ORDER)[number]>();
  for (const tok of tokens) {
    const d = normalizeDayToken(tok);
    if (d) set.add(d);
  }

  return DAY_ORDER.filter((d) => set.has(d)).map((d) => DAY_AL[d]);
}

export default async function BusinessDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let business: Awaited<ReturnType<typeof getApprovedBusinessById>>;

  try {
    business = await getApprovedBusinessById(id);
  } catch (e) {
    return (
      <main className={styles.page}>
        <section className={styles.error}>
          <h1>Biznesi nuk u gjet.</h1>
          <Link href="/homepage">Kthehu te homepage</Link>
        </section>
      </main>
    );
  }
  const addressValue = (business.address ?? "").trim();
  const cityValue = (business.city ?? "").trim();

  const item: BusinessDetail = {
    id: business.id,
    name: business.name,
    description: business.description ?? "",
    category: business.type ?? "General",
    address: addressValue,
    location: cityValue,
    phone: business.phoneNumber ?? "",
    email: business.email ?? "",
    openDays: business.openDays ?? "",
    logo: business.imageUrl ?? "",
    rating: 0,
    reviewsCount: 0,
    coordinates: null,
    photos: [],
  };

  const mapsQuery = item.coordinates
    ? `${item.coordinates.lat},${item.coordinates.lng}`
    : [item.address, item.location].filter((x) => (x ?? "").trim().length > 0).join(", ");

  const mapsHref = `https://maps.google.com/?q=${encodeURIComponent(mapsQuery)}`;

  const makeAbsolute = (src: string) => {
    const s = (src ?? "").trim();
    if (!s) return "";
    if (s.startsWith("http://") || s.startsWith("https://")) return s;
    if (s.startsWith("//")) return `https:${s}`;

    const base =
      process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
      process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
      "";

    if (s.startsWith("/") && base) return `${base}${s}`;
    return s;
  };

  const photos = [
    ...(Array.isArray(item.photos) ? item.photos : []),
    ...(item.logo?.trim() ? [item.logo.trim()] : []),
  ]
    .map(makeAbsolute)
    .filter((p, idx, arr) => p.length > 0 && arr.indexOf(p) === idx);

  const mainPhoto = photos[0] ?? "";
  const openDaysLines = parseOpenDaysToAlbanianLines(item.openDays);
  const showCategoryChip = item.category && item.category !== "Unknown";

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div style={{ display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 420px", minWidth: 280 }}>
            <p className={styles.crumb}>
              <Link href="/homepage">Home</Link> &nbsp;&gt;&nbsp; <span>{item.name}</span>
            </p>

            {showCategoryChip ? <span className={styles.chip}>{item.category}</span> : null}

            <h1 className={styles.title}>{item.name}</h1>
            <h2 className={styles.sectionTitle}>Description</h2>
            <p className={styles.desc}>{item.description || "Nuk ka pershkrim per momentin."}</p>
            <p className={styles.rating}>
              {stars(item.rating)} ({item.reviewsCount} reviews)
            </p>
          </div>

          {mainPhoto ? (
            <div
              style={{
                flex: "0 0 360px",
                width: 360,
                maxWidth: "100%",
                marginTop: 36,
              }}
            >
              <img
                src={mainPhoto}
                alt={`${item.name} photo`}
                style={{
                  width: "100%",
                  height: 210,
                  objectFit: "cover",
                  borderRadius: 16,
                  border: "1px solid rgba(0,0,0,0.08)",
                  background: "rgba(0,0,0,0.02)",
                }}
              />
            </div>
          ) : null}

          <div style={{ flex: "0 0 320px", minWidth: 260 }}>
            <h2 className={styles.sectionTitle}>Ditët e punës</h2>
            {openDaysLines.length > 0 ? (
              <div style={{ marginTop: 8, lineHeight: 1.9 }}>
                {openDaysLines.map((d) => (
                  <div key={d} style={{ fontWeight: 600 }}>
                    {d}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ marginTop: 8, opacity: 0.7 }}>Nuk është specifikuar.</div>
            )}
          </div>
        </div>

        <div className={styles.grid} style={{ marginTop: 26 }}>
          <div className={styles.box}>
            <span className={styles.boxLabel}>Address</span>
            <strong>{toStringSafe(item.address) || "—"}</strong>
          </div>
          <div className={styles.box}>
            <span className={styles.boxLabel}>Location</span>
            <strong>{toStringSafe(item.location) || "—"}</strong>
          </div>
          <div className={styles.box}>
            <span className={styles.boxLabel}>Phone</span>
            <strong>{toStringSafe(item.phone) || "—"}</strong>
          </div>
          <div className={styles.box}>
            <span className={styles.boxLabel}>Email</span>
            <strong>{toStringSafe(item.email) || "—"}</strong>
          </div>
        </div>

        <div className={styles.actions}>
          <a className={styles.btn} href={mapsHref} target="_blank" rel="noreferrer">
            Get Directions
          </a>
        </div>

        <Link href="/homepage" className={styles.back}>
          &larr; Back to all businesses
        </Link>
      </section>
    </main>
  );
}