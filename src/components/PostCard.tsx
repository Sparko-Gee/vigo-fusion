import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

interface PostCardProps {
  post: {
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
  };
  onLike: () => void;
}

export default function PostCard({ post, onLike }: PostCardProps) {
  const { user } = useAuth();
  const likesCount = post.likes_count?.[0]?.count || 0;
  const commentsCount = post.comments_count?.[0]?.count || 0;

  const handleLike = async () => {
    if (!user) return;
    
    if (!post.liked_by_user) {
      await supabase.from('likes').insert({
        post_id: post.id,
        user_id: user.id
      });
    } else {
      await supabase.from('likes')
        .delete()
        .match({ post_id: post.id, user_id: user.id });
    }
    
    onLike();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6"
    >
      <div className="flex items-center mb-4">
        <img
          src={post.user.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde'}
          alt={post.user.username}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div className="ml-3">
          <p className="text-white font-medium">{post.user.username}</p>
          <p className="text-gray-400 text-sm">
            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
          </p>
        </div>
      </div>
      
      <p className="text-white mb-4">{post.content}</p>
      
      {post.media_url && (
        <div className="mb-4 rounded-lg overflow-hidden">
          {post.media_type === 'image' ? (
            <img src={post.media_url} alt="Post content" className="w-full" />
          ) : (
            <video src={post.media_url} controls className="w-full" />
          )}
        </div>
      )}
      
      <div className="flex items-center space-x-6">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-2 ${
            post.liked_by_user ? 'text-pink-500' : 'text-gray-400'
          } hover:text-pink-500 transition-colors`}
        >
          <Heart className="h-5 w-5" />
          <span>{likesCount}</span>
        </button>
        
        <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
          <MessageCircle className="h-5 w-5" />
          <span>{commentsCount}</span>
        </button>
        
        <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
          <Share2 className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  );
}