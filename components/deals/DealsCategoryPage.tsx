import styles from "@/app/deals-page.module.css";

type Deal = {
  id: string;
  title: string;
  description: string;
  category?: string;
  originalPrice?: number;
  discountedPrice?: number;
  discountPercent?: number;
  expiresAt?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";

async function getDeals(category: string): Promise<Deal[]> {
  try {
    const res = await fetch(`${API_BASE}/api/promotions?category=${encodeURIComponent(category)}`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = (await res.json()) as Deal[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function DealsCategoryPage({ title, category }: { title: string; category: string }) {
  const deals = await getDeals(category);

  return (
    <main className={styles.page}>
      <section className={styles.wrap}>
        <h1 className={styles.title}>{title}</h1>

        {deals.length > 0 ? (
          <div className={styles.grid}>
            {deals.map((item) => (
              <article key={item.id} className={styles.card}>
                <div className={styles.top}>
                  <span className={styles.pill}>
                    <svg className={styles.pillIcon} viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M20 10.59V7a2 2 0 0 0-2-2h-3.59a2 2 0 0 0-1.41.59L5.59 13a2 2 0 0 0 0 2.82l2.59 2.59a2 2 0 0 0 2.82 0L18.41 11a2 2 0 0 0 .59-1.41ZM8.5 9A1.5 1.5 0 1 1 10 7.5 1.5 1.5 0 0 1 8.5 9Z" />
                    </svg>
                    {title}
                  </span>
                  {item.discountPercent ? <span className={styles.off}>% {item.discountPercent} OFF</span> : null}
                </div>
                <h2 className={styles.name}>{item.title}</h2>
                <p className={styles.desc}>{item.description}</p>
                {(item.discountedPrice ?? item.originalPrice) ? (
                  <p className={styles.price}>
                    ${Number(item.discountedPrice ?? item.originalPrice).toFixed(2)}
                    {item.originalPrice && item.discountedPrice ? (
                      <span className={styles.priceOld}>${Number(item.originalPrice).toFixed(2)}</span>
                    ) : null}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            No deals in this category yet.
          </div>
        )}
      </section>
    </main>
  );
}
