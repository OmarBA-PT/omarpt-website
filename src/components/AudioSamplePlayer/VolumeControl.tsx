import React from 'react';
import { SpeakerLoudIcon, SpeakerModerateIcon, SpeakerOffIcon } from './Icons';

interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleMute: () => void;
}

const VolumeControl = ({ volume, isMuted, onVolumeChange, onToggleMute }: VolumeControlProps) => {
  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <SpeakerOffIcon />;
    if (volume < 0.5) return <SpeakerModerateIcon />;
    return <SpeakerLoudIcon />;
  };

  return (
    <div className='flex items-center gap-2 justify-center'>
      <button
        onClick={onToggleMute}
        className='text-brand-primary hover:text-brand-secondary transition-colors cursor-pointer'
        aria-label={isMuted ? 'Unmute' : 'Mute'}>
        {getVolumeIcon()}
      </button>
      <div className='relative w-32 h-2 group cursor-pointer'>
        <div className='absolute inset-0 bg-brand-primary/20 rounded-full pointer-events-none' />
        <div
          className='absolute left-0 top-0 h-full bg-brand-primary rounded-full transition-all duration-150 pointer-events-none'
          style={{ width: `${volume * 100}%` }}
        />
        <input
          type='range'
          min='0'
          max='1'
          step='0.01'
          value={volume}
          onChange={onVolumeChange}
          className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
          style={{ zIndex: 10 }}
          aria-label='Volume'
        />
        <div
          className='absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-brand-primary rounded-full shadow-lg transition-all duration-150 opacity-0 group-hover:opacity-100 pointer-events-none'
          style={{ left: `calc(${volume * 100}% - 0.5rem)` }}
        />
      </div>
      <span className='text-body-sm text-brand-secondary font-medium'>
        {Math.round(volume * 100)}%
      </span>
    </div>
  );
};

export default VolumeControl;
