import { AppShell } from "@/components/app-shell"
import { ThreadForm } from "@/components/thread-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockPosts } from "@/lib/mock-data"

type EditThreadPageProps = {
  params: {
    slug: string
  }
}

export default function EditThreadPage({ params }: EditThreadPageProps) {
  // In a real app, fetch the post by slug
  const post = mockPosts[0]

  return (
    <AppShell showSidebar={false}>
      <div className="max-w-3xl mx-auto">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-2xl">Edit Thread</CardTitle>
            <CardDescription>Update your thread details</CardDescription>
          </CardHeader>
          <CardContent>
            <ThreadForm
              initialData={{
                title: post.title,
                content: post.contentMD,
                tags: post.tags,
              }}
              isEditing
            />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
