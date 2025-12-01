'use client';

import { useState, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { applicationFormData, shouldDisplayQuestion } from '@/data/applicationFormData';
import FormField from './FormField';
import { MdError } from 'react-icons/md';

// Create a type for all form fields dynamically
type ApplicationFormData = Record<string, any>;

const ApplicationForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formTopRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    trigger,
  } = useForm<ApplicationFormData>({
    mode: 'onTouched',
    defaultValues: {},
  });

  const formData = watch(); // Watch all form values

  const currentSection = applicationFormData[currentStep];
  const totalSteps = applicationFormData.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  // Get all question IDs for the current section (including sub-questions)
  const getCurrentSectionQuestionIds = () => {
    const ids: string[] = [];
    currentSection.questions.forEach(question => {
      if (shouldDisplayQuestion(question, formData)) {
        ids.push(question.id);
        // Add sub-question IDs
        question.subQuestions?.forEach(subQ => {
          ids.push(subQ.id);
        });
      }
    });
    return ids;
  };

  // Check if current section has any errors
  const currentSectionHasErrors = () => {
    const questionIds = getCurrentSectionQuestionIds();
    return questionIds.some(id => errors[id]);
  };

  // Get error count for current section
  const getCurrentSectionErrorCount = () => {
    const questionIds = getCurrentSectionQuestionIds();
    return questionIds.filter(id => errors[id]).length;
  };

  // Scroll to top of form
  const scrollToTop = () => {
    formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleNext = async () => {
    // Validate all fields in current section
    const questionIds = getCurrentSectionQuestionIds();
    const isValid = await trigger(questionIds);

    if (isValid) {
      if (currentStep < totalSteps - 1) {
        setCurrentStep(prev => prev + 1);
        scrollToTop();
      }
    } else {
      // Scroll to top to show error banner
      scrollToTop();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      scrollToTop();
    }
  };

  const onSubmit: SubmitHandler<ApplicationFormData> = async (data) => {
    setIsSubmitting(true);

    // TODO: Implement form submission logic
    console.log('Form submitted:', data);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    alert('Thank you for your application! We will be in touch soon.');
    setIsSubmitting(false);
  };

  // Custom validation function for required fields
  const getValidationRules = (required: boolean) => {
    if (!required) return {};

    return {
      required: 'This field is required',
    };
  };

  return (
    <div className="w-full max-w-4xl mx-auto" ref={formTopRef}>
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-body-sm font-medium text-gray-700">
            Step {currentStep + 1} of {totalSteps}
          </span>
          <span className="text-body-sm font-medium text-brand-primary">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-primary transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step Indicators */}
      <div className="mb-8 hidden md:flex justify-between">
        {applicationFormData.map((section, index) => (
          <div
            key={section.id}
            className={`flex flex-col items-center flex-1 ${
              index !== 0 ? 'ml-4' : ''
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2 transition-colors ${
                index < currentStep
                  ? 'bg-brand-primary text-white'
                  : index === currentStep
                  ? 'bg-brand-primary text-white ring-4 ring-brand-primary/20'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {index < currentStep ? '✓' : index + 1}
            </div>
            <span
              className={`text-body-xs text-center ${
                index === currentStep
                  ? 'text-brand-primary font-medium'
                  : 'text-gray-500'
              }`}
            >
              {section.title}
            </span>
          </div>
        ))}
      </div>

      {/* Section Header */}
      <div className="mb-8 text-center">
        <h2 className="text-h3 font-bold text-gray-900 mb-2">
          {currentSection.title}
        </h2>
        {currentSection.description && (
          <p className="text-body-base text-gray-600">
            {currentSection.description}
          </p>
        )}
      </div>

      {/* Error Summary Banner */}
      {currentSectionHasErrors() && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
          <div className="flex items-start">
            <MdError className="w-5 h-5 text-red-500 mt-0.5 mr-3 shrink-0" />
            <div>
              <h3 className="text-body-base font-semibold text-red-800 mb-1">
                Please complete all required fields
              </h3>
              <p className="text-body-sm text-red-700">
                {getCurrentSectionErrorCount()} required {getCurrentSectionErrorCount() === 1 ? 'field is' : 'fields are'} missing. Please check the highlighted fields below.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-lg p-8">
        <div className="space-y-6">
          {currentSection.questions.map(question => {
            // Check if question should be displayed based on conditional logic
            if (!shouldDisplayQuestion(question, formData)) {
              return null;
            }

            return (
              <FormField
                key={question.id}
                question={question}
                register={register}
                errors={errors}
                watch={watch}
                setValue={setValue}
                getValidationRules={getValidationRules}
              />
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              currentStep === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Previous
          </button>

          {currentStep < totalSteps - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-3 bg-brand-primary text-white rounded-lg font-medium hover:bg-brand-primary/90 transition-colors"
            >
              Next Step
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-8 py-3 rounded-lg font-medium transition-all ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-brand-primary text-white hover:bg-brand-primary/90 hover:shadow-lg'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          )}
        </div>
      </form>

      {/* Mobile Step Indicator */}
      <div className="md:hidden mt-4 text-center">
        <p className="text-body-sm text-gray-600">
          {applicationFormData.map((section, index) => (
            <span
              key={section.id}
              className={
                index === currentStep ? 'text-brand-primary font-medium' : ''
              }
            >
              {index > 0 && ' → '}
              {section.title}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
};

export default ApplicationForm;
