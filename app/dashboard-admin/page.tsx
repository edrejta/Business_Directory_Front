"use client";

import "./admin-theme.css";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { AdminUser } from "@/lib/api/admin";
import { useAuth } from "@/context/AuthContext";
import ConfirmModal from "@/components/admin/ConfirmModal";
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
import {
  APPROVED_COLUMNS,
  AUDIT_COLUMNS,
  CATEGORY_COLUMNS,
  PENDING_COLUMNS,
  USER_COLUMNS,
} from "./columns";
import {
  filterAuditLogs,
  filterBusinesses,
  filterUsers,
  deriveAuditActionOptions,
  deriveCities,
  buildKpiMetrics,
} from "./selectors";
import {
  ADMIN_ROLE,
  BUSINESS_ROLE,
  PAGE_SIZE,
  ROLE_OPTIONS,
  SIDEBAR_ITEMS,
  USER_ROLE,
} from "./constants";
import { clampPage, formatDateTime, getTotalPages, paginate } from "./utils";
import { useAdminDashboardData } from "./useAdminDashboardData";
import { useAdminActions } from "./useAdminActions";

export default function DashboardAdmin() {
  const { user, isLoading, logoutUser } = useAuth();
  const router = useRouter();

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
    sectionError,
    setSectionError,
    refreshDashboard,
    refreshUsers,
    refreshPendingBusinesses,
    refreshApprovedBusinesses,
    refreshAuditLogs,
  } = useAdminDashboardData({
    isLoadingAuth: isLoading,
    userRole: user?.role,
  });

  const {
    busyKey,
    confirmAction,
    setConfirmAction,
    reasonAction,
    modalReason,
    setModalReason,
    openReasonAction,
    closeReasonAction,
    handleConfirmSubmit,
    handleReasonSubmit,
    reasonModalConfig,
  } = useAdminActions({
    setSectionError,
    refreshDashboard,
    refreshUsers,
    refreshPendingBusinesses,
    refreshApprovedBusinesses,
    refreshAuditLogs,
  });

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

  const setUserSearchWithReset: Dispatch<SetStateAction<string>> = (value) => {
    setUserSearch(value);
    setUserPage(1);
  };
  const setUserRoleFilterWithReset: Dispatch<SetStateAction<string>> = (value) => {
    setUserRoleFilter(value);
    setUserPage(1);
  };
  const setPendingSearchWithReset: Dispatch<SetStateAction<string>> = (value) => {
    setPendingSearch(value);
    setPendingPage(1);
  };
  const setPendingCityFilterWithReset: Dispatch<SetStateAction<string>> = (value) => {
    setPendingCityFilter(value);
    setPendingPage(1);
  };
  const setApprovedSearchWithReset: Dispatch<SetStateAction<string>> = (value) => {
    setApprovedSearch(value);
    setApprovedPage(1);
  };
  const setApprovedCityFilterWithReset: Dispatch<SetStateAction<string>> = (value) => {
    setApprovedCityFilter(value);
    setApprovedPage(1);
  };
  const setAuditSearchWithReset: Dispatch<SetStateAction<string>> = (value) => {
    setAuditSearch(value);
    setAuditPage(1);
  };
  const setAuditActionFilterWithReset: Dispatch<SetStateAction<string>> = (value) => {
    setAuditActionFilter(value);
    setAuditPage(1);
  };

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

  const getRoleLabel = (value: number) => {
    return ROLE_OPTIONS.find((role) => role.value === value)?.label ?? String(value);
  };

  const isAdminAccount = (account: AdminUser) => account.role === ADMIN_ROLE;

  const userEmailById = useMemo(() => {
    return new Map(users.map((entry) => [entry.id, entry.email]));
  }, [users]);

  const getTargetEmail = (targetUserId?: string) => {
    if (!targetUserId) return "-";
    return userEmailById.get(targetUserId) ?? "-";
  };

  const filteredUsers = useMemo(() => filterUsers(users, userRoleFilter, userSearch), [users, userRoleFilter, userSearch]);

  const pendingCities = useMemo(() => deriveCities(pendingBusinesses), [pendingBusinesses]);
  const filteredPendingBusinesses = useMemo(
    () => filterBusinesses(pendingBusinesses, pendingCityFilter, pendingSearch),
    [pendingBusinesses, pendingCityFilter, pendingSearch],
  );

  const approvedCities = useMemo(() => deriveCities(approvedBusinesses), [approvedBusinesses]);
  const filteredApprovedBusinesses = useMemo(
    () => filterBusinesses(approvedBusinesses, approvedCityFilter, approvedSearch),
    [approvedBusinesses, approvedCityFilter, approvedSearch],
  );

  const auditActionOptions = useMemo(() => deriveAuditActionOptions(auditLogs), [auditLogs]);
  const filteredAuditLogs = useMemo(
    () => filterAuditLogs(auditLogs, auditActionFilter, auditSearch, userEmailById),
    [auditLogs, auditActionFilter, auditSearch, userEmailById],
  );

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

  const { totalBusinessesKpi, pendingBusinessesKpi, approvedBusinessesKpi, totalUsersKpi, toKpiProgress } =
    useMemo(() => buildKpiMetrics(dashboard, pendingBusinesses, approvedBusinesses, users), [
      dashboard,
      pendingBusinesses,
      approvedBusinesses,
      users,
    ]);

  const kpiSkeletonCardClass =
    "h-full rounded-2xl border border-[var(--coffee-border)] bg-[var(--coffee-surface)] p-5 shadow-sm";
  const kpiSkeletonCount = 4;

  if (isLoading || !user) return null;

  return (
    <div className="admin-coffee min-h-screen bg-[var(--coffee-bg)] text-[var(--coffee-text)]">
      <div className="admin-layout-shell flex">
        <SidebarNav items={SIDEBAR_ITEMS} />

        <div className="admin-main-shell min-w-0 flex-1">
          <TopNav
            username={user.username}
            roleLabel={getRoleLabel(user.role)}
            homeHref="/"
            roleHref="/dashboard-admin"
            onLogout={logoutUser}
          />

          <main className="min-w-0 px-3 py-4 lg:px-8 lg:py-8">
            {error && (
              <div className="mb-3 rounded-xl border border-red-400/60 bg-red-100 px-3 py-2 text-sm text-red-900">{error}</div>
            )}
            {sectionError && (
              <div className="mb-3 rounded-xl border border-amber-400/60 bg-amber-100 px-3 py-2 text-sm text-amber-900">
                {sectionError}
              </div>
            )}

            <section id="kpi-cards" className="mb-5">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {loadingData ? (
                  <>
                    {Array.from({ length: kpiSkeletonCount }).map((_, index) => (
                      <div className={kpiSkeletonCardClass} key={`kpi-skeleton-${index}`}>
                        <div className="h-4 w-2/3 animate-pulse rounded bg-[var(--coffee-border)]" />
                        <div className="mt-4 h-8 w-1/2 animate-pulse rounded bg-[var(--coffee-border)]" />
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    <KpiCard
                      title="Total Businesses"
                      value={totalBusinessesKpi}
                      tone="primary"
                      progress={toKpiProgress(totalBusinessesKpi)}
                    />
                    <KpiCard
                      title="Pending Businesses"
                      value={pendingBusinessesKpi}
                      tone="warning"
                      progress={toKpiProgress(pendingBusinessesKpi)}
                    />
                    <KpiCard
                      title="Approved Businesses"
                      value={approvedBusinessesKpi}
                      tone="success"
                      progress={toKpiProgress(approvedBusinessesKpi)}
                    />
                    <KpiCard title="Total Users" value={totalUsersKpi} tone="info" progress={toKpiProgress(totalUsersKpi)} />
                  </>
                )}
              </div>
            </section>

            <div className="min-w-0 grid gap-5">
              <div id="pending-review" className="min-w-0">
                <PendingReviewSection
                  loadingData={loadingData}
                  filteredCount={filteredPendingBusinesses.length}
                  pendingSearch={pendingSearch}
                  setPendingSearch={setPendingSearchWithReset}
                  pendingCityFilter={pendingCityFilter}
                  setPendingCityFilter={setPendingCityFilterWithReset}
                  pendingCities={pendingCities}
                  rows={pagedPendingBusinesses}
                  columns={PENDING_COLUMNS}
                  busyKey={busyKey}
                  onApproveRequest={(business) => setConfirmAction({ type: "approve", business })}
                  onDeleteRequest={(business) => setConfirmAction({ type: "deleteBusiness", business })}
                  currentPage={currentPendingPage}
                  totalPages={totalPendingPages}
                  onPageChange={setPendingPage}
                  formatDateTime={formatDateTime}
                />
              </div>

              <div id="role-management" className="min-w-0">
                <RoleManagementSection
                  loadingData={loadingData}
                  userSearch={userSearch}
                  setUserSearch={setUserSearchWithReset}
                  userRoleFilter={userRoleFilter}
                  setUserRoleFilter={setUserRoleFilterWithReset}
                  adminRole={ADMIN_ROLE}
                  roleOptions={ROLE_OPTIONS}
                  rows={pagedUsers}
                  columns={USER_COLUMNS}
                  busyKey={busyKey}
                  getRoleLabel={getRoleLabel}
                  isAdminAccount={isAdminAccount}
                  onChangeRoleRequest={(entry, nextRole) => openReasonAction({ type: "changeRole", user: entry, nextRole })}
                  onDeleteUserRequest={(entry) => openReasonAction({ type: "deleteUser", user: entry })}
                  currentPage={currentUserPage}
                  totalPages={totalUserPages}
                  onPageChange={setUserPage}
                />
              </div>

              <div id="business-suspension" className="min-w-0">
                <BusinessSuspensionSection
                  loadingData={loadingData}
                  approvedSearch={approvedSearch}
                  setApprovedSearch={setApprovedSearchWithReset}
                  approvedCityFilter={approvedCityFilter}
                  setApprovedCityFilter={setApprovedCityFilterWithReset}
                  approvedCities={approvedCities}
                  rows={pagedApprovedBusinesses}
                  columns={APPROVED_COLUMNS}
                  busyKey={busyKey}
                  onSuspendRequest={(business) => openReasonAction({ type: "suspendBusiness", business })}
                  currentPage={currentApprovedPage}
                  totalPages={totalApprovedPages}
                  onPageChange={setApprovedPage}
                />
              </div>

              <div className="min-w-0 grid gap-5 xl:grid-cols-12">
                <div id="system-info" className="min-w-0 xl:col-span-5">
                  <SystemInfoSection loadingData={loadingData} health={health} reports={reports} />
                </div>

                <div id="categories" className="min-w-0 xl:col-span-7">
                  <CategoriesSection loadingData={loadingData} categories={categories} columns={CATEGORY_COLUMNS} />
                </div>
              </div>

              <div id="audit-logs" className="min-w-0">
                <AuditLogsSection
                  loadingData={loadingData}
                  auditSearch={auditSearch}
                  setAuditSearch={setAuditSearchWithReset}
                  auditActionFilter={auditActionFilter}
                  setAuditActionFilter={setAuditActionFilterWithReset}
                  auditActionOptions={auditActionOptions}
                  rows={pagedAuditLogs}
                  columns={AUDIT_COLUMNS}
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
        title={confirmAction?.type === "approve" ? "Approve Business" : "Delete Pending Business"}
        message={
          confirmAction
            ? `${confirmAction.type === "approve" ? "Approve" : "Delete"} ${confirmAction.business.name}?`
            : ""
        }
        confirmLabel={confirmAction?.type === "approve" ? "Approve" : "Delete"}
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
            <div className="space-y-1">
              <label className="block text-sm font-medium" htmlFor="rolePreviewInput">
                New role
              </label>
              <input
                id="rolePreviewInput"
                className="w-full rounded-md border border-[var(--coffee-border)] bg-[var(--coffee-bg)] px-3 py-2 text-sm text-[var(--coffee-text)] shadow-sm outline-none"
                value={getRoleLabel(reasonAction.nextRole)}
                readOnly
                aria-label="Selected new role"
              />
            </div>
          ) : undefined
        }
      />
    </div>
  );
}
