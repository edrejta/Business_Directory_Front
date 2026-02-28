import styles from "./page.module.css";
import {
  fetchOpenDaysForBusiness,
  resolveRequestedBusinessId,
} from "@/lib/api/openDays";

export default async function OpenDaysPage({
  searchParams,
}: {
  searchParams: Promise<{ businessId?: string; id?: string }>;
}) {
  const params = await searchParams;
  const requestedBusinessId = resolveRequestedBusinessId(params);
  const { data, errorMessage } = await fetchOpenDaysForBusiness(requestedBusinessId);

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
          <p className={styles.empty}>{errorMessage ?? "Open days not found for this business."}</p>
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
