import { authenticatedJson } from "@/lib/api/client";
import type { BusinessComment, CreateCommentInput, UpdateCommentInput } from "@/lib/types/comment";

export function createComment(input: CreateCommentInput) {
  return authenticatedJson<BusinessComment>("/api/comments", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateComment(id: string, input: UpdateCommentInput) {
  return authenticatedJson<BusinessComment>(`/api/comments/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export function deleteComment(id: string) {
  return authenticatedJson<{ message?: string }>(`/api/comments/${id}`, {
    method: "DELETE",
  });
}
