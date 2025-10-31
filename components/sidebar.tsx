"use client"

import Link from "next/link"
import { TrendingUp, Users, Tag, PenSquare } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

const popularTags = [
  { name: "React", count: 1234 },
  { name: "Next.js", count: 892 },
  { name: "TypeScript", count: 756 },
  { name: "Tailwind", count: 645 },
  { name: "Node.js", count: 534 },
]

const topContributors = [
  { name: "Sarah Chen", username: "sarahc", avatar: "/diverse-group-smiling.png", posts: 234 },
  { name: "Mike Johnson", username: "mikej", avatar: "/person-named-mike.png", posts: 189 },
  { name: "Emma Wilson", username: "emmaw", avatar: "/portrait-young-woman.png", posts: 156 },
]

export function Sidebar() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      {/* Popular Tags */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Tag className="h-4 w-4 text-primary" />
            Popular Tags
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <Badge
                key={tag.name}
                variant="secondary"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {tag.name}
                <span className="ml-1 text-xs opacity-70">{tag.count}</span>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Contributors */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            Top Contributors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topContributors.map((user) => (
              <Link
                key={user.username}
                href={`/u/${user.username}`}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground">@{user.username}</p>
                </div>
                <div className="text-xs text-muted-foreground">{user.posts} posts</div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {user ? (
        <Card className="border-border bg-gradient-to-br from-primary/10 to-primary/5">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <PenSquare className="h-4 w-4 text-primary" />
              Start a Discussion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4 text-pretty">
              Have a question or want to share something? Create a new thread and engage with the community.
            </p>
            <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/new">Create Thread</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border bg-gradient-to-br from-primary/10 to-primary/5">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Join the Community
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4 text-pretty">
              Share your knowledge and learn from others in our growing community.
            </p>
            <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/register">Get Started</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
