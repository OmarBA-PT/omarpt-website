import React from 'react';
import { FaStar } from 'react-icons/fa';
import { ICON_DEFINITIONS, type CustomIconKey } from './iconDefinitions/index';

export type { CustomIconKey };

export interface CustomIconProps {
  iconKey: CustomIconKey;
  /**
   * Width of the icon in rem units (e.g., 3 = 3rem)
   * Height will auto-calculate based on the icon's aspect ratio
   */
  width: number;
  /**
   * Controls the icon color - supports:
   * - Solid colors: 'text-brand-primary', 'text-brand-secondary', 'text-brand-charcoal', 'text-brand-white'
   * - Gradients: 'gradient-primary', 'gradient-charcoal-linear', 'gradient-charcoal-diag', 'gradient-charcoal-radial', 'gradient-metal', 'gradient-firey'
   * - Legacy text-gradient classes also supported: 'text-gradient-primary', etc.
   */
  colorClassName?: string;
  /**
   * Optional additional className for the container (e.g., for margin, display properties)
   * Do NOT use this for width/height - use the width prop instead
   */
  className?: string;
}

/**
 * CustomIcon component for rendering custom SVG icons
 *
 * Features:
 * - Size control via width prop (in rem units)
 * - Automatic aspect ratio maintenance
 * - Color control via Tailwind text/gradient classes
 * - Falls back to red star if icon not found
 *
 * @example
 * // Basic usage - 3rem wide
 * <CustomIcon iconKey="dumbell" width={3} />
 *
 * @example
 * // With solid brand color - 4rem wide
 * <CustomIcon iconKey="dumbell" width={4} colorClassName="text-brand-primary" />
 *
 * @example
 * // With gradient - 6rem wide
 * <CustomIcon iconKey="dumbell" width={6} colorClassName="text-gradient-primary" />
 */
const CustomIcon = ({ iconKey, width, colorClassName = 'text-brand-primary', className = '' }: CustomIconProps) => {
  const iconDef = ICON_DEFINITIONS[iconKey];

  // If icon not found, render red star as fallback
  if (!iconDef) {
    console.warn(`CustomIcon: Icon "${iconKey}" not found. Rendering fallback icon.`);
    return <FaStar className={`text-red-500`} style={{ width: `${width}rem`, height: 'auto' }} />;
  }

  // Calculate height based on width to maintain aspect ratio
  const heightRem = width / iconDef.aspectRatio;

  // Map gradient names to CSS custom properties
  const gradientMap: Record<string, string> = {
    'gradient-primary': 'var(--background-image-brand-gradient-primary)',
    'gradient-charcoal-linear': 'var(--background-image-brand-gradient-charcoal-linear)',
    'gradient-charcoal-diag': 'var(--background-image-brand-gradient-charcoal-diag)',
    'gradient-charcoal-radial': 'var(--background-image-brand-gradient-charcoal-radial)',
    'gradient-metal': 'var(--background-image-brand-gradient-metal)',
    'gradient-firey': 'var(--background-image-brand-gradient-firey)',
  };

  // Check if using a gradient (either new format 'gradient-X' or legacy 'text-gradient-X')
  const isGradient = colorClassName.startsWith('gradient-') || colorClassName.startsWith('text-gradient-');

  // For gradients, apply gradient to wrapper and use mask for the SVG shape
  if (isGradient) {
    // Get the gradient value - support both new and legacy formats
    let gradientValue: string | undefined;

    if (colorClassName.startsWith('gradient-')) {
      // New format: use the gradient map
      gradientValue = gradientMap[colorClassName];
    } else if (colorClassName.startsWith('text-gradient-')) {
      // Legacy format: apply the text-gradient class (uses background-clip: text from globals.css)
      // Convert to simple gradient format
      const gradientName = colorClassName.replace('text-gradient-', 'gradient-');
      gradientValue = gradientMap[gradientName];
    }

    return (
      <div
        className={`inline-block ${className}`.trim()}
        style={{
          width: `${width}rem`,
          height: `${heightRem}rem`,
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: gradientValue,
            WebkitMask: `url("data:image/svg+xml,${encodeURIComponent(iconDef.svgPath)}") center / contain no-repeat`,
            mask: `url("data:image/svg+xml,${encodeURIComponent(iconDef.svgPath)}") center / contain no-repeat`,
          }}
        />
      </div>
    );
  }

  // For solid colors, use the normal SVG with currentColor
  return (
    <div
      className={`inline-block ${className}`.trim()}
      style={{
        width: `${width}rem`,
        height: `${heightRem}rem`,
      }}
    >
      {iconDef.renderSvg(colorClassName)}
    </div>
  );
};

export default CustomIcon;
