"use client";

import { type CSSProperties, type ReactNode } from "react";

export type DataColumn = {
  key: string;
  label: string;
  className?: string;
};

type DataTableProps = {
  columns: DataColumn[];
  children: ReactNode;
  loading?: boolean;
  empty?: boolean;
  emptyMessage?: string;
};

function normalizeClassName(value?: string) {
  if (!value) return "";

  return value
    .replace(/\btext-end\b/g, "text-right")
    .replace(/\btext-nowrap\b/g, "whitespace-nowrap");
}

export default function DataTable({
  columns,
  children,
  loading = false,
  empty = false,
  emptyMessage = "No rows found.",
}: DataTableProps) {
  const mobileMinTableWidth = columns.length > 3 ? columns.length * 160 : 0;
  const tableStyle: CSSProperties | undefined =
    mobileMinTableWidth > 0
      ? ({
          "--admin-mobile-table-min-width": `${mobileMinTableWidth}px`,
        } as CSSProperties)
      : undefined;

  return (
    <div
      className="admin-table-scroll w-full overflow-x-scroll overflow-y-hidden rounded-xl border border-[var(--coffee-border)] md:overflow-x-auto"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      <table
        className="admin-mobile-scroll-table min-w-full text-sm text-[var(--coffee-text)]"
        style={{ ...tableStyle, minWidth: mobileMinTableWidth > 0 ? `${mobileMinTableWidth}px` : undefined }}
      >
        <thead className="bg-[var(--coffee-border)]/70 text-left text-xs uppercase tracking-wide text-[var(--coffee-text)]/80">
          <tr>
            {columns.map((column) => (
              <th scope="col" key={column.key} className={`px-3 py-2 font-semibold ${normalizeClassName(column.className)}`}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {loading &&
            Array.from({ length: 5 }).map((_, index) => (
              <tr key={`loading-${index}`} className="border-t border-[var(--coffee-border)]">
                <td colSpan={columns.length} className="px-3 py-3">
                  <div className="h-4 w-full animate-pulse rounded bg-[var(--coffee-border)]" />
                </td>
              </tr>
            ))}

          {!loading && !empty && children}

          {!loading && empty && (
            <tr className="border-t border-[var(--coffee-border)]">
              <td colSpan={columns.length} className="px-3 py-6 text-center text-[var(--coffee-muted)]">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
