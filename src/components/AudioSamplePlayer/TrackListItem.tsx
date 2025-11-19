import React from 'react';
import UnifiedImage from '@/components/UI/UnifiedImage';
import PlaceholderImage from './PlaceholderImage';
import { formatTime } from './utils';
import { useAudioDuration } from './useAudioDuration';
import type { AudioSample } from './types';

interface TrackListItemProps {
  sample: AudioSample;
  index: number;
  isCurrentTrack: boolean;
  onPlayTrack: (index: number) => void;
}

const TrackListItem = ({ sample, index, isCurrentTrack, onPlayTrack }: TrackListItemProps) => {
  const duration = useAudioDuration(
    sample.audioFile?.asset?.url,
    sample.audioFile?.asset?.duration
  );
  return (
    <button
      onClick={() => onPlayTrack(index)}
      className={`w-full p-4 hover:bg-brand-primary/5 transition-colors text-left flex items-center cursor-pointer gap-4 ${
        isCurrentTrack ? 'bg-brand-primary/10' : ''
      }`}>
      {/* Track image */}
      <div className='relative w-14 h-14 rounded overflow-hidden flex-shrink-0'>
        {sample.image?.asset ? (
          <UnifiedImage
            src={sample.image}
            alt={`${sample.songName} artwork`}
            mode='fill'
            sizeContext='thumbnail'
            objectFit='cover'
            documentId={sample._id}
            documentType={sample._type || 'audioSample'}
            fieldPath='image'
          />
        ) : (
          <PlaceholderImage />
        )}
      </div>

      {/* Track info */}
      <div className='flex-1 min-w-0'>
        <p className='text-body-base font-medium truncate'>{sample.songName}</p>
        <p className='text-body-sm text-brand-secondary truncate'>{sample.artistName}</p>
      </div>

      {/* Duration */}
      <div className='text-body-sm text-subtle flex-shrink-0'>
        {duration > 0 ? formatTime(duration) : '—'}
      </div>
    </button>
  );
};

export default TrackListItem;
