"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { getFavorites } from "@/lib/feedback/storage";

export default function NavbarAuth() {
  const { user, logoutUser } = useAuth();

  const [mounted, setMounted] = useState(false);
  const [favCount, setFavCount] = useState(0);

  useEffect(() => setMounted(true), []);

  // load favorites count whenever user changes
  useEffect(() => {
    if (user) {
      const key = user.email || user.username || "";
      setFavCount(getFavorites(key).length);
    } else {
      setFavCount(0);
    }
  }, [user]);

  if (!mounted) return null;

  if (!user) {
    return (
      <div className="stagger-fade flex items-center gap-3">
        <Link
          className="rounded-full bg-espresso px-4 py-2 text-sm font-semibold text-paper transition hover:bg-[#2d1f15]"
          href="/login"
        >
          Hyr
        </Link>
      </div>
    );
  }

  return (
    <div className="stagger-fade flex items-center gap-3">
      <Link
        className="relative rounded-full border border-oak/35 bg-sand px-4 py-2 text-sm font-semibold text-espresso transition hover:bg-[#efdfcd]"
        href="/favorites"
      >
        Favorites
        {favCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-espresso text-xs font-semibold text-paper">
            {favCount}
          </span>
        )}
      </Link>

      <Link
        className="rounded-full border border-oak/35 bg-sand px-4 py-2 text-sm font-semibold text-espresso transition hover:bg-[#efdfcd]"
        href={user.role === 1 ? "/dashboard-business" : user.role === 2 ? "/dashboard-admin" : "/dashboard-user"}
      >
        {user.role === 1 ? "Business Owner" : user.role === 2 ? "Admin" : "User"}
      </Link>

      <button
        onClick={logoutUser}
        className="rounded-full bg-espresso px-4 py-2 text-sm font-semibold text-paper transition hover:bg-[#2d1f15]"
        type="button"
      >
        Dil
      </button>
    </div>
  );
}