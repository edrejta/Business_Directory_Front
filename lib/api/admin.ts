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
  role: string | number;
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

export const normalizeDashboard = (raw: unknown): DashboardPayload => {
  const root = asRecord(raw);
  const payload = asRecord(root.data ?? root.result ?? root);
  const metricsSource = asRecord(payload.metrics ?? payload.Metrics ?? payload);

  const metrics: DashboardMetrics = {
    totalBusinesses: toNumber(metricsSource.totalBusinesses ?? metricsSource.TotalBusinesses),
    pendingBusinesses: toNumber(metricsSource.pendingBusinesses ?? metricsSource.PendingBusinesses),
    approvedBusinesses: toNumber(metricsSource.approvedBusinesses ?? metricsSource.ApprovedBusinesses),
    totalUsers: toNumber(
      metricsSource.totalUsers ??
        metricsSource.TotalUsers ??
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
  return authenticatedJson<AdminUser[]>("/api/admin/users");
}

export async function getReportSummary() {
  return authenticatedJson<ReportSummary>("/api/admin/reports/summary");
}

export async function getAdminCategories() {
  return authenticatedJson<Category[]>("/api/admin/categories");
}

export async function getHealthStatus() {
  return authenticatedJson<HealthStatus>("/health", { requireAuth: false });
}

export async function getAdminBusinesses(status?: string) {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return authenticatedJson<AdminBusiness[]>(`/api/admin/businesses${query}`);
}

export async function getPendingAdminBusinesses() {
  return authenticatedJson<AdminBusiness[]>("/api/admin/businesses/pending");
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

export async function suspendAdminBusiness(id: string) {
  return authenticatedJson<AdminBusiness>(`/api/admin/businesses/${id}/suspend`, {
    method: "PATCH",
  });
}
