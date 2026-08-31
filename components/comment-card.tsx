"use client"

import { useState } from "react"
import Link from "next/link"
import { MessageSquare, MoreHorizontal, CheckCircle2 } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { CommentForm } from "./comment-form"
import type { Comment } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"

type CommentCardProps = {
  comment: Comment
  depth?: number
}

export function CommentCard({
  comment,
  depth = 0,
}: CommentCardProps) {
  const [showReply, setShowReply] = useState(false)

  const timeAgo = comment.createdAt
  ? formatDistanceToNow(
      new Date(comment.createdAt.replace(/\.(\d{3})\d+$/, ".$1")),
      { addSuffix: true }
    )
  : "Unknown date"

  // Create initials from author's fullname
  const initials =
    comment.authorFullname
      ?.slice(0, 2)
      .toUpperCase() ||
    comment.authorUsername
      ?.slice(0, 2)
      .toUpperCase() ||
    "U"

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">

      {/* Header */}
      <div className="flex items-start gap-3">

        {/* Avatar */}
        <Link href={`/u/${comment.authorUsername}`}>
          <Avatar className="h-10 w-10">
            <AvatarFallback>
              {initials}
            </AvatarFallback>
          </Avatar>
        </Link>

        {/* Author information */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">

            <Link
              href={`/u/${comment.authorUsername}`}
              className="font-semibold text-sm hover:text-primary transition-colors"
            >
              {comment.authorFullname}
            </Link>

            <span className="text-xs text-muted-foreground">
              @{comment.authorUsername}
            </span>

            <span className="text-xs text-muted-foreground">
              {timeAgo}
            </span>

          </div>
        </div>

        {/* More menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">

            <DropdownMenuItem>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Mark as Solution
            </DropdownMenuItem>

            <DropdownMenuItem>
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem>
              Report
            </DropdownMenuItem>

            <DropdownMenuItem className="text-destructive">
              Delete
            </DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>

      </div>

      {/* Comment content */}
      <div className="prose prose-sm prose-slate dark:prose-invert max-w-none">
        <MarkdownRenderer content={comment.content} />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">

        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 h-8"
          onClick={() => setShowReply(!showReply)}
        >
          <MessageSquare className="h-3.5 w-3.5" />

          <span className="text-xs">
            Reply
          </span>
        </Button>

      </div>

      {/* Reply form */}
      {showReply && (
        <div className="pt-4 border-t border-border">

          <CommentForm
            postId={comment.postId}
            parentCommentId={comment.id}
            onCancel={() => setShowReply(false)}
            compact
          />

        </div>
      )}

    </div>
  )
}
