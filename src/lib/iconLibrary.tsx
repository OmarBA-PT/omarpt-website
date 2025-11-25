import React from 'react';
import {
  TbChartLine,
  TbChartBar,
  TbClock,
  TbBarbell,
  TbUserBolt,
  TbSettings,
  TbFlame,
} from 'react-icons/tb';
import { IconType } from 'react-icons';

// Icon mapping with display names
export const ICON_LIBRARY = {
  progressGraph: {
    name: 'Progress Graph',
    icon: TbChartLine,
  },
  darkBoard: {
    name: 'Dark Board',
    icon: TbChartBar,
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
    icon: TbUserBolt,
  },
  gear: {
    name: 'Gear',
    icon: TbSettings,
  },
  flame: {
    name: 'Flame',
    icon: TbFlame,
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
