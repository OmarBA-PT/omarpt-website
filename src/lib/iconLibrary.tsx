import React from 'react';
import { TbTargetArrow, TbClock, TbBarbell, TbSettings } from 'react-icons/tb';
import { FaChartLine } from 'react-icons/fa';
import { GiStrong } from 'react-icons/gi';
import { SiFireship } from 'react-icons/si';
import { IconType } from 'react-icons';

// Icon mapping with display names
export const ICON_LIBRARY = {
  progressGraph: {
    name: 'Progress Graph',
    icon: FaChartLine,
  },
  darkBoard: {
    name: 'Target',
    icon: TbTargetArrow,
  },
  clock: {
    name: 'Clock',
    icon: TbClock,
  },
  dumbell: {
    name: 'Dumbell',
    icon: TbBarbell,
  },
  strongMan: {
    name: 'Strong Man',
    icon: GiStrong,
  },
  gear: {
    name: 'Gear',
    icon: TbSettings,
  },
  flame: {
    name: 'Flame',
    icon: SiFireship,
  },
} as const;

export type IconKey = keyof typeof ICON_LIBRARY;

// Type for icon component props
export interface IconComponentProps {
  iconKey: IconKey;
  className?: string;
  size?: number;
}

// Get icon component by key
export const getIcon = (iconKey: IconKey): IconType => {
  return ICON_LIBRARY[iconKey].icon;
};

// Get all icon options for Sanity
export const getIconOptions = () => {
  return Object.entries(ICON_LIBRARY).map(([key, value]) => ({
    value: key,
    title: value.name,
  }));
};

// React component for rendering icons
const Icon = ({ iconKey, className = 'text-black', size = 24 }: IconComponentProps) => {
  const IconComponent = getIcon(iconKey);
  return <IconComponent className={className} size={size} />;
};

export default Icon;
