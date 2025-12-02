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
        id: 'cardioAbility',
        question: 'Rate your ability to perform cardiovascular exercise',
        type: 'radio',
        required: true,
        options: [
          { label: 'Low', value: 'low' },
          { label: 'Average', value: 'average' },
          { label: 'Good', value: 'good' },
          { label: 'Excellent', value: 'excellent' },
        ],
      },
      {
        id: 'experienceLevel',
        question: 'Rate your experience with exercise',
        type: 'radio',
        required: true,
        options: [
          { label: 'Beginner (starting from scratch)', value: 'beginner' },
          {
            label: 'Intermediate (general knowledge and have fair amount of experience)',
            value: 'intermediate',
          },
          {
            label:
              'Advanced (know how to perform exercises with great form and highly experienced)',
            value: 'advanced',
          },
        ],
      },
      {
        id: 'gymEquipment',
        question: 'Which gym equipment have you used before or feel comfortable with using?',
        type: 'checkbox',
        required: false,
        helperText: 'Select all that apply',
        options: [
          { label: 'Cardio machines', value: 'cardio-machines' },
          { label: 'Free weights', value: 'free-weights' },
          { label: 'Weight machines', value: 'weight-machines' },
          { label: 'Cable weights', value: 'cable-weights' },
          { label: 'Resistance bands', value: 'resistance-bands' },
          { label: 'Kettlebells', value: 'kettlebells' },
          { label: 'TRX', value: 'trx' },
          { label: 'Other', value: 'other' },
          { label: 'None', value: 'none' },
        ],
      },
      {
        id: 'preferredTime',
        question: 'What time of day do you prefer to exercise?',
        type: 'radio',
        required: true,
        options: [
          { label: 'Morning', value: 'morning' },
          { label: 'Afternoon', value: 'afternoon' },
          { label: 'Evening', value: 'evening' },
        ],
      },
      {
        id: 'daysPerWeek',
        question: 'How many days per week can you commit to exercise?',
        type: 'radio',
        required: true,
        options: [
          { label: '1-3 days per week', value: '1-3' },
          { label: '4-5 days per week', value: '4-5' },
          { label: '6-7 days per week', value: '6-7' },
        ],
      },
      {
        id: 'enjoyedActivities',
        question: 'What activities do you enjoy? List any below:',
        type: 'textarea',
        required: false,
        placeholder: 'List any activities you enjoy (e.g., running, swimming, cycling, yoga...)',
      },
      {
        id: 'desiredBodyShape',
        question:
          'What sort of body shape do you desire to achieve? (i.e. toned, muscular, fit, or unsure)',
        type: 'text',
        required: false,
        placeholder: 'e.g., toned, muscular, fit, lean, or unsure',
      },
      {
        id: 'needFatLoss',
        question:
          'Do you feel like you need to lose body fat? If yes, how much weight do you wish to lose?',
        type: 'textarea',
        required: false,
        placeholder: 'e.g., Yes, approximately 10kg / No / Unsure',
      },
      {
        id: 'sleepHours',
        question: 'How many hours of sleep do you get per day in total?',
        type: 'radio',
        required: true,
        options: [
          { label: '3-5 hours', value: '3-5' },
          { label: '6-8 hours', value: '6-8' },
          { label: '9+ hours', value: '9+' },
        ],
      },
      {
        id: 'waterIntake',
        question: 'Approximately how much water do you drink per day?',
        type: 'radio',
        required: true,
        options: [
          { label: 'Up to 1 liter', value: 'up-to-1' },
          { label: '1.5 liters', value: '1.5' },
          { label: '2 liters or more', value: '2+' },
        ],
      },
      {
        id: 'mealsPerDay',
        question: 'How many meals do you eat per day?',
        type: 'radio',
        required: true,
        options: [
          { label: '1-2', value: '1-2' },
          { label: '3-4', value: '3-4' },
          { label: '5+', value: '5+' },
        ],
      },
      {
        id: 'currentInjuries',
        question: 'Do you have any current injuries or areas of pain in your body? List if any:',
        type: 'textarea',
        required: false,
        placeholder: 'List any injuries or areas of pain, or write "none"',
      },
      {
        id: 'additionalTrainingInfo',
        question:
          'Is there any additional information or concern in regards to training you would like to share with your trainer?',
        type: 'textarea',
        required: false,
        placeholder:
          'Any concerns, preferences, or information that would help us serve you better...',
      },
    ],
  },
  {
    id: 'goals',
    title: 'Goal Sheet',
    description: 'Share your goals and aspirations with us',
    questions: [
      {
        id: 'fitnessGoals3to6Months',
        question:
          'What fitness or nutrition related GOALS you would like to accomplish within the next 3-6 months?',
        type: 'textarea',
        required: true,
        placeholder: 'Describe your primary fitness and nutrition goals...',
        subQuestions: [
          {
            id: 'whyImportant',
            question: 'Why is this important to you?',
            type: 'textarea',
            required: false,
            placeholder: 'What motivates you to make this change?',
          },
          {
            id: 'achievementFeeling',
            question: 'What feeling can you imagine having upon achieving this?',
            type: 'textarea',
            required: false,
            placeholder: 'How will you feel when you reach your goal?',
          },
        ],
      },
      {
        id: 'wellnessGoals',
        question:
          'LIST any other wellness GOALS that you would like to accomplish as soon as possible',
        type: 'textarea',
        required: false,
        placeholder: 'Ex: lower stress, find more relaxation time, meditate regularly, etc.',
        helperText: 'Think beyond just fitness - overall wellness matters too',
        subQuestions: [
          {
            id: 'wellnessImpact',
            question: 'What impact will this have on your life?',
            type: 'textarea',
            required: false,
            placeholder: 'How will your life improve?',
          },
        ],
      },
      {
        id: 'oneYearChange',
        question: 'What would you would like to see change in your life within 1 year?',
        type: 'textarea',
        required: false,
        placeholder: 'If you are unsure, just write the first thing that comes to your mind...',
        helperText:
          'You may revisit or add to this any time. Sometimes new desires come up while on the journey of other goals being reached. List 1-5 things.',
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
