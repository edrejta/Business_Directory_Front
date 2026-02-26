"use client";

import { useEffect, useMemo, useState } from "react";
import { Testimonials } from "./Testimonials";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import heroArchImage from "@/src/assets/image.jpg";
import cityWideImage from "@/src/assets/image (2).jpg";
import coffeeSquareImage from "@/src/assets/image (3).jpg";
import featuredMainImage from "@/src/assets/image (4).jpg";
import listingAltImage from "@/src/assets/image (5).jpg";

type Business = {
  id: string;
  name: string;
  logo?: string;
  description?: string;
  rating?: number;
  category?: string;
  location?: string;
  phone?: string;
  coordinates?: { lat: number; lng: number } | null;
};

type ApiBusiness = {
  id?: string;
  Id?: string;
  name?: string;
  Name?: string;
  description?: string;
  Description?: string;
  businessType?: string;
  BusinessType?: string;
  type?: string;
  Type?: string;
  city?: string;
  City?: string;
  phone?: string;
  Phone?: string;
  logo?: string;
  Logo?: string;
  coordinates?: { lat: number; lng: number } | null;
};

type ApiResult<T> = {
  data: T;
  error: string | null;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5003";
const FALLBACK_IMAGE = heroArchImage.src;
const ALT_IMAGE = listingAltImage.src;
const FEATURED_MAIN_IMAGE = featuredMainImage.src;
const STREET_IMAGE = cityWideImage.src;
const COFFEE_IMAGE = coffeeSquareImage.src;

const SAMPLE_BUSINESSES: Business[] = [
  {
    id: "sample-1",
    name: "Downtown Cafe",
    description: "Cafe me ambience moderne.",
    rating: 4,
    category: "Cafe",
    logo: FALLBACK_IMAGE,
  },
  {
    id: "sample-2",
    name: "Artisan Bistro",
    description: "Bistro me menu sezonale.",
    rating: 5,
    category: "Restaurant",
    logo: ALT_IMAGE,
  },
];

const TRENDING_SEARCHES: Array<{ label: string; keyword: string; categories?: string[] }> = [
  { label: "Restaurant near me", keyword: "restaurant", categories: ["Restaurant"] },
  { label: "Pharmacy", keyword: "pharmacy", categories: ["Service"] },
  { label: "Car Wash", keyword: "car wash", categories: ["Service"] },
];

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
    const response = await fetch(`${API_BASE}${path}`);
    const raw = (await response.json().catch(() => fallback)) as T & {
      message?: string;
      data?: unknown;
      result?: unknown;
    };
    if (!response.ok) {
      return { data: fallback, error: raw?.message ?? "Request failed." };
    }
    const payload = (raw.data ?? raw.result ?? raw) as T;
    return { data: payload, error: null };
  } catch {
    return { data: fallback, error: "Unable to reach backend." };
  }
}

const toText = (value: unknown) => (typeof value === "string" ? value : "");

function normalizeBusiness(item: ApiBusiness): Business {
  return {
    id: toText(item.id ?? item.Id),
    name: toText(item.name ?? item.Name) || "Business",
    description: toText(item.description ?? item.Description) || undefined,
    category: toText(item.businessType ?? item.BusinessType ?? item.type ?? item.Type) || undefined,
    location: toText(item.city ?? item.City) || undefined,
    phone: toText(item.phone ?? item.Phone) || undefined,
    logo: toText(item.logo ?? item.Logo) || undefined,
    coordinates: item.coordinates ?? null,
  };
}

function normalizeCities(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((entry) => {
      if (typeof entry === "string") return entry;
      if (typeof entry === "object" && entry !== null) {
        const row = entry as Record<string, unknown>;
        return toText(row.name ?? row.Name ?? row.city ?? row.City);
      }
      return "";
    })
    .filter((value) => value.length > 0);
}

function buildStars(value: number) {
  const stars = Math.max(0, Math.min(5, Math.round(value)));
  return `${"\u2605".repeat(stars)}${"\u2606".repeat(5 - stars)}`;
}

function estimateReviewCount(id: string) {
  const score = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return 20 + (score % 19);
}

