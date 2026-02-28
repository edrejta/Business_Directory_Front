"use client";

import type { Dispatch, SetStateAction } from "react";
import type { AdminUser } from "@/lib/api/admin";
import ActionDropdown, { type DropdownAction } from "@/components/admin/ActionDropdown";
import DataTable, { type DataColumn } from "@/components/admin/DataTable";
import PaginationControls from "@/components/admin/PaginationControls";
import SectionCard from "@/components/admin/SectionCard";

type RoleOption = {
  value: number;
  label: string;
};

type RoleManagementSectionProps = {
  loadingData: boolean;
  userSearch: string;
  setUserSearch: Dispatch<SetStateAction<string>>;
  userRoleFilter: string;
  setUserRoleFilter: Dispatch<SetStateAction<string>>;
  adminRole: number;
  roleOptions: readonly RoleOption[];
  rows: AdminUser[];
  columns: DataColumn[];
  busyKey: string | null;
  getRoleLabel: (value: number) => string;
  isAdminAccount: (user: AdminUser) => boolean;
  onChangeRoleRequest: (user: AdminUser, nextRole: number) => void;
  onDeleteUserRequest: (user: AdminUser) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const controlClass =
  "w-full rounded-md border border-[var(--coffee-border)] bg-[var(--coffee-bg)] px-3 py-2 text-sm text-[var(--coffee-text)] shadow-sm outline-none transition focus:border-[var(--coffee-primary)] focus:ring-2 focus:ring-[var(--coffee-primary)]/30";

export default function RoleManagementSection({
  loadingData,
  userSearch,
  setUserSearch,
  userRoleFilter,
  setUserRoleFilter,
  adminRole,
  roleOptions,
  rows,
  columns,
  busyKey,
  getRoleLabel,
  isAdminAccount,
  onChangeRoleRequest,
  onDeleteUserRequest,
  currentPage,
  totalPages,
  onPageChange,
}: RoleManagementSectionProps) {
  return (
    <SectionCard title="Role Management" subtitle="Change user role and delete users (optional reason)">
      <div className="mb-3 grid gap-2 md:grid-cols-12">
        <div className="md:col-span-6">
          <input
            className={controlClass}
            placeholder="Search users by username or email"
            value={userSearch}
            onChange={(event) => setUserSearch(event.target.value)}
            aria-label="Search users"
          />
        </div>

        <div className="md:col-span-4">
          <select
            className={controlClass}
            value={userRoleFilter}
            onChange={(event) => setUserRoleFilter(event.target.value)}
            aria-label="Filter users by role"
          >
            <option value="all">All roles</option>
            {roleOptions.map((role) => (
              <option key={role.value} value={String(role.value)}>
                {role.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <DataTable columns={columns} loading={loadingData} empty={rows.length === 0} emptyMessage="No users found.">
        {rows.map((entry) => {
          const currentRole = entry.role;
          const protectedAdmin = isAdminAccount(entry);

          const roleActions: DropdownAction[] = roleOptions.map((role) => {
            const cannotDowngradeAdmin = protectedAdmin && role.value !== adminRole;
            const isSameRole = role.value === currentRole;

            return {
              key: `role-${role.value}`,
              label: `Set ${role.label}`,
              disabled: cannotDowngradeAdmin || isSameRole || busyKey === `role-${entry.id}`,
              onClick: () => onChangeRoleRequest(entry, role.value),
            };
          });

          const actions: DropdownAction[] = [
            ...roleActions,
            {
              key: "delete",
              label: "Delete user",
              danger: true,
              disabled: protectedAdmin || busyKey === `delete-${entry.id}`,
              onClick: () => onDeleteUserRequest(entry),
            },
          ];

          return (
            <tr key={entry.id} className="border-t border-[var(--coffee-border)]">
              <td className="px-3 py-2">
                {entry.username ?? entry.fullName ?? "-"}
                {protectedAdmin && (
                  <span className="ml-2 rounded-full border border-[var(--coffee-text)]/30 bg-[var(--coffee-text)] px-2 py-1 text-xs font-semibold text-[var(--coffee-bg)]">
                    Protected Admin
                  </span>
                )}
              </td>
              <td className="px-3 py-2">{entry.email}</td>
              <td className="px-3 py-2">
                <span
                  className={`rounded-full border px-2 py-1 text-xs font-semibold ${
                    currentRole === adminRole
                      ? "border-[var(--coffee-text)]/30 bg-[var(--coffee-text)] text-[var(--coffee-bg)]"
                      : "border-[var(--coffee-border)] bg-[var(--coffee-border)] text-[var(--coffee-text)]"
                  }`}
                >
                  {getRoleLabel(entry.role)}
                </span>
              </td>
              <td className="px-3 py-2 text-right">
                <ActionDropdown id={`user-${entry.id}`} actions={actions} />
              </td>
            </tr>
          );
        })}
      </DataTable>

      <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} label="Users pages" />
    </SectionCard>
  );
}
