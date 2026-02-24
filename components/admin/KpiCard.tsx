"use client";

type KpiCardProps = {
  title: string;
  value: number;
  tone?: "primary" | "warning" | "success" | "info";
  progress?: number;
};

export default function KpiCard({ title, value, tone = "primary", progress = 0 }: KpiCardProps) {
  const textClass = `text-${tone}`;
  const progressClass = `bg-${tone}`;
  const safeProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body">
        <div className="d-flex align-items-center justify-content-between">
          <div className="text-muted small">{title}</div>
          <span className={`rounded-circle ${progressClass}`} style={{ width: 8, height: 8 }} aria-hidden />
        </div>
        <div className={`display-6 fw-semibold mt-2 ${textClass}`}>{value}</div>
        <div className="progress mt-3" role="progressbar" aria-label={`${title} visual`} aria-valuenow={safeProgress} aria-valuemin={0} aria-valuemax={100} style={{ height: 6 }}>
          <div className={`progress-bar ${progressClass}`} style={{ width: `${safeProgress}%` }} />
        </div>
      </div>
    </div>
  );
}
