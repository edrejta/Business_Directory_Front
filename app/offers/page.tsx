import styles from "./page.module.css";
import Link from "next/link";
import coffeeSquareImage from "@/src/assets/image (3).jpg";
import featuredMainImage from "@/src/assets/image (4).jpg";
import listingAltImage from "@/src/assets/image (5).jpg";
import FavoriteButton from "@/components/FavoriteButton";

type Category = "Discounts" | "FlashSales" | "EarlyAccess";

type Promotion = {
  id: string;
  businessId?: string;
  businessName?: string;
  businessImage?: string;
  title: string;
  description: string;
  category?: Category;
  discountPercent?: number;
  expiresAt?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5003";
const validCategories: Category[] = ["Discounts", "FlashSales", "EarlyAccess"];

async function getOffers(category?: string): Promise<Promotion[]> {
  try {
    const params = new URLSearchParams();
    if (category && validCategories.includes(category as Category)) {
      params.set("category", category);
    }
    const query = params.toString();
    const response = await fetch(`${API_BASE}/promotions${query ? `?${query}` : ""}`, { cache: "no-store" });
    if (!response.ok) {
      return [];
    }
    const data = (await response.json()) as Promotion[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function getTimeLeft(expiresAt?: string) {
  if (!expiresAt) return "No time limit";
  const ms = new Date(expiresAt).getTime() - Date.now();
  if (ms <= 0) return "Expired";
  const hours = Math.floor(ms / (1000 * 60 * 60));
  if (hours < 24) return `${hours}h left`;
  const days = Math.floor(hours / 24);
  return `${days}d left`;
}

function getImage(category?: Category) {
  if (category === "FlashSales") return featuredMainImage.src;
  if (category === "EarlyAccess") return listingAltImage.src;
  return coffeeSquareImage.src;
}

function getCategoryLabel(category?: string) {
  if (category === "FlashSales") return "Flash Sales";
  if (category === "EarlyAccess") return "Early Access";
  if (category === "Discounts") return "Discounts";
  return "All Offers";
}

export default async function OffersPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const selectedCategory = validCategories.includes((params.category || "") as Category)
    ? (params.category as Category)
    : undefined;
  const offers = await getOffers(selectedCategory);

  return (
    <main className={styles.page}>
      <section className={styles.wrap}>
        <div className={`${styles.head} ${styles.fadeIn}`}>
          <p>DEALS &amp; PROMOTIONS</p>
          <h1>{getCategoryLabel(selectedCategory)}</h1>
        </div>

        <div className={styles.tabs}>
          <Link href="/offers?category=Discounts" className={selectedCategory === "Discounts" ? styles.activeTab : ""}>
            Discounts
          </Link>
          <Link href="/offers?category=FlashSales" className={selectedCategory === "FlashSales" ? styles.activeTab : ""}>
            Flash Sales
          </Link>
          <Link href="/offers?category=EarlyAccess" className={selectedCategory === "EarlyAccess" ? styles.activeTab : ""}>
            Early Access
          </Link>
        </div>

        {offers.length > 0 ? (
          <div className={`${styles.grid} ${styles.fadeInUp}`}>
            {offers.map((offer) => (
              <article key={offer.id} className={styles.card}>
                <div className={styles.media}>
                  <img src={offer.businessImage || getImage(offer.category)} alt={offer.businessName || offer.title} />
                </div>
                <div className={styles.body}>
                  <div className={styles.row}>
                    <h2>{offer.businessName || offer.title}</h2>
                    <span>-{offer.discountPercent ?? 0}%</span>
                  </div>
                  <p>{offer.description}</p>
                </div>
                <div className={styles.footer}>
                  <small>&#9200; {getTimeLeft(offer.expiresAt)}</small>
                  <div className={styles.actions}>
                    <a href="/login">Claim</a>
                    {offer.businessId ? (
                      <FavoriteButton
                        businessId={offer.businessId}
                        name={offer.businessName || offer.title}
                        source="offer"
                        href={`/business/${offer.businessId}`}
                        compact
                        className={styles.favoriteButton}
                      />
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className={styles.empty}>No offers in this category yet.</div>
        )}
      </section>
    </main>
  );
}
