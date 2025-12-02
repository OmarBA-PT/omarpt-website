// AI Helper: This file contains the application form structure and questions.
// This data structure is designed to be easily replaceable with Sanity CMS integration later.
// The structure mirrors what would be fetched from Sanity with minimal changes needed.

export type QuestionType = 'radio' | 'checkbox' | 'text' | 'textarea' | 'yesno';

export interface QuestionOption {
  label: string;
  value: string;
}

export interface FormQuestion {
  id: string;
  question: string;
  type: QuestionType;
  options?: QuestionOption[];
  required?: boolean;
  placeholder?: string;
  helperText?: string;
  conditionalOn?: {
    questionId: string;
    value: string;
  };
  subQuestions?: FormQuestion[]; // For grouped sub-questions
}

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  questions: FormQuestion[];
}

export const applicationFormData: FormSection[] = [
  {
    id: 'fitness-background',
    title: 'Fitness Questionnaire',
    description: 'Help us understand your current fitness level and experience',
    questions: [
      {
        id: 'activityLevel',
        question: 'Rate your overall current physical activity level',
        type: 'radio',
        required: true,
        options: [
          { label: 'Sedentary (not active)', value: 'sedentary' },
          {
            label: 'Moderately active (3 days per week for 30 mins physical activity)',
            value: 'moderate',
          },
          { label: 'Active (at least 5 days per week for at least 30 minutes)', value: 'active' },
          {
            label: 'Very Active (More than 5 days per week for at least 45 minutes)',
            value: 'very-active',
          },
        ],
      },
    ],
  },
];

// Helper function to get all questions across all sections
export const getAllQuestions = (): FormQuestion[] => {
  return applicationFormData.flatMap((section) => section.questions);
};

// Helper function to get a specific question by ID
export const getQuestionById = (id: string): FormQuestion | undefined => {
  return getAllQuestions().find((q) => q.id === id);
};

// Helper function to check if a question should be displayed based on conditional logic
export const shouldDisplayQuestion = (
  question: FormQuestion,
  formData: Record<string, any>
): boolean => {
  if (!question.conditionalOn) return true;

  const { questionId, value } = question.conditionalOn;
  return formData[questionId] === value;
};
