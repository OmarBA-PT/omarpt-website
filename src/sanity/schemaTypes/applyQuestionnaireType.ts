// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { defineField, defineType, defineArrayMember } from 'sanity';
import { ClipboardIcon, DocumentTextIcon, BlockElementIcon, HelpCircleIcon } from '@sanity/icons';

// Question option schema (for radio/checkbox questions)
const questionOptionFields = [
  defineField({
    name: 'label',
    title: 'Label',
    type: 'string',
    description: 'The text shown to the user',
    validation: (Rule) => Rule.required().error('Option label is required'),
  }),
  defineField({
    name: 'value',
    title: 'Value',
    type: 'string',
    description: 'The value stored when this option is selected (must be unique)',
    validation: (Rule) => Rule.required().error('Option value is required'),
  }),
];

// Conditional display configuration
const conditionalOnFields = [
  defineField({
    name: 'questionId',
    title: 'Depends on Question ID',
    type: 'string',
    description: 'The ID of the question that controls this field\'s visibility',
    validation: (Rule) => Rule.required().error('Question ID is required for conditional logic'),
  }),
  defineField({
    name: 'value',
    title: 'Expected Value',
    type: 'string',
    description: 'This question will only appear when the controlling question has this value (e.g., "yes" for yes/no questions)',
    validation: (Rule) => Rule.required().error('Expected value is required for conditional logic'),
  }),
];

// Sub-question fields (one level deep, cannot have their own subQuestions)
const subQuestionFields = [
  defineField({
    name: 'id',
    title: 'Question ID',
    type: 'string',
    description: 'Unique identifier for this question (used for form field name)',
    validation: (Rule) => Rule.required().error('Question ID is required'),
  }),
  defineField({
    name: 'question',
    title: 'Question Text',
    type: 'string',
    description: 'The question to display to the user',
    validation: (Rule) => Rule.required().error('Question text is required'),
  }),
  defineField({
    name: 'type',
    title: 'Question Type',
    type: 'string',
    description: 'The type of input field to display',
    options: {
      list: [
        { title: 'Text (single line)', value: 'text' },
        { title: 'Text Area (multi-line)', value: 'textarea' },
        { title: 'Yes/No', value: 'yesno' },
        { title: 'Radio (single choice)', value: 'radio' },
        { title: 'Checkbox (multiple choice)', value: 'checkbox' },
      ],
      layout: 'radio',
    },
    initialValue: 'textarea',
    validation: (Rule) => Rule.required().error('Question type is required'),
  }),
  defineField({
    name: 'required',
    title: 'Required',
    type: 'boolean',
    description: 'Whether this question must be answered',
    initialValue: false,
  }),
  defineField({
    name: 'placeholder',
    title: 'Placeholder Text',
    type: 'string',
    description: 'Placeholder text shown in empty text fields',
  }),
  defineField({
    name: 'helperText',
    title: 'Helper Text',
    type: 'string',
    description: 'Additional help text shown below the question',
  }),
  defineField({
    name: 'options',
    title: 'Options',
    type: 'array',
    description: 'Options for radio or checkbox questions',
    hidden: ({ parent }) => parent?.type !== 'radio' && parent?.type !== 'checkbox',
    of: [
      defineArrayMember({
        type: 'object',
        name: 'questionOption',
        title: 'Option',
        fields: questionOptionFields,
        preview: {
          select: {
            label: 'label',
            value: 'value',
          },
          prepare({ label, value }) {
            return {
              title: label || 'Untitled Option',
              subtitle: value ? `Value: ${value}` : '',
            };
          },
        },
      }),
    ],
    validation: (Rule) =>
      Rule.custom((options, context) => {
        const parent = context.parent as { type?: string };
        if ((parent?.type === 'radio' || parent?.type === 'checkbox') && (!options || options.length < 2)) {
          return 'Radio and checkbox questions require at least 2 options';
        }
        return true;
      }),
  }),
  defineField({
    name: 'conditionalOn',
    title: 'Conditional Display',
    type: 'object',
    description: 'Configure when this question should be shown based on another question\'s answer',
    fields: conditionalOnFields,
    options: {
      collapsible: true,
      collapsed: true,
    },
  }),
];

// Main question fields (can have subQuestions)
const questionFields = [
  ...subQuestionFields.slice(0, -1), // All fields except conditionalOn
  defineField({
    name: 'subQuestions',
    title: 'Sub-Questions',
    type: 'array',
    description: 'Follow-up questions that appear based on the answer to this question',
    of: [
      defineArrayMember({
        type: 'object',
        name: 'subQuestion',
        title: 'Sub-Question',
        icon: HelpCircleIcon,
        fields: subQuestionFields,
        preview: {
          select: {
            question: 'question',
            type: 'type',
            required: 'required',
            conditionalOn: 'conditionalOn',
          },
          prepare({ question, type, required, conditionalOn }) {
            const typeLabels: Record<string, string> = {
              text: 'Text',
              textarea: 'Text Area',
              yesno: 'Yes/No',
              radio: 'Radio',
              checkbox: 'Checkbox',
            };
            const conditional = conditionalOn?.questionId
              ? ` (shows when ${conditionalOn.questionId} = "${conditionalOn.value}")`
              : '';
            return {
              title: question || 'Untitled Sub-Question',
              subtitle: `${typeLabels[type] || type}${required ? ' • Required' : ''}${conditional}`,
              media: HelpCircleIcon,
            };
          },
        },
      }),
    ],
  }),
  defineField({
    name: 'conditionalOn',
    title: 'Conditional Display',
    type: 'object',
    description: 'Configure when this question should be shown based on another question\'s answer',
    fields: conditionalOnFields,
    options: {
      collapsible: true,
      collapsed: true,
    },
  }),
];

