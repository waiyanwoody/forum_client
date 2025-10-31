"use client"

import { useState } from "react"
import Link from "next/link"
import { ThumbsUp, Bookmark, Share2, MoreHorizontal, CheckCircle2, Clock } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import type { Post } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"

type ThreadDetailProps = {
  post: Post
}

export function ThreadDetail({ post }: ThreadDetailProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(post.isSaved)
  const [likeCount, setLikeCount] = useState(post.likeCount)
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
  }

  const handleSave = () => {
    setIsSaved(!isSaved)
  }

  return (
    <article className="bg-card border border-border rounded-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link href={`/u/${post.author.username}`}>
          <Avatar className="h-12 w-12">
            <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
            <AvatarFallback>{post.author.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link href={`/u/${post.author.username}`} className="font-semibold hover:text-primary transition-colors">
              {post.author.name}
            </Link>
            <span className="text-sm text-muted-foreground">@{post.author.username}</span>
            {post.isSolved && (
              <Badge variant="outline" className="gap-1 border-green-500/50 text-green-600 dark:text-green-400">
                <CheckCircle2 className="h-3 w-3" />
                Solved
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{timeAgo}</span>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Report</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-balance">{post.title}</h1>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>

      {/* Content */}
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <MarkdownRenderer content={post.contentMD} />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-4 border-t border-border">
        <Button
          variant={isLiked ? "default" : "outline"}
          size="sm"
          className="gap-2 transition-all active:scale-95"
          onClick={handleLike}
        >
          <ThumbsUp
            className={`h-4 w-4 transition-transform ${isLiked ? "scale-110 animate-in zoom-in-50 duration-200" : ""}`}
          />
          <span>{likeCount}</span>
        </Button>

        <Button
          variant={isSaved ? "default" : "outline"}
          size="sm"
          className="gap-2 transition-all active:scale-95"
          onClick={handleSave}
        >
          <Bookmark
            className={`h-4 w-4 transition-all ${isSaved ? "fill-current scale-110 animate-in zoom-in-50 duration-200" : ""}`}
          />
          {isSaved ? "Saved" : "Save"}
        </Button>

        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </div>
    </article>
  )
}
