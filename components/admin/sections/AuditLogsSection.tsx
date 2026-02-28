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

const controlClass =
  "w-full rounded-md border border-[var(--coffee-border)] bg-[var(--coffee-bg)] px-3 py-2 text-sm text-[var(--coffee-text)] shadow-sm outline-none transition focus:border-[var(--coffee-primary)] focus:ring-2 focus:ring-[var(--coffee-primary)]/30";

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
      <div className="mb-3 grid gap-2 md:grid-cols-12">
        <div className="md:col-span-5">
          <input
            className={controlClass}
            placeholder="Search audit logs"
            value={auditSearch}
            onChange={(event) => setAuditSearch(event.target.value)}
            aria-label="Search audit logs"
          />
        </div>

        <div className="md:col-span-4">
          <select
            className={controlClass}
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
          <tr key={entry.id} className="border-t border-[var(--coffee-border)]">
            <td className="px-3 py-2">{entry.action ?? "-"}</td>
            <td className="whitespace-nowrap px-3 py-2">{getTargetEmail(entry.targetUserId)}</td>
            <td className="px-3 py-2">{entry.reason ?? "-"}</td>
            <td className="whitespace-nowrap px-3 py-2">{entry.id}</td>
            <td className="px-3 py-2">{formatDateTime(entry.createdAt)}</td>
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
