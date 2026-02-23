"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getAdminAuditLogs,
  getAdminBusinesses,
  getAdminCategories,
  getAdminDashboard,
  getAdminUsers,
  getHealthStatus,
  getReportSummary,
  type AdminBusiness,
  type AdminUser,
  type AuditLog,
  type Category,
  type DashboardPayload,
  type HealthStatus,
  type ReportSummary,
} from "@/lib/api/admin";
import { APPROVED_STATUS, PENDING_STATUS } from "./constants";

type UseAdminDashboardDataResult = {
  dashboard: DashboardPayload | null;
  users: AdminUser[];
  pendingBusinesses: AdminBusiness[];
  approvedBusinesses: AdminBusiness[];
  auditLogs: AuditLog[];
  categories: Category[];
  reports: ReportSummary | null;
  health: HealthStatus | null;
  loadingData: boolean;
  error: string | null;
  refreshDashboard: () => Promise<void>;
  refreshUsers: () => Promise<void>;
  refreshPendingBusinesses: () => Promise<void>;
  refreshApprovedBusinesses: () => Promise<void>;
  refreshAuditLogs: () => Promise<void>;
};

const toArray = <T,>(value: unknown): T[] => (Array.isArray(value) ? value : []);

export function useAdminDashboardData(enabled: boolean): UseAdminDashboardDataResult {
  const [dashboard, setDashboard] = useState<DashboardPayload | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [pendingBusinesses, setPendingBusinesses] = useState<AdminBusiness[]>([]);
  const [approvedBusinesses, setApprovedBusinesses] = useState<AdminBusiness[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [reports, setReports] = useState<ReportSummary | null>(null);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshDashboard = useCallback(async () => {
    const dashboardData = await getAdminDashboard();
    setDashboard(dashboardData);
  }, []);

  const refreshUsers = useCallback(async () => {
    const usersData = await getAdminUsers();
    setUsers(toArray<AdminUser>(usersData));
  }, []);

  const refreshPendingBusinesses = useCallback(async () => {
    const pendingData = await getAdminBusinesses(PENDING_STATUS);
    setPendingBusinesses(toArray<AdminBusiness>(pendingData));
  }, []);

  const refreshApprovedBusinesses = useCallback(async () => {
    const approvedData = await getAdminBusinesses(APPROVED_STATUS);
    setApprovedBusinesses(toArray<AdminBusiness>(approvedData));
  }, []);

  const refreshAuditLogs = useCallback(async () => {
    const logs = await getAdminAuditLogs(100);
    setAuditLogs(toArray<AuditLog>(logs));
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let mounted = true;
    const loadAdminData = async () => {
      setLoadingData(true);
      setError(null);
      try {
        const results = await Promise.allSettled([
          getAdminDashboard(),
          getAdminUsers(),
          getAdminCategories(),
          getReportSummary(),
          getHealthStatus(),
          getAdminBusinesses(PENDING_STATUS),
          getAdminBusinesses(APPROVED_STATUS),
          getAdminAuditLogs(100),
        ]);

        if (!mounted) return;

        const endpointNames = [
          "dashboard",
          "users",
          "categories",
          "reports summary",
          "health",
          "pending businesses",
          "approved businesses",
          "audit logs",
        ] as const;

        const failedEndpoints: string[] = [];
        results.forEach((result, index) => {
          if (result.status === "rejected") {
            failedEndpoints.push(endpointNames[index]);
          }
        });

        const [dashboardResult, usersResult, categoriesResult, reportsResult, healthResult, pendingResult, approvedResult, logsResult] =
          results;

        if (dashboardResult.status === "fulfilled") {
          setDashboard(dashboardResult.value);
        }
        if (usersResult.status === "fulfilled") {
          setUsers(toArray<AdminUser>(usersResult.value));
        }
        if (categoriesResult.status === "fulfilled") {
          setCategories(toArray<Category>(categoriesResult.value));
        }
        if (reportsResult.status === "fulfilled") {
          setReports(reportsResult.value);
        }
        if (healthResult.status === "fulfilled") {
          setHealth(healthResult.value);
        }
        if (pendingResult.status === "fulfilled") {
          setPendingBusinesses(toArray<AdminBusiness>(pendingResult.value));
        }
        if (approvedResult.status === "fulfilled") {
          setApprovedBusinesses(toArray<AdminBusiness>(approvedResult.value));
        }
        if (logsResult.status === "fulfilled") {
          setAuditLogs(toArray<AuditLog>(logsResult.value));
        }

        if (failedEndpoints.length > 0) {
          setError(`Some admin sections failed to load: ${failedEndpoints.join(", ")}.`);
        }
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Failed to load admin dashboard.");
      } finally {
        if (mounted) setLoadingData(false);
      }
    };

    void loadAdminData();

    return () => {
      mounted = false;
    };
  }, [enabled]);

  return {
    dashboard,
    users,
    pendingBusinesses,
    approvedBusinesses,
    auditLogs,
    categories,
    reports,
    health,
    loadingData,
    error,
    refreshDashboard,
    refreshUsers,
    refreshPendingBusinesses,
    refreshApprovedBusinesses,
    refreshAuditLogs,
  };
}
