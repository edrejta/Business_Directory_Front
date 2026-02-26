export type FavoriteSource = "business" | "deal" | "offer";

export interface FavoriteItem {
  businessId: string;
  name: string;
  source: FavoriteSource;
  addedAt: string;
  href?: string;
}
