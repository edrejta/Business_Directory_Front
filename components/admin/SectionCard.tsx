"use client";

import { type ReactNode } from "react";

type SectionCardProps = {
  id?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
};

export default function SectionCard({ id, title, subtitle, actions, children }: SectionCardProps) {
  return (
    <section id={id} className="min-w-0 h-full rounded-2xl border border-[var(--coffee-border)] bg-[var(--coffee-surface)] shadow-sm">
      <div className="p-4 xl:p-5">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold leading-tight">{title}</h2>
            {subtitle && <p className="mt-1 text-sm text-[var(--coffee-muted)]">{subtitle}</p>}
          </div>
          {actions}
        </div>

        {children}
      </div>
    </section>
  );
}
