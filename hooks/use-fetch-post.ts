"use client";

import { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { ApiHttpError } from "@/lib/http";
import { getPosts } from "@/lib/api/posts";
import type { PaginatedResponse, Post } from "@/lib/types";

export const useFetchPosts = (pageSize = 10) => {
  const query = useInfiniteQuery<PaginatedResponse<Post>, ApiHttpError>({
    queryKey: ["posts", pageSize],
    queryFn: ({ page = 0 }) => getPosts(page, pageSize),
    getNextPageParam: (lastPage) => {
      // Return next page number, or undefined if no more pages
      return lastPage.number + 1 < lastPage.totalPages
        ? lastPage.number + 1
        : undefined;
    },
    initialPageParam: 1, // ✅ required
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query.isError && query.error instanceof ApiHttpError) {
      toast.error(query.error.message || "Failed to load posts");
    } else if (query.isError) {
      toast.error("Something went wrong while fetching posts");
    }
  }, [query.isError, query.error]);

  return query;
};
