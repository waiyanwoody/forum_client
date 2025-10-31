"use client"

import { useState, useEffect, useRef } from "react"
import { AppShell } from "@/components/app-shell"
import { Sidebar } from "@/components/sidebar"
import { PostCard } from "@/components/post-card"
import { mockPosts } from "@/lib/mock-data"
import { Loader2, TrendingUp, CheckCircle2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

type FilterTab = "all" | "trending" | "solved" | "following"

export default function HomePage() {
  const [posts, setPosts] = useState(mockPosts.slice(0, 10))
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all")
  const observerTarget = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMorePosts()
        }
      },
      { threshold: 0.1 },
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [hasMore, loading, page])

  const loadMorePosts = () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      const nextPage = page + 1
      const startIndex = nextPage * 10
      const endIndex = startIndex + 10
      const newPosts = mockPosts.slice(startIndex, endIndex)

      if (newPosts.length === 0) {
        setHasMore(false)
      } else {
        setPosts((prev) => [...prev, ...newPosts])
        setPage(nextPage)
      }
      setLoading(false)
    }, 1000)
  }

  const handleFilterChange = (filter: FilterTab) => {
    setActiveFilter(filter)
    // Reset posts and pagination when filter changes
    setPosts(mockPosts.slice(0, 10))
    setPage(1)
    setHasMore(true)
  }

  return (
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
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {hasMore && (
          <div ref={observerTarget} className="flex justify-center py-8">
            {loading && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading more posts...</span>
              </div>
            )}
          </div>
        )}

        {!hasMore && posts.length > 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>You've reached the end!</p>
          </div>
        )}
      </div>
    </AppShell>
  )
}
