import { authenticatedJson } from "@/lib/api/client";

export type DashboardMetrics = {
  totalBusinesses: number;
  pendingBusinesses: number;
  approvedBusinesses: number;
  totalUsers: number;
};

export type DashboardActivity = {
  label: string;
  value: number;
};

export type DashboardPayload = {
  metrics: DashboardMetrics;
  recentActivity: DashboardActivity[];
};

export type AdminUser = {
  id: string;
  username?: string;
  fullName?: string;
  email: string;
  role: number;
  createdAt?: string;
  status?: string;
};

export type ReportSummary = {
  totalReports: number;
  openReports: number;
  resolvedReports: number;
  flaggedBusinesses: number;
  reportsByReason?: Array<{ reason: string; count: number }>;
};

export type Category = {
  id: string;
  name: string;
  businessesCount?: number;
};

export type HealthStatus = {
  status?: string;
  timestamp?: string;
  version?: string;
};

export type AuditLog = {
  id: string;
  action?: string;
  actorUserId?: string;
  targetUserId?: string;
  oldValue?: string;
  newValue?: string;
  reason?: string;
  createdAt?: string;
};

export type AdminBusinessStatus = "Pending" | "Approved" | "Rejected" | "Suspended" | string;

export type AdminBusiness = {
  id: string;
  name: string;
  ownerId?: string;
  city?: string;
  businessType?: string;
  status?: AdminBusinessStatus;
  createdAt?: string;
  updatedAt?: string;
};

const toNumber = (value: unknown) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const asRecord = (value: unknown): Record<string, unknown> =>
  typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {};

const toOptionalString = (value: unknown): string | undefined => (typeof value === "string" ? value : undefined);
const unwrapPayload = (raw: unknown): unknown => {
  const root = asRecord(raw);
  return root.data ?? root.result ?? raw;
};

const normalizeAdminUser = (raw: unknown): AdminUser => {
  const source = asRecord(raw);
  return {
    id: String(source.id ?? source.Id ?? ""),
    username: toOptionalString(source.username ?? source.Username),
    fullName: toOptionalString(source.fullName ?? source.FullName),
    email: String(source.email ?? source.Email ?? ""),
    role: toNumber(source.role ?? source.Role),
    createdAt: toOptionalString(source.createdAt ?? source.CreatedAt),
    status: toOptionalString(source.status ?? source.Status),
  };
};

const normalizeAdminUsers = (raw: unknown): AdminUser[] => {
  const payload = unwrapPayload(raw);
  if (!Array.isArray(payload)) return [];
  return payload.map((entry) => normalizeAdminUser(entry)).filter((entry) => entry.id.length > 0);
};

const normalizeCategory = (raw: unknown): Category => {
  const source = asRecord(raw);
  return {
    id: String(source.id ?? source.Id ?? ""),
    name: String(source.name ?? source.Name ?? ""),
    businessesCount: toNumber(
      source.businessesCount ?? source.BusinessesCount ?? source.count ?? source.Count
    ),
  };
};

const normalizeCategories = (raw: unknown): Category[] => {
  const payload = unwrapPayload(raw);
  if (!Array.isArray(payload)) return [];
  return payload.map((entry) => normalizeCategory(entry)).filter((entry) => entry.id.length > 0);
};

const normalizeAdminBusiness = (raw: unknown): AdminBusiness => {
  const source = asRecord(raw);
  return {
    id: String(source.id ?? source.Id ?? ""),
    name: String(source.name ?? source.Name ?? ""),
    ownerId: toOptionalString(source.ownerId ?? source.OwnerId),
    city: toOptionalString(source.city ?? source.City),
    businessType: toOptionalString(source.businessType ?? source.BusinessType ?? source.type ?? source.Type),
    status: toOptionalString(source.status ?? source.Status),
    createdAt: toOptionalString(source.createdAt ?? source.CreatedAt),
    updatedAt: toOptionalString(source.updatedAt ?? source.UpdatedAt),
  };
};

const normalizeAdminBusinesses = (raw: unknown): AdminBusiness[] => {
  const payload = unwrapPayload(raw);
  if (!Array.isArray(payload)) return [];
  return payload.map((entry) => normalizeAdminBusiness(entry)).filter((entry) => entry.id.length > 0);
};

const normalizeAuditLog = (raw: unknown): AuditLog => {
  const source = asRecord(raw);
  return {
    id: String(source.id ?? source.Id ?? ""),
    action: toOptionalString(source.action ?? source.Action),
    actorUserId: toOptionalString(source.actorUserId ?? source.ActorUserId),
    targetUserId: toOptionalString(source.targetUserId ?? source.TargetUserId),
    oldValue: toOptionalString(source.oldValue ?? source.OldValue),
    newValue: toOptionalString(source.newValue ?? source.NewValue),
    reason: toOptionalString(source.reason ?? source.Reason),
    createdAt: toOptionalString(source.createdAt ?? source.CreatedAt),
  };
};

const normalizeAuditLogs = (raw: unknown): AuditLog[] => {
  const payload = unwrapPayload(raw);
  if (!Array.isArray(payload)) return [];
  return payload.map((entry) => normalizeAuditLog(entry)).filter((entry) => entry.id.length > 0);
};

