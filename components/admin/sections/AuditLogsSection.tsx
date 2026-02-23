"use client";

import type { Dispatch, SetStateAction } from "react";
import type { AuditLog } from "@/lib/api/admin";
import DataTable, { type DataColumn } from "@/components/admin/DataTable";
import PaginationControls from "@/components/admin/PaginationControls";
import SectionCard from "@/components/admin/SectionCard";

type AuditLogsSectionProps = {
  loadingData: boolean;
  auditSearch: string;
  setAuditSearch: Dispatch<SetStateAction<string>>;
  auditActionFilter: string;
  setAuditActionFilter: Dispatch<SetStateAction<string>>;
  auditActionOptions: string[];
  rows: AuditLog[];
  columns: DataColumn[];
  getTargetEmail: (targetUserId?: string) => string;
  formatDateTime: (value?: string) => string;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function AuditLogsSection({
  loadingData,
  auditSearch,
  setAuditSearch,
  auditActionFilter,
  setAuditActionFilter,
  auditActionOptions,
  rows,
  columns,
  getTargetEmail,
  formatDateTime,
  currentPage,
  totalPages,
  onPageChange,
}: AuditLogsSectionProps) {
  return (
    <SectionCard title="Recent Audit Logs" subtitle="Role changes, deletions, and business moderation logs">
      <div className="row g-2 mb-3">
        <div className="col-12 col-md-5">
          <input
            className="form-control"
            placeholder="Search audit logs"
            value={auditSearch}
            onChange={(event) => setAuditSearch(event.target.value)}
            aria-label="Search audit logs"
          />
        </div>
        <div className="col-12 col-md-4">
          <select
            className="form-select"
            value={auditActionFilter}
            onChange={(event) => setAuditActionFilter(event.target.value)}
            aria-label="Filter logs by action"
          >
            <option value="all">All actions</option>
            {auditActionOptions.map((action) => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </select>
        </div>
      </div>

      <DataTable columns={columns} loading={loadingData} empty={rows.length === 0} emptyMessage="No audit logs found.">
        {rows.map((entry) => (
          <tr key={entry.id}>
            <td>{entry.action ?? "-"}</td>
            <td>{getTargetEmail(entry.targetUserId)}</td>
            <td>{entry.reason ?? "-"}</td>
            <td>{entry.targetUserId ?? entry.id}</td>
            <td>{formatDateTime(entry.createdAt)}</td>
          </tr>
        ))}
      </DataTable>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        label="Audit logs pages"
      />
    </SectionCard>
  );
}
