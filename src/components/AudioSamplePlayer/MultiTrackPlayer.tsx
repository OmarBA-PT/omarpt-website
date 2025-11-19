import React from 'react';
import UnifiedImage from '@/components/UI/UnifiedImage';
import { PlayIcon, PauseIcon, SkipPreviousIcon, SkipNextIcon } from './Icons';
import PlaceholderImage from './PlaceholderImage';
import TimelineBar from './TimelineBar';
import VolumeControl from './VolumeControl';
import TrackListItem from './TrackListItem';
import type { AudioSample } from './types';
import { maxCardWidth } from '@/utils/spacingConstants';

interface MultiTrackPlayerProps {
  tracks: AudioSample[];
  currentTrack: AudioSample;
  currentTrackIndex: number;
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
  onPlayTrack: (index: number) => void;
  onSkipNext: () => void;
  onSkipPrevious: () => void;
  onTimelineChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleMute: () => void;
}

const MultiTrackPlayer = ({
  tracks,
  currentTrack,
  currentTrackIndex,
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
  onPlayTrack,
  onSkipNext,
  onSkipPrevious,
  onTimelineChange,
  onVolumeChange,
  onToggleMute,
}: MultiTrackPlayerProps) => {
  return (
    <div
      className={`${maxCardWidth} mx-auto relative rounded-lg bg-gradient-to-br from-brand-white to-brand-white-dark overflow-hidden shadow-sm text-left`}
      data-sanity-edit-target={documentId && documentType ? `${documentId}` : undefined}>
      {/* Currently playing track header */}
      <div className='bg-brand-white-dark border-b border-brand-primary/10 p-4'>
        <div className='flex flex-col md:flex-row items-start md:items-center gap-4'>
          <div className='flex items-center gap-4 w-full md:w-auto'>
            {/* Current track image with play button overlay */}
            <div className='relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 group cursor-pointer'>
              <div className='absolute inset-0 z-0'>
                {currentTrack.image?.asset ? (
                  <UnifiedImage
                    src={currentTrack.image}
                    alt={`${currentTrack.songName} artwork`}
                    mode='fill'
                    sizeContext='thumbnail'
                    objectFit='cover'
                    documentId={currentTrack._id}
                    documentType={currentTrack._type || 'audioSample'}
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
              <p className='text-h5 truncate'>{currentTrack.songName}</p>
              <p className='text-body-lg text-brand-secondary truncate'>
                {currentTrack.artistName}
              </p>
              {currentTrack.services && currentTrack.services.length > 0 && (
                <p className='text-body-base text-subtle truncate'>
                  {currentTrack.services.join(' • ')}
                </p>
              )}
            </div>
          </div>

          {/* Playback controls - desktop only, aligned to right */}
          {!isIOS && (
            <div className='hidden md:flex items-center md:ml-auto flex-shrink-0'>
              <button
                onClick={onSkipPrevious}
                disabled={currentTrackIndex === 0}
                className='p-2 rounded-full hover:bg-brand-primary/10 disabled:opacity-30 disabled:cursor-not-allowed text-brand-primary transition-colors cursor-pointer'
                aria-label='Previous track'>
                <SkipPreviousIcon />
              </button>
              <button
                onClick={onSkipNext}
                disabled={currentTrackIndex === tracks.length - 1}
                className='p-2 mr-2 rounded-full hover:bg-brand-primary/10 disabled:opacity-30 disabled:cursor-not-allowed text-brand-primary transition-colors cursor-pointer'
                aria-label='Next track'>
                <SkipNextIcon />
              </button>
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
      <div className='bg-brand-white-dark p-4 border-t border-brand-primary/10'>
        <TimelineBar
          currentTime={currentTime}
          duration={duration}
          progressPercentage={progressPercentage}
          onTimelineChange={onTimelineChange}
        />

        {/* Playback controls - mobile only, below timeline */}
        {!isIOS && (
          <div className='md:hidden mt-4 flex justify-center items-center'>
            <button
              onClick={onSkipPrevious}
              disabled={currentTrackIndex === 0}
              className='p-1 rounded-full hover:bg-brand-primary/10 disabled:opacity-30 disabled:cursor-not-allowed text-brand-primary transition-colors cursor-pointer'
              aria-label='Previous track'>
              <SkipPreviousIcon />
            </button>
            <button
              onClick={onSkipNext}
              disabled={currentTrackIndex === tracks.length - 1}
              className='p-1 mr-2 rounded-full hover:bg-brand-primary/10 disabled:opacity-30 disabled:cursor-not-allowed text-brand-primary transition-colors cursor-pointer'
              aria-label='Next track'>
              <SkipNextIcon />
            </button>
            <VolumeControl
              volume={volume}
              isMuted={isMuted}
              onVolumeChange={onVolumeChange}
              onToggleMute={onToggleMute}
            />
          </div>
        )}
      </div>

      {/* Playlist */}
      <div className='divide-y divide-brand-primary/10'>
        {tracks.map((sample, index) => (
          <TrackListItem
            key={sample._id || index}
            sample={sample}
            index={index}
            isCurrentTrack={index === currentTrackIndex}
            onPlayTrack={onPlayTrack}
          />
        ))}
      </div>
    </div>
  );
};

export default MultiTrackPlayer;
