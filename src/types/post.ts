export interface Post {
  id: string;
  content: string;
  media_url?: string;
  media_type?: string;
  created_at: string;
  user: {
    username: string;
    avatar_url?: string;
  };
  likes_count: { count: number }[];
  comments_count: { count: number }[];
  liked_by_user: boolean;
}