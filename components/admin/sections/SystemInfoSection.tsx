"use client";

import type { HealthStatus, ReportSummary } from "@/lib/api/admin";
import SectionCard from "@/components/admin/SectionCard";

type SystemInfoSectionProps = {
  loadingData: boolean;
  health: HealthStatus | null;
  reports: ReportSummary | null;
};

export default function SystemInfoSection({ loadingData, health, reports }: SystemInfoSectionProps) {
  return (
    <SectionCard title="System Info" subtitle="Service health and report status">
      {loadingData ? (
        <div className="d-flex align-items-center gap-2 text-muted">
          <div className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
          Loading system status...
        </div>
      ) : (
        <dl className="row mb-0">
          <dt className="col-5 text-muted">Health</dt>
          <dd className="col-7 fw-semibold">{health?.status ?? "unknown"}</dd>
          <dt className="col-5 text-muted">Timestamp</dt>
          <dd className="col-7">{health?.timestamp ?? "-"}</dd>
          <dt className="col-5 text-muted">Version</dt>
          <dd className="col-7">{health?.version ?? "-"}</dd>
          <dt className="col-5 text-muted">Reports Open</dt>
          <dd className="col-7">{reports?.openReports ?? 0}</dd>
        </dl>
      )}
    </SectionCard>
  );
}
