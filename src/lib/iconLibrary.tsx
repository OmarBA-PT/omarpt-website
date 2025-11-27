import React from 'react';
import CustomIcon, { CustomIconKey } from '@/components/UI/CustomIcon';

// Icon mapping with display names
// This is the single source of truth for all icons in the application
export const ICON_LIBRARY = {
  dumbell: {
    name: 'Dumbell',
  },
  progressGraph: {
    name: 'Progress Graph',
  },
  darkBoard: {
    name: 'Target',
  },
  clock: {
    name: 'Clock',
  },
  strongMan: {
    name: 'Strong Man',
  },
  gear: {
    name: 'Gear',
  },
  flame: {
    name: 'Flame',
  },
} as const;

export type IconKey = keyof typeof ICON_LIBRARY;

// Type for icon component props
export interface IconComponentProps {
  iconKey: IconKey;
  className?: string;
  /**
   * Controls the icon color - use Tailwind text-* or gradient classes:
   * - Solid colors: text-brand-primary, text-brand-secondary, text-brand-charcoal, text-brand-white
   * - Gradients: text-gradient-primary, text-gradient-charcoal-linear, text-gradient-metal, text-gradient-firey
   */
  colorClassName?: string;
}

// Get all icon options for Sanity
export const getIconOptions = () => {
  return Object.entries(ICON_LIBRARY).map(([key, value]) => ({
    value: key,
    title: value.name,
  }));
};

/**
 * Icon component for rendering custom SVG icons
 *
 * Features:
 * - Size control via Tailwind width classes (w-4, w-6, w-8, w-16, etc.)
 * - Color control via Tailwind text/gradient classes
 * - Falls back to red star if icon SVG not implemented yet
 *
 * @example
 * // Basic usage with size
 * <Icon iconKey="dumbell" className="w-16" />
 *
 * @example
 * // With solid brand color
 * <Icon iconKey="dumbell" className="w-16" colorClassName="text-brand-primary" />
 *
 * @example
 * // With gradient
 * <Icon iconKey="dumbell" className="w-16" colorClassName="text-gradient-primary" />
 */
const Icon = ({ iconKey, className = '', colorClassName = 'text-brand-primary' }: IconComponentProps) => {
  return <CustomIcon iconKey={iconKey as CustomIconKey} className={className} colorClassName={colorClassName} />;
};

export default Icon;
