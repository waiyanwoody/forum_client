// app/u/[username]/UserPageClient.tsx
"use client";

import { AppShell } from "@/components/app-shell";
import { UserProfile } from "@/components/user-profile";
import { UserActivity } from "@/components/user-activity";
import {
  mockPosts,
  mockUserReplies,
  mockLikedPosts,
  mockSavedPosts,
} from "@/lib/mock-data";
import { useFetchProfile } from "@/hooks/use-fetch-profile";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/contexts/auth-context";

export default function UserPageClient({ username }: { username: string }) {
    const { profile, posts:userPosts, status, loading } = useFetchProfile(username);
    const { user } = useAuth();

    const isCurrentUser = () => {
        return username === user?.username;
    }

  return (
    <ProtectedRoute>
      <AppShell showSidebar={false}>
        <div className="max-w-4xl mx-auto space-y-6">
          <UserProfile isCurrentUser={isCurrentUser()} user={profile} stats={status} />
          <UserActivity
            userPosts={userPosts}
            replies={mockUserReplies}
            likedPosts={mockLikedPosts}
            savedPosts={mockSavedPosts}
          />
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
