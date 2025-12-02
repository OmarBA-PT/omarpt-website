import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import TextInput from './TextInput';

interface ContactDetailsStepProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

const ContactDetailsStep = ({ register, errors }: ContactDetailsStepProps) => {
  return (
    <>
      <TextInput
        id='fullName'
        label='Your Name'
        type='text'
        placeholder='Enter your full name'
        required
        error={errors.fullName}
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
        error={errors.email}
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
        error={errors.phone}
        register={register}
        validation={{
          required: 'This field is required',
        }}
      />
    </>
  );
};

export default ContactDetailsStep;
