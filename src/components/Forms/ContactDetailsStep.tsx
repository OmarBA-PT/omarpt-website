import React from 'react';
import { UseFormRegister, FieldErrors, FieldNamesMarkedBoolean } from 'react-hook-form';
import TextInput from './TextInput';
import { contactDetailsStepData } from './ApplicationForm/contactDetailsStepData';

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
    <>
      {contactDetailsStepData.questions.map((question) => {
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
    </>
  );
};

export default ContactDetailsStep;
