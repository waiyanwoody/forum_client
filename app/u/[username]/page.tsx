import { AppShell } from "@/components/app-shell"
import { UserProfile } from "@/components/user-profile"
import { UserActivity } from "@/components/user-activity"
import { mockUsers, mockPosts, mockUserReplies, mockLikedPosts, mockSavedPosts } from "@/lib/mock-data"

type UserPageProps = {
  params: {
    username: string
  }
}

export default function UserPage({ params }: UserPageProps) {
  // In a real app, fetch user by username
  const user = mockUsers[0]
  const userPosts = mockPosts.filter((post) => post.author.id === user.id)

  return (
    <AppShell showSidebar={false}>
      <div className="max-w-4xl mx-auto space-y-6">
        <UserProfile user={user} />
        <UserActivity
          posts={userPosts}
          replies={mockUserReplies}
          likedPosts={mockLikedPosts}
          savedPosts={mockSavedPosts}
        />
      </div>
    </AppShell>
  )
}
