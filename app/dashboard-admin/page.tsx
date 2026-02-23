"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import "./admin-theme.css";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  approveAdminBusiness,
  deleteAdminUser,
  rejectAdminBusiness,
  suspendAdminBusiness,
  updateAdminUserRole,
  type AdminBusiness,
  type AdminUser,
} from "@/lib/api/admin";
import ConfirmModal from "@/components/admin/ConfirmModal";
import type { DataColumn } from "@/components/admin/DataTable";
import KpiCard from "@/components/admin/KpiCard";
import ReasonModal from "@/components/admin/ReasonModal";
import AuditLogsSection from "@/components/admin/sections/AuditLogsSection";
import BusinessSuspensionSection from "@/components/admin/sections/BusinessSuspensionSection";
import CategoriesSection from "@/components/admin/sections/CategoriesSection";
import PendingReviewSection from "@/components/admin/sections/PendingReviewSection";
import RoleManagementSection from "@/components/admin/sections/RoleManagementSection";
import SystemInfoSection from "@/components/admin/sections/SystemInfoSection";
import SidebarNav from "@/components/admin/SidebarNav";
import TopNav from "@/components/admin/TopNav";
import Toasts, { type ToastItem } from "@/components/admin/Toasts";
import {
  ADMIN_ROLE,
  BUSINESS_ROLE,
  PAGE_SIZE,
  ROLE_OPTIONS,
  SIDEBAR_ITEMS,
  USER_ROLE,
} from "./constants";
import { useAdminDashboardData } from "./useAdminDashboardData";
import { clampPage, formatDateTime, getTotalPages, paginate } from "./utils";

type ConfirmAction =
  | { type: "approve"; business: AdminBusiness }
  | { type: "reject"; business: AdminBusiness };

type ReasonAction =
  | { type: "changeRole"; user: AdminUser; nextRole: number }
  | { type: "deleteUser"; user: AdminUser }
  | { type: "suspendBusiness"; business: AdminBusiness };

type ReasonModalConfig = {
  title: string;
  confirmLabel: string;
  confirmVariant: "primary" | "danger" | "warning";
};

