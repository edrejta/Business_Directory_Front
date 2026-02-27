export interface BusinessComment {
  id: string;
  businessId: string;
  userId: string;
  username?: string;
  text: string;
  rate: number;
  createdAt?: string;
}

export interface CreateCommentInput {
  businessId: string;
  text: string;
  rate: number;
}

export interface UpdateCommentInput {
  text: string;
  rate: number;
}
