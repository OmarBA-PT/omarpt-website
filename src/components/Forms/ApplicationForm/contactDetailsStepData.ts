// AI Helper: This file contains the Contact Details step structure for the application form.
// This data structure defines the fields for the first step of the application process.

export interface ContactField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'tel';
  placeholder: string;
  required: boolean;
  validation: {
    required?: string;
    pattern?: {
      value: RegExp;
      message: string;
    };
  };
}

export interface ContactDetailsStepData {
  title: string;
  description: string;
  fields: ContactField[];
}

export const contactDetailsStepData: ContactDetailsStepData = {
  title: 'Contact Details',
  description: "Let's start with some basic information about you",
  fields: [
    {
      id: 'fullName',
      label: 'Your Name',
      type: 'text',
      placeholder: 'Enter your full name',
      required: true,
      validation: {
        required: 'This field is required',
      },
    },
    {
      id: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'your.email@example.com',
      required: true,
      validation: {
        required: 'This field is required',
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: 'Please enter a valid email address',
        },
      },
    },
    {
      id: 'phone',
      label: 'Phone Number',
      type: 'tel',
      placeholder: '+44 7XXX XXXXXX',
      required: true,
      validation: {
        required: 'This field is required',
      },
    },
  ],
};
