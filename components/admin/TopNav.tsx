"use client";

import Link from "next/link";

type TopNavProps = {
  username?: string;
  roleLabel: string;
  homeHref: string;
  roleHref: string;
  onLogout: () => void;
};

export default function TopNav({ username, roleLabel, homeHref, roleHref, onLogout }: TopNavProps) {
  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom z-3">
      <div className="container-fluid px-3 px-lg-4 py-2 d-flex align-items-center gap-2">
        <div className="d-flex align-items-center gap-2 flex-grow-1" style={{ minWidth: 0 }}>
          <div style={{ minWidth: 0 }}>
            <h1 className="h5 mb-0">
              Admin Dashboard
            </h1>
            <small className="text-muted d-block text-truncate">Welcome, {username ?? "admin"}</small>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2 flex-nowrap justify-content-end ms-2">
          <Link href={homeHref} className="btn btn-outline-primary btn-sm" aria-label="Go to home page">
            Home
          </Link>
          <Link href={roleHref} className="btn btn-outline-secondary btn-sm" aria-label="Go to role dashboard">
            <span className="d-none d-md-inline">{roleLabel}</span>
            <span className="d-inline d-md-none">Role</span>
          </Link>
          <button className="btn btn-dark btn-sm" onClick={onLogout} type="button" aria-label="Logout">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
