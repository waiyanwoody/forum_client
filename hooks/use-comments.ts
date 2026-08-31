import { useQuery } from "@tanstack/react-query";

import { getComments } from "@/lib/api/comments";

export const useComments = (
  postId: number,
  page = 0,
  pageSize = 10
) => {
  return useQuery({
    queryKey: ["comments", postId, page, pageSize],

    queryFn: () => getComments(page, pageSize, postId),

    enabled: !!postId,
  });
};

