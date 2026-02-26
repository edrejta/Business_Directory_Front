"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import type { FavoriteItem } from "@/lib/types/favorite";
import { getFavorites, toggleFavorite } from "@/lib/feedback/storage";

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString();
};

export default function FavoritesPage() {
  const { user } = useAuth();
  const userKey = user?.email || user?.username || null;
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    if (!userKey) {
      setFavorites([]);
      return;
    }
    setFavorites(getFavorites(userKey));
  }, [userKey]);

  const handleRemove = (item: FavoriteItem) => {
    if (!userKey) return;
    const result = toggleFavorite(userKey, item);
    setFavorites(result.next);
  };

  const emptyMessage = useMemo(() => {
    if (!user) return "Login to see your favorites.";
    return "You do not have any favorites yet.";
  }, [user]);

  return (
    <main className="min-h-screen bg-[#f0efec] px-4 py-10 text-[#3a2c28]">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9a7b60]">Saved</p>
          <h1 className="text-3xl font-bold text-[#3a2c28]">Favorites</h1>
        </header>

        {!user ? (
          <div className="rounded-2xl border border-[#d8d1c8] bg-[#f7f3ee] p-6">
            <p className="text-sm text-[#75695e]">{emptyMessage}</p>
            <Link className="mt-3 inline-block text-sm font-semibold underline" href="/login">
              Login
            </Link>
          </div>
        ) : favorites.length === 0 ? (
          <div className="rounded-2xl border border-[#d8d1c8] bg-[#f7f3ee] p-6">
            <p className="text-sm text-[#75695e]">{emptyMessage}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {favorites.map((item) => {
              const href = item.href || `/business/${item.businessId}`;
              return (
                <div key={item.businessId} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#d8d1c8] bg-[#f7f3ee] p-5">
                  <div>
                    <p className="text-lg font-semibold text-[#3a2c28]">{item.name}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#9a7b60]">{item.source}</p>
                    {item.addedAt ? (
                      <p className="text-xs text-[#75695e]">Saved {formatDate(item.addedAt)}</p>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-3">
                    <Link className="text-sm font-semibold underline" href={href}>
                      View
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleRemove(item)}
                      className="rounded-full border border-[#d2c4b4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#6f5f50]"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
