import { useEffect, useState } from "react";
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
import { ADMIN_ROLE, APPROVED_STATUS, PENDING_STATUS } from "./constants";

type UseAdminDashboardDataParams = {
  isLoadingAuth: boolean;
  userRole?: number;
};

export function useAdminDashboardData({ isLoadingAuth, userRole }: UseAdminDashboardDataParams) {
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
  const [sectionError, setSectionError] = useState<string | null>(null);

  const refreshDashboard = async () => {
    const data = await getAdminDashboard();
    setDashboard(data);
  };

  const refreshUsers = async () => {
    const data = await getAdminUsers();
    setUsers(Array.isArray(data) ? data : []);
  };

  const refreshPendingBusinesses = async () => {
    const data = await getAdminBusinesses(PENDING_STATUS);
    setPendingBusinesses(Array.isArray(data) ? data : []);
  };

  const refreshApprovedBusinesses = async () => {
    const data = await getAdminBusinesses(APPROVED_STATUS);
    setApprovedBusinesses(Array.isArray(data) ? data : []);
  };

  const refreshAuditLogs = async () => {
    const data = await getAdminAuditLogs(100);
    setAuditLogs(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    if (isLoadingAuth || userRole !== ADMIN_ROLE) return;

    let mounted = true;

    const loadAdminData = async () => {
      setLoadingData(true);
      setError(null);
      setSectionError(null);

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

        const [
          dashboardResult,
          usersResult,
          categoriesResult,
          reportsResult,
          healthResult,
          pendingResult,
          approvedResult,
          logsResult,
        ] = results;

        if (dashboardResult.status === "fulfilled") setDashboard(dashboardResult.value);
        if (usersResult.status === "fulfilled") setUsers(Array.isArray(usersResult.value) ? usersResult.value : []);
        if (categoriesResult.status === "fulfilled") {
          setCategories(Array.isArray(categoriesResult.value) ? categoriesResult.value : []);
        }
        if (reportsResult.status === "fulfilled") setReports(reportsResult.value);
        if (healthResult.status === "fulfilled") setHealth(healthResult.value);
        if (pendingResult.status === "fulfilled") {
          setPendingBusinesses(Array.isArray(pendingResult.value) ? pendingResult.value : []);
        }
        if (approvedResult.status === "fulfilled") {
          setApprovedBusinesses(Array.isArray(approvedResult.value) ? approvedResult.value : []);
        }
        if (logsResult.status === "fulfilled") setAuditLogs(Array.isArray(logsResult.value) ? logsResult.value : []);

        const failed = results.filter((result) => result.status === "rejected");
        if (failed.length > 0) {
          setSectionError("Some dashboard sections could not be loaded.");
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
  }, [isLoadingAuth, userRole]);

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
    sectionError,
    setSectionError,
    refreshDashboard,
    refreshUsers,
    refreshPendingBusinesses,
    refreshApprovedBusinesses,
    refreshAuditLogs,
  };
}
