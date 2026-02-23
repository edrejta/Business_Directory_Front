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
      <div className="row g-2 mb-3">
        <div className="col-12 col-md-6">
          <input
            className="form-control"
            placeholder="Search approved businesses"
            value={approvedSearch}
            onChange={(event) => setApprovedSearch(event.target.value)}
            aria-label="Search approved businesses"
          />
        </div>
        <div className="col-12 col-md-4">
          <select
            className="form-select"
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
              key: "suspend",
              label: "Suspend",
              danger: true,
              disabled: busyKey === `suspend-${business.id}`,
              onClick: () => onSuspendRequest(business),
            },
          ];

          return (
            <tr key={business.id}>
              <td>{business.name}</td>
              <td>{business.city ?? "-"}</td>
              <td>{business.businessType ?? "-"}</td>
              <td>
                <span className="badge text-bg-success">Approved</span>
              </td>
              <td className="text-end">
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
