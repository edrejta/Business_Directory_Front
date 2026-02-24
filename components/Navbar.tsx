"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";

const roleToPath: Record<number, string> = {
  0: "/dashboard-user",
  1: "/dashboard-business",
  2: "/dashboard-admin",
};

const roleToLabel: Record<number, string> = {
  0: "User",
  1: "Business Owner",
  2: "Admin",
};

export default function Navbar() {
  const { user, logoutUser } = useAuth();

  const homePath = useMemo(() => {
    if (!user) return "/login";
    return roleToPath[user.role] || "/login";
  }, [user]);

  return (
    <header className="animate-fade-up border-b border-oak/35 bg-mist/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link className="text-lg font-semibold tracking-tight text-espresso" href={homePath}>
          Business Directory
        </Link>

        <div className="stagger-fade flex items-center gap-3">
          <span className="rounded-full bg-sand px-3 py-1 text-xs font-semibold text-espresso">
            {user ? roleToLabel[user.role] || "User" : "Guest"}
          </span>

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
