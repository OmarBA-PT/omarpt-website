// Transforms Sanity questionnaire data to the format expected by ApplicationForm components
// Falls back to hardcoded data if Sanity data is not available

import type { APPLY_QUESTIONNAIRE_QUERYResult } from '@/sanity/types';
import { applicationFormData, FormSection, FormQuestion, QuestionOption } from '@/data/applicationFormData';

// Sanity option type with _key and _type fields
interface SanityQuestionOption {
  _key: string;
  _type?: string;
  label?: string;
  value?: string;
}

// Sanity conditional configuration
interface SanityConditionalOn {
  questionId?: string;
  value?: string;
}

// Sanity sub-question type
interface SanitySubQuestion {
  _key: string;
  _type?: string;
  id?: string;
  question?: string;
  type?: 'text' | 'textarea' | 'yesno' | 'radio' | 'checkbox';
  required?: boolean;
  placeholder?: string;
  helperText?: string;
  options?: SanityQuestionOption[];
  conditionalOn?: SanityConditionalOn;
}

// Sanity question type
interface SanityQuestion {
  _key: string;
  _type?: string;
  id?: string;
  question?: string;
  type?: 'text' | 'textarea' | 'yesno' | 'radio' | 'checkbox';
  required?: boolean;
  placeholder?: string;
  helperText?: string;
  options?: SanityQuestionOption[];
  conditionalOn?: SanityConditionalOn;
  subQuestions?: SanitySubQuestion[];
}

// Sanity question group type
interface SanityQuestionGroup {
  _key: string;
  _type?: string;
  id?: string;
  title?: string;
  questions?: SanityQuestion[];
}

// Sanity section type
interface SanitySection {
  _key: string;
  _type?: string;
  id?: string;
  title?: string;
  description?: string;
  questionGroups?: SanityQuestionGroup[];
}

/**
 * Transforms Sanity questionnaire data to the FormSection[] format used by the application form.
 * If Sanity data is not available or incomplete, falls back to hardcoded data.
 */
export function transformQuestionnaireData(
  sanityData: APPLY_QUESTIONNAIRE_QUERYResult | null
): FormSection[] {
  // If no Sanity data or no sections, use hardcoded fallback
  if (!sanityData?.sections || sanityData.sections.length === 0) {
    return applicationFormData;
  }

  // Transform Sanity sections to FormSection[]
  return (sanityData.sections as SanitySection[]).map((section): FormSection => ({
    id: section.id || 'unknown-section',
    title: section.title || 'Untitled Section',
    description: section.description || undefined,
    questionGroups: (section.questionGroups || []).map((group) => ({
      id: group.id || 'unknown-group',
      title: group.title || undefined,
      questions: (group.questions || []).map(transformQuestion),
    })),
  }));
}

/**
 * Transforms a Sanity question to FormQuestion format
 */
function transformQuestion(question: SanityQuestion): FormQuestion {
  return {
    id: question.id || 'unknown-question',
    question: question.question || '',
    type: question.type || 'text',
    required: question.required || false,
    placeholder: question.placeholder || undefined,
    helperText: question.helperText || undefined,
    options: question.options?.map(transformOption),
    conditionalOn: question.conditionalOn?.questionId && question.conditionalOn?.value
      ? {
          questionId: question.conditionalOn.questionId,
          value: question.conditionalOn.value,
        }
      : undefined,
    subQuestions: question.subQuestions?.map(transformSubQuestion),
  };
}

/**
 * Transforms a Sanity sub-question to FormQuestion format
 */
function transformSubQuestion(subQuestion: SanitySubQuestion): FormQuestion {
  return {
    id: subQuestion.id || 'unknown-subquestion',
    question: subQuestion.question || '',
    type: subQuestion.type || 'text',
    required: subQuestion.required || false,
    placeholder: subQuestion.placeholder || undefined,
    helperText: subQuestion.helperText || undefined,
    options: subQuestion.options?.map(transformOption),
    conditionalOn: subQuestion.conditionalOn?.questionId && subQuestion.conditionalOn?.value
      ? {
          questionId: subQuestion.conditionalOn.questionId,
          value: subQuestion.conditionalOn.value,
        }
      : undefined,
  };
}

/**
 * Transforms a Sanity option to QuestionOption format
 */
function transformOption(option: SanityQuestionOption): QuestionOption {
  return {
    label: option.label || '',
    value: option.value || '',
  };
}