export default function DashboardAdmin() {
  const { user, isLoading, logoutUser } = useAuth();
  const router = useRouter();

  // Global UI states
  const [sectionError, setSectionError] = useState<string | null>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);

  // Modal states
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const [reasonAction, setReasonAction] = useState<ReasonAction | null>(null);
  const [modalReason, setModalReason] = useState("");

  // Toast notifications
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Filters + pagination (Users)
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [userPage, setUserPage] = useState(1);

  // Filters + pagination (Pending businesses)
  const [pendingSearch, setPendingSearch] = useState("");
  const [pendingCityFilter, setPendingCityFilter] = useState("all");
  const [pendingPage, setPendingPage] = useState(1);

  // Filters + pagination (Approved businesses)
  const [approvedSearch, setApprovedSearch] = useState("");
  const [approvedCityFilter, setApprovedCityFilter] = useState("all");
  const [approvedPage, setApprovedPage] = useState(1);

  // Filters + pagination (Audit logs)
  const [auditSearch, setAuditSearch] = useState("");
  const [auditActionFilter, setAuditActionFilter] = useState("all");
  const [auditPage, setAuditPage] = useState(1);

  const isAdminReady = !isLoading && !!user && user.role === ADMIN_ROLE;
  const {
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
  } = useAdminDashboardData(isAdminReady);

  useEffect(() => {
    void import("bootstrap");
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== ADMIN_ROLE) {
      if (user.role === USER_ROLE) router.replace("/dashboard-user");
      else if (user.role === BUSINESS_ROLE) router.replace("/dashboard-business");
    }
  }, [isLoading, router, user]);

  const addToast = (message: string, variant: ToastItem["variant"] = "success") => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((prev) => [...prev, { id, message, variant }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3500);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const getRoleLabel = (value: number) => {
    return ROLE_OPTIONS.find((role) => role.value === value)?.label ?? String(value);
  };

  const isAdminAccount = (account: AdminUser) => {
    return account.role === ADMIN_ROLE;
  };

  type AdminActionOptions = {
    key: string;
    request: () => Promise<unknown>;
    refresh?: Array<() => Promise<void>>;
    successMessage: string;
    successVariant?: ToastItem["variant"];
    failureMessage: string;
    failureVariant?: ToastItem["variant"];
  };

  const runAdminAction = async ({
    key,
    request,
    refresh = [],
    successMessage,
    successVariant = "success",
    failureMessage,
    failureVariant = "danger",
  }: AdminActionOptions) => {
    setBusyKey(key);
    setSectionError(null);
    try {
      await request();
      if (refresh.length > 0) {
        await Promise.all(refresh.map((refreshStep) => refreshStep()));
      }
      addToast(successMessage, successVariant);
    } catch (err) {
      setSectionError(err instanceof Error ? err.message : failureMessage);
      addToast(failureMessage, failureVariant);
    } finally {
      setBusyKey(null);
    }
  };

  const openReasonAction = (action: ReasonAction) => {
    setModalReason("");
    setReasonAction(action);
  };

  const closeReasonAction = () => {
    setReasonAction(null);
    setModalReason("");
  };

  const getReasonModalConfig = (action: ReasonAction | null): ReasonModalConfig => {
    if (!action) {
      return { title: "Action", confirmLabel: "Confirm", confirmVariant: "primary" };
    }

    if (action.type === "changeRole") {
      return { title: "Change User Role", confirmLabel: "Save Role", confirmVariant: "warning" };
    }

    if (action.type === "deleteUser") {
      return { title: "Delete User", confirmLabel: "Delete User", confirmVariant: "danger" };
    }

    return { title: "Suspend Business", confirmLabel: "Suspend", confirmVariant: "warning" };
  };

  const userEmailById = useMemo(() => {
    return new Map(users.map((entry) => [entry.id, entry.email]));
  }, [users]);

  const getTargetEmail = (targetUserId?: string) => {
    if (!targetUserId) return "-";
    return userEmailById.get(targetUserId) ?? "-";
  };

  const runApproveBusiness = async (business: AdminBusiness) => {
    await runAdminAction({
      key: `approve-${business.id}`,
      request: () => approveAdminBusiness(business.id),
      refresh: [refreshPendingBusinesses, refreshDashboard],
      successMessage: `Approved ${business.name}.`,
      successVariant: "success",
      failureMessage: "Approve failed.",
    });
  };

  const runRejectBusiness = async (business: AdminBusiness) => {
    await runAdminAction({
      key: `reject-${business.id}`,
      request: () => rejectAdminBusiness(business.id),
      refresh: [refreshPendingBusinesses, refreshDashboard],
      successMessage: `Rejected ${business.name}.`,
      successVariant: "warning",
      failureMessage: "Reject failed.",
    });
  };

  const runChangeRole = async (targetUser: AdminUser, nextRole: number, reason?: string) => {
    if (isAdminAccount(targetUser) && nextRole !== ADMIN_ROLE) {
      setSectionError("Admin accounts cannot be downgraded from this panel.");
      addToast("Admin safety guard blocked downgrade.", "warning");
      return;
    }

    await runAdminAction({
      key: `role-${targetUser.id}`,
      request: () => updateAdminUserRole(targetUser.id, nextRole, reason),
      refresh: [refreshUsers, refreshAuditLogs],
      successMessage: `Role updated for ${targetUser.email}.`,
      successVariant: "success",
      failureMessage: "Role update failed.",
    });
  };

  const runDeleteUser = async (targetUser: AdminUser, reason?: string) => {
    if (isAdminAccount(targetUser)) {
      setSectionError("Admin accounts cannot be deleted from this panel.");
      addToast("Admin safety guard blocked delete.", "warning");
      return;
    }

    await runAdminAction({
      key: `delete-${targetUser.id}`,
      request: () => deleteAdminUser(targetUser.id, reason),
      refresh: [refreshUsers, refreshDashboard, refreshAuditLogs],
      successMessage: `Deleted ${targetUser.email}.`,
      successVariant: "warning",
      failureMessage: "User delete failed.",
    });
  };

  const runSuspendBusiness = async (business: AdminBusiness, reason?: string) => {
    await runAdminAction({
      key: `suspend-${business.id}`,
      request: () => suspendAdminBusiness(business.id, reason),
      refresh: [refreshApprovedBusinesses, refreshDashboard, refreshAuditLogs],
      successMessage: `Suspended ${business.name}.`,
      successVariant: "warning",
      failureMessage: "Suspend failed.",
    });
  };

  const handleConfirmSubmit = async () => {
    if (!confirmAction) return;

    if (confirmAction.type === "approve") {
      await runApproveBusiness(confirmAction.business);
    }
    if (confirmAction.type === "reject") {
      await runRejectBusiness(confirmAction.business);
    }

    setConfirmAction(null);
  };

  const handleReasonSubmit = async () => {
    if (!reasonAction) return;

    if (reasonAction.type === "changeRole") {
      await runChangeRole(reasonAction.user, reasonAction.nextRole, modalReason.trim() || undefined);
    }
    if (reasonAction.type === "deleteUser") {
      await runDeleteUser(reasonAction.user, modalReason.trim() || undefined);
    }
    if (reasonAction.type === "suspendBusiness") {
      await runSuspendBusiness(reasonAction.business, modalReason.trim() || undefined);
    }

    setReasonAction(null);
    setModalReason("");
  };

  const filteredUsers = useMemo(() => {
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
  }, [users, userRoleFilter, userSearch]);

  const pendingCities = useMemo(() => {
    return Array.from(new Set(pendingBusinesses.map((entry) => entry.city).filter((entry): entry is string => !!entry)));
  }, [pendingBusinesses]);

  const filteredPendingBusinesses = useMemo(() => {
    const query = pendingSearch.trim().toLowerCase();

    return pendingBusinesses.filter((entry) => {
      const matchesCity = pendingCityFilter === "all" || entry.city === pendingCityFilter;
      const matchesQuery =
        query.length === 0 ||
        entry.name.toLowerCase().includes(query) ||
        (entry.businessType ?? "").toLowerCase().includes(query) ||
        (entry.city ?? "").toLowerCase().includes(query);
      return matchesCity && matchesQuery;
    });
  }, [pendingBusinesses, pendingCityFilter, pendingSearch]);

  const approvedCities = useMemo(() => {
    return Array.from(new Set(approvedBusinesses.map((entry) => entry.city).filter((entry): entry is string => !!entry)));
  }, [approvedBusinesses]);

  const filteredApprovedBusinesses = useMemo(() => {
    const query = approvedSearch.trim().toLowerCase();

    return approvedBusinesses.filter((entry) => {
      const matchesCity = approvedCityFilter === "all" || entry.city === approvedCityFilter;
      const matchesQuery =
        query.length === 0 ||
        entry.name.toLowerCase().includes(query) ||
        (entry.businessType ?? "").toLowerCase().includes(query) ||
        (entry.city ?? "").toLowerCase().includes(query);
      return matchesCity && matchesQuery;
    });
  }, [approvedBusinesses, approvedCityFilter, approvedSearch]);

  const auditActionOptions = useMemo(() => {
    return Array.from(new Set(auditLogs.map((entry) => entry.action).filter((entry): entry is string => !!entry)));
  }, [auditLogs]);

  const filteredAuditLogs = useMemo(() => {
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
  }, [auditActionFilter, auditLogs, auditSearch, userEmailById]);

  useEffect(() => {
    setUserPage(1);
  }, [userSearch, userRoleFilter]);

  useEffect(() => {
    setPendingPage(1);
  }, [pendingSearch, pendingCityFilter]);

  useEffect(() => {
    setApprovedPage(1);
  }, [approvedSearch, approvedCityFilter]);

  useEffect(() => {
    setAuditPage(1);
  }, [auditSearch, auditActionFilter]);

  const totalUserPages = getTotalPages(filteredUsers.length, PAGE_SIZE);
  const totalPendingPages = getTotalPages(filteredPendingBusinesses.length, PAGE_SIZE);
  const totalApprovedPages = getTotalPages(filteredApprovedBusinesses.length, PAGE_SIZE);
  const totalAuditPages = getTotalPages(filteredAuditLogs.length, PAGE_SIZE);

  const currentUserPage = clampPage(userPage, totalUserPages);
  const currentPendingPage = clampPage(pendingPage, totalPendingPages);
  const currentApprovedPage = clampPage(approvedPage, totalApprovedPages);
  const currentAuditPage = clampPage(auditPage, totalAuditPages);

  const pagedUsers = paginate(filteredUsers, currentUserPage, PAGE_SIZE);
  const pagedPendingBusinesses = paginate(filteredPendingBusinesses, currentPendingPage, PAGE_SIZE);
  const pagedApprovedBusinesses = paginate(filteredApprovedBusinesses, currentApprovedPage, PAGE_SIZE);
  const pagedAuditLogs = paginate(filteredAuditLogs, currentAuditPage, PAGE_SIZE);
  const totalUsersKpi =
    (dashboard?.metrics.totalUsers ?? 0) > 0 ? (dashboard?.metrics.totalUsers ?? 0) : users.length;
  const totalBusinessesKpi = dashboard?.metrics.totalBusinesses ?? 0;
  const pendingBusinessesKpi = dashboard?.metrics.pendingBusinesses ?? 0;
  const approvedBusinessesKpi = dashboard?.metrics.approvedBusinesses ?? 0;
  const kpiScaleMax = Math.max(totalBusinessesKpi, pendingBusinessesKpi, approvedBusinessesKpi, totalUsersKpi, 1);
  const toKpiProgress = (value: number) => Math.round((value / kpiScaleMax) * 100);

  const userColumns: DataColumn[] = [
    { key: "username", label: "Username" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    { key: "actions", label: "Actions", className: "text-end" },
  ];

  const pendingColumns: DataColumn[] = [
    { key: "name", label: "Business" },
    { key: "city", label: "City" },
    { key: "type", label: "Category" },
    { key: "submitted", label: "Submitted" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions", className: "text-end" },
  ];

  const approvedColumns: DataColumn[] = [
    { key: "name", label: "Business" },
    { key: "city", label: "City" },
    { key: "type", label: "Category" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions", className: "text-end" },
  ];

  const categoryColumns: DataColumn[] = [
    { key: "name", label: "Category" },
    { key: "count", label: "Businesses" },
  ];

  const auditColumns: DataColumn[] = [
    { key: "action", label: "Action" },
    { key: "target", label: "Target Email", className: "text-nowrap" },
    { key: "reason", label: "Reason" },
    { key: "log", label: "Log ID", className: "text-nowrap" },
    { key: "time", label: "Time" },
  ];
  const reasonModalConfig = getReasonModalConfig(reasonAction);

  if (isLoading || !user) return null;

  return (
    <div className="admin-coffee bg-body-secondary min-vh-100">
      <div className="d-flex admin-layout-shell">
        <SidebarNav items={SIDEBAR_ITEMS} />

        <div className="flex-grow-1 admin-main-shell">
          <TopNav
            username={user.username}
            roleLabel={getRoleLabel(user.role)}
            homeHref="/"
            roleHref="/dashboard-admin"
            onLogout={logoutUser}
          />

          <main className="container-fluid p-3 p-lg-5">
            {error && <div className="alert alert-danger">{error}</div>}
            {sectionError && <div className="alert alert-warning">{sectionError}</div>}

            <section id="kpi-cards" className="mb-5">
              <div className="row g-4">
                <div className="col-12 col-md-6 col-xl-3">
                  {loadingData ? (
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-body placeholder-glow">
                        <span className="placeholder col-8" />
                        <span className="placeholder col-5 mt-3 d-block" />
                      </div>
                    </div>
                  ) : (
                    <KpiCard
                      title="Total Businesses"
                      value={totalBusinessesKpi}
                      tone="primary"
                      progress={toKpiProgress(totalBusinessesKpi)}
                    />
                  )}
                </div>
                <div className="col-12 col-md-6 col-xl-3">
                  {loadingData ? (
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-body placeholder-glow">
                        <span className="placeholder col-8" />
                        <span className="placeholder col-5 mt-3 d-block" />
                      </div>
                    </div>
                  ) : (
                    <KpiCard
                      title="Pending Businesses"
                      value={pendingBusinessesKpi}
                      tone="warning"
                      progress={toKpiProgress(pendingBusinessesKpi)}
                    />
                  )}
                </div>
                <div className="col-12 col-md-6 col-xl-3">
                  {loadingData ? (
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-body placeholder-glow">
                        <span className="placeholder col-8" />
                        <span className="placeholder col-5 mt-3 d-block" />
                      </div>
                    </div>
                  ) : (
                    <KpiCard
                      title="Approved Businesses"
                      value={approvedBusinessesKpi}
                      tone="success"
                      progress={toKpiProgress(approvedBusinessesKpi)}
                    />
                  )}
                </div>
                <div className="col-12 col-md-6 col-xl-3">
                  {loadingData ? (
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-body placeholder-glow">
                        <span className="placeholder col-8" />
                        <span className="placeholder col-5 mt-3 d-block" />
                      </div>
                    </div>
                  ) : (
                    <KpiCard title="Total Users" value={totalUsersKpi} tone="info" progress={toKpiProgress(totalUsersKpi)} />
                  )}
                </div>
              </div>
            </section>

            <div className="row g-5">
              <div className="col-12" id="pending-review">
                <PendingReviewSection
                  loadingData={loadingData}
                  filteredCount={filteredPendingBusinesses.length}
                  pendingSearch={pendingSearch}
                  setPendingSearch={setPendingSearch}
                  pendingCityFilter={pendingCityFilter}
                  setPendingCityFilter={setPendingCityFilter}
                  pendingCities={pendingCities}
                  rows={pagedPendingBusinesses}
                  columns={pendingColumns}
                  busyKey={busyKey}
                  onApproveRequest={(business) => setConfirmAction({ type: "approve", business })}
                  onRejectRequest={(business) => setConfirmAction({ type: "reject", business })}
                  currentPage={currentPendingPage}
                  totalPages={totalPendingPages}
                  onPageChange={setPendingPage}
                  formatDateTime={formatDateTime}
                />
              </div>

              <div className="col-12" id="role-management">
                <RoleManagementSection
                  loadingData={loadingData}
                  userSearch={userSearch}
                  setUserSearch={setUserSearch}
                  userRoleFilter={userRoleFilter}
                  setUserRoleFilter={setUserRoleFilter}
                  adminRole={ADMIN_ROLE}
                  roleOptions={ROLE_OPTIONS}
                  rows={pagedUsers}
                  columns={userColumns}
                  busyKey={busyKey}
                  getRoleLabel={getRoleLabel}
                  isAdminAccount={isAdminAccount}
                  onChangeRoleRequest={(entry, nextRole) =>
                    openReasonAction({ type: "changeRole", user: entry, nextRole })
                  }
                  onDeleteUserRequest={(entry) => openReasonAction({ type: "deleteUser", user: entry })}
                  currentPage={currentUserPage}
                  totalPages={totalUserPages}
                  onPageChange={setUserPage}
                />
              </div>

              <div className="col-12" id="business-suspension">
                <BusinessSuspensionSection
                  loadingData={loadingData}
                  approvedSearch={approvedSearch}
                  setApprovedSearch={setApprovedSearch}
                  approvedCityFilter={approvedCityFilter}
                  setApprovedCityFilter={setApprovedCityFilter}
                  approvedCities={approvedCities}
                  rows={pagedApprovedBusinesses}
                  columns={approvedColumns}
                  busyKey={busyKey}
                  onSuspendRequest={(business) => openReasonAction({ type: "suspendBusiness", business })}
                  currentPage={currentApprovedPage}
                  totalPages={totalApprovedPages}
                  onPageChange={setApprovedPage}
                />
              </div>

              <div className="col-12 col-xl-5" id="system-info">
                <SystemInfoSection loadingData={loadingData} health={health} reports={reports} />
              </div>

              <div className="col-12 col-xl-7" id="categories">
                <CategoriesSection loadingData={loadingData} categories={categories} columns={categoryColumns} />
              </div>

              <div className="col-12" id="audit-logs">
                <AuditLogsSection
                  loadingData={loadingData}
                  auditSearch={auditSearch}
                  setAuditSearch={setAuditSearch}
                  auditActionFilter={auditActionFilter}
                  setAuditActionFilter={setAuditActionFilter}
                  auditActionOptions={auditActionOptions}
                  rows={pagedAuditLogs}
                  columns={auditColumns}
                  getTargetEmail={getTargetEmail}
                  formatDateTime={formatDateTime}
                  currentPage={currentAuditPage}
                  totalPages={totalAuditPages}
                  onPageChange={setAuditPage}
                />
              </div>
            </div>
          </main>
        </div>
      </div>

      <ConfirmModal
        isOpen={!!confirmAction}
        title={confirmAction?.type === "approve" ? "Approve Business" : "Reject Business"}
        message={
          confirmAction
            ? `${confirmAction.type === "approve" ? "Approve" : "Reject"} ${confirmAction.business.name}?`
            : ""
        }
        confirmLabel={confirmAction?.type === "approve" ? "Approve" : "Reject"}
        confirmVariant={confirmAction?.type === "approve" ? "primary" : "danger"}
        isLoading={busyKey !== null}
        onClose={() => setConfirmAction(null)}
        onConfirm={() => {
          void handleConfirmSubmit();
        }}
      />

      <ReasonModal
        isOpen={!!reasonAction}
        title={reasonModalConfig.title}
        reason={modalReason}
        reasonLabel="Reason (optional)"
        reasonPlaceholder="Add context for audit logs"
        confirmLabel={reasonModalConfig.confirmLabel}
        confirmVariant={reasonModalConfig.confirmVariant}
        isLoading={busyKey !== null}
        onReasonChange={setModalReason}
        onClose={closeReasonAction}
        onConfirm={() => {
          void handleReasonSubmit();
        }}
        extraFields={
          reasonAction?.type === "changeRole" ? (
            <div className="mb-2">
              <label className="form-label" htmlFor="rolePreviewInput">
                New role
              </label>
              <input
                id="rolePreviewInput"
                className="form-control"
                value={getRoleLabel(reasonAction.nextRole)}
                readOnly
                aria-label="Selected new role"
              />
            </div>
          ) : undefined
        }
      />

      <Toasts items={toasts} onClose={removeToast} />
    </div>
  );
}
