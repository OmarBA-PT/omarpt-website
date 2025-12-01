import React from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { FormQuestion } from '@/data/applicationFormData';

interface FormFieldProps {
  question: FormQuestion;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
  getValidationRules: (required: boolean) => object;
}

const FormField = ({
  question,
  register,
  errors,
  watch,
  setValue,
  getValidationRules,
}: FormFieldProps) => {
  const value = watch(question.id);

  const renderField = () => {
    switch (question.type) {
      case 'text':
        return (
          <>
            <input
              type='text'
              id={question.id}
              {...register(question.id, getValidationRules(question.required || false))}
              placeholder={question.placeholder}
              className={`w-full px-4 py-3 rounded-lg border text-black ${
                errors[question.id]
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-brand-primary focus:ring-brand-primary'
              } focus:outline-none focus:ring-2 transition-colors text-body-base`}
            />
          </>
        );

      case 'textarea':
        return (
          <>
            <textarea
              id={question.id}
              {...register(question.id, getValidationRules(question.required || false))}
              placeholder={question.placeholder}
              rows={4}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors[question.id]
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-brand-primary focus:ring-brand-primary'
              } focus:outline-none focus:ring-2 transition-colors text-body-base resize-y min-h-[100px]`}
            />
          </>
        );

      case 'number':
        return (
          <>
            <input
              type='number'
              id={question.id}
              {...register(question.id, getValidationRules(question.required || false))}
              placeholder={question.placeholder}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors[question.id]
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-brand-primary focus:ring-brand-primary'
              } focus:outline-none focus:ring-2 transition-colors text-body-base`}
            />
          </>
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
                  value={option.value}
                  {...register(question.id, getValidationRules(question.required || false))}
                  className='mt-1 w-4 h-4 text-brand-primary focus:ring-brand-primary focus:ring-2 cursor-pointer'
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
                    setValue(question.id, newValues);
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
                value='yes'
                {...register(question.id, getValidationRules(question.required || false))}
                className='w-4 h-4 text-brand-primary focus:ring-brand-primary focus:ring-2 cursor-pointer'
              />
              <span className='text-body-base text-gray-700 group-hover:text-gray-900'>Yes</span>
            </label>
            <label className='flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-brand-primary hover:bg-brand-primary/5 cursor-pointer transition-all group flex-1'>
              <input
                type='radio'
                value='no'
                {...register(question.id, getValidationRules(question.required || false))}
                className='w-4 h-4 text-brand-primary focus:ring-brand-primary focus:ring-2 cursor-pointer'
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
    switch (subQuestion.type) {
      case 'textarea':
        return (
          <textarea
            id={subQuestion.id}
            {...register(subQuestion.id, getValidationRules(subQuestion.required || false))}
            placeholder={subQuestion.placeholder}
            rows={3}
            className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-brand-primary focus:ring-brand-primary focus:outline-none focus:ring-2 transition-colors text-body-base resize-y min-h-20'
          />
        );
      case 'text':
        return (
          <input
            type='text'
            id={subQuestion.id}
            {...register(subQuestion.id, getValidationRules(subQuestion.required || false))}
            placeholder={subQuestion.placeholder}
            className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-brand-primary focus:ring-brand-primary focus:outline-none focus:ring-2 transition-colors text-body-base'
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
      {errors[question.id] && (
        <p className='mt-2 text-body-sm text-red-600'>
          {errors[question.id]?.message as string}
        </p>
      )}

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
              {errors[subQuestion.id] && (
                <p className='mt-2 text-body-xs text-red-600'>
                  {errors[subQuestion.id]?.message as string}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FormField;
