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
  target: {
    name: 'Target',
  },
  clock: {
    name: 'Clock',
  },
  questionMan: {
    name: 'Question Man',
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
  /**
   * Width of the icon in rem units (e.g., 3 = 3rem)
   * Height will auto-calculate based on the icon's aspect ratio
   */
  width: number;
  /**
   * Controls the icon color - supports:
   * - Solid colors: 'text-brand-primary', 'text-brand-secondary', 'text-brand-charcoal', 'text-brand-white'
   * - Gradients: 'gradient-primary', 'gradient-charcoal-linear', 'gradient-charcoal-diag', 'gradient-charcoal-radial', 'gradient-metal', 'gradient-firey'
   */
  colorClassName?: string;
  /**
   * Optional additional className for the container (e.g., for margin, display properties)
   * Do NOT use this for width/height - use the width prop instead
   */
  className?: string;
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
 * - Size control via width prop (in rem units)
 * - Automatic aspect ratio maintenance
 * - Color control via solid colors or gradients
 * - Falls back to red star if icon SVG not implemented yet
 *
 * @example
 * // Basic usage - 3rem wide with default color
 * <Icon iconKey="dumbell" width={3} />
 *
 * @example
 * // With solid brand color - 4rem wide
 * <Icon iconKey="dumbell" width={4} colorClassName="text-brand-secondary" />
 *
 * @example
 * // With gradient - 6rem wide
 * <Icon iconKey="dumbell" width={6} colorClassName="gradient-primary" />
 */
const Icon = ({
  iconKey,
  width,
  colorClassName = 'text-brand-primary',
  className = '',
}: IconComponentProps) => {
  return (
    <CustomIcon
      iconKey={iconKey as CustomIconKey}
      width={width}
      colorClassName={colorClassName}
      className={className}
    />
  );
};

export default Icon;
