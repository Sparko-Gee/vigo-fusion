import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, PhoneOff } from 'lucide-react';

export default function VoiceChat() {
  const [isInCall, setIsInCall] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCall = async () => {
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(audioStream);
      setIsInCall(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const endCall = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsInCall(false);
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed bottom-4 right-4"
    >
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={isInCall ? endCall : startCall}
        className={`p-4 rounded-full ${
          isInCall ? 'bg-red-500' : 'bg-green-500'
        } text-white shadow-lg hover:opacity-90 transition-colors`}
      >
        {isInCall ? (
          <PhoneOff className="h-6 w-6" />
        ) : (
          <Phone className="h-6 w-6" />
        )}
      </motion.button>
    </motion.div>
  );
}