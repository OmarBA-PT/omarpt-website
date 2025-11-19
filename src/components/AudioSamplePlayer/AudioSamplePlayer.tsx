import React, { useRef, useState, useEffect } from 'react';
import { detectIOS } from './utils';
import SingleTrackPlayer from './SingleTrackPlayer';
import MultiTrackPlayer from './MultiTrackPlayer';
import type { AudioSamplePlayerProps } from './types';

const AudioSamplePlayer = ({ audioSamples, documentId, documentType }: AudioSamplePlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  const validSamples = audioSamples?.filter(sample => sample?.audioFile?.asset?.url) || [];
  const currentTrack = validSamples[currentTrackIndex];
  const isSingleTrack = validSamples.length === 1;

  // Detect iOS devices where volume control doesn't work
  useEffect(() => {
    setIsIOS(detectIOS());
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (!isSingleTrack && currentTrackIndex < validSamples.length - 1) {
        // Auto-advance to next track and keep playing
        setCurrentTrackIndex(prev => prev + 1);
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play().catch(() => setIsPlaying(false));
          }
        }, 100);
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex, validSamples.length, isSingleTrack]);

  // Reset playback when track changes (NOT when play state changes)
  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
    // Load the new track's metadata
    if (audioRef.current) {
      audioRef.current.load();
    }
  }, [currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
    setIsPlaying(!isPlaying);
  };

  const playTrack = (index: number) => {
    // Stop current track if playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    // Switch to new track
    setCurrentTrackIndex(index);
    setCurrentTime(0);
    // Start playing after a brief delay to let the track load
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().catch(() => setIsPlaying(false));
        setIsPlaying(true);
      }
    }, 50);
  };

  const skipToNext = () => {
    if (currentTrackIndex < validSamples.length - 1) {
      const wasPlaying = isPlaying;
      setCurrentTrackIndex(prev => prev + 1);
      if (wasPlaying) {
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play().catch(() => setIsPlaying(false));
          }
        }, 100);
      }
    }
  };

  const skipToPrevious = () => {
    if (currentTrackIndex > 0) {
      const wasPlaying = isPlaying;
      setCurrentTrackIndex(prev => prev - 1);
      if (wasPlaying) {
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play().catch(() => setIsPlaying(false));
          }
        }, 100);
      }
    }
  };

  const handleTimelineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume(0.7);
      setIsMuted(false);
    } else {
      setVolume(0);
      setIsMuted(true);
    }
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!currentTrack) {
    return (
      <div className='p-6 rounded-lg border-2 border-brand-primary/20 bg-brand-white'>
        <p className='text-body-base text-brand-primary'>No audio samples available</p>
      </div>
    );
  }

  const commonProps = {
    isPlaying,
    currentTime,
    duration,
    progressPercentage,
    volume,
    isMuted,
    isIOS,
    documentId,
    documentType,
    onPlayPause: togglePlayPause,
    onTimelineChange: handleTimelineChange,
    onVolumeChange: handleVolumeChange,
    onToggleMute: toggleMute,
  };

  return (
    <>
      {isSingleTrack ? (
        <SingleTrackPlayer track={currentTrack} {...commonProps} />
      ) : (
        <MultiTrackPlayer
          tracks={validSamples}
          currentTrack={currentTrack}
          currentTrackIndex={currentTrackIndex}
          onPlayTrack={playTrack}
          onSkipNext={skipToNext}
          onSkipPrevious={skipToPrevious}
          {...commonProps}
        />
      )}

      {/* Hidden Audio Element */}
      <audio ref={audioRef} src={currentTrack.audioFile?.asset?.url} preload='metadata' />
    </>
  );
};

export default AudioSamplePlayer;
