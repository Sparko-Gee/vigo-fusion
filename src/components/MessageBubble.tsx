import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import AudioPlayer from './AudioPlayer';
import type { Message } from '../types/message';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
}

export default function MessageBubble({ message, isOwnMessage }: MessageBubbleProps) {
  return (
    <div
      className={`max-w-[70%] ${
        isOwnMessage
          ? 'bg-purple-600 text-white'
          : 'bg-white/20 text-white'
      } rounded-lg p-3`}
    >
      <p className="text-sm font-medium mb-1">{message.sender.username}</p>
      {message.type === 'voice' ? (
        <div className="w-[240px]">
          <AudioPlayer url={message.content} />
        </div>
      ) : (
        <p>{message.content}</p>
      )}
      <p className="text-xs opacity-70 mt-1">
        {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
      </p>
    </div>
  );
}