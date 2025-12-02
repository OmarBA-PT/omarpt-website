import React from 'react';
import { UseFormRegister, FieldErrors, FieldNamesMarkedBoolean } from 'react-hook-form';
import TextInput from './TextInput';

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
      <TextInput
        id='fullName'
        label='Your Name'
        type='text'
        placeholder='Enter your full name'
        required
        error={touchedFields.fullName || attemptedValidation ? errors.fullName : undefined}
        register={register}
        validation={{
          required: 'This field is required',
        }}
      />

      <TextInput
        id='email'
        label='Email Address'
        type='email'
        placeholder='your.email@example.com'
        required
        error={touchedFields.email || attemptedValidation ? errors.email : undefined}
        register={register}
        validation={{
          required: 'This field is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Please enter a valid email address',
          },
        }}
      />

      <TextInput
        id='phone'
        label='Phone Number'
        type='tel'
        placeholder='+44 7XXX XXXXXX'
        required
        error={touchedFields.phone || attemptedValidation ? errors.phone : undefined}
        register={register}
        validation={{
          required: 'This field is required',
        }}
      />
    </>
  );
};

export default ContactDetailsStep;
