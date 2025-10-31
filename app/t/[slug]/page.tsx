import { AppShell } from "@/components/app-shell"
import { ThreadDetail } from "@/components/thread-detail"
import { CommentTree } from "@/components/comment-tree"
import { CommentForm } from "@/components/comment-form"
import { ThreadSidebar } from "@/components/thread-sidebar"
import { mockPosts, mockComments } from "@/lib/mock-data"

type ThreadPageProps = {
  params: {
    slug: string
  }
}

export default function ThreadPage({ params }: ThreadPageProps) {
  // In a real app, fetch the post by slug
  const post = mockPosts[0]

  return (
    <AppShell sidebar={<ThreadSidebar post={post} />}>
      <div className="space-y-6">
        <ThreadDetail post={post} />

        <div className="border-t border-border pt-6">
          <h2 className="text-xl font-semibold mb-6">
            {mockComments.length} {mockComments.length === 1 ? "Reply" : "Replies"}
          </h2>

          <div className="space-y-6">
            <CommentForm />
            <CommentTree comments={mockComments} />
          </div>
        </div>
      </div>
    </AppShell>
  )
}
