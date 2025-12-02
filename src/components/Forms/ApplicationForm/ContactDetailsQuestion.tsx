import React from 'react';
import { UseFormRegister, FieldErrors, FieldValues } from 'react-hook-form';

interface Question {
  id: string;
  question: string;
  placeholder?: string;
  required?: boolean;
}

interface ContactDetailsQuestionProps {
  question: Question;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  touchedFields: any;
  attemptedValidation: boolean;
}

const ContactDetailsQuestion = ({
  question,
  register,
  errors,
  touchedFields,
  attemptedValidation,
}: ContactDetailsQuestionProps) => {
  // Determine input type and validation based on the question
  let inputType: 'text' | 'email' | 'tel' = 'text';
  let validation: any = {};

  if (question.required) {
    validation.required = 'This field is required';
  }

  // Special handling for email field
  if (question.id === 'email') {
    inputType = 'email';
    validation.pattern = {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Please enter a valid email address',
    };
  }

  // Special handling for phone field
  if (question.id === 'phone') {
    inputType = 'tel';
  }

  const isTouchedOrAttempted = touchedFields[question.id] || attemptedValidation;
  const hasError = errors[question.id];

  return (
    <div>
      <label htmlFor={question.id} className='block text-body-sm font-medium text-gray-700 mb-2'>
        {question.question}
        {question.required && <span className='text-red-500 ml-1'>*</span>}
      </label>
      <input
        id={question.id}
        type={inputType}
        placeholder={question.placeholder}
        {...register(question.id, validation)}
        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
          isTouchedOrAttempted
            ? hasError
              ? 'border-red-500 focus:ring-red-500/20'
              : 'border-green-500 focus:ring-green-500/20'
            : 'border-gray-300 focus:ring-brand-primary/20'
        }`}
      />
      {isTouchedOrAttempted && hasError && (
        <p className='mt-2 text-body-sm text-red-600'>{(errors[question.id] as any)?.message}</p>
      )}
    </div>
  );
};

export default ContactDetailsQuestion;
