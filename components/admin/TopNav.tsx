"use client";

import Link from "next/link";

type TopNavProps = {
  username?: string;
  roleLabel: string;
  homeHref: string;
  roleHref: string;
  onLogout: () => void;
};

const buttonBase =
  "inline-flex items-center justify-center rounded-md border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--coffee-primary)] focus-visible:ring-offset-1";

export default function TopNav({ username, roleLabel, homeHref, roleHref, onLogout }: TopNavProps) {
  return (
    <nav className="sticky top-0 z-30 border-b border-[var(--coffee-border)] bg-[var(--coffee-surface)]/95 backdrop-blur">
      <div className="flex items-center gap-2 px-3 py-2 lg:px-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-base font-semibold leading-5">Admin Dashboard</h1>
          <small className="block truncate text-xs text-[var(--coffee-muted)]">Welcome, {username ?? "admin"}</small>
        </div>

        <div className="ml-2 flex shrink-0 items-center gap-2">
          <Link
            href={homeHref}
            className={`${buttonBase} border-[var(--coffee-primary)] text-[var(--coffee-primary)] hover:bg-[var(--coffee-border)]`}
            aria-label="Go to home page"
          >
            Home
          </Link>

          <Link
            href={roleHref}
            className={`${buttonBase} border-[var(--coffee-border)] text-[var(--coffee-text)] hover:bg-[var(--coffee-border)]`}
            aria-label="Go to role dashboard"
          >
            <span className="hidden md:inline">{roleLabel}</span>
            <span className="md:hidden">Role</span>
          </Link>

          <button
            className={`${buttonBase} border-[var(--coffee-primary)] bg-[var(--coffee-primary)] text-[var(--coffee-bg)] hover:bg-[var(--coffee-text)]`}
            onClick={onLogout}
            type="button"
            aria-label="Logout"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
