import type { AdminBusiness, AdminUser, AuditLog, DashboardPayload } from "@/lib/api/admin";

export function filterUsers(users: AdminUser[], userRoleFilter: string, userSearch: string): AdminUser[] {
  const query = userSearch.trim().toLowerCase();

  return users.filter((entry) => {
    const matchesRole = userRoleFilter === "all" || String(entry.role) === userRoleFilter;
    const matchesQuery =
      query.length === 0 ||
      (entry.username ?? "").toLowerCase().includes(query) ||
      (entry.fullName ?? "").toLowerCase().includes(query) ||
      entry.email.toLowerCase().includes(query);

    return matchesRole && matchesQuery;
  });
}

export function deriveCities(businesses: AdminBusiness[]): string[] {
  return Array.from(new Set(businesses.map((entry) => entry.city).filter((entry): entry is string => !!entry)));
}

export function filterBusinesses(
  businesses: AdminBusiness[],
  cityFilter: string,
  searchValue: string,
): AdminBusiness[] {
  const query = searchValue.trim().toLowerCase();

  return businesses.filter((entry) => {
    const matchesCity = cityFilter === "all" || entry.city === cityFilter;
    const matchesQuery =
      query.length === 0 ||
      entry.name.toLowerCase().includes(query) ||
      (entry.businessType ?? "").toLowerCase().includes(query) ||
      (entry.city ?? "").toLowerCase().includes(query);

    return matchesCity && matchesQuery;
  });
}

export function deriveAuditActionOptions(auditLogs: AuditLog[]): string[] {
  return Array.from(new Set(auditLogs.map((entry) => entry.action).filter((entry): entry is string => !!entry)));
}

export function filterAuditLogs(
  auditLogs: AuditLog[],
  auditActionFilter: string,
  auditSearch: string,
  userEmailById: Map<string, string>,
): AuditLog[] {
  const query = auditSearch.trim().toLowerCase();

  return auditLogs.filter((entry) => {
    const targetEmail = (entry.targetUserId ? userEmailById.get(entry.targetUserId) ?? "-" : "-").toLowerCase();
    const actionText = (entry.action ?? "").toLowerCase();
    const reasonText = (entry.reason ?? "").toLowerCase();
    const logId = (entry.id ?? "").toLowerCase();
    const matchesAction = auditActionFilter === "all" || entry.action === auditActionFilter;
    const matchesQuery =
      query.length === 0 ||
      actionText.includes(query) ||
      reasonText.includes(query) ||
      logId.includes(query) ||
      targetEmail.includes(query);

    return matchesAction && matchesQuery;
  });
}

export function buildKpiMetrics(
  dashboard: DashboardPayload | null,
  pendingBusinesses: AdminBusiness[],
  approvedBusinesses: AdminBusiness[],
  users: AdminUser[],
) {
  const pendingBusinessesKpi =
    (dashboard?.metrics.pendingBusinesses ?? 0) > 0
      ? (dashboard?.metrics.pendingBusinesses ?? 0)
      : pendingBusinesses.length;

  const approvedBusinessesKpi =
    (dashboard?.metrics.approvedBusinesses ?? 0) > 0
      ? (dashboard?.metrics.approvedBusinesses ?? 0)
      : approvedBusinesses.length;

  const totalBusinessesFallback = pendingBusinesses.length + approvedBusinesses.length;
  const totalBusinessesKpi =
    (dashboard?.metrics.totalBusinesses ?? 0) > 0
      ? (dashboard?.metrics.totalBusinesses ?? 0)
      : totalBusinessesFallback;

  const totalUsersKpi = (dashboard?.metrics.totalUsers ?? 0) > 0 ? (dashboard?.metrics.totalUsers ?? 0) : users.length;
  const kpiScaleMax = Math.max(totalBusinessesKpi, pendingBusinessesKpi, approvedBusinessesKpi, totalUsersKpi, 1);

  return {
    totalBusinessesKpi,
    pendingBusinessesKpi,
    approvedBusinessesKpi,
    totalUsersKpi,
    toKpiProgress: (value: number) => Math.round((value / kpiScaleMax) * 100),
  };
}
