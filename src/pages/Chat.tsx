import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, AlertCircle, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import VoiceMessage from '../components/VoiceMessage';
import VoiceChat from '../components/VoiceChat';
import MessageBubble from '../components/MessageBubble';
import type { Message } from '../types/message';

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchMessages();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('chat')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        async (payload) => {
          // Fetch complete message data including sender info
          const { data: newMessage } = await supabase
            .from('messages')
            .select(`
              *,
              sender:profiles(username, avatar_url)
            `)
            .eq('id', payload.new.id)
            .single();

          if (newMessage) {
            setMessages(current => [...current, newMessage]);
            scrollToBottom();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles(username, avatar_url)
        `)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(data || []);
      scrollToBottom();
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          content: newMessage.trim(),
          sender_id: user.id,
          type: 'text'
        });

      if (error) throw error;

      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleVoiceMessage = async (voiceUrl: string, duration: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          content: voiceUrl,
          sender_id: user.id,
          type: 'voice',
          duration
        });

      if (error) throw error;
    } catch (err) {
      console.error('Error sending voice message:', err);
      setError('Failed to send voice message. Please try again.');
      setTimeout(() => setError(null), 3000);
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-white text-lg">Please sign in to access the chat.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg rounded-xl h-[600px] flex flex-col relative"
      >
        {error && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500/90 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader className="h-8 w-8 text-purple-500 animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-white/50">
              No messages yet. Start a conversation!
            </div>
          ) : (
            messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-start space-x-3 ${
                  message.sender_id === user?.id ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <img
                  src={message.sender.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde'}
                  alt={message.sender.username}
                  className="h-8 w-8 rounded-full"
                />
                <MessageBubble 
                  message={message} 
                  isOwnMessage={message.sender_id === user?.id} 
                />
              </motion.div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage} className="p-4 border-t border-white/10">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-white/5 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <VoiceMessage onSend={handleVoiceMessage} />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </form>
      </motion.div>
      <VoiceChat />
    </div>
  );
}