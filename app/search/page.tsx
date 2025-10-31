"use client"

import { useState, useMemo } from "react"
import { AppShell } from "@/components/app-shell"
import { PostCard } from "@/components/post-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { mockPosts } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"

type SearchPageProps = {
  searchParams: {
    q?: string
  }
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const initialQuery = searchParams.q || ""
  const [query, setQuery] = useState(initialQuery)
  const [activeTab, setActiveTab] = useState("posts")
  const [sortBy, setSortBy] = useState("relevance")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const filteredPosts = useMemo(() => {
    let results = mockPosts

    // Filter by search query
    if (query.trim()) {
      const lowerQuery = query.toLowerCase()
      results = results.filter(
        (post) =>
          post.title.toLowerCase().includes(lowerQuery) ||
          post.content.toLowerCase().includes(lowerQuery) ||
          post.author.name.toLowerCase().includes(lowerQuery) ||
          post.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)),
      )
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      results = results.filter((post) => selectedTags.some((tag) => post.tags.includes(tag)))
    }

    // Sort results
    if (sortBy === "recent") {
      results = [...results].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } else if (sortBy === "popular") {
      results = [...results].sort((a, b) => b.likes - a.likes)
    }

    return results
  }, [query, selectedTags, sortBy])

  // Get all unique tags from posts
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    mockPosts.forEach((post) => post.tags.forEach((tag) => tags.add(tag)))
    return Array.from(tags)
  }, [])

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  return (
    <AppShell showSidebar={false}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Search</h1>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search discussions, users, tags..."
              className="pl-10 pr-4 h-12 text-lg bg-muted border-border"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>

          {/* Results Count */}
          {query && (
            <p className="text-sm text-muted-foreground">
              Found <span className="font-semibold text-foreground">{filteredPosts.length}</span> results for "{query}"
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
            <TabsList className="grid w-full sm:w-auto grid-cols-3 bg-muted">
              <TabsTrigger value="posts">Posts ({filteredPosts.length})</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="tags">Tags</TabsTrigger>
            </TabsList>
          </Tabs>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {sortBy === "relevance" && "Relevance"}
                  {sortBy === "recent" && "Recent"}
                  {sortBy === "popular" && "Popular"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy("relevance")}>Most Relevant</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("recent")}>Most Recent</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("popular")}>Most Popular</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {allTags.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Filter by tags:</p>
            <div className="flex flex-wrap gap-2">
              {allTags.slice(0, 10).map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/80"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                  {selectedTags.includes(tag) && <X className="ml-1 h-3 w-3" />}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        <div className="space-y-4">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No results found. Try adjusting your search.</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
