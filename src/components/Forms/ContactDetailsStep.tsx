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
      {contactDetailsStepData.fields.map((field) => (
        <TextInput
          key={field.id}
          id={field.id}
          label={field.label}
          type={field.type}
          placeholder={field.placeholder}
          required={field.required}
          error={
            (touchedFields as any)[field.id] || attemptedValidation
              ? (errors as any)[field.id]
              : undefined
          }
          register={register}
          validation={field.validation}
        />
      ))}
    </>
  );
};

export default ContactDetailsStep;
