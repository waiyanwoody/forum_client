"use client"

import { useQuery } from "@tanstack/react-query"
import { CommentForm } from "@/components/comment-form"
import { CommentTree } from "@/components/comment-tree"
import { getCommentsByPostId } from "@/lib/api/comments"

type ThreadCommentsProps = {
  postId: number
}

export function ThreadComments({ postId }: ThreadCommentsProps) {
  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => getCommentsByPostId(postId),
  })

  if (isLoading) {
    return <p className="text-muted-foreground">Loading comments...</p>
  }

  if (isError) {
    return (
      <p className="text-destructive">
        Failed to load comments.
      </p>
    )
  }

  const comments = data?.content ?? []
  const count = data?.totalElements ?? 0

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        {count} {count === 1 ? "Reply" : "Replies"}
      </h2>

      <CommentForm postId={postId} />

      {comments.length > 0 ? (
        <CommentTree comments={comments} />
      ) : (
        <p className="text-muted-foreground">
          No replies yet. Be the first to reply!
        </p>
      )}
    </div>
  )
}