import React from 'react';

/**
 * Parses a string with color markers {text} and returns JSX elements.
 * Text wrapped in {curly braces} will be rendered in white.
 * All other text will be rendered in the brand primary color (orange).
 *
 * @param text - The string to parse (e.g., "Welcome to {Omania} Training")
 * @returns Array of React elements with appropriate color classes
 *
 * @example
 * parseColoredText("Welcome to {Omania} Training")
 * // Returns: <span className="text-brand-primary">Welcome to </span>
 * //          <span className="text-white">Omania</span>
 * //          <span className="text-brand-primary"> Training</span>
 */
export const parseColoredText = (text: string): React.ReactNode[] => {
  if (!text) return [];

  // Split by {text} pattern while keeping the matched groups
  const parts = text.split(/(\{[^}]+\})/g);

  return parts.map((part, i) => {
    if (!part) return null; // Skip empty strings

    // Check if this part is wrapped in curly braces
    if (part.startsWith('{') && part.endsWith('}')) {
      // Remove the braces and render in white
      const content = part.slice(1, -1);
      return (
        <span key={i} className="text-white">
          {content}
        </span>
      );
    }

    // Render in brand primary color (orange)
    return (
      <span key={i} className="text-brand-primary">
        {part}
      </span>
    );
  });
};
