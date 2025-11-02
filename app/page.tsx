"use client"

import { useState, useEffect, useRef } from "react"
import { AppShell } from "@/components/app-shell"
import { Sidebar } from "@/components/sidebar"
import { PostCard } from "@/components/post-card"
import { mockPosts } from "@/lib/mock-data"
import { Loader2, TrendingUp, CheckCircle2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFetchPosts } from "@/hooks/use-fetch-post"
import { ProtectedRoute } from "@/components/protected-route"

type FilterTab = "all" | "trending" | "solved" | "following"

export default function HomePage() {

const {
  data:posts,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isisFetchingNextPage,
  isError,
} = useFetchPosts(10);
  
  const [page, setPage] = useState(1)
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all")
  const observerTarget = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          loadMorePosts()
        }
      },
      { threshold: 0.1 },
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, page])

  const loadMorePosts = () => {
    console.log('loadMorePosts called')
    if (hasNextPage) fetchNextPage();
  }

  const handleFilterChange = (filter: FilterTab) => {
    setActiveFilter(filter)
    // Reset posts and pagination when filter changes
  }

  return (
    <ProtectedRoute>
    <AppShell sidebar={<Sidebar />}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-balance">Discussions</h1>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Button
            variant={activeFilter === "all" ? "default" : "ghost"}
            size="sm"
            onClick={() => handleFilterChange("all")}
            className={
              activeFilter === "all"
                ? "bg-card hover:bg-card/80 text-foreground border border-border"
                : "text-muted-foreground hover:text-foreground hover:bg-card/50"
            }
          >
            All
          </Button>
          <Button
            variant={activeFilter === "trending" ? "default" : "ghost"}
            size="sm"
            onClick={() => handleFilterChange("trending")}
            className={
              activeFilter === "trending"
                ? "bg-card hover:bg-card/80 text-foreground border border-border"
                : "text-muted-foreground hover:text-foreground hover:bg-card/50"
            }
          >
            <TrendingUp className="h-4 w-4 mr-1.5" />
            Trending
          </Button>
          <Button
            variant={activeFilter === "solved" ? "default" : "ghost"}
            size="sm"
            onClick={() => handleFilterChange("solved")}
            className={
              activeFilter === "solved"
                ? "bg-card hover:bg-card/80 text-foreground border border-border"
                : "text-muted-foreground hover:text-foreground hover:bg-card/50"
            }
          >
            <CheckCircle2 className="h-4 w-4 mr-1.5" />
            Solved
          </Button>
          <Button
            variant={activeFilter === "following" ? "default" : "ghost"}
            size="sm"
            onClick={() => handleFilterChange("following")}
            className={
              activeFilter === "following"
                ? "bg-card hover:bg-card/80 text-foreground border border-border"
                : "text-muted-foreground hover:text-foreground hover:bg-card/50"
            }
          >
            <Star className="h-4 w-4 mr-1.5" />
            Following
          </Button>
        </div>

        <div className="space-y-4">
        {posts?.pages.map((page, pageIndex) =>
          page.content.map(post => (
            <PostCard key={`${pageIndex}-${post.id}`} post={post} />
          ))
        )}
        </div>

        {hasNextPage && (
          <div ref={observerTarget} className="flex justify-center py-8">
            {isFetchingNextPage && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>loading more posts...</span>
              </div>
            )}
          </div>
        )}

        {!hasNextPage && posts && posts.pages.length > 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>You've reached the end!</p>
          </div>
        )}
      </div>
      </AppShell>
      </ProtectedRoute>
  )
}
