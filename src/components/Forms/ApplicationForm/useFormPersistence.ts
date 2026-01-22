'use client';

import { useEffect, useRef, useCallback } from 'react';
import { ApplicationFormData, GroupState } from './types';

const STORAGE_KEY = 'omarpt_application_form_draft';
const DEBOUNCE_DELAY = 500; // ms

export interface PersistedFormState {
  formData: ApplicationFormData;
  currentStep: number;
  groupState: GroupState;
  stepsVisitedForward: number[];
  stepsCompletedForward: number[];
  savedAt: string;
}

interface UseFormPersistenceOptions {
  formData: ApplicationFormData;
  currentStep: number;
  groupState: GroupState;
  stepsVisitedForward: Set<number>;
  stepsCompletedForward: Set<number>;
}

interface UseFormPersistenceReturn {
  clearSavedData: () => void;
}

/**
 * Clear persisted form state from localStorage.
 * Safe to call during SSR (no-op).
 */
export const clearPersistedFormState = (): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing saved form data:', error);
  }
};

/**
 * Load persisted form state from localStorage.
 * This function is safe to call during SSR (returns null).
 * Should be called once at component initialization.
 */
export const loadPersistedFormState = (): PersistedFormState | null => {
  if (typeof window === 'undefined') return null;

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;

    const parsed: PersistedFormState = JSON.parse(saved);

    // Validate the structure
    if (!parsed.formData || typeof parsed.formData !== 'object') return null;
    if (typeof parsed.currentStep !== 'number' || parsed.currentStep < 0) return null;

    return parsed;
  } catch (error) {
    console.error('Error loading saved form data:', error);
    // Clear corrupted data
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore cleanup errors
    }
    return null;
  }
};

/**
 * Hook to persist form data to localStorage with debouncing.
 * Call clearSavedData() on successful form submission.
 */
export const useFormPersistence = ({
  formData,
  currentStep,
  groupState,
  stepsVisitedForward,
  stepsCompletedForward,
}: UseFormPersistenceOptions): UseFormPersistenceReturn => {
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const isInitializedRef = useRef(false);
  const isClearedRef = useRef(false);

  // Mark as initialized after first render
  useEffect(() => {
    isInitializedRef.current = true;
  }, []);

  // Save data with debouncing
  useEffect(() => {
    // Don't save during initial mount to avoid overwriting with empty data
    if (!isInitializedRef.current) return;

    // Don't save if data has been explicitly cleared (e.g., after successful submission)
    if (isClearedRef.current) return;

    // Clear existing timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Debounce the save operation
    debounceRef.current = setTimeout(() => {
      // Double-check cleared flag in case it was set during debounce delay
      if (isClearedRef.current) return;

      try {
        // Check if there's any meaningful data to save
        const hasData = Object.values(formData).some(
          (value) => value !== undefined && value !== null && value !== ''
        );

        if (!hasData && currentStep === 0) {
          // No data to save, clear any existing saved data
          localStorage.removeItem(STORAGE_KEY);
          return;
        }

        const stateToSave: PersistedFormState = {
          formData,
          currentStep,
          groupState,
          stepsVisitedForward: Array.from(stepsVisitedForward),
          stepsCompletedForward: Array.from(stepsCompletedForward),
          savedAt: new Date().toISOString(),
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
      } catch (error) {
        console.error('Error saving form data:', error);
      }
    }, DEBOUNCE_DELAY);

    // Cleanup timeout on unmount
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [formData, currentStep, groupState, stepsVisitedForward, stepsCompletedForward]);

  // Clear saved data (call on successful submission)
  const clearSavedData = useCallback(() => {
    // Set flag to prevent any pending or future saves
    isClearedRef.current = true;

    // Cancel any pending debounced save
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing saved form data:', error);
    }
  }, []);

  return {
    clearSavedData,
  };
};
