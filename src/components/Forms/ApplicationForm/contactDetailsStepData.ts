// AI Helper: This file contains the Contact Details step structure for the application form.
// This data structure is designed to be easily replaceable with Sanity CMS integration later.
// The structure mirrors what would be fetched from Sanity with minimal changes needed.

import { FormSection } from '@/data/applicationFormData';

export const contactDetailsStepData: FormSection = {
  id: 'contact-details',
  title: 'Contact Details',
  description: "Let's start with some basic information about you",
  questionGroups: [
    {
      id: 'contact-info',
      questions: [
        {
          id: 'fullName',
          question: 'Your Name',
          type: 'text',
          placeholder: 'Enter your full name',
          required: true,
        },
        {
          id: 'email',
          question: 'Email Address',
          type: 'text',
          placeholder: 'your.email@example.com',
          required: true,
        },
        {
          id: 'phone',
          question: 'Phone Number',
          type: 'text',
          placeholder: '+44 7XXX XXXXXX',
          required: true,
        },
      ],
    },
  ],
};
