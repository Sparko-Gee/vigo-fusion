import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Loader } from 'lucide-react';
import { getPublicUrl } from '../lib/supabase-storage';

interface AudioPlayerProps {
  url: string;
}

export default function AudioPlayer({ url }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadAudio = async () => {
      try {
        setLoading(true);
        setError(null);
        const signedUrl = await getPublicUrl(url);
        if (mounted) {
          setAudioUrl(signedUrl);
        }
      } catch (err) {
        if (mounted) {
          setError('Failed to load audio');
          console.error('Error loading audio:', err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadAudio();
    return () => {
      mounted = false;
    };
  }, [url]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioUrl]);

  const togglePlay = async () => {
    if (!audioRef.current || !audioUrl) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        await audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } catch (err) {
      setError('Failed to play audio');
      console.error('Error playing audio:', err);
    }
  };

  const formatTime = (time: number) => {
    if (!isFinite(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getRemainingTime = () => {
    const remaining = duration - currentTime;
    return formatTime(remaining);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-2">
        <Loader className="h-4 w-4 text-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      <button
        onClick={togglePlay}
        disabled={!audioUrl}
        className="p-2 rounded-full bg-purple-500/20 hover:bg-purple-500/30 transition-colors disabled:opacity-50"
      >
        {isPlaying ? (
          <Pause className="h-4 w-4 text-white" />
        ) : (
          <Play className="h-4 w-4 text-white" />
        )}
      </button>
      
      <div className="flex-1">
        <div className="h-1 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-500 transition-all duration-100"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-1 text-xs text-white/70">
          <span>{formatTime(currentTime)}</span>
          <span>-{getRemainingTime()}</span>
        </div>
      </div>

      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          preload="metadata"
        />
      )}
    </div>
  );
}