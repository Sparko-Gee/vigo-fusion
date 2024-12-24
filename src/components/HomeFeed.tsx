import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import PostCard from './PostCard';

export default function HomeFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          user:profiles(*),
          likes_count:likes(count),
          comments_count:comments(count)
        `)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();

    // Subscribe to real-time updates
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
      <AnimatePresence>
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <motion.div
              key={`skeleton-${i}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl h-64 animate-pulse"
            />
          ))
        ) : (
          posts.map((post: any) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <PostCard post={post} onLike={fetchPosts} />
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  );
}