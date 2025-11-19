import type { Card as CardType } from '@/sanity/types';

/**
 * Converts a closing card object from GROQ query results to the format expected by the Card component.
 * GROQ returns null for missing properties, but TypeScript/Card component expects undefined.
 * This helper recursively converts all null values to undefined.
 *
 * Note: We accept `unknown` as input since GROQ query results have complex nullable types
 * that don't match the generated TypeScript types exactly.
 */
export function normalizeClosingCardForCard(closingCard: unknown): Partial<CardType> {
  if (closingCard === null || closingCard === undefined) {
    return {};
  }

  if (typeof closingCard !== 'object') {
    return {};
  }

  const normalized: Record<string, unknown> = {};
  const input = closingCard as Record<string, unknown>;

  for (const key in input) {
    const value = input[key];

    if (value === null) {
      // Convert null to undefined
      normalized[key] = undefined;
    } else if (Array.isArray(value)) {
      // Recursively process arrays
      normalized[key] = value.map((item: unknown) =>
        typeof item === 'object' && item !== null ? normalizeClosingCardForCard(item) : item === null ? undefined : item
      );
    } else if (typeof value === 'object') {
      // Recursively process nested objects
      normalized[key] = normalizeClosingCardForCard(value);
    } else {
      // Primitive values remain as-is
      normalized[key] = value;
    }
  }

  // Ensure image has _type if it exists
  const result = normalized as Partial<CardType>;
  if (result.image && !result.image._type) {
    result.image._type = 'image';
  }

  return result;
}