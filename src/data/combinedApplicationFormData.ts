// AI Helper: This file combines the contact details step and application form data into a single unified array.
// This allows the form to treat all steps uniformly without special handling for contact details.

import { contactDetailsStepData } from '@/components/Forms/ApplicationForm/data/contactDetailsStepData';
import { applicationFormData, FormSection } from './applicationFormData';

/**
 * Combined application form data that includes contact details as the first section
 * followed by all other form sections.
 *
 * This creates a single source of truth for the entire form structure,
 * eliminating the need for special handling of contact details throughout the application.
 */
export const combinedApplicationFormData: FormSection[] = [
  contactDetailsStepData,
  ...applicationFormData,
];
