"use client";

type KpiCardProps = {
  title: string;
  value: number;
  tone?: "primary" | "warning" | "success" | "info";
  progress?: number;
};

const toneColor: Record<NonNullable<KpiCardProps["tone"]>, string> = {
  primary: "var(--coffee-primary)",
  warning: "#9a6b1f",
  success: "#486650",
  info: "var(--coffee-accent)",
};

export default function KpiCard({ title, value, tone = "primary", progress = 0 }: KpiCardProps) {
  const safeProgress = Math.max(0, Math.min(100, progress));
  const color = toneColor[tone];

  return (
    <div className="h-full rounded-2xl border border-[var(--coffee-border)] bg-[var(--coffee-surface)] p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div className="text-xs text-[var(--coffee-muted)]">{title}</div>
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} aria-hidden />
      </div>

      <div className="mt-2 text-4xl font-semibold" style={{ color }}>
        {value}
      </div>

      <div
        className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[var(--coffee-border)]"
        role="progressbar"
        aria-label={`${title} visual`}
        aria-valuenow={safeProgress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="h-full rounded-full" style={{ width: `${safeProgress}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}
