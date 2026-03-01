"use client";

import type { Dispatch, SetStateAction } from "react";
import type { AdminBusiness } from "@/lib/api/admin";
import ActionDropdown, { type DropdownAction } from "@/components/admin/ActionDropdown";
import DataTable, { type DataColumn } from "@/components/admin/DataTable";
import PaginationControls from "@/components/admin/PaginationControls";
import SectionCard from "@/components/admin/SectionCard";

type PendingReviewSectionProps = {
  loadingData: boolean;
  filteredCount: number;
  pendingSearch: string;
  setPendingSearch: Dispatch<SetStateAction<string>>;
  pendingCityFilter: string;
  setPendingCityFilter: Dispatch<SetStateAction<string>>;
  pendingCities: string[];
  rows: AdminBusiness[];
  columns: DataColumn[];
  busyKey: string | null;
  onApproveRequest: (business: AdminBusiness) => void;
  onDeleteRequest: (business: AdminBusiness) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  formatDateTime: (value?: string) => string;
};

const controlClass =
  "w-full rounded-md border border-[var(--coffee-border)] bg-[var(--coffee-bg)] px-3 py-2 text-sm text-[var(--coffee-text)] shadow-sm outline-none transition focus:border-[var(--coffee-primary)] focus:ring-2 focus:ring-[var(--coffee-primary)]/30";

export default function PendingReviewSection({
  loadingData,
  filteredCount,
  pendingSearch,
  setPendingSearch,
  pendingCityFilter,
  setPendingCityFilter,
  pendingCities,
  rows,
  columns,
  busyKey,
  onApproveRequest,
  onDeleteRequest,
  currentPage,
  totalPages,
  onPageChange,
  formatDateTime,
}: PendingReviewSectionProps) {
  return (
    <SectionCard
      title="Pending Review Inbox"
      subtitle="Approve or permanently delete pending businesses"
      actions={
        <span className="rounded-full border border-amber-700/30 bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-900">
          {filteredCount} pending
        </span>
      }
    >
      <div className="mb-3 grid gap-2 md:grid-cols-12">
        <div className="md:col-span-6">
          <input
            className={controlClass}
            placeholder="Search pending businesses"
            value={pendingSearch}
            onChange={(event) => setPendingSearch(event.target.value)}
            aria-label="Search pending businesses"
          />
        </div>

        <div className="md:col-span-4">
          <select
            className={controlClass}
            value={pendingCityFilter}
            onChange={(event) => setPendingCityFilter(event.target.value)}
            aria-label="Filter pending businesses by city"
          >
            <option value="all">All cities</option>
            {pendingCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>

      <DataTable columns={columns} loading={loadingData} empty={rows.length === 0} emptyMessage="No pending businesses found.">
        {rows.map((business) => {
          const actions: DropdownAction[] = [
            {
              key: "preview",
              label: "Preview",
              onClick: () => {
                window.location.assign(`/dashboard-admin/business-preview/${business.id}`);
              },
            },
            
            {
              key: "approve",
              label: "Approve",
              onClick: () => onApproveRequest(business),
              disabled: busyKey === `approve-${business.id}`,
            },
            {
              key: "delete",
              label: "Delete Permanently",
              onClick: () => onDeleteRequest(business),
              disabled: busyKey === `delete-pending-${business.id}`,
              danger: true,
            },
          ];

          return (
            <tr key={business.id} className="border-t border-[var(--coffee-border)]">
              <td className="px-3 py-2">{business.name}</td>
              <td className="px-3 py-2">{business.city ?? "-"}</td>
              <td className="px-3 py-2">{business.businessType ?? "-"}</td>
              <td className="px-3 py-2">{formatDateTime(business.createdAt)}</td>
              <td className="px-3 py-2">
                <span className="rounded-full border border-amber-700/30 bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-900">
                  Pending
                </span>
              </td>
              <td className="px-3 py-2 text-right">
                <ActionDropdown id={`pending-${business.id}`} actions={actions} />
              </td>
            </tr>
          );
        })}
      </DataTable>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        label="Pending businesses pages"
      />
    </SectionCard>
  );
}
