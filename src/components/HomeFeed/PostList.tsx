import React from 'react';
import { motion } from 'framer-motion';
import PostCard from '../PostCard';
import type { Post } from '../../types/post';

interface PostListProps {
  posts: Post[];
  onLike: () => void;
}

export default function PostList({ posts, onLike }: PostListProps) {
  return posts.map((post) => (
    <motion.div
      key={`post-${post.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <PostCard post={post} onLike={onLike} />
    </motion.div>
  ));
}