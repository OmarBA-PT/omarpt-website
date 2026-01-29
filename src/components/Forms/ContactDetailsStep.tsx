import React from 'react';
import { UseFormRegister, FieldErrors, FieldNamesMarkedBoolean } from 'react-hook-form';
import TextInput from './TextInput';
import { contactDetailsStepData } from './ApplicationForm/data/contactDetailsStepData';

interface ContactDetailsStepProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  touchedFields: FieldNamesMarkedBoolean<any>;
  attemptedValidation: boolean;
}

const ContactDetailsStep = ({
  register,
  errors,
  touchedFields,
  attemptedValidation,
}: ContactDetailsStepProps) => {
  return (
    <div className='space-y-6'>
      {contactDetailsStepData.questionGroups.map((group) => (
        <div key={group.id} className='p-6 bg-brand-white/40 rounded-lg border border-gray-200'>
          {group.title && (
            <h3 className='text-body-lg font-semibold text-brand-secondary mb-4'>{group.title}</h3>
          )}
          <div className='space-y-4'>
            {group.questions.map((question) => {
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

              return (
                <TextInput
                  key={question.id}
                  id={question.id}
                  label={question.question}
                  type={inputType}
                  placeholder={question.placeholder}
                  required={question.required}
                  error={
                    (touchedFields as any)[question.id] || attemptedValidation
                      ? (errors as any)[question.id]
                      : undefined
                  }
                  register={register}
                  validation={validation}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactDetailsStep;
