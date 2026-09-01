import type { Comment, Post } from "@/lib/types";
import { ApiHttpError } from "@/lib/http";
import { api } from "./client";

type ActivityResponse<T> = T[] | { content: T[] };

const normalizePost = (post: any): Post => {
  const author = post.author ?? post.user ?? {};
  const content = post.content ?? post.contentMD ?? "";

  return {
    ...post,
    id: Number(post.id),
    title: post.title ?? "Untitled post",
    content,
    excerpt: post.excerpt ?? content.slice(0, 180),
    tags: post.tags ?? [],
    slug: post.slug ?? String(post.id),
    createdAt: post.createdAt ?? post.created_at,
    author: {
      id: Number(author.id),
      fullname: author.fullname ?? author.name ?? "Unknown user",
      username: author.username ?? "unknown",
      email: author.email,
      bio: author.bio,
      avatar_path: author.avatar_path ?? author.avatarPath,
    },
    likeCount: post.likeCount ?? post.likes?.length ?? 0,
    liked: post.liked ?? false,
    viewCount: post.viewCount ?? 0,
    commentCount: post.commentCount ?? post.replyCount ?? 0,
  };
};

const getActivity = async <T>(path: string): Promise<T[]> => {
  try {
    const response = await api.get<ActivityResponse<T>>(path);
    if (Array.isArray(response.data)) {
  return response.data;
}

if (response.data && Array.isArray(response.data.content)) {
  return response.data.content;
}

return [];
  } catch (error: any) {
    const data = error.response?.data;

    if (error.response) {
      if (data && typeof data.status === "number") {
        throw new ApiHttpError(data);
      }
      const message =
        data?.message ?? data?.error ?? error.response.statusText;
      throw new Error(
        message
          ? `Request failed (${error.response.status}): ${message}`
          : `Request failed (${error.response.status})`
      );
    }

    throw new Error("Network error or server unreachable");
  }
};

export const getUserReplies = (userId: number | string) =>
  getActivity<Comment>(`/api/user/${userId}/replies`);

export const getUserLikedPosts = (userId: number | string) =>
  getActivity<Post>(`/api/user/${userId}/liked-posts`).then((posts) =>
    posts.map((post) => ({ ...normalizePost(post), liked: true }))
  );

export const getUserSavedPosts = (userId: number | string) =>
  getActivity<Post>(`/api/user/${userId}/saved-posts`).then((posts) =>
    posts.map(normalizePost)
  );