export default function HomepageClient() {
  const router = useRouter();
  const { user, logoutUser, getRedirectPath } = useAuth();

  const [query, setQuery] = useState("");
  const [activeLocation, setActiveLocation] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [results, setResults] = useState<Business[]>([]);
  const [featured, setFeatured] = useState<Business[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [subscribeMessage, setSubscribeMessage] = useState<string | null>(null);
  const [hasSearchAttempt, setHasSearchAttempt] = useState(false);

  const handleAddBusiness = () => {
    const next = "/dashboard-business?mode=create";
    if (!user) {
      router.push(`/login?next=${encodeURIComponent(next)}`);
      return;
    }
    router.push(next);
  };

  const runSearch = async (options?: {
    keyword?: string;
    categories?: string[];
    cities?: string[];
    markAsAttempt?: boolean;
  }) => {
    if (options?.markAsAttempt) {
      setHasSearchAttempt(true);
    }

    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    const keyword = normalizeSearchKeyword(options?.keyword ?? query);
    const categoryValues = options?.categories ?? selectedCategories;
    const cityValues = options?.cities ?? selectedCities;

    if (keyword?.trim()) params.set("search", keyword.trim());
    if (categoryValues.length > 0) params.set("type", categoryValues[0]);
    if (cityValues.length > 0) params.set("city", cityValues[0]);

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
      const [businessesRes, citiesRes] = await Promise.all([
        fetchJson<ApiBusiness[]>("/api/businesses/public", []),
        fetchJson<unknown>("/api/cities", []),
      ]);

      if (!mounted) {
        return;
      }

      const normalizedBusinesses = Array.isArray(businessesRes.data)
        ? businessesRes.data.map(normalizeBusiness).filter((item) => item.id.length > 0)
        : [];
      const normalizedCities = normalizeCities(citiesRes.data);
      const derivedCategories = Array.from(
        new Set(normalizedBusinesses.map((item) => item.category).filter((value): value is string => !!value)),
      );
      const derivedCities = Array.from(
        new Set(normalizedBusinesses.map((item) => item.location).filter((value): value is string => !!value)),
      );

      setResults(normalizedBusinesses);
      setFeatured(normalizedBusinesses.slice(0, 10));
      setCategories(derivedCategories);
      setLocations(normalizedCities.length > 0 ? normalizedCities : derivedCities);
      setError(businessesRes.error || citiesRes.error);
      setLoading(false);
    };

    void load();
    return () => {
      mounted = false;
    };
  }, []);

  const listItems = useMemo(() => {
    if (results.length > 0) {
      return results.slice(0, 2);
    }
    return hasSearchAttempt ? [] : SAMPLE_BUSINESSES;
  }, [results, hasSearchAttempt]);

  const featuredItems = useMemo(() => (featured.length > 0 ? featured.slice(0, 2) : listItems), [featured, listItems]);
  const trustedCount = useMemo(() => (results.length > 0 ? results.length : 2), [results.length]);
  const categoryCount = useMemo(() => (categories.length > 0 ? categories.length : 2), [categories.length]);

  const mapPoints = useMemo(() => {
    const normalizeText = (input: string) =>
      input
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

    const cityFallback: Record<string, { lat: number; lng: number }> = {
      prishtine: { lat: 42.6629, lng: 21.1655 },
      prishtina: { lat: 42.6629, lng: 21.1655 },
      prizren: { lat: 42.2139, lng: 20.7397 },
      peje: { lat: 42.6598, lng: 20.2883 },
      gjakove: { lat: 42.3803, lng: 20.4308 },
      gjilan: { lat: 42.4635, lng: 21.4694 },
      ferizaj: { lat: 42.3702, lng: 21.1558 },
      mitrovice: { lat: 42.8914, lng: 20.866 },
    };

    return results
      .map((item) => {
        if (item.coordinates?.lat && item.coordinates?.lng) {
          return { ...item, lat: item.coordinates.lat, lng: item.coordinates.lng };
        }
        const key = normalizeText(item.location || "");
        const fallback = cityFallback[key];
        if (fallback) {
          return { ...item, lat: fallback.lat, lng: fallback.lng };
        }
        return null;
      })
      .filter((item): item is Business & { lat: number; lng: number } => item !== null)
      .slice(0, 25);
  }, [results]);

  const applyPrishtineFilter = () => {
    setActiveLocation("Prishtine");
    setSelectedCities(["Prishtine"]);
    setSelectedCategories([]);
    setQuery("");
    void runSearch({ keyword: "", categories: [], cities: ["Prishtine"] });
    document.getElementById("business-listings")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const roleHref = user ? getRedirectPath(user.role) : "/login";

  return (
    <div className="kb-page">
      <header className="kb-topbar">
        <Link className="kb-brand" href="/">
          <span>K</span>
          <strong>KosBiz</strong>
        </Link>

        <nav className="kb-nav">
          <Link href="/about">About</Link>
          <Link href="/how-to-use">How To Use</Link>
          {user ? (
            <>
              <Link className="kb-btn kb-btn-outline" href={roleHref}>
                Dashboard
              </Link>
              <button className="kb-btn kb-btn-solid" onClick={logoutUser} type="button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="kb-btn kb-btn-outline" href="/login">
                Login
              </Link>
              <Link className="kb-btn kb-btn-solid" href="/register">
                Signup
              </Link>
            </>
          )}
        </nav>
      </header>

      <section className="kb-hero">
        <div className="kb-hero-left">
          <p className="kb-kicker">KOSOVO BUSINESS DIRECTORY</p>
          <h1>
            Find trusted
            <br />
            local businesses
            <br />
            <em>fast.</em>
          </h1>
          <p className="kb-hero-copy">
            Search by keyword, location, and category to discover businesses near you. We&apos;re here to help you
            find exactly what you have in mind.
          </p>

          <form
            className="kb-search"
            onSubmit={(event) => {
              event.preventDefault();
              const normalizedQuery = normalizeSearchKeyword(query);
              setQuery(normalizedQuery);
              void runSearch({ keyword: normalizedQuery, markAsAttempt: true });
            }}
          >
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search for business, product, or service"
            />
            <button type="submit" aria-label="Search">
              &#128269;
            </button>
          </form>

          <div className="kb-trending">
            <span>TRENDING:</span>
            {TRENDING_SEARCHES.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  setQuery(item.keyword);
                  void runSearch({ keyword: item.keyword, categories: item.categories, markAsAttempt: true });
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="kb-hero-right">
          <div className="kb-hero-arch">
            <img src={FALLBACK_IMAGE} alt="Hero" />
          </div>
          <article className="kb-trusted-card">
            <p>TRUSTED BY</p>
            <h3>{trustedCount}+</h3>
            <span>businesses in Kosovo</span>
          </article>
          <img className="kb-floating-shot" src={COFFEE_IMAGE} alt="Espresso shot" />
        </div>
      </section>

      <section className="kb-filters">
        <div className="kb-filter-group">
          <p>Category</p>
          <div className="kb-filter-pills">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                className={selectedCategories.includes(item) ? "active" : ""}
                onClick={() =>
                  setSelectedCategories((prev) =>
                    prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item],
                  )
                }
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="kb-filter-group">
          <p>City</p>
          <div className="kb-filter-pills">
            {locations.map((item) => (
              <button
                key={item}
                type="button"
                className={selectedCities.includes(item) ? "active" : ""}
                onClick={() => {
                  setSelectedCities((prev) => (prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]));
                  setActiveLocation(item);
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="kb-filter-actions">
          <button type="button" onClick={() => void runSearch({ keyword: query, markAsAttempt: true })}>
            Apply Filters
          </button>
          <button
            type="button"
            className="ghost"
            onClick={() => {
              setSelectedCategories([]);
              setSelectedCities([]);
              setActiveLocation(null);
              void runSearch({ keyword: query, categories: [], cities: [], markAsAttempt: true });
            }}
          >
            Clear
          </button>
        </div>
      </section>

      <section className="kb-listings" id="business-listings">
        <div className="kb-listings-head">
          <div>
            <p className="kb-kicker">OUR LISTINGS</p>
            <h2>Business Listings</h2>
            {activeLocation ? <p className="kb-active-filter">Filtered by location: {activeLocation}</p> : null}
          </div>
          <button
            type="button"
            className="kb-map-view"
            onClick={() => setViewMode((prev) => (prev === "list" ? "map" : "list"))}
          >
            &#9679; {viewMode === "list" ? "MAP VIEW" : "LIST VIEW"}
          </button>
        </div>

        {viewMode === "list" ? (
          <div className="kb-listings-grid">
            {listItems.length === 0 ? (
              <p className="kb-status">No businesses found.</p>
            ) : (
              listItems.map((item, index) => (
                <article key={item.id} className="kb-listing-card">
                  <div className="kb-listing-image">
                    <img src={item.logo || (index === 0 ? FALLBACK_IMAGE : ALT_IMAGE)} alt={item.name} />
                    <span>{item.category || (index === 0 ? "Cafe" : "Restaurant")}</span>
                  </div>
                  <div className="kb-listing-body">
                    <h3>{item.name}</h3>
                    <p>{item.description || "Cafe me ambience moderne."}</p>
                    <div className="kb-rating">
                      <strong>{buildStars(item.rating || 4)}</strong>
                      <small>({estimateReviewCount(item.id)})</small>
                    </div>
                    <div className="kb-listing-actions">
                      <a href={`/business/${item.id}`}>VIEW DETAILS</a>
                      <div className="kb-listing-icons">
                        <a
                          className="kb-listing-icon"
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            item.location || item.name,
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Open ${item.name} location`}
                          title="Open location"
                        >
                          <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                            <path d="M12 2a7 7 0 0 0-7 7c0 4.8 5.3 10.6 6.2 11.6a1 1 0 0 0 1.6 0C13.7 19.6 19 13.8 19 9a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z" />
                          </svg>
                        </a>
                        <a
                          className="kb-listing-icon"
                          href={`/business/${item.id}`}
                          aria-label={`Open ${item.name} profile`}
                          title="Open business profile"
                        >
                          <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm6.9 9h-2.1a15 15 0 0 0-1.2-5A8 8 0 0 1 18.9 11ZM12 4.1c.8 1 1.8 3.2 2.4 6H9.6c.6-2.8 1.6-5 2.4-6ZM6.4 6a15 15 0 0 0-1.3 5H3.1A8 8 0 0 1 6.4 6ZM3.1 13h2c.1 1.8.6 3.5 1.3 5A8 8 0 0 1 3.1 13Zm6.5 0h4.8c-.6 2.8-1.6 5-2.4 6-.8-1-1.8-3.2-2.4-6Zm6 5c.7-1.5 1.2-3.2 1.3-5h2A8 8 0 0 1 15.6 18Z" />
                          </svg>
                        </a>
                        <a
                          className="kb-listing-icon kb-listing-icon-clock"
                          href={`/opendays?businessId=${item.id}`}
                          aria-label={`Check ${item.name} opening days`}
                          title="Opening days"
                        >
                          <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                            <path d="M12 4a1 1 0 0 1 1 1v6.4l3.3 2a1 1 0 1 1-1 1.7l-3.8-2.3A1 1 0 0 1 11 12V5a1 1 0 0 1 1-1Zm0-2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        ) : (
          <div className="kb-map-panel">
            <iframe
              title="Kosovo business map"
              className="kb-map-frame"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.openstreetmap.org/export/embed.html?bbox=20.00%2C41.85%2C21.85%2C43.30&layer=mapnik"
            />
            <div className="kb-map-pins" aria-hidden="true">
              {mapPoints.map((item) => {
                const x = ((item.lng - 20.0) / (21.85 - 20.0)) * 92 + 4;
                const y = ((43.3 - item.lat) / (43.3 - 41.85)) * 84 + 8;
                return (
                  <a
                    key={`pin-${item.id}`}
                    className="kb-map-pin"
                    href={`/business/${item.id}`}
                    style={{ left: `${x}%`, top: `${y}%` }}
                    title={item.name}
                  >
                    <span />
                  </a>
                );
              })}
            </div>
          </div>
        )}

        <div className="kb-pagination">
          <button type="button">Prev</button>
          <span>Page 1 of 1</span>
          <button type="button">Next</button>
        </div>
      </section>

      <section className="kb-owner-banner">
        <div className="kb-owner-banner-inner">
          <p className="kb-owner-kicker">FOR BUSINESS OWNERS</p>
          <h2>A jeni pronar biznesi? Shtoni biznesin tuaj.</h2>
          <button type="button" className="kb-owner-banner-btn" onClick={handleAddBusiness}>
            ADD YOUR BUSINESS
          </button>
        </div>
      </section>

      <section className="kb-featured">
        <div className="kb-featured-head">
          <p className="kb-kicker kb-kicker-light">HANDPICKED FOR YOU</p>
          <h2>Featured Businesses</h2>
        </div>

        <div className="kb-featured-layout">
          <article className="kb-featured-main">
            <img src={FEATURED_MAIN_IMAGE} alt="Artisan Bistro" />
            <h3>{featuredItems[1]?.name || "Artisan Bistro"}</h3>
            <p>{featuredItems[1]?.description || "Bistro me menu sezonale."}</p>
          </article>

          <div className="kb-featured-side">
            <article className="kb-number-card">
              <span>01</span>
              <div>
                <h3>{featuredItems[0]?.name || "Downtown Cafe"}</h3>
                <p>
                  {featuredItems[0]?.description ||
                    "Cafe me ambience moderne. Eksperience e kafese artizanale ne zemer te Prishtines."}
                </p>
                <a href={featuredItems[0] ? `/business/${featuredItems[0].id}` : "#"}>READ MORE</a>
              </div>
            </article>

            <div className="kb-split-row">
              <article className="kb-number-card compact">
                <span>02</span>
                <div>
                  <h3>{featuredItems[1]?.name || "Artisan Bistro"}</h3>
                  <p>{featuredItems[1]?.description || "Bistro me menu sezonale."}</p>
                </div>
              </article>
              <article className="kb-city-card">
                <img src={STREET_IMAGE} alt="Prishtine" />
                <button type="button" onClick={applyPrishtineFilter}>
                  EXPLORE PRISHTINE
                </button>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="kb-deals">
        <div className="kb-deals-head">
          <span>COMING SOON</span>
          <h2>
            Deals &amp;
            <br />
            Promotions
          </h2>
          <p>New deals coming soon - stay tuned! Be the first to know about exclusive offers from local businesses.</p>
        </div>

        <div className="kb-deals-grid">
          <Link className="kb-deal-card" href="/deals">
            <small>01</small>
            <i>{"\u{1F3F7}"}</i>
            <h3>Discounts</h3>
            <p>Up to 50% off</p>
          </Link>
          <Link className="kb-deal-card active" href="/deals">
            <small>02</small>
            <i>{"\u2737"}</i>
            <h3>Flash Sales</h3>
            <p>Limited time</p>
          </Link>
          <Link className="kb-deal-card" href="/deals">
            <small>03</small>
            <i>{"\u25F4"}</i>
            <h3>Early Access</h3>
            <p>Try now</p>
          </Link>
        </div>
      </section>

      <section className="kb-dont-miss">
        <div className="kb-deals-notify">
          <h3>Don&apos;t miss out</h3>
          <p>Be the first to discover new deals and promotions from local businesses.</p>
          <a className="kb-claim-btn" href="/register">
            REGJISTROHU
          </a>
        </div>
      </section>

      <Testimonials />

      <section className="kb-newsletter">
        <div className="kb-newsletter-box">
          <h2>Stay in the loop</h2>
          <p>Subscribe to our newsletter and be the first to discover new businesses, exclusive deals, and events.</p>
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              if (!email.trim()) {
                setSubscribeMessage("Please enter an email.");
                return;
              }

              try {
                const response = await fetch(`${API_BASE}/subscribe`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email: email.trim() }),
                });

                if (!response.ok) {
                  setSubscribeMessage("Subscription failed.");
                  return;
                }

                setSubscribeMessage("Subscribed successfully.");
                setEmail("");
              } catch {
                setSubscribeMessage("Backend not reachable.");
              }
            }}
          >
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              placeholder="Enter your email"
            />
            <button type="submit">SUBSCRIBE &#8594;</button>
          </form>
          {subscribeMessage ? <p className="kb-newsletter-message">{subscribeMessage}</p> : null}
        </div>
      </section>

      <footer className="kb-footer">
        <div>
          <h3>Contact</h3>
          <p>support@kosbiz.com</p>
          <p>+233 200 000 000</p>
          <p>About | Terms | Privacy</p>
        </div>

        <div>
          <h3>Live Counters</h3>
          <p>{trustedCount} businesses listed</p>
          <p>{categoryCount} categories</p>
          <p>12 users online</p>
        </div>

        <div>
          <h3>KosBiz</h3>
          <p>Your trusted Kosovo business directory. Discover local businesses fast.</p>
        </div>
      </footer>

      {loading && <p className="kb-status">Loading...</p>}
      {error && !loading && <p className="kb-status">{error}</p>}
    </div>
  );
}