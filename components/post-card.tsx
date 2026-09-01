"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  MessageSquare,
  ThumbsUp,
  Pin,
  CheckCircle2,
  Clock,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Post } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"
import { getUserAvatar } from "@/lib/utils"
import { useToggleLike } from "@/hooks/use-likes"

type PostCardProps = {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.liked)
  const [likeCount, setLikeCount] = useState(post.likeCount ?? 0)
  const likeMutation = useToggleLike()

  useEffect(() => {
    setIsLiked(post.liked)
    setLikeCount(post.likeCount ?? 0)
  }, [post.liked, post.likeCount])

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
  })

  const avatarUrl = getUserAvatar(post?.author.avatar_path)

  const handleLike = () => {
    if (likeMutation.isPending) return

    const nextLiked = !isLiked

    setIsLiked(nextLiked)
    setLikeCount((currentCount) =>
      Math.max(0, currentCount + (nextLiked ? 1 : -1))
    )

    likeMutation.mutate(
      {
        targetType: "POST",
        targetId: post.id,
      },
      {
        onError: () => {
          setIsLiked(!nextLiked)
          setLikeCount((currentCount) =>
            Math.max(0, currentCount + (nextLiked ? -1 : 1))
          )
        },
      }
    )
  }

  return (
    <article className="group relative bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all">
      {/* Pinned indicator */}
      {post.isPinned && (
        <div className="absolute top-4 right-4">
          <Pin className="h-4 w-4 text-primary" />
        </div>
      )}

      <div className="flex gap-4">
        {/* Author Avatar */}
        <Link
          href={`/u/${post?.author?.username}`}
          className="flex-shrink-0"
        >
          <Avatar className="h-12 w-12 ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
            <AvatarImage
              src={avatarUrl || "/placeholder.svg"}
              alt={post?.author?.username}
            />

            <AvatarFallback>
              {post?.author?.username
                ?.slice(0, 2)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* Title & Status */}
          <div className="flex items-start gap-2">
            <Link
              href={`/t/${post.slug}`}
              className="flex-1 text-lg font-semibold text-foreground hover:text-primary transition-colors text-balance"
            >
              {post.title}
            </Link>

            {post.isSolved && (
              <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            )}
          </div>

          {/* Excerpt */}
          <p className="text-sm text-muted-foreground line-clamp-2 text-pretty">
            {post.excerpt}
          </p>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <Link
              href={`/u/${post?.author?.username}`}
              className="font-medium hover:text-foreground transition-colors"
            >
              {post?.author?.username}
            </Link>

            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {timeAgo}
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {post.tags?.map((tag, index) => (
              <Badge
                key={`${tag}-${index}`}
                variant="secondary"
                className="text-xs"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="hidden sm:flex flex-col items-end gap-3 flex-shrink-0">
          {/* Like Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            disabled={likeMutation.isPending}
            className={`flex items-center gap-2 transition-colors ${
              isLiked
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ThumbsUp
              className={`h-4 w-4 ${
                isLiked ? "fill-current" : ""
              }`}
            />

            <span className="text-sm font-medium">
              {likeCount}
            </span>
          </Button>

          {/* Comment Button */}
          <Link
            href={`/t/${post.slug}`}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <MessageSquare className="h-4 w-4" />

            <span className="text-sm font-medium">
              {post.commentCount ?? 0}
            </span>
          </Link>
        </div>
      </div>
    </article>
  )
}