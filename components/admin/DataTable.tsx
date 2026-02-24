"use client";

import { type ReactNode } from "react";

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

export default function DataTable({ columns, children, loading = false, empty = false, emptyMessage = "No rows found." }: DataTableProps) {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light">
          <tr>
            {columns.map((column) => (
              <th scope="col" key={column.key} className={column.className}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading &&
            Array.from({ length: 5 }).map((_, index) => (
              <tr key={`loading-${index}`}>
                <td colSpan={columns.length}>
                  <div className="placeholder-glow">
                    <span className="placeholder col-12" />
                  </div>
                </td>
              </tr>
            ))}
          {!loading && !empty && children}
          {!loading && empty && (
            <tr>
              <td colSpan={columns.length} className="text-center text-muted py-4">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
