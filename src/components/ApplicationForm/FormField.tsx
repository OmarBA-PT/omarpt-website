import React from 'react';
import { FormQuestion } from '@/data/applicationFormData';

interface FormFieldProps {
  question: FormQuestion;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  subQuestionValues?: Record<string, any>;
  onSubQuestionChange?: (questionId: string, value: any) => void;
}

const FormField = ({
  question,
  value,
  onChange,
  error,
  subQuestionValues = {},
  onSubQuestionChange,
}: FormFieldProps) => {
  const renderField = () => {
    switch (question.type) {
      case 'text':
        return (
          <input
            type='text'
            id={question.id}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder}
            className={`w-full px-4 py-3 rounded-lg border text-black ${
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-brand-primary focus:ring-brand-primary'
            } focus:outline-none focus:ring-2 transition-colors text-body-base`}
            required={question.required}
          />
        );

      case 'textarea':
        return (
          <textarea
            id={question.id}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder}
            rows={4}
            className={`w-full px-4 py-3 rounded-lg border ${
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-brand-primary focus:ring-brand-primary'
            } focus:outline-none focus:ring-2 transition-colors text-body-base resize-y min-h-[100px]`}
            required={question.required}
          />
        );

      case 'number':
        return (
          <input
            type='number'
            id={question.id}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder}
            className={`w-full px-4 py-3 rounded-lg border ${
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-brand-primary focus:ring-brand-primary'
            } focus:outline-none focus:ring-2 transition-colors text-body-base`}
            required={question.required}
          />
        );

      case 'radio':
        return (
          <div className='space-y-3'>
            {question.options?.map((option) => (
              <label
                key={option.value}
                className='flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-brand-primary hover:bg-brand-primary/5 cursor-pointer transition-all group'>
                <input
                  type='radio'
                  name={question.id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => onChange(e.target.value)}
                  className='mt-1 w-4 h-4 text-brand-primary focus:ring-brand-primary focus:ring-2 cursor-pointer'
                  required={question.required}
                />
                <span className='text-body-base text-gray-700 group-hover:text-gray-900 flex-1'>
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        const selectedValues = Array.isArray(value) ? value : [];
        return (
          <div className='space-y-3'>
            {question.options?.map((option) => (
              <label
                key={option.value}
                className='flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-brand-primary hover:bg-brand-primary/5 cursor-pointer transition-all group'>
                <input
                  type='checkbox'
                  value={option.value}
                  checked={selectedValues.includes(option.value)}
                  onChange={(e) => {
                    const newValues = e.target.checked
                      ? [...selectedValues, option.value]
                      : selectedValues.filter((v: string) => v !== option.value);
                    onChange(newValues);
                  }}
                  className='mt-1 w-4 h-4 text-brand-primary focus:ring-brand-primary focus:ring-2 cursor-pointer rounded'
                />
                <span className='text-body-base text-gray-700 group-hover:text-gray-900 flex-1'>
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        );

      case 'yesno':
        return (
          <div className='flex gap-4'>
            <label className='flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-brand-primary hover:bg-brand-primary/5 cursor-pointer transition-all group flex-1'>
              <input
                type='radio'
                name={question.id}
                value='yes'
                checked={value === 'yes'}
                onChange={(e) => onChange(e.target.value)}
                className='w-4 h-4 text-brand-primary focus:ring-brand-primary focus:ring-2 cursor-pointer'
                required={question.required}
              />
              <span className='text-body-base text-gray-700 group-hover:text-gray-900'>Yes</span>
            </label>
            <label className='flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-brand-primary hover:bg-brand-primary/5 cursor-pointer transition-all group flex-1'>
              <input
                type='radio'
                name={question.id}
                value='no'
                checked={value === 'no'}
                onChange={(e) => onChange(e.target.value)}
                className='w-4 h-4 text-brand-primary focus:ring-brand-primary focus:ring-2 cursor-pointer'
                required={question.required}
              />
              <span className='text-body-base text-gray-700 group-hover:text-gray-900'>No</span>
            </label>
          </div>
        );

      default:
        return null;
    }
  };

  const renderSubQuestion = (subQuestion: FormQuestion) => {
    const subValue = subQuestionValues[subQuestion.id];

    switch (subQuestion.type) {
      case 'textarea':
        return (
          <textarea
            id={subQuestion.id}
            value={subValue || ''}
            onChange={(e) => onSubQuestionChange?.(subQuestion.id, e.target.value)}
            placeholder={subQuestion.placeholder}
            rows={3}
            className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-brand-primary focus:ring-brand-primary focus:outline-none focus:ring-2 transition-colors text-body-base resize-y min-h-20'
            required={subQuestion.required}
          />
        );
      case 'text':
        return (
          <input
            type='text'
            id={subQuestion.id}
            value={subValue || ''}
            onChange={(e) => onSubQuestionChange?.(subQuestion.id, e.target.value)}
            placeholder={subQuestion.placeholder}
            className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-brand-primary focus:ring-brand-primary focus:outline-none focus:ring-2 transition-colors text-body-base'
            required={subQuestion.required}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className='mb-6'>
      <label htmlFor={question.id} className='block mb-2'>
        <span className='text-body-base font-medium text-gray-900'>
          {question.question}
          {question.required && <span className='text-red-500 ml-1'>*</span>}
        </span>
      </label>
      {renderField()}
      {question.helperText && (
        <p className='mt-2 text-body-sm text-gray-600'>{question.helperText}</p>
      )}
      {error && <p className='mt-2 text-body-sm text-red-600'>{error}</p>}

      {/* Render sub-questions if they exist */}
      {question.subQuestions && question.subQuestions.length > 0 && (
        <div className='mt-4 ml-4 pl-4 border-l-4 border-brand-primary/30 space-y-4'>
          {question.subQuestions.map((subQuestion) => (
            <div key={subQuestion.id}>
              <label htmlFor={subQuestion.id} className='block mb-2'>
                <span className='text-body-sm font-medium text-gray-700'>
                  {subQuestion.question}
                  {subQuestion.required && <span className='text-red-500 ml-1'>*</span>}
                </span>
              </label>
              {renderSubQuestion(subQuestion)}
              {subQuestion.helperText && (
                <p className='mt-2 text-body-xs text-gray-600'>{subQuestion.helperText}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FormField;
