"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { getRedirectPath, getRoleLabel } from "@/lib/auth/redirect";

export default function Navbar() {
  const { user, logoutUser } = useAuth();

  const homePath = useMemo(() => {
    if (!user) return "/login";
    return getRedirectPath(user.role);
  }, [user]);

  const roleLabel = useMemo(() => {
    if (!user) return "Guest";
    return getRoleLabel(user.role);
  }, [user]);

  const showBiznesShortcut = useMemo(() => {
    if (!user) return false;
    return getRedirectPath(user.role) !== "/dashboard-business";
  }, [user]);

  return (
    <header className="animate-fade-up border-b border-oak/35 bg-mist/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link className="text-lg font-semibold tracking-tight text-espresso" href={homePath}>
          Business Directory
        </Link>

        <div className="stagger-fade flex items-center gap-3">
          <Link
            className="rounded-full border border-oak/35 bg-sand px-4 py-2 text-sm font-semibold text-espresso transition hover:bg-[#efdfcd]"
            href="/"
          >
            Home
          </Link>

          {user && showBiznesShortcut ? (
            <Link
              className="rounded-full border border-oak/35 bg-sand px-4 py-2 text-sm font-semibold text-espresso transition hover:bg-[#efdfcd]"
              href="/dashboard-business"
            >
              Biznes
            </Link>
          ) : null}

          <Link
            className="rounded-full border border-oak/35 bg-sand px-4 py-2 text-sm font-semibold text-espresso transition hover:bg-[#efdfcd]"
            href={homePath}
          >
            {roleLabel}
          </Link>

          {user ? (
            <button
              onClick={logoutUser}
              className="rounded-full bg-espresso px-4 py-2 text-sm font-semibold text-paper transition hover:bg-[#2d1f15]"
              type="button"
            >
              Dil
            </button>
          ) : (
            <Link
              className="rounded-full bg-espresso px-4 py-2 text-sm font-semibold text-paper transition hover:bg-[#2d1f15]"
              href="/login"
            >
              Hyr
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}