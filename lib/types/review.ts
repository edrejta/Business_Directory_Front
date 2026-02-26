export interface Comment {
  id: string;
  reviewId: string;
  userLabel: string;
  text: string;
  createdAt: string;
}

export interface Review {
  id: string;
  businessId: string;
  userLabel: string;
  rating: number;
  comment: string;
  createdAt: string;
  comments?: Comment[];
}
