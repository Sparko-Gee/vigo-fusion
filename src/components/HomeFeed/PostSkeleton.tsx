import React from 'react';
import { motion } from 'framer-motion';

interface PostSkeletonProps {
  index: number;
}

export default function PostSkeleton({ index }: PostSkeletonProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white/10 backdrop-blur-lg rounded-xl h-64 animate-pulse"
    />
  );
}