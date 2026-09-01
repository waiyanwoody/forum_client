"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { PostCard } from "./post-card"
import { MessageSquare, ThumbsUp, Bookmark } from "lucide-react"
import type { Post, Comment, UserPostsResponse } from "@/lib/types"
import { format } from "date-fns"
import { PostCardSummary } from "./post-card-summary"
import { getUserLikedPosts, getUserReplies, getUserSavedPosts } from "@/lib/api/activity"

type UserActivityProps = {
  userPosts: UserPostsResponse | null
  userId?: number | string
}

export function UserActivity({ userPosts, userId }: UserActivityProps) {
  const [activeTab, setActiveTab] = useState("posts")
  const author = userPosts?.author;
  const posts = userPosts?.posts;
  const activityUserId = userId ?? author?.id;

  const repliesQuery = useQuery({
    queryKey: ["userReplies", activityUserId],
    queryFn: () => getUserReplies(activityUserId!),
    enabled: !!activityUserId && activeTab === "replies",
  })
  const likedPostsQuery = useQuery({
    queryKey: ["userLikedPosts", activityUserId],
    queryFn: () => getUserLikedPosts(activityUserId!),
    enabled: !!activityUserId && activeTab === "likes",
  })
  const savedPostsQuery = useQuery({
    queryKey: ["userSavedPosts", activityUserId],
    queryFn: () => getUserSavedPosts(activityUserId!),
    enabled: !!activityUserId && activeTab === "saved",
  })

  const replies = repliesQuery.data ?? []
  const likedPosts = likedPostsQuery.data ?? []
  const savedPosts = savedPostsQuery.data ?? []

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="bg-muted">
        <TabsTrigger value="posts">Posts</TabsTrigger>
        <TabsTrigger value="replies">Replies</TabsTrigger>
        <TabsTrigger value="likes">Likes</TabsTrigger>
        <TabsTrigger value="saved">Saved</TabsTrigger>
      </TabsList>

      <TabsContent value="posts" className="space-y-4">
        {posts && author && posts.length > 0 ? (
          posts.map((post) => <PostCardSummary key={post.id} post={post} author={author} />)
        ) : (
          <div className="text-center py-12 text-muted-foreground">No posts yet</div>
        )}
      </TabsContent>

      <TabsContent value="replies" className="space-y-4">
        {replies.length > 0 ? (
          replies.map((reply) => (
            <Card key={reply.id} className="border-border bg-card hover:bg-accent/5 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <MessageSquare className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1 space-y-2">
                    <div className="text-sm text-muted-foreground">
                      Replied {format(new Date(reply.createdAt), "MMM d, yyyy")}
                    </div>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <p className="text-foreground">{reply.content}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{reply.likeCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">No replies yet</div>
        )}
      </TabsContent>

      <TabsContent value="likes" className="space-y-4">
        {likedPostsQuery.isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading liked posts...</div>
        ) : likedPostsQuery.isError ? (
          <div className="text-center py-12 text-destructive">
            {likedPostsQuery.error instanceof Error
              ? likedPostsQuery.error.message
              : "Failed to load liked posts"}
          </div>
        ) : likedPosts.length > 0 ? (
          likedPosts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="text-center py-12 text-muted-foreground">No liked posts yet</div>
        )}
      </TabsContent>

      <TabsContent value="saved" className="space-y-4">
        {savedPosts.length > 0 ? (
          savedPosts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Bookmark className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p>No saved threads yet</p>
            <p className="text-sm mt-2">Save threads to read them later</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}
