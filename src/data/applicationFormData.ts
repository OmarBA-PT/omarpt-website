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

export interface QuestionGroup {
  id: string;
  title?: string;
  questions: FormQuestion[];
}

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  questionGroups: QuestionGroup[];
}

export const applicationFormData: FormSection[] = [
  {
    id: 'health-history',
    title: 'Health History',
    description: 'Important information about your current health status',
    questionGroups: [
      {
        id: 'physicianSupervision-group',
        title: 'Physician Supervision',
        questions: [
          {
            id: 'physicianSupervision',
            question:
              'Are you currently under, or have been under the supervision of a physician for any physical issues, surgeries, or disease?',
            helperText: 'Eg: muscular, joint, bone, lungs, heart, diabetes, renal etc',
            type: 'yesno',
            required: true,
            subQuestions: [
              {
                id: 'supervisionDetails',
                question: 'Please briefly list or explain:',
                type: 'textarea',
                required: true,
                conditionalOn: {
                  questionId: 'physicianSupervision',
                  value: 'yes',
                },
              },
            ],
          },
          {
            id: 'clearedToExercise',
            question: 'Have you been cleared by the physician to exercise?',
            type: 'yesno',
            required: true,
            conditionalOn: {
              questionId: 'physicianSupervision',
              value: 'yes',
            },
          },
        ],
      },
      {
        id: 'medicationForPressure-group',
        title: 'Medication',
        questions: [
          {
            id: 'medicationForPressure',
            question: 'Are you on medication for your blood pressure, heart, or kidneys?',
            type: 'yesno',
            required: true,
            subQuestions: [
              {
                id: 'medicationDetails',
                question: 'Please give details of the medication and purpose:',
                type: 'textarea',
                required: true,
                conditionalOn: {
                  questionId: 'medicationForPressure',
                  value: 'yes',
                },
              },
            ],
          },
        ],
      },
      {
        id: 'shouldSeePhysician-group',
        title: 'Current Health Concerns',
        questions: [
          {
            id: 'shouldSeePhysician',
            question:
              'Do you have any symptoms or health concerns you feel may require medical assessment?',
            helperText: 'Includes occasional chest pains, or any pain or physical complications',
            type: 'yesno',
            required: true,
            subQuestions: [
              {
                id: 'physicalIssuesDetails',
                question: 'Please briefly list or explain:',
                type: 'textarea',
                required: true,
                conditionalOn: {
                  questionId: 'shouldSeePhysician',
                  value: 'yes',
                },
              },
            ],
          },
        ],
      },
      {
        id: 'difficultMovements-group',
        title: 'Movement Restrictions & Difficulties',
        questions: [
          {
            id: 'difficultyMoving',
            question:
              'Do you have any restrictions with certain activities, or any movements that cause pain or discomfort?',
            helperText: 'Example: squatting, bending, lifting arms, climbing stairs, etc.',
            type: 'yesno',
            required: true,
            subQuestions: [
              {
                id: 'difficultyDetails',
                question: 'If yes, please list or explain:',
                type: 'textarea',
                required: true,
                conditionalOn: {
                  questionId: 'difficultyMoving',
                  value: 'yes',
                },
              },
            ],
          },
        ],
      },
      {
        id: 'alcohol-smoking-group',
        title: 'Alcohol & Smoking',
        questions: [
          {
            id: 'drinksAlcohol',
            question: 'Do you drink alcohol?',
            type: 'yesno',
            required: true,
            subQuestions: [
              {
                id: 'alcoholDetails',
                question: 'Please describe quantity and frequency:',
                type: 'textarea',
                required: true,
                placeholder:
                  'E.g. 1-3 drinks daily, 3-5 drinks on weekends, 1-2 drinks occasionally, etc.',
                conditionalOn: {
                  questionId: 'drinksAlcohol',
                  value: 'yes',
                },
              },
            ],
          },
          {
            id: 'smokes',
            question: 'Do you smoke?',
            type: 'yesno',
            required: true,
            subQuestions: [
              {
                id: 'smokingDetails',
                question: 'Please describe quantity and frequency:',
                type: 'textarea',
                required: true,
                placeholder: 'E.g. 5-10 cigarettes daily, occasional social smoking, etc.',
                conditionalOn: {
                  questionId: 'smokes',
                  value: 'yes',
                },
              },
            ],
          },
        ],
      },
      {
        id: 'additionalHealthComments-group',
        title: 'Additional Comments',
        questions: [
          {
            id: 'additionalHealthComments',
            question:
              'If there are any other comments you would like to add, please add them here:',
            type: 'textarea',
            required: false,
          },
        ],
      },
    ],
  },
  {
    id: 'fitness-background',
    title: 'Fitness Background',
    description: 'Help me understand your current fitness level and experience',
    questionGroups: [
      {
        id: 'activityLevel-group',
        title: 'Physical Activity Level',
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
              {
                label: 'Active (at least 5 days per week for at least 30 minutes)',
                value: 'active',
              },
              {
                label: 'Very Active (More than 5 days per week for at least 45 minutes)',
                value: 'very-active',
              },
            ],
          },
        ],
      },
      {
        id: 'cardioAbility-group',
        title: 'Cardiovascular Fitness',
        questions: [
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
        ],
      },
      {
        id: 'experienceLevel-group',
        title: 'Exercise Experience',
        questions: [
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
        ],
      },
      {
        id: 'gymEquipment-group',
        title: 'Equipment Familiarity',
        questions: [
          {
            id: 'gymEquipment',
            question: 'Which gym equipment have you used before or feel comfortable with using?',
            type: 'checkbox',
            required: false,
            helperText: 'Select all that apply; skip to next question if none.',
            options: [
              { label: 'Cardio machines', value: 'cardio-machines' },
              { label: 'Free weights', value: 'free-weights' },
              { label: 'Weight machines', value: 'weight-machines' },
              { label: 'Cable weights', value: 'cable-weights' },
              { label: 'Resistance bands', value: 'resistance-bands' },
              { label: 'Kettlebells', value: 'kettlebells' },
              { label: 'TRX', value: 'trx' },
            ],
          },
          {
            id: 'otherEquipment',
            question:
              'Please describe any other equipment not listed above that you are familiar with:',
            type: 'textarea',
            required: false,
          },
        ],
      },
      {
        id: 'preferredTime-group',
        title: 'Preferred Exercise Time',
        questions: [
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
        ],
      },
      {
        id: 'daysPerWeek-group',
        title: 'Weekly Commitment',
        questions: [
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
        ],
      },
      {
        id: 'enjoyedActivities-group',
        title: 'Activities You Enjoy',
        questions: [
          {
            id: 'enjoyedActivities',
            question: 'What activities do you enjoy? List any below:',
            type: 'textarea',
            required: false,
            placeholder: 'e.g, running, swimming, cycling, yoga etc',
          },
        ],
      },
      {
        id: 'desiredBodyShape-group',
        title: 'Body Shape Goals',
        questions: [
          {
            id: 'desiredBodyShape',
            question: 'What sort of body shape do you desire to achieve?',
            type: 'text',
            required: false,
            placeholder: 'e.g, toned, muscular, fit, lean, or unsure',
          },
        ],
      },
      {
        id: 'needFatLoss-group',
        title: 'Fat Loss Goals',
        questions: [
          {
            id: 'needFatLoss',
            question:
              'Do you feel like you need to lose body fat? If yes, how much weight do you wish to lose?',
            type: 'textarea',
            required: false,
            placeholder: 'e.g., Yes, approximately 10kg / No / Unsure',
          },
        ],
      },
      {
        id: 'sleepHours-group',
        title: 'Sleep Habits',
        questions: [
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
        ],
      },
      {
        id: 'waterIntake-group',
        title: 'Water Intake',
        questions: [
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
        ],
      },
      {
        id: 'mealsPerDay-group',
        title: 'Nutrition Habits',
        questions: [
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
        ],
      },
      {
        id: 'currentInjuries-group',
        title: 'Current Injuries',
        questions: [
          {
            id: 'currentInjuries',
            question:
              'Do you have any current injuries or areas of pain in your body? List if any:',
            type: 'textarea',
            required: false,
            placeholder: 'List any injuries or areas of pain, or write "none"',
          },
        ],
      },
      {
        id: 'additionalTrainingInfo-group',
        title: 'Additional Training Information',
        questions: [
          {
            id: 'additionalTrainingInfo',
            question:
              'Is there any additional information or concern in regards to training you would like to share with your trainer?',
            type: 'textarea',
            required: false,
          },
        ],
      },
    ],
  },
  {
    id: 'goals-motivation',
    title: 'Goals & Motivation',
    description: 'Share your goals and aspirations with me',
    questionGroups: [
      {
        id: 'fitnessGoals3to6Months-group',
        title: '3-6 Month Fitness Goals',
        questions: [
          {
            id: 'fitnessGoals3to6Months',
            question:
              'What fitness or nutrition related GOALS would you like to accomplish within the next 3-6 months?',
            type: 'textarea',
            placeholder: 'E.g. lose weight, build muscle, improve endurance, etc.',
            required: false,
            subQuestions: [
              {
                id: 'whyImportant',
                question: 'Why is this important to you?',
                type: 'textarea',
                required: false,
                placeholder: 'E.g. boost confidence, improve longevity etc.',
              },
              {
                id: 'achievementFeeling',
                question: 'What feeling can you imagine having upon achieving this?',
                type: 'textarea',
                required: false,
                placeholder: 'E.g. proud, accomplished, healthier, more energetic, etc.',
              },
            ],
          },
        ],
      },
      {
        id: 'wellnessGoals-group',
        title: 'Wellness Goals',
        questions: [
          {
            id: 'wellnessGoals',
            question:
              'LIST any other wellness GOALS that you would like to accomplish as soon as possible:',
            type: 'textarea',
            required: false,
            placeholder: 'e.g, lower stress, find more relaxation time, meditate regularly, etc.',
            helperText: 'Think beyond just fitness - overall wellness matters too',
            subQuestions: [
              {
                id: 'wellnessImpact',
                question: 'What impact will this have on your life?',
                type: 'textarea',
                required: false,
                placeholder: 'e.g, better work-life balance, improved relationships, etc.',
              },
            ],
          },
        ],
      },
      {
        id: 'oneYearChange-group',
        title: '1 Year Vision',
        questions: [
          {
            id: 'oneYearChange',
            question: 'What would you would like to see change in your life within 1 year?',
            type: 'textarea',
            required: false,
            placeholder: 'e.g, healthier habits, improved fitness, more energy, etc.',
            helperText:
              'If you are unsure, just write the first thing that comes to your mind and we may revisit or add to this any time. Sometimes new desires come up while on the journey of other goals being reached.',
          },
        ],
      },
    ],
  },
];

// Helper function to get all questions across all sections
export const getAllQuestions = (): FormQuestion[] => {
  return applicationFormData.flatMap((section) =>
    section.questionGroups.flatMap((group) => group.questions)
  );
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
