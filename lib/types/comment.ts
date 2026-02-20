export interface BusinessComment {
  id: string;
  businessId: string;
  userId: string;
  content: string;
}

export interface CreateCommentInput {
  businessId: string;
  content: string;
}

export interface UpdateCommentInput {
  content: string;
}
