import React, { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import PostSkeleton from './PostSkeleton';
import PostList from './PostList';
import type { Post } from '../../types/post';

export default function HomeFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          content,
          media_url,
          media_type,
          created_at,
          profiles!posts_user_id_fkey (
            username,
            avatar_url
          ),
          likes (count),
          comments (count)
        `)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      
      // Transform the data to match the Post type
      const transformedPosts = data?.map(post => ({
        ...post,
        user: post.profiles,
        likes_count: [{ count: post.likes?.[0]?.count || 0 }],
        comments_count: [{ count: post.comments?.[0]?.count || 0 }]
      })) || [];

      setPosts(transformedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();

    const channel = supabase
      .channel('public:posts')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts'
        },
        () => {
          fetchPosts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
      <AnimatePresence mode="wait">
        {loading ? (
          <React.Fragment key="skeletons">
            {Array.from({ length: 6 }, (_, index) => (
              <PostSkeleton key={`skeleton-${index}`} index={index} />
            ))}
          </React.Fragment>
        ) : (
          <React.Fragment key="posts">
            <PostList posts={posts} onLike={fetchPosts} />
          </React.Fragment>
        )}
      </AnimatePresence>
    </div>
  );
}