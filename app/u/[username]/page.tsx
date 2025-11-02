// app/u/[username]/page.tsx

import UserPageClient from "./UserPageClient";

type UserPageProps = {
  params: Promise<{ username: string }>;
};

export default async function UserPage({ params }: UserPageProps) {
  const { username } = await params;
  // ✅ Server Component — just pass params
  return <UserPageClient username={username} />;
}
