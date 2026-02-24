export interface BusinessComment {
  id: string;
  businessId: string;
  userId: string;
  text: string;
  rate: number;
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
