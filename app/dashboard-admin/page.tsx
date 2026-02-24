"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import {
  getAdminCategories,
  getAdminDashboard,
  getAdminUsers,
  getHealthStatus,
  getReportSummary,
  type AdminUser,
  type Category,
  type DashboardPayload,
  type HealthStatus,
  type ReportSummary,
} from "@/lib/api/admin";

export default function DashboardAdmin() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [dashboard, setDashboard] = useState<DashboardPayload | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [reports, setReports] = useState<ReportSummary | null>(null);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== 2) {
      if (user.role === 0) router.replace("/dashboard-user");
      else if (user.role === 1) router.replace("/dashboard-business");
    }
  }, [isLoading, router, user]);

  useEffect(() => {
    if (isLoading || !user || user.role !== 2) return;

    let mounted = true;
    const load = async () => {
      setLoadingData(true);
      setError(null);
      try {
        const [dashboardData, usersData, categoriesData, reportsData, healthData] = await Promise.all([
          getAdminDashboard(),
          getAdminUsers(),
          getAdminCategories(),
          getReportSummary(),
          getHealthStatus(),
        ]);

        if (!mounted) return;

        if (dashboardData.metrics.totalUsers === 0 && Array.isArray(usersData)) {
          dashboardData.metrics.totalUsers = usersData.length;
        }

        setDashboard(dashboardData);
        setUsers(Array.isArray(usersData) ? usersData : []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setReports(reportsData);
        setHealth(healthData);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Ndodhi një gabim.");
      } finally {
        if (mounted) setLoadingData(false);
      }
    };

    void load();
    return () => {
      mounted = false;
    };
  }, [isLoading, user]);

  const chartRows = useMemo(() => {
    if (!dashboard) return [];
    if (dashboard.recentActivity.length > 0) return dashboard.recentActivity;
    return [
      { label: "Pending", value: dashboard.metrics.pendingBusinesses },
      { label: "Approved", value: dashboard.metrics.approvedBusinesses },
      { label: "Users", value: dashboard.metrics.totalUsers },
    ];
  }, [dashboard]);

  const maxChart = Math.max(...chartRows.map((item) => item.value), 1);

  if (isLoading || !user) return null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen px-4 py-8 md:px-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="rounded-2xl border border-oak/35 bg-paper/90 p-6 shadow-panel">
            <h1 className="text-2xl font-bold text-espresso md:text-3xl">
              Mirë se erdhe, {user.username ?? "admin"}.
            </h1>
            <p className="mt-2 text-espresso/80">Panel administrimi për monitorim dhe menaxhim të sistemit.</p>
          </div>

          {loadingData && (
            <div className="rounded-xl border border-oak/30 bg-white/80 p-4 text-sm text-espresso/80">
              Duke ngarkuar të dhënat...
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700">{error}</div>
          )}

          {!loadingData && !error && dashboard && (
            <>
              <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard title="Total Businesses" value={dashboard.metrics.totalBusinesses} />
                <StatCard title="Pending Businesses" value={dashboard.metrics.pendingBusinesses} />
                <StatCard title="Approved Businesses" value={dashboard.metrics.approvedBusinesses} />
                <StatCard title="Total Users" value={dashboard.metrics.totalUsers} />
              </section>

              <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                <article className="rounded-2xl border border-oak/30 bg-white/90 p-5 xl:col-span-2">
                  <h2 className="text-lg font-semibold text-espresso">Activity Snapshot</h2>
                  <div className="mt-4 space-y-3">
                    {chartRows.map((item) => (
                      <div key={item.label}>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="text-espresso/75">{item.label}</span>
                          <span className="font-semibold text-espresso">{item.value}</span>
                        </div>
                        <div className="h-2.5 w-full rounded-full bg-mist">
                          <div
                            className="h-2.5 rounded-full bg-oak"
                            style={{ width: `${Math.round((item.value / maxChart) * 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="rounded-2xl border border-oak/30 bg-white/90 p-5">
                  <h2 className="text-lg font-semibold text-espresso">System</h2>
                  <dl className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between gap-3">
                      <dt className="text-espresso/70">Health</dt>
                      <dd className="font-semibold text-espresso">{health?.status ?? "unknown"}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-espresso/70">Timestamp</dt>
                      <dd className="font-medium text-espresso">{health?.timestamp ?? "n/a"}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-espresso/70">Version</dt>
                      <dd className="font-medium text-espresso">{health?.version ?? "n/a"}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-espresso/70">Reports Open</dt>
                      <dd className="font-medium text-espresso">{reports?.openReports ?? 0}</dd>
                    </div>
                  </dl>
                </article>
              </section>

              <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <TableCard title="Users" columns={["Username", "Email", "Role"]}>
                  {users.slice(0, 8).map((u) => (
                    <tr key={u.id} className="border-b border-oak/15 last:border-none">
                      <td className="px-3 py-2 text-espresso">{u.username ?? u.fullName ?? "-"}</td>
                      <td className="px-3 py-2 text-espresso/80">{u.email}</td>
                      <td className="px-3 py-2 text-espresso/80">{String(u.role)}</td>
                    </tr>
                  ))}
                </TableCard>

                <TableCard title="Categories" columns={["Category", "Businesses"]}>
                  {categories.slice(0, 8).map((c) => (
                    <tr key={c.id} className="border-b border-oak/15 last:border-none">
                      <td className="px-3 py-2 text-espresso">{c.name}</td>
                      <td className="px-3 py-2 text-espresso/80">{c.businessesCount ?? "-"}</td>
                    </tr>
                  ))}
                </TableCard>
              </section>
            </>
          )}
        </div>
      </main>
    </>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <article className="rounded-2xl border border-oak/30 bg-white/90 p-4">
      <p className="text-sm text-espresso/70">{title}</p>
      <p className="mt-2 text-3xl font-semibold text-espresso">{value}</p>
    </article>
  );
}

function TableCard({
  title,
  columns,
  children,
}: {
  title: string;
  columns: string[];
  children: ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-oak/30 bg-white/90 p-5">
      <h2 className="text-lg font-semibold text-espresso">{title}</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-oak/25">
              {columns.map((column) => (
                <th key={column} className="px-3 py-2 text-left font-semibold text-espresso/75">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </article>
  );
}
