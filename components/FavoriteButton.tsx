"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import type { FavoriteItem, FavoriteSource } from "@/lib/types/favorite";
import { isFavorite, toggleFavorite } from "@/lib/feedback/storage";
import styles from "./FavoriteButton.module.css";

interface FavoriteButtonProps {
  businessId: string;
  name: string;
  source: FavoriteSource;
  href?: string;
  compact?: boolean;
  className?: string;
}

const joinClassNames = (...values: Array<string | undefined | false>) => values.filter(Boolean).join(" ");

export default function FavoriteButton({
  businessId,
  name,
  source,
  href,
  compact = false,
  className,
}: FavoriteButtonProps) {
  const { user } = useAuth();
  const router = useRouter();
  const userKey = user?.email || user?.username || null;

  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!userKey) {
      setActive(false);
      return;
    }
    setActive(isFavorite(userKey, businessId));
  }, [businessId, userKey]);

  const label = useMemo(() => {
    if (compact) return active ? "Saved" : "Save";
    return active ? "Saved to favorites" : "Save to favorites";
  }, [active, compact]);

  const handleToggle = () => {
    if (!userKey) {
      router.push("/login");
      return;
    }

    const item: FavoriteItem = {
      businessId,
      name,
      source,
      addedAt: new Date().toISOString(),
      href,
    };

    const result = toggleFavorite(userKey, item);
    setActive(result.isFavorite);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={joinClassNames(
        styles.button,
        active && styles.buttonActive,
        compact && styles.compact,
        className,
      )}
      aria-pressed={active}
      title={userKey ? label : "Login to save favorites"}
    >
      {label}
    </button>
  );
}
