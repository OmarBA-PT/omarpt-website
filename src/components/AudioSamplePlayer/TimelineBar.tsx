import React from 'react';
import { formatTime } from './utils';

interface TimelineBarProps {
  currentTime: number;
  duration: number;
  progressPercentage: number;
  onTimelineChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TimelineBar = ({ currentTime, duration, progressPercentage, onTimelineChange }: TimelineBarProps) => {
  return (
    <div className='flex items-center gap-3 mb-2'>
      <span className='text-body-sm font-medium'>{formatTime(currentTime)}</span>
      <div className='relative flex-1 h-2 group'>
        <div className='absolute inset-0 bg-brand-primary/20 rounded-full' />
        <div
          className='absolute left-0 top-0 h-full bg-brand-primary rounded-full transition-all duration-150'
          style={{ width: `${progressPercentage}%` }}
        />
        <input
          type='range'
          min='0'
          max={duration || 0}
          value={currentTime}
          onChange={onTimelineChange}
          className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
          aria-label='Audio timeline'
        />
        <div
          className='absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-brand-primary rounded-full shadow-lg transition-all duration-150 opacity-0 group-hover:opacity-100 pointer-events-none'
          style={{ left: `calc(${progressPercentage}% - 0.5rem)` }}
        />
      </div>
      <span className='text-body-sm font-medium'>{formatTime(duration)}</span>
    </div>
  );
};

export default TimelineBar;
