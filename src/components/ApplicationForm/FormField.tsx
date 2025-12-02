import React from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { FormQuestion } from '@/data/applicationFormData';
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
    const validation = getValidationRules(question.required || false);

    switch (question.type) {
      case 'text':
        return (
          <TextInput
            id={question.id}
            label={question.question}
            type='text'
            placeholder={question.placeholder}
            required={question.required}
            error={errors[question.id]}
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
            error={errors[question.id]}
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
            error={errors[question.id]}
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
            error={errors[question.id]}
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
            error={errors[question.id]}
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

    switch (subQuestion.type) {
      case 'textarea':
        return (
          <TextArea
            id={subQuestion.id}
            label={subQuestion.question}
            placeholder={subQuestion.placeholder}
            required={subQuestion.required}
            error={errors[subQuestion.id]}
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
            error={errors[subQuestion.id]}
            helperText={subQuestion.helperText}
            register={register}
            validation={validation}
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
          {question.subQuestions.map((subQuestion) => (
            <div key={subQuestion.id}>{renderSubQuestion(subQuestion)}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FormField;
