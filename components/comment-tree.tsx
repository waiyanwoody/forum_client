"use client"

import { CommentCard } from "./comment-card"
import type { Comment } from "@/lib/types"

type CommentTreeProps = {
  comments: Comment[]
  depth?: number
}

export function CommentTree({ comments, depth = 0 }: CommentTreeProps) {
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id}>
          <CommentCard comment={comment} depth={depth} />
          {comment.children.length > 0 && (
            <div className="ml-8 mt-4 border-l-2 border-border pl-4">
              <CommentTree comments={comment.children} depth={depth + 1} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
