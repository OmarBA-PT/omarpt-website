'use client';

import React, { useState } from 'react';
import { applicationFormData, shouldDisplayQuestion } from '@/data/applicationFormData';
import FormField from './FormField';

const ApplicationForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentSection = applicationFormData[currentStep];
  const totalSteps = applicationFormData.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleFieldChange = (questionId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [questionId]: value
    }));
    // Clear error when user starts typing
    if (errors[questionId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  const handleSubQuestionChange = (subQuestionId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [subQuestionId]: value
    }));
  };

  const validateCurrentSection = (): boolean => {
    const newErrors: Record<string, string> = {};

    currentSection.questions.forEach(question => {
      // Only validate if question should be displayed
      if (!shouldDisplayQuestion(question, formData)) return;

      if (question.required) {
        const value = formData[question.id];

        if (!value || (Array.isArray(value) && value.length === 0)) {
          newErrors[question.id] = 'This field is required';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentSection()) {
      if (currentStep < totalSteps - 1) {
        setCurrentStep(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateCurrentSection()) {
      return;
    }

    setIsSubmitting(true);

    // TODO: Implement form submission logic
    console.log('Form submitted:', formData);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    alert('Thank you for your application! We will be in touch soon.');
    setIsSubmitting(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
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

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
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
                value={formData[question.id]}
                onChange={value => handleFieldChange(question.id, value)}
                error={errors[question.id]}
                subQuestionValues={formData}
                onSubQuestionChange={handleSubQuestionChange}
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
