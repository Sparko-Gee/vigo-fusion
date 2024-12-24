import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Image, Video, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface CreatePostProps {
  onPostCreated: () => void;
}

export default function CreatePost({ onPostCreated }: CreatePostProps) {
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !file) return;
    
    setIsUploading(true);
    try {
      let mediaUrl = '';
      let mediaType = '';
      
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { data, error } = await supabase.storage
          .from('posts')
          .upload(fileName, file);
          
        if (error) throw error;
        
        mediaUrl = data.path;
        mediaType = file.type.startsWith('image/') ? 'image' : 'video';
      }
      
      await supabase.from('posts').insert({
        content,
        user_id: user?.id,
        media_url: mediaUrl,
        media_type: mediaType
      });
      
      setContent('');
      setFile(null);
      onPostCreated();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6"
    >
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full bg-white/5 rounded-lg p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          rows={3}
        />
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex space-x-4">
            <label className="cursor-pointer text-gray-400 hover:text-white transition-colors">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <Image className="h-6 w-6" />
            </label>
            
            <label className="cursor-pointer text-gray-400 hover:text-white transition-colors">
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <Video className="h-6 w-6" />
            </label>
          </div>
          
          <button
            type="submit"
            disabled={isUploading || (!content.trim() && !file)}
            className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
            <span>{isUploading ? 'Posting...' : 'Post'}</span>
          </button>
        </div>
      </form>
    </motion.div>
  );
}