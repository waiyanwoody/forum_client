"use client"

import Link from "next/link"
import { MessageSquare, ThumbsUp, AtSign, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Notification } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"

type NotificationListProps = {
  notifications: Notification[]
}

export function NotificationList({ notifications }: NotificationListProps) {
  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "REPLY":
        return <MessageSquare className="h-5 w-5 text-primary" />
      case "LIKE":
        return <ThumbsUp className="h-5 w-5 text-primary" />
      case "MENTION":
        return <AtSign className="h-5 w-5 text-primary" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-2">
      {notifications.map((notification) => {
        const timeAgo = formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })

        return (
          <Link
            key={notification.id}
            href={notification.link}
            className={`block p-4 rounded-lg border transition-all hover:border-primary/50 ${
              notification.read ? "bg-card border-border" : "bg-primary/5 border-primary/20"
            }`}
          >
            <div className="flex gap-4">
              <div className="flex-shrink-0 mt-1">{getIcon(notification.type)}</div>

              <div className="flex-1 min-w-0 space-y-1">
                <p className="text-sm text-pretty">{notification.message}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{timeAgo}</span>
                  {!notification.read && (
                    <span className="inline-flex items-center gap-1 text-xs text-primary">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      New
                    </span>
                  )}
                </div>
              </div>

              {!notification.read && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0"
                  onClick={(e) => {
                    e.preventDefault()
                    console.log("[v0] Mark as read:", notification.id)
                  }}
                >
                  <CheckCircle2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </Link>
        )
      })}
    </div>
  )
}
