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
      {
        id: 'activityLevelTwo',
        question: 'Rate your overall current physical activity level 2',
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
  {
    id: 'health-information',
    title: 'General Health Questionnaire',
    description: 'Important information about your current health status',
    questions: [
      {
        id: 'physicianSupervision',
        question:
          'Are you currently under, or have been under the supervision of a physician for any physical issues, surgeries, or disease (Ex: muscular, joint, bone, lungs, heart, diabetes, renal)?',
        type: 'yesno',
        required: true,
        subQuestions: [
          {
            id: 'physicianDetails',
            question: 'If so, please briefly list or explain:',
            type: 'textarea',
            required: false,
            placeholder: 'Please provide details...',
          },
        ],
      },
      {
        id: 'medicationForPressure',
        question: 'Are you on medication for your blood pressure, heart, or kidneys?',
        type: 'yesno',
        required: true,
      },
      {
        id: 'shouldSeePhysician',
        question:
          'Do you have any issues right now that you should see a physician for? (includes occasional chest pains, or any pain or physical complications)',
        type: 'yesno',
        required: true,
      },
      {
        id: 'clearedToExercise',
        question:
          'Have you been cleared by a physician to exercise? This is recommended if you have any physical condition currently being treated by a physician.',
        type: 'yesno',
        required: true,
      },
      {
        id: 'activityRestrictions',
        question: 'Do you have any restrictions with certain activities?',
        type: 'yesno',
        required: true,
        subQuestions: [
          {
            id: 'restrictionDetails',
            question: 'If yes, please describe:',
            type: 'textarea',
            required: false,
            placeholder: 'Please describe your activity restrictions...',
          },
        ],
      },
      {
        id: 'difficultMovements',
        question:
          'List any physical activities or movements are difficult for you to perform or cause you discomfort? You can write none if you are all good:',
        type: 'textarea',
        required: false,
        placeholder: 'You can write "none" if you are all good',
      },
      {
        id: 'drinksAlcohol',
        question: 'Do you drink alcohol?',
        type: 'yesno',
        required: true,
      },
      {
        id: 'smokes',
        question: 'Do you smoke?',
        type: 'yesno',
        required: true,
      },
      {
        id: 'additionalHealthComments',
        question: 'If there are any other comments you would like to add, please add them here:',
        type: 'textarea',
        required: false,
        placeholder: 'Any additional information we should know...',
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
