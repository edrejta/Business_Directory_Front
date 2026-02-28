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
      actions={<span className="badge text-bg-warning">{filteredCount} pending</span>}
    >
      <div className="row g-2 mb-3">
        <div className="col-12 col-md-6">
          <input
            className="form-control"
            placeholder="Search pending businesses"
            value={pendingSearch}
            onChange={(event) => setPendingSearch(event.target.value)}
            aria-label="Search pending businesses"
          />
        </div>
        <div className="col-12 col-md-4">
          <select
            className="form-select"
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
            <tr key={business.id}>
              <td>{business.name}</td>
              <td>{business.city ?? "-"}</td>
              <td>{business.businessType ?? "-"}</td>
              <td>{formatDateTime(business.createdAt)}</td>
              <td>
                <span className="badge text-bg-warning">Pending</span>
              </td>
              <td className="text-end">
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
