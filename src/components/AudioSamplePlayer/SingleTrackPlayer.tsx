import React from 'react';
import UnifiedImage from '@/components/UI/UnifiedImage';
import { PlayIcon, PauseIcon } from './Icons';
import PlaceholderImage from './PlaceholderImage';
import TimelineBar from './TimelineBar';
import VolumeControl from './VolumeControl';
import type { AudioSample } from './types';
import { maxCardWidth } from '@/utils/spacingConstants';

interface SingleTrackPlayerProps {
  track: AudioSample;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  progressPercentage: number;
  volume: number;
  isMuted: boolean;
  isIOS: boolean;
  documentId?: string;
  documentType?: string;
  onPlayPause: () => void;
  onTimelineChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleMute: () => void;
}

const SingleTrackPlayer = ({
  track,
  isPlaying,
  currentTime,
  duration,
  progressPercentage,
  volume,
  isMuted,
  isIOS,
  documentId,
  documentType,
  onPlayPause,
  onTimelineChange,
  onVolumeChange,
  onToggleMute,
}: SingleTrackPlayerProps) => {
  return (
    <div
      className={`${maxCardWidth} mx-auto relative rounded-lg bg-gradient-to-br from-brand-white to-brand-white-dark overflow-hidden shadow-sm text-left`}
      data-sanity-edit-target={documentId && documentType ? `${documentId}` : undefined}>
      {/* Header */}
      <div className='bg-brand-white-dark border-b border-brand-primary/10 p-4'>
        <div className='flex flex-col md:flex-row items-start md:items-center gap-4'>
          <div className='flex items-center gap-4 w-full md:w-auto'>
            {/* Current track image with play button overlay */}
            <div className='relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 group cursor-pointer'>
              <div className='absolute inset-0 z-0'>
                {track.image?.asset ? (
                  <UnifiedImage
                    src={track.image}
                    alt={`${track.songName} artwork`}
                    mode='fill'
                    sizeContext='thumbnail'
                    objectFit='cover'
                    documentId={track._id}
                    documentType={track._type || 'audioSample'}
                    fieldPath='image'
                  />
                ) : (
                  <PlaceholderImage />
                )}
              </div>
              {/* Darkening overlay */}
              <div className='absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors z-10' />
              {/* Play/Pause button */}
              <button
                onClick={onPlayPause}
                className='absolute inset-0 z-20 flex items-center justify-center text-white hover:scale-110 transition-transform cursor-pointer'
                aria-label={isPlaying ? 'Pause' : 'Play'}>
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </button>
            </div>

            {/* Current track info */}
            <div className='flex-1 min-w-0'>
              <p className='text-h5 truncate'>{track.songName}</p>
              <p className='text-body-lg text-brand-secondary truncate'>{track.artistName}</p>
              {track.services && track.services.length > 0 && (
                <p className='text-body-base text-subtle truncate'>{track.services.join(' • ')}</p>
              )}
            </div>
          </div>

          {/* Volume control - desktop only, aligned to right */}
          {!isIOS && (
            <div className='hidden md:block md:ml-auto'>
              <VolumeControl
                volume={volume}
                isMuted={isMuted}
                onVolumeChange={onVolumeChange}
                onToggleMute={onToggleMute}
              />
            </div>
          )}
        </div>
      </div>

      {/* Timeline bar */}
      <div className='bg-brand-white-dark px-6 py-4 border-t border-brand-primary/10'>
        <TimelineBar
          currentTime={currentTime}
          duration={duration}
          progressPercentage={progressPercentage}
          onTimelineChange={onTimelineChange}
        />

        {/* Volume control - mobile only, below timeline */}
        {!isIOS && (
          <div className='md:hidden mt-4'>
            <VolumeControl
              volume={volume}
              isMuted={isMuted}
              onVolumeChange={onVolumeChange}
              onToggleMute={onToggleMute}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleTrackPlayer;
