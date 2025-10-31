"use client"

import { useState } from "react"
import Link from "next/link"
import { ThumbsUp, MessageSquare, MoreHorizontal, CheckCircle2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { CommentForm } from "./comment-form"
import type { Comment } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"

type CommentCardProps = {
  comment: Comment
  depth?: number
}

export function CommentCard({ comment, depth = 0 }: CommentCardProps) {
  const [isLiked, setIsLiked] = useState(comment.isLiked)
  const [likeCount, setLikeCount] = useState(comment.likeCount)
  const [showReply, setShowReply] = useState(false)
  const timeAgo = formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Link href={`/u/${comment.author.username}`}>
          <Avatar className="h-10 w-10">
            <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
            <AvatarFallback>{comment.author.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/u/${comment.author.username}`}
              className="font-semibold text-sm hover:text-primary transition-colors"
            >
              {comment.author.name}
            </Link>
            <span className="text-xs text-muted-foreground">@{comment.author.username}</span>
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Mark as Solution
            </DropdownMenuItem>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Report</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Content */}
      <div className="prose prose-sm prose-slate dark:prose-invert max-w-none">
        <MarkdownRenderer content={comment.contentMD} />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="gap-1.5 h-8 transition-all active:scale-95" onClick={handleLike}>
          <ThumbsUp
            className={`h-3.5 w-3.5 transition-all ${isLiked ? "fill-current scale-110 animate-in zoom-in-50 duration-200" : ""}`}
          />
          <span className="text-xs">{likeCount}</span>
        </Button>

        <Button variant="ghost" size="sm" className="gap-1.5 h-8" onClick={() => setShowReply(!showReply)}>
          <MessageSquare className="h-3.5 w-3.5" />
          <span className="text-xs">Reply</span>
        </Button>
      </div>

      {/* Reply Form */}
      {showReply && (
        <div className="pt-4 border-t border-border">
          <CommentForm onCancel={() => setShowReply(false)} compact />
        </div>
      )}
    </div>
  )
}
