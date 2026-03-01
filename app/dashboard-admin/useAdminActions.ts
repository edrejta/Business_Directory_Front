import { useMemo, useState } from "react";
import {
  approveAdminBusiness,
  deleteAdminBusiness,
  deleteAdminUser,
  suspendAdminBusiness,
  updateAdminUserRole,
  type AdminBusiness,
  type AdminUser,
} from "@/lib/api/admin";
import { ADMIN_ROLE } from "./constants";

export type ConfirmAction =
  | { type: "approve"; business: AdminBusiness }
  | { type: "deleteBusiness"; business: AdminBusiness };

export type ReasonAction =
  | { type: "changeRole"; user: AdminUser; nextRole: number }
  | { type: "deleteUser"; user: AdminUser }
  | { type: "suspendBusiness"; business: AdminBusiness };

export type ReasonModalConfig = {
  title: string;
  confirmLabel: string;
  confirmVariant: "primary" | "danger" | "warning";
};

type RefreshAction = () => Promise<void>;

type UseAdminActionsParams = {
  setSectionError: (value: string | null) => void;
  refreshDashboard: RefreshAction;
  refreshUsers: RefreshAction;
  refreshPendingBusinesses: RefreshAction;
  refreshApprovedBusinesses: RefreshAction;
  refreshAuditLogs: RefreshAction;
};

type AdminActionOptions = {
  key: string;
  request: () => Promise<unknown>;
  refresh?: RefreshAction[];
  failureMessage: string;
};

function getReasonModalConfig(action: ReasonAction | null): ReasonModalConfig {
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
}

export function useAdminActions({
  setSectionError,
  refreshDashboard,
  refreshUsers,
  refreshPendingBusinesses,
  refreshApprovedBusinesses,
  refreshAuditLogs,
}: UseAdminActionsParams) {
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const [reasonAction, setReasonAction] = useState<ReasonAction | null>(null);
  const [modalReason, setModalReason] = useState("");

  const runAdminAction = async ({ key, request, refresh = [], failureMessage }: AdminActionOptions) => {
    setBusyKey(key);
    setSectionError(null);

    try {
      await request();
      if (refresh.length > 0) {
        await Promise.all(refresh.map((step) => step()));
      }
    } catch (err) {
      setSectionError(err instanceof Error ? err.message : failureMessage);
    } finally {
      setBusyKey(null);
    }
  };

  const runApproveBusiness = async (business: AdminBusiness) => {
    await runAdminAction({
      key: `approve-${business.id}`,
      request: () => approveAdminBusiness(business.id),
      refresh: [refreshPendingBusinesses, refreshDashboard],
      failureMessage: "Approve failed.",
    });
  };

  const runDeletePendingBusiness = async (business: AdminBusiness) => {
    await runAdminAction({
      key: `delete-pending-${business.id}`,
      request: () => deleteAdminBusiness(business.id),
      refresh: [refreshPendingBusinesses, refreshDashboard],
      failureMessage: "Delete failed.",
    });
  };

  const runChangeRole = async (targetUser: AdminUser, nextRole: number, reason?: string) => {
    if (targetUser.role === ADMIN_ROLE && nextRole !== ADMIN_ROLE) {
      setSectionError("Admin accounts cannot be downgraded from this panel.");
      return;
    }

    await runAdminAction({
      key: `role-${targetUser.id}`,
      request: () => updateAdminUserRole(targetUser.id, nextRole, reason),
      refresh: [refreshUsers, refreshAuditLogs],
      failureMessage: "Role update failed.",
    });
  };

  const runDeleteUser = async (targetUser: AdminUser, reason?: string) => {
    if (targetUser.role === ADMIN_ROLE) {
      setSectionError("Admin accounts cannot be deleted from this panel.");
      return;
    }

    await runAdminAction({
      key: `delete-${targetUser.id}`,
      request: () => deleteAdminUser(targetUser.id, reason),
      refresh: [refreshUsers, refreshDashboard, refreshAuditLogs],
      failureMessage: "User delete failed.",
    });
  };

  const runSuspendBusiness = async (business: AdminBusiness, reason?: string) => {
    await runAdminAction({
      key: `suspend-${business.id}`,
      request: () => suspendAdminBusiness(business.id, reason),
      refresh: [refreshApprovedBusinesses, refreshDashboard, refreshAuditLogs],
      failureMessage: "Suspend failed.",
    });
  };

  const openReasonAction = (action: ReasonAction) => {
    setModalReason("");
    setReasonAction(action);
  };

  const closeReasonAction = () => {
    setReasonAction(null);
    setModalReason("");
  };

  const handleConfirmSubmit = async () => {
    if (!confirmAction) return;

    if (confirmAction.type === "approve") {
      await runApproveBusiness(confirmAction.business);
    }
    if (confirmAction.type === "deleteBusiness") {
      await runDeletePendingBusiness(confirmAction.business);
    }

    setConfirmAction(null);
  };

  const handleReasonSubmit = async () => {
    if (!reasonAction) return;

    if (reasonAction.type === "deleteUser" && modalReason.trim().length === 0) {
      setSectionError("Please provide a reason before deleting a user.");
      return;
    }

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

  const reasonModalConfig = useMemo(() => getReasonModalConfig(reasonAction), [reasonAction]);

  return {
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
  };
}
