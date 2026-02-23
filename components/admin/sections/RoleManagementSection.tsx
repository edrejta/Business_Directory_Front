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
  roleOptions: readonly RoleOption[];
  rows: AdminUser[];
  columns: DataColumn[];
  busyKey: string | null;
  getRoleValue: (value: number | string) => number;
  getRoleLabel: (value: number | string) => string;
  isAdminAccount: (user: AdminUser) => boolean;
  onChangeRoleRequest: (user: AdminUser, nextRole: number) => void;
  onDeleteUserRequest: (user: AdminUser) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function RoleManagementSection({
  loadingData,
  userSearch,
  setUserSearch,
  userRoleFilter,
  setUserRoleFilter,
  roleOptions,
  rows,
  columns,
  busyKey,
  getRoleValue,
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
      <div className="row g-2 mb-3">
        <div className="col-12 col-md-6">
          <input
            className="form-control"
            placeholder="Search users by username or email"
            value={userSearch}
            onChange={(event) => setUserSearch(event.target.value)}
            aria-label="Search users"
          />
        </div>
        <div className="col-12 col-md-4">
          <select
            className="form-select"
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
          const currentRole = getRoleValue(entry.role);
          const protectedAdmin = isAdminAccount(entry);

          const roleActions: DropdownAction[] = roleOptions.map((role) => {
            const cannotDowngradeAdmin = protectedAdmin && role.value !== 2;
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
            <tr key={entry.id}>
              <td>
                {entry.username ?? entry.fullName ?? "-"}
                {protectedAdmin && <span className="badge text-bg-dark ms-2">Protected Admin</span>}
              </td>
              <td>{entry.email}</td>
              <td>
                <span className={`badge ${currentRole === 2 ? "text-bg-dark" : "text-bg-secondary"}`}>
                  {getRoleLabel(entry.role)}
                </span>
              </td>
              <td className="text-end">
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
