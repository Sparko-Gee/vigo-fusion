import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, Square, Send } from 'lucide-react';
import { startRecording, stopRecording, createAudioBlob } from '../lib/audio';
import { uploadVoiceMessage } from '../lib/storage';

interface VoiceMessageProps {
  onSend: (url: string, duration: number) => void;
}

export default function VoiceMessage({ onSend }: VoiceMessageProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);
  const [duration, setDuration] = useState(0);

  const handleStartRecording = async () => {
    try {
      const { mediaRecorder, chunks, stream } = await startRecording();
      mediaRecorderRef.current = mediaRecorder;
      streamRef.current = stream;
      chunksRef.current = chunks;
      startTimeRef.current = Date.now();

      mediaRecorder.onstop = () => {
        const blob = createAudioBlob(chunksRef.current);
        const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
        setDuration(duration);
        setAudioBlob(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const handleStopRecording = () => {
    stopRecording(mediaRecorderRef.current, streamRef.current);
    setIsRecording(false);
  };

  const handleSendVoiceMessage = async () => {
    if (!audioBlob) return;

    try {
      const path = await uploadVoiceMessage(audioBlob);
      onSend(path, duration);
      setAudioBlob(null);
      setDuration(0);
    } catch (error) {
      console.error('Error sending voice message:', error);
    }
  };

  return (
    <motion.div className="flex items-center space-x-2">
      {!audioBlob ? (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={isRecording ? handleStopRecording : handleStartRecording}
          className={`p-2 rounded-full ${
            isRecording ? 'bg-red-500' : 'bg-purple-600'
          } text-white hover:opacity-90 transition-colors`}
          title={isRecording ? 'Stop Recording' : 'Start Recording'}
        >
          {isRecording ? (
            <Square className="h-5 w-5" />
          ) : (
            <Mic className="h-5 w-5" />
          )}
        </motion.button>
      ) : (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleSendVoiceMessage}
          className="p-2 rounded-full bg-purple-600 text-white hover:opacity-90 transition-colors"
          title="Send Voice Message"
        >
          <Send className="h-5 w-5" />
        </motion.button>
      )}
    </motion.div>
  );
}