const normalizeReportSummary = (raw: unknown): ReportSummary => {
  const source = asRecord(unwrapPayload(raw));
  const reasonsRaw = source.reportsByReason ?? source.ReportsByReason;
  const reportsByReason = Array.isArray(reasonsRaw)
    ? reasonsRaw.map((item) => {
        const row = asRecord(item);
        return {
          reason: String(row.reason ?? row.Reason ?? ""),
          count: toNumber(row.count ?? row.Count),
        };
      })
    : undefined;

  return {
    totalReports: toNumber(source.totalReports ?? source.TotalReports),
    openReports: toNumber(source.openReports ?? source.OpenReports),
    resolvedReports: toNumber(source.resolvedReports ?? source.ResolvedReports),
    flaggedBusinesses: toNumber(source.flaggedBusinesses ?? source.FlaggedBusinesses),
    reportsByReason,
  };
};

const normalizeHealthStatus = (raw: unknown): HealthStatus => {
  const source = asRecord(unwrapPayload(raw));
  return {
    status: toOptionalString(source.status ?? source.Status),
    timestamp: toOptionalString(source.timestamp ?? source.Timestamp),
    version: toOptionalString(source.version ?? source.Version),
  };
};

export const normalizeDashboard = (raw: unknown): DashboardPayload => {
  const root = asRecord(raw);
  const payload = asRecord(root.data ?? root.result ?? root);
  const metricsSource = asRecord(payload.metrics ?? payload.Metrics ?? payload);

  const metrics: DashboardMetrics = {
    totalBusinesses: toNumber(
      metricsSource.totalBusinesses ??
        metricsSource.TotalBusinesses ??
        metricsSource.businessCount ??
        metricsSource.BusinessCount,
    ),
    pendingBusinesses: toNumber(metricsSource.pendingBusinesses ?? metricsSource.PendingBusinesses),
    approvedBusinesses: toNumber(metricsSource.approvedBusinesses ?? metricsSource.ApprovedBusinesses),
    totalUsers: toNumber(
      metricsSource.totalUsers ??
        metricsSource.TotalUsers ??
        metricsSource.userCount ??
        metricsSource.UserCount ??
        metricsSource.usersCount ??
        metricsSource.UsersCount ??
        metricsSource.currentUsers ??
        metricsSource.CurrentUsers,
    ),
  };

  const recentRaw = payload.recentActivity ?? payload.RecentActivity;
  const recentList = Array.isArray(recentRaw) ? recentRaw : [];
  const recentActivity = recentList
    .map((item) => asRecord(item))
    .map((item) => ({
      label: String(item.label ?? item.Label ?? ""),
      value: toNumber(item.value ?? item.Value),
    }))
    .filter((item) => item.label.length > 0);

  return { metrics, recentActivity };
};

export async function getAdminDashboard() {
  const dashboard = await authenticatedJson<unknown>("/api/admin/dashboard");
  return normalizeDashboard(dashboard);
}

export async function getAdminUsers() {
  const response = await authenticatedJson<unknown>("/api/admin/users");
  return normalizeAdminUsers(response);
}

export async function updateAdminUserRole(id: string, role: number, reason?: string) {
  const response = await authenticatedJson<unknown>(`/api/admin/users/${id}/role`, {
    method: "PATCH",
    body: JSON.stringify(reason ? { role, reason } : { role }),
  });
  return normalizeAdminUser(response);
}

export async function getAdminAuditLogs(take = 100) {
  const response = await authenticatedJson<unknown>(`/api/admin/audit-logs?take=${encodeURIComponent(String(take))}`);
  return normalizeAuditLogs(response);
}

export async function deleteAdminUser(id: string, reason?: string) {
  const query = reason ? `?reason=${encodeURIComponent(reason)}` : "";
  return authenticatedJson<{ success?: boolean; message?: string }>(`/api/admin/users/${id}${query}`, {
    method: "DELETE",
  });
}

export async function getReportSummary() {
  const response = await authenticatedJson<unknown>("/api/admin/reports/summary");
  return normalizeReportSummary(response);
}

export async function getAdminCategories() {
  const response = await authenticatedJson<unknown>("/api/admin/categories");
  return normalizeCategories(response);
}

export async function getHealthStatus() {
  try {
    const response = await authenticatedJson<unknown>("/health", { requireAuth: false });
    return normalizeHealthStatus(response);
  } catch {
    const fallback = await authenticatedJson<unknown>("/api/health", { requireAuth: false });
    return normalizeHealthStatus(fallback);
  }
}

export async function getAdminBusinesses(status?: string) {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  const response = await authenticatedJson<unknown>(`/api/admin/businesses${query}`);
  return normalizeAdminBusinesses(response);
}

export async function getAdminBusinessById(id: string) {
  return authenticatedJson<AdminBusiness>(`/api/admin/businesses/${id}`);
}

export async function approveAdminBusiness(id: string) {
  return authenticatedJson<AdminBusiness>(`/api/admin/businesses/${id}/approve`, {
    method: "PATCH",
  });
}

export async function rejectAdminBusiness(id: string) {
  return authenticatedJson<AdminBusiness>(`/api/admin/businesses/${id}/reject`, {
    method: "PATCH",
  });
}

export async function suspendAdminBusiness(id: string, reason?: string) {
  return authenticatedJson<AdminBusiness>(`/api/admin/businesses/${id}/suspend`, {
    method: "PATCH",
    body: JSON.stringify(reason ? { reason } : {}),
  });
}
