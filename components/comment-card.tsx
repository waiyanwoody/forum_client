"use client"

import { useState } from "react"

import Link from "next/link"

import {
  MessageSquare,
  MoreHorizontal,
  CheckCircle2,
} from "lucide-react"

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

import {
  useUpdateComment,
  useDeleteComment,
} from "@/hooks/use-comments"

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

  // Edit state
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)

  // React Query mutations
  const updateMutation = useUpdateComment(comment.postId)
  const deleteMutation = useDeleteComment(comment.postId)

  const timeAgo = comment.createdAt
    ? formatDistanceToNow(
        new Date(
          comment.createdAt.replace(
            /\.(\d{3})\d+$/,
            ".$1"
          )
        ),
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

  // Handle update
  const handleUpdate = () => {
    const content = editContent.trim()

    if (!content) return

    updateMutation.mutate(
      {
        id: comment.id,
        payload: {
          postId: comment.postId,
          content,
          parentCommentId: null,
        },
      },
      {
        onSuccess: () => {
          setIsEditing(false)
        },
      }
    )
  }

  // Handle delete
  const handleDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?"
    )

    if (!confirmed) return

    deleteMutation.mutate(comment.id)
  }

  // Cancel editing
  const handleCancelEdit = () => {
    setEditContent(comment.content)
    setIsEditing(false)
  }

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
              disabled={deleteMutation.isPending}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">

            <DropdownMenuItem>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Mark as Solution
            </DropdownMenuItem>

            {/* Edit */}
            <DropdownMenuItem
              onClick={() => {
                setEditContent(comment.content)
                setIsEditing(true)
              }}
              disabled={updateMutation.isPending}
            >
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem>
              Report
            </DropdownMenuItem>

            {/* Delete */}
            <DropdownMenuItem
              className="text-destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending
                ? "Deleting..."
                : "Delete"}
            </DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>

      </div>

      {/* Comment content / Edit form */}
      {isEditing ? (
        <div className="space-y-3">

          <textarea
            value={editContent}
            onChange={(e) =>
              setEditContent(e.target.value)
            }
            className="w-full min-h-[100px] rounded-md border border-border bg-background p-3 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Edit your comment..."
            disabled={updateMutation.isPending}
          />

          <div className="flex items-center gap-2">

            {/* Save */}
            <Button
              size="sm"
              onClick={handleUpdate}
              disabled={
                updateMutation.isPending ||
                !editContent.trim()
              }
            >
              {updateMutation.isPending
                ? "Saving..."
                : "Save"}
            </Button>

            {/* Cancel */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancelEdit}
              disabled={updateMutation.isPending}
            >
              Cancel
            </Button>

          </div>

        </div>
      ) : (
        <div className="prose prose-sm prose-slate dark:prose-invert max-w-none">
          <MarkdownRenderer content={comment.content} />
        </div>
      )}

      {/* Actions */}
      {!isEditing && (
        <div className="flex items-center gap-2">

          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 h-8"
            onClick={() =>
              setShowReply(!showReply)
            }
          >
            <MessageSquare className="h-3.5 w-3.5" />

            <span className="text-xs">
              Reply
            </span>
          </Button>

        </div>
      )}

      {/* Reply form */}
      {showReply && !isEditing && (
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
