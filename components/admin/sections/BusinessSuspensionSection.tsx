"use client";

import type { Dispatch, SetStateAction } from "react";
import type { AdminBusiness } from "@/lib/api/admin";
import ActionDropdown, { type DropdownAction } from "@/components/admin/ActionDropdown";
import DataTable, { type DataColumn } from "@/components/admin/DataTable";
import PaginationControls from "@/components/admin/PaginationControls";
import SectionCard from "@/components/admin/SectionCard";

type BusinessSuspensionSectionProps = {
  loadingData: boolean;
  approvedSearch: string;
  setApprovedSearch: Dispatch<SetStateAction<string>>;
  approvedCityFilter: string;
  setApprovedCityFilter: Dispatch<SetStateAction<string>>;
  approvedCities: string[];
  rows: AdminBusiness[];
  columns: DataColumn[];
  busyKey: string | null;
  onSuspendRequest: (business: AdminBusiness) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const controlClass =
  "w-full rounded-md border border-[var(--coffee-border)] bg-[var(--coffee-bg)] px-3 py-2 text-sm text-[var(--coffee-text)] shadow-sm outline-none transition focus:border-[var(--coffee-primary)] focus:ring-2 focus:ring-[var(--coffee-primary)]/30";

export default function BusinessSuspensionSection({
  loadingData,
  approvedSearch,
  setApprovedSearch,
  approvedCityFilter,
  setApprovedCityFilter,
  approvedCities,
  rows,
  columns,
  busyKey,
  onSuspendRequest,
  currentPage,
  totalPages,
  onPageChange,
}: BusinessSuspensionSectionProps) {
  return (
    <SectionCard title="Business Suspension" subtitle="Suspend approved businesses (optional reason)">
      <div className="mb-3 grid gap-2 md:grid-cols-12">
        <div className="md:col-span-6">
          <input
            className={controlClass}
            placeholder="Search approved businesses"
            value={approvedSearch}
            onChange={(event) => setApprovedSearch(event.target.value)}
            aria-label="Search approved businesses"
          />
        </div>

        <div className="md:col-span-4">
          <select
            className={controlClass}
            value={approvedCityFilter}
            onChange={(event) => setApprovedCityFilter(event.target.value)}
            aria-label="Filter approved businesses by city"
          >
            <option value="all">All cities</option>
            {approvedCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>

      <DataTable columns={columns} loading={loadingData} empty={rows.length === 0} emptyMessage="No approved businesses found.">
        {rows.map((business) => {
          const actions: DropdownAction[] = [
            {
              key: "view",
              label: "View",
              onClick: () => {
                window.location.assign(`/business/${business.id}`);
              },
            },
            {
              key: "suspend",
              label: "Suspend",
              danger: true,
              disabled: busyKey === `suspend-${business.id}`,
              onClick: () => onSuspendRequest(business),
            },
          ];

          return (
            <tr key={business.id} className="border-t border-[var(--coffee-border)]">
              <td className="px-3 py-2">{business.name}</td>
              <td className="px-3 py-2">{business.city ?? "-"}</td>
              <td className="px-3 py-2">{business.businessType ?? "-"}</td>
              <td className="px-3 py-2">
                <span className="rounded-full border border-emerald-700/30 bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-900">
                  Approved
                </span>
              </td>
              <td className="px-3 py-2 text-right">
                <ActionDropdown id={`approved-${business.id}`} actions={actions} />
              </td>
            </tr>
          );
        })}
      </DataTable>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        label="Approved businesses pages"
      />
    </SectionCard>
  );
}
