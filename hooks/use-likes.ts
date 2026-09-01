"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleLike } from "@/lib/api/likes";
import type { LikeRequest } from "@/lib/types";

const toggleQueues = new Map<string, Promise<unknown>>();

function queuedToggle(request: LikeRequest) {
  const key = `${request.targetType}:${request.targetId}`;
  const previous = toggleQueues.get(key) ?? Promise.resolve();
  const current = previous.catch(() => undefined).then(() => toggleLike(request));

  toggleQueues.set(key, current);
  const clearQueue = () => {
    if (toggleQueues.get(key) === current) {
      toggleQueues.delete(key);
    }
  };
  void current.then(clearQueue, clearQueue);

  return current;
}

export function useToggleLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: queuedToggle,

    onSuccess: (_, variables) => {
      if (variables.targetType === "POST") {
        queryClient.invalidateQueries({
          queryKey: ["post", variables.targetId],
        });

        queryClient.invalidateQueries({
          queryKey: ["posts"],
        });

        queryClient.invalidateQueries({
          queryKey: ["userLikedPosts"],
        });
      }

      if (variables.targetType === "COMMENT") {
        queryClient.invalidateQueries({ queryKey: ["comments"] });
      }
    },
  });
}

