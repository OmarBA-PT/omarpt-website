import { useEffect, useState } from 'react';

/**
 * Hook to load audio duration from an audio file URL
 * Only loads if Sanity metadata duration is not available
 */
export const useAudioDuration = (audioUrl?: string, metadataDuration?: number) => {
  const [duration, setDuration] = useState<number>(metadataDuration || 0);

  useEffect(() => {
    // If we already have duration from metadata, use that
    if (metadataDuration && metadataDuration > 0) {
      setDuration(metadataDuration);
      return;
    }

    // Otherwise, load it from the audio file
    if (!audioUrl) return;

    const audio = new Audio(audioUrl);

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [audioUrl, metadataDuration]);

  return duration;
};
