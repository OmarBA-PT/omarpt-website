import { FieldErrors } from 'react-hook-form';
import { ApplicationFormData } from './types';
import {
  shouldDisplayQuestion,
  FormQuestion,
  QuestionGroup,
  FormSection,
} from '@/data/applicationFormData';

interface UseFormValidationProps {
  isContactDetailsStep: boolean;
  contactDetailsStepData: { questionGroups: QuestionGroup[] };
  currentSection: FormSection | null;
  formData: ApplicationFormData;
  errors: FieldErrors;
  touchedFields: any;
  attemptedValidation: boolean;
}

export const useFormValidation = ({
  isContactDetailsStep,
  contactDetailsStepData,
  currentSection,
  formData,
  errors,
  touchedFields,
  attemptedValidation,
}: UseFormValidationProps) => {
  // Get all question IDs for the current section (including sub-questions)
  const getCurrentSectionQuestionIds = () => {
    const ids: string[] = [];

    // Contact Details step
    if (isContactDetailsStep) {
      contactDetailsStepData.questionGroups.forEach((group) => {
        group.questions.forEach((question) => {
          ids.push(question.id);
        });
      });
      return ids;
    }

    // Dynamic sections
    if (currentSection) {
      currentSection.questionGroups.forEach((group) => {
        group.questions.forEach((question) => {
          if (shouldDisplayQuestion(question as FormQuestion, formData)) {
            ids.push(question.id);
            // Add sub-question IDs
            question.subQuestions?.forEach((subQ) => {
              ids.push(subQ.id);
            });
          }
        });
      });
    }
    return ids;
  };

  // Get question IDs for a specific group
  const getGroupQuestionIds = (groupIndex: number) => {
    const ids: string[] = [];
    const questionGroups = isContactDetailsStep
      ? contactDetailsStepData.questionGroups
      : currentSection?.questionGroups || [];

    const group = questionGroups[groupIndex];
    if (!group) return ids;

    group.questions.forEach((question) => {
      if (isContactDetailsStep || shouldDisplayQuestion(question as FormQuestion, formData)) {
        ids.push(question.id);
        // Add sub-question IDs
        question.subQuestions?.forEach((subQ) => {
          ids.push(subQ.id);
        });
      }
    });

    return ids;
  };

  // Check if current section has any errors
  const currentSectionHasErrors = () => {
    const questionIds = getCurrentSectionQuestionIds();
    return questionIds.some((id) => errors[id] && (touchedFields[id] || attemptedValidation));
  };

  // Get error count for current section
  const getCurrentSectionErrorCount = () => {
    const questionIds = getCurrentSectionQuestionIds();
    return questionIds.filter((id) => errors[id] && (touchedFields[id] || attemptedValidation))
      .length;
  };

  // Check if all required fields in a group are filled
  const isGroupComplete = (groupIndex: number): boolean => {
    const questionGroups = isContactDetailsStep
      ? contactDetailsStepData.questionGroups
      : currentSection?.questionGroups || [];

    const group = questionGroups[groupIndex];
    if (!group) return true;

    // Check all questions in the group
    for (const question of group.questions) {
      // Skip questions that shouldn't be displayed
      if (!isContactDetailsStep && !shouldDisplayQuestion(question as FormQuestion, formData)) {
        continue;
      }

      // Check if required field is filled
      if (question.required) {
        const value = formData[question.id];
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          return false;
        }
      }

      // Check sub-questions
      if (question.subQuestions) {
        for (const subQ of question.subQuestions) {
          if (subQ.required) {
            const subValue = formData[subQ.id];
            if (!subValue || (typeof subValue === 'string' && subValue.trim() === '')) {
              return false;
            }
          }
        }
      }
    }

    return true;
  };

  // Check if a group has only radio button or yes/no required fields
  const groupHasOnlyRadioButtonRequiredFields = (groupIndex: number): boolean => {
    const questionGroups = isContactDetailsStep
      ? contactDetailsStepData.questionGroups
      : currentSection?.questionGroups || [];

    const group = questionGroups[groupIndex];
    if (!group) return false;

    let hasRequiredFields = false;

    for (const question of group.questions) {
      // Skip questions that shouldn't be displayed
      if (!isContactDetailsStep && !shouldDisplayQuestion(question as FormQuestion, formData)) {
        continue;
      }

      // If there's a required field that's not a radio button or yesno, return false
      if (question.required) {
        hasRequiredFields = true;
        if (question.type !== 'radio' && question.type !== 'yesno') {
          return false;
        }
      }

      // Check sub-questions
      if (question.subQuestions) {
        for (const subQ of question.subQuestions) {
          if (subQ.required) {
            hasRequiredFields = true;
            if (subQ.type !== 'radio' && subQ.type !== 'yesno') {
              return false;
            }
          }
        }
      }
    }

    return hasRequiredFields;
  };

  // Custom validation function for required fields
  const getValidationRules = (required: boolean) => {
    if (!required) return {};
    return {
      required: 'This field is required',
    };
  };

  return {
    getCurrentSectionQuestionIds,
    getGroupQuestionIds,
    currentSectionHasErrors,
    getCurrentSectionErrorCount,
    isGroupComplete,
    groupHasOnlyRadioButtonRequiredFields,
    getValidationRules,
  };
};
