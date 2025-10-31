"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bold, Italic, Code, LinkIcon } from "lucide-react"

type CommentFormProps = {
  onCancel?: () => void
  compact?: boolean
}

export function CommentForm({ onCancel, compact = false }: CommentFormProps) {
  const [content, setContent] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Comment submitted:", content)
    setContent("")
    onCancel?.()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-3">
        {!compact && (
          <Avatar className="h-10 w-10">
            <AvatarImage src="/diverse-user-avatars.png" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        )}

        <div className="flex-1 space-y-3">
          <Textarea
            placeholder="Write your reply..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px] resize-none bg-muted border-border"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
                <Bold className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
                <Italic className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
                <Code className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
                <LinkIcon className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              {onCancel && (
                <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit" size="sm" disabled={!content.trim()}>
                Post Reply
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
