import React from 'react';

type ColorScheme = 'orange-white' | 'white-orange';

/**
 * Parses a string with color markers {text} and returns JSX elements.
 * Handles gradient text properly by using inline-block for gradient segments.
 *
 * @param text - The string to parse (e.g., "Welcome to {Omania} Training")
 * @param colorScheme - The color scheme to use:
 *   - 'orange-white' (default): Default text is orange gradient, {tagged} text is white
 *   - 'white-orange': Default text is white, {tagged} text is orange gradient
 * @returns Array of React elements with appropriate color classes
 *
 * @example
 * // Orange gradient default, white tagged
 * parseColoredText("Welcome to {Omania} Training", 'orange-white')
 *
 * @example
 * // White default, orange gradient tagged
 * parseColoredText("Professional {Development} Services", 'white-orange')
 */
export const parseColoredText = (
  text: string,
  colorScheme: ColorScheme = 'orange-white'
): React.ReactNode[] => {
  if (!text) return [];

  // Split by {text} pattern while keeping the matched groups
  const parts = text.split(/(\{[^}]+\})/g);

  // Determine colors based on scheme
  const defaultColor = colorScheme === 'orange-white' ? 'text-gradient-primary' : 'text-white';
  const taggedColor = colorScheme === 'orange-white' ? 'text-white' : 'text-gradient-primary';

  return parts.map((part, i) => {
    if (!part) return null; // Skip empty strings

    // Check if this part is wrapped in curly braces
    const isTagged = part.startsWith('{') && part.endsWith('}');
    const content = isTagged ? part.slice(1, -1) : part;
    const colorClass = isTagged ? taggedColor : defaultColor;

    // For gradient text, we need to handle line breaks differently
    // Split by newlines to preserve them
    const lines = content.split('\n');

    // If no newlines, return a simple span
    if (lines.length === 1) {
      return (
        <span key={i} className={colorClass}>
          {content}
        </span>
      );
    }

    // If there are newlines, we need to wrap each line separately
    // and add <br> elements between them
    return (
      <React.Fragment key={i}>
        {lines.map((line, lineIndex) => (
          <React.Fragment key={`${i}-${lineIndex}`}>
            {line && (
              <span className={colorClass}>
                {line}
              </span>
            )}
            {lineIndex < lines.length - 1 && <br />}
          </React.Fragment>
        ))}
      </React.Fragment>
    );
  });
};