export const applyQuestionnaireType = defineType({
  name: 'applyQuestionnaire',
  title: 'Apply Questionnaire',
  type: 'document',
  icon: ClipboardIcon,
  fields: [
    defineField({
      name: 'sections',
      title: 'Form Sections',
      type: 'array',
      description: 'The sections of the application form questionnaire. Each section becomes a step in the multi-step form.',
      validation: (Rule) => Rule.required().min(1).error('At least one section is required'),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'formSection',
          title: 'Section',
          icon: DocumentTextIcon,
          fields: [
            defineField({
              name: 'id',
              title: 'Section ID',
              type: 'string',
              description: 'Unique identifier for this section',
              validation: (Rule) => Rule.required().error('Section ID is required'),
            }),
            defineField({
              name: 'title',
              title: 'Section Title',
              type: 'string',
              description: 'The title shown at the top of this form section',
              validation: (Rule) => Rule.required().error('Section title is required'),
            }),
            defineField({
              name: 'description',
              title: 'Section Description',
              type: 'string',
              description: 'A brief description shown below the section title',
            }),
            defineField({
              name: 'questionGroups',
              title: 'Question Groups',
              type: 'array',
              description: 'Groups of related questions within this section. Each group can be expanded/collapsed in the form.',
              validation: (Rule) => Rule.required().min(1).error('At least one question group is required'),
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'questionGroup',
                  title: 'Question Group',
                  icon: BlockElementIcon,
                  fields: [
                    defineField({
                      name: 'id',
                      title: 'Group ID',
                      type: 'string',
                      description: 'Unique identifier for this group',
                      validation: (Rule) => Rule.required().error('Group ID is required'),
                    }),
                    defineField({
                      name: 'title',
                      title: 'Group Title',
                      type: 'string',
                      description: 'Title for this question group (shown as expandable header)',
                    }),
                    defineField({
                      name: 'questions',
                      title: 'Questions',
                      type: 'array',
                      description: 'The questions in this group',
                      validation: (Rule) => Rule.required().min(1).error('At least one question is required'),
                      of: [
                        defineArrayMember({
                          type: 'object',
                          name: 'formQuestion',
                          title: 'Question',
                          icon: HelpCircleIcon,
                          fields: questionFields,
                          preview: {
                            select: {
                              question: 'question',
                              type: 'type',
                              required: 'required',
                              hasSubQuestions: 'subQuestions',
                            },
                            prepare({ question, type, required, hasSubQuestions }) {
                              const typeLabels: Record<string, string> = {
                                text: 'Text',
                                textarea: 'Text Area',
                                yesno: 'Yes/No',
                                radio: 'Radio',
                                checkbox: 'Checkbox',
                              };
                              const subQCount = hasSubQuestions?.length || 0;
                              const subQText = subQCount > 0 ? ` • ${subQCount} sub-question${subQCount > 1 ? 's' : ''}` : '';
                              return {
                                title: question || 'Untitled Question',
                                subtitle: `${typeLabels[type] || type}${required ? ' • Required' : ''}${subQText}`,
                                media: HelpCircleIcon,
                              };
                            },
                          },
                        }),
                      ],
                    }),
                  ],
                  preview: {
                    select: {
                      title: 'title',
                      questions: 'questions',
                    },
                    prepare({ title, questions }) {
                      const questionCount = questions?.length || 0;
                      return {
                        title: title || 'Untitled Group',
                        subtitle: `${questionCount} question${questionCount !== 1 ? 's' : ''}`,
                        media: BlockElementIcon,
                      };
                    },
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: {
              title: 'title',
              questionGroups: 'questionGroups',
            },
            prepare({ title, questionGroups }) {
              const groupCount = questionGroups?.length || 0;
              const questionCount = questionGroups?.reduce(
                (acc: number, group: { questions?: unknown[] }) => acc + (group.questions?.length || 0),
                0
              ) || 0;
              return {
                title: title || 'Untitled Section',
                subtitle: `${groupCount} group${groupCount !== 1 ? 's' : ''} • ${questionCount} question${questionCount !== 1 ? 's' : ''}`,
                media: DocumentTextIcon,
              };
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      sections: 'sections',
    },
    prepare({ sections }) {
      const sectionCount = sections?.length || 0;
      const questionCount = sections?.reduce((acc: number, section: { questionGroups?: { questions?: unknown[] }[] }) => {
        return acc + (section.questionGroups?.reduce((groupAcc: number, group: { questions?: unknown[] }) => {
          return groupAcc + (group.questions?.length || 0);
        }, 0) || 0);
      }, 0) || 0;
      return {
        title: 'Apply - Questionnaire',
        subtitle: `${sectionCount} section${sectionCount !== 1 ? 's' : ''} • ${questionCount} question${questionCount !== 1 ? 's' : ''}`,
      };
    },
  },
});
