import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const { user } = useAuth();

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        user:profiles(*),
        likes_count:likes(count),
        comments_count:comments(count),
        liked_by_user:likes!inner(user_id)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
      return;
    }

    setPosts(data || []);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {user && <CreatePost onPostCreated={fetchPosts} />}
        
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={fetchPosts}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}