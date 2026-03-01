"use client";

import { Fragment } from "react";
import type { HealthStatus, ReportSummary } from "@/lib/api/admin";
import SectionCard from "@/components/admin/SectionCard";

type SystemInfoSectionProps = {
  loadingData: boolean;
  health: HealthStatus | null;
  reports: ReportSummary | null;
};

const data = [
  { key: "health", label: "Health" },
  { key: "timestamp", label: "Timestamp" },
  { key: "version", label: "Version" },
  { key: "openReports", label: "Reports Open" },
] as const;

export default function SystemInfoSection({ loadingData, health, reports }: SystemInfoSectionProps) {
  return (
    <SectionCard title="System Info" subtitle="Service health and report status">
      {loadingData ? (
        <div className="flex items-center gap-2 text-sm text-[var(--coffee-muted)]">
          <span
            className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[var(--coffee-border)] border-t-[var(--coffee-primary)]"
            role="status"
            aria-hidden="true"
          />
          Loading system status...
        </div>
      ) : (
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
          {data.map((entry) => (
            <Fragment key={entry.key}>
              <dt className="text-[var(--coffee-muted)]">{entry.label}</dt>
              <dd className="font-medium">
                {entry.key === "health" && (health?.status ?? "unknown")}
                {entry.key === "timestamp" && (health?.timestamp ?? "-")}
                {entry.key === "version" && (health?.version ?? "-")}
                {entry.key === "openReports" && (reports?.openReports ?? 0)}
              </dd>
            </Fragment>
          ))}
        </dl>
      )}
    </SectionCard>
  );
}
