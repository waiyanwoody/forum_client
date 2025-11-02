import type { PaginatedResponse, Post } from "@/lib/types";
import { ApiHttpError } from "@/lib/http";
import { api } from "./client";
import { CreatePostPayload } from "@/hooks/use-create-post";

export const createPost = async (payload: CreatePostPayload): Promise<Post> => {
  try {
    const response = await api.post("/api/posts", payload);
    return response.data;
  } catch (error: any) {
    const data = error.response?.data;
    if (error.response) {
      if (data && typeof data.status === "number") {
        throw new ApiHttpError(data);
      }
      throw new Error(`Request failed (${error.response.status})`);
    }
    throw new Error("Network error or server unreachable");
  }
};

/**
 * Fetch posts from backend.
 * Supports optional pagination: /api/posts?page=1&pageSize=10
 */
export const getPosts = async (
  page?: number,
  pageSize?: number
): Promise<PaginatedResponse<Post>> => {
  try {
    const params = new URLSearchParams();
    if (page) params.append("page", page.toString());
    if (pageSize) params.append("pageSize", pageSize.toString());

    const response = await api.get(`/api/posts?${params.toString()}`);
    return response.data;
  } catch (error: any) {
    const data = error.response?.data;

    if (error.response) {
      if (data && typeof data.status === "number") {
        throw new ApiHttpError(data);
      }
      throw new Error(`Request failed (${error.response.status})`);
    }

    throw new Error("Network error or server unreachable");
  }
};
