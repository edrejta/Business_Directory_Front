import styles from "./page.module.css";

type OpenDays = {
  businessId: string;
  mondayOpen: boolean;
  tuesdayOpen: boolean;
  wednesdayOpen: boolean;
  thursdayOpen: boolean;
  fridayOpen: boolean;
  saturdayOpen: boolean;
  sundayOpen: boolean;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";

async function getOpenDays(businessId?: string): Promise<OpenDays | null> {
  if (!businessId) return null;
  try {
    const response = await fetch(`${API_BASE}/api/opendays?businessId=${encodeURIComponent(businessId)}`, {
      cache: "no-store",
    });
    if (!response.ok) return null;
    return (await response.json()) as OpenDays;
  } catch {
    return null;
  }
}

export default async function OpenDaysPage({
  searchParams,
}: {
  searchParams: Promise<{ businessId?: string }>;
}) {
  const params = await searchParams;
  const data = await getOpenDays(params.businessId);

  const rows: Array<[string, boolean]> = data
    ? [
        ["Monday", data.mondayOpen],
        ["Tuesday", data.tuesdayOpen],
        ["Wednesday", data.wednesdayOpen],
        ["Thursday", data.thursdayOpen],
        ["Friday", data.fridayOpen],
        ["Saturday", data.saturdayOpen],
        ["Sunday", data.sundayOpen],
      ]
    : [];

  return (
    <main className={styles.page}>
      <section className={styles.wrap}>
        <h1>Open Days</h1>
        {!data ? (
          <p className={styles.empty}>Open days not found for this business.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Day</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([day, isOpen]) => (
                <tr key={day}>
                  <td>{day}</td>
                  <td className={isOpen ? styles.open : styles.closed}>{isOpen ? "Open" : "Closed"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
