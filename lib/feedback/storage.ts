import type { Review, Comment } from "@/lib/types/review";
import type { FavoriteItem } from "@/lib/types/favorite";

const REVIEWS_PREFIX = "bd_reviews_v1:";
const FAVORITES_PREFIX = "bd_favorites_v1:";

const isBrowser = () => typeof window !== "undefined";

const safeParse = <T>(raw: string | null, fallback: T): T => {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const getReviewsKey = (businessId: string) => `${REVIEWS_PREFIX}${businessId}`;
const getFavoritesKey = (userKey: string) => `${FAVORITES_PREFIX}${userKey}`;

export function getReviews(businessId: string): Review[] {
  if (!isBrowser()) return [];
  const stored = safeParse<Review[]>(localStorage.getItem(getReviewsKey(businessId)), []);
  return stored
    .filter((item) => item && item.businessId === businessId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function addReview(businessId: string, review: Review): Review[] {
  if (!isBrowser()) return [review];
  const current = getReviews(businessId);
  const next = [review, ...current];
  localStorage.setItem(getReviewsKey(businessId), JSON.stringify(next));
  return next;
}

export function addComment(businessId: string, reviewId: string, comment: Comment): Review[] {
  if (!isBrowser()) return [];
  const current = getReviews(businessId);
  const next = current.map((r) => {
    if (r.id !== reviewId) return r;
    const existing = Array.isArray(r.comments) ? r.comments : [];
    return { ...r, comments: [comment, ...existing] };
  });
  localStorage.setItem(getReviewsKey(businessId), JSON.stringify(next));
  return next;
}

export function getFavorites(userKey: string): FavoriteItem[] {
  if (!isBrowser()) return [];
  const stored = safeParse<FavoriteItem[]>(localStorage.getItem(getFavoritesKey(userKey)), []);
  return stored.filter((item) => item && item.businessId);
}

export function saveFavorites(userKey: string, favorites: FavoriteItem[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(getFavoritesKey(userKey), JSON.stringify(favorites));
}

export function isFavorite(userKey: string, businessId: string): boolean {
  if (!isBrowser()) return false;
  return getFavorites(userKey).some((item) => item.businessId === businessId);
}

export function toggleFavorite(
  userKey: string,
  item: FavoriteItem,
): { next: FavoriteItem[]; isFavorite: boolean } {
  if (!isBrowser()) return { next: [item], isFavorite: true };
  const current = getFavorites(userKey);
  const exists = current.some((entry) => entry.businessId === item.businessId);
  const next = exists ? current.filter((entry) => entry.businessId !== item.businessId) : [item, ...current];
  saveFavorites(userKey, next);
  return { next, isFavorite: !exists };
}
