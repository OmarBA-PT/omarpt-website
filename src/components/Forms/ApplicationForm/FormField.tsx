import React from 'react';
import {
  UseFormRegister,
  FieldErrors,
  UseFormWatch,
  UseFormSetValue,
  FieldNamesMarkedBoolean,
} from 'react-hook-form';
import { FormQuestion, shouldDisplayQuestion } from '@/data/applicationFormData';
import TextInput from '@/components/Forms/TextInput';
import TextArea from '@/components/Forms/TextArea';
import RadioGroup from '@/components/Forms/RadioGroup';
import CheckboxGroup from '@/components/Forms/CheckboxGroup';
import YesNoField from '@/components/Forms/YesNoField';
import { formStyles } from '@/components/Forms/formStyles';

interface FormFieldProps {
  question: FormQuestion;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  touchedFields: FieldNamesMarkedBoolean<any>;
  attemptedValidation: boolean;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
  getValidationRules: (required: boolean) => object;
}

const FormField = ({
  question,
  register,
  errors,
  touchedFields,
  attemptedValidation,
  watch,
  setValue,
  getValidationRules,
}: FormFieldProps) => {
  const value = watch(question.id);

  const renderField = () => {
    let validation = getValidationRules(question.required || false);

    // Add special validation for email fields
    if (question.id === 'email') {
      validation = {
        ...validation,
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: 'Please enter a valid email address',
        },
      };
    }

    // Only show error if field has been touched or validation was attempted
    const shouldShowError = touchedFields[question.id] || attemptedValidation;

    // Determine input type for text fields
    let inputType: 'text' | 'email' | 'tel' = 'text';
    if (question.id === 'email') inputType = 'email';
    if (question.id === 'phone') inputType = 'tel';

    switch (question.type) {
      case 'text':
        return (
          <TextInput
            id={question.id}
            label={question.question}
            type={inputType}
            placeholder={question.placeholder}
            required={question.required}
            error={shouldShowError ? errors[question.id] : undefined}
            helperText={question.helperText}
            register={register}
            validation={validation}
          />
        );

      case 'textarea':
        return (
          <TextArea
            id={question.id}
            label={question.question}
            placeholder={question.placeholder}
            required={question.required}
            error={shouldShowError ? errors[question.id] : undefined}
            helperText={question.helperText}
            register={register}
            validation={validation}
            rows={4}
          />
        );

      case 'radio':
        return (
          <RadioGroup
            id={question.id}
            label={question.question}
            options={question.options || []}
            required={question.required}
            error={shouldShowError ? errors[question.id] : undefined}
            helperText={question.helperText}
            register={register}
            validation={validation}
          />
        );

      case 'checkbox':
        return (
          <CheckboxGroup
            id={question.id}
            label={question.question}
            options={question.options || []}
            required={question.required}
            error={shouldShowError ? errors[question.id] : undefined}
            helperText={question.helperText}
            value={value}
            setValue={setValue}
          />
        );

      case 'yesno':
        return (
          <YesNoField
            id={question.id}
            label={question.question}
            required={question.required}
            error={shouldShowError ? errors[question.id] : undefined}
            helperText={question.helperText}
            register={register}
            validation={validation}
          />
        );

      default:
        return null;
    }
  };

  const renderSubQuestion = (subQuestion: FormQuestion) => {
    const validation = getValidationRules(subQuestion.required || false);
    // Only show error if field has been touched or validation was attempted
    const shouldShowError = touchedFields[subQuestion.id] || attemptedValidation;
    const subQuestionValue = watch(subQuestion.id);

    switch (subQuestion.type) {
      case 'textarea':
        return (
          <TextArea
            id={subQuestion.id}
            label={subQuestion.question}
            placeholder={subQuestion.placeholder}
            required={subQuestion.required}
            error={shouldShowError ? errors[subQuestion.id] : undefined}
            helperText={subQuestion.helperText}
            register={register}
            validation={validation}
            rows={3}
          />
        );
      case 'text':
        return (
          <TextInput
            id={subQuestion.id}
            label={subQuestion.question}
            type='text'
            placeholder={subQuestion.placeholder}
            required={subQuestion.required}
            error={shouldShowError ? errors[subQuestion.id] : undefined}
            helperText={subQuestion.helperText}
            register={register}
            validation={validation}
          />
        );
      case 'yesno':
        return (
          <YesNoField
            id={subQuestion.id}
            label={subQuestion.question}
            required={subQuestion.required}
            error={shouldShowError ? errors[subQuestion.id] : undefined}
            helperText={subQuestion.helperText}
            register={register}
            validation={validation}
          />
        );
      case 'radio':
        return (
          <RadioGroup
            id={subQuestion.id}
            label={subQuestion.question}
            options={subQuestion.options || []}
            required={subQuestion.required}
            error={shouldShowError ? errors[subQuestion.id] : undefined}
            helperText={subQuestion.helperText}
            register={register}
            validation={validation}
          />
        );
      case 'checkbox':
        return (
          <CheckboxGroup
            id={subQuestion.id}
            label={subQuestion.question}
            options={subQuestion.options || []}
            required={subQuestion.required}
            error={shouldShowError ? errors[subQuestion.id] : undefined}
            helperText={subQuestion.helperText}
            value={subQuestionValue}
            setValue={setValue}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={formStyles.field.wrapper}>
      {renderField()}

      {/* Render sub-questions if they exist */}
      {question.subQuestions && question.subQuestions.length > 0 && (
        <div className={formStyles.field.subQuestionWrapper}>
          {question.subQuestions.map((subQuestion: FormQuestion) => {
            // Check if subQuestion should be displayed based on conditionalOn logic
            const formData = watch();
            if (!shouldDisplayQuestion(subQuestion, formData)) {
              return null;
            }

            return <div key={subQuestion.id}>{renderSubQuestion(subQuestion)}</div>;
          })}
        </div>
      )}
    </div>
  );
};

export default FormField;
