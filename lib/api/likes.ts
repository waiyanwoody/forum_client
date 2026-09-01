import type { LikeRequest } from "@/lib/types";
import { api } from "./client";

export async function toggleLike(
  request: LikeRequest
): Promise<boolean> {
  const response = await api.post<boolean>("/api/likes/toggle", request);
  return response.data;
}

export async function getPostLikeCount(postId: number): Promise<number> {
  const response = await api.get<number>(`/api/likes/posts/${postId}/count`);
  return response.data;
}

export async function getCommentLikeCount(commentId: number): Promise<number> {
  const response = await api.get<number>(`/api/likes/comments/${commentId}/count`);
  return response.data;
}

