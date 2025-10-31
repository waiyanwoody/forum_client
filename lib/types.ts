export type Post = {
  id: string
  title: string
  slug: string
  excerpt: string
  contentMD: string
  tags: string[]
  author: User
  createdAt: string
  lastActivityAt: string
  likeCount: number
  replyCount: number
  isSaved: boolean
  isPinned?: boolean
  isSolved?: boolean
}

export type Comment = {
  id: string
  author: User
  contentMD: string
  createdAt: string
  likeCount: number
  isLiked: boolean
  children: Comment[]
}

export type User = {
  id: string
  name: string
  username: string
  avatar: string
  bio?: string
  joinedAt?: string
  badges?: Badge[]
  stats?: UserStats
}

export type Badge = {
  id: string
  name: string
  icon: string
  color: string
}

export type UserStats = {
  posts: number
  replies: number
  likesReceived: number
  solutions: number
  followingCount: number
  followerCount: number
  postCount: number
  postLikeCount: number
}

export type Notification = {
  id: string
  type: "LIKE" | "REPLY" | "MENTION"
  message: string
  createdAt: string
  read: boolean
  link: string
}
