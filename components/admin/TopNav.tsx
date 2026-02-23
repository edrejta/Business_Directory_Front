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
    <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top z-3">
      <div className="container-fluid px-3 px-lg-4 py-2 d-flex flex-wrap align-items-center gap-2">
        <div className="d-flex align-items-center gap-2 flex-grow-1">
          <button
            className="btn btn-outline-secondary d-lg-none"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#adminSidebarOffcanvas"
            aria-controls="adminSidebarOffcanvas"
            aria-label="Open navigation"
          >
            Menu
          </button>
          <div>
            <h1 className="h5 mb-0">Admin Dashboard</h1>
            <small className="text-muted">Welcome, {username ?? "admin"}</small>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2 flex-wrap justify-content-end ms-2">
          <Link href={homeHref} className="btn btn-outline-primary btn-sm" aria-label="Go to home page">
            Home
          </Link>
          <Link href={roleHref} className="btn btn-outline-secondary btn-sm" aria-label="Go to role dashboard">
            {roleLabel}
          </Link>
          <button className="btn btn-dark btn-sm" onClick={onLogout} type="button" aria-label="Logout">
            Dil
          </button>
        </div>
      </div>
    </nav>
  );
}
