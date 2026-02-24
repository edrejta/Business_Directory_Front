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
    <section id={id} className="card border-0 shadow-sm h-100">
      <div className="card-body p-4 p-xl-5">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
          <div>
            <h2 className="h5 mb-1">{title}</h2>
            {subtitle && <p className="text-muted mb-0 small">{subtitle}</p>}
          </div>
          {actions}
        </div>
        {children}
      </div>
    </section>
  );
}
