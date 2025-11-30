# Application Form Implementation

## Overview

A comprehensive, multi-step application form has been implemented on the `/apply` page. The form is designed with excellent UX and is structured to be easily migrated to Sanity CMS in the future.

## What Was Implemented

### 1. Data Structure (`src/data/applicationFormData.ts`)

- **Centralized data file** containing all form questions from the three PDFs:
  - Fitness Questionnaire
  - General Health Questionnaire
  - Goal Sheet
- **TypeScript interfaces** for type safety
- **Helper functions** for question management
- **Easy Sanity migration**: The data structure mirrors what would be fetched from Sanity, requiring minimal changes when integrating with CMS

### 2. Form Components

#### ApplicationForm Component (`src/components/ApplicationForm/ApplicationForm.tsx`)
- **Multi-step wizard** with 4 sections:
  1. Personal Information
  2. Fitness Background
  3. Goals & Lifestyle
  4. Health Information
- **Progress indicator** showing completion percentage
- **Step indicators** (desktop) with visual progress
- **Form validation** with error messages
- **Conditional questions** (e.g., "How much weight to lose?" only shows if user answers "Yes" to needing fat loss)
- **Smooth navigation** between steps with validation
- **Submit button** (currently logs to console, ready for backend integration)

#### FormField Component (`src/components/ApplicationForm/FormField.tsx`)
- **Multiple field types**:
  - Text inputs
  - Textareas
  - Radio buttons
  - Checkboxes
  - Yes/No questions
  - Number inputs
- **Accessible and user-friendly**:
  - Hover states
  - Focus states
  - Clear visual feedback
  - Required field indicators (*)
  - Helper text support
  - Error messages

### 3. Features

✅ **Multi-step form** (4 sections)
✅ **Progress bar** with percentage
✅ **Visual step indicators** (desktop)
✅ **Mobile-responsive** design
✅ **Form validation** on each step
✅ **Conditional logic** (questions appear based on previous answers)
✅ **Required field validation**
✅ **Smooth transitions** between steps
✅ **Error handling** with user-friendly messages
✅ **Professional styling** matching the brand colors
✅ **Accessibility** considerations (labels, focus states, keyboard navigation)

## Question Mapping

All 40+ questions from the PDFs have been implemented across 4 sections:

### Section 1: Personal Information (3 questions)
- Full Name
- Email Address
- Phone Number

### Section 2: Fitness Background (7 questions)
- Activity level
- Cardiovascular ability
- Experience level
- Gym equipment familiarity
- Preferred exercise time
- Days per week commitment
- Enjoyed activities

### Section 3: Goals & Lifestyle (12 questions)
- Desired body shape
- Fat loss goals
- Weight to lose (conditional)
- 3-6 month fitness goals
- Why goals are important
- Achievement feelings
- Wellness goals
- Wellness impact
- 1-year life changes
- Sleep hours
- Water intake
- Meals per day

### Section 4: Health Information (13 questions)
- Physician supervision
- Physician details (conditional)
- Blood pressure medication
- Current issues requiring physician
- Cleared to exercise
- Activity restrictions
- Restriction details (conditional)
- Difficult movements
- Current injuries
- Alcohol consumption
- Smoking status
- Additional health comments
- Training concerns

## Future Integration with Sanity

The data structure in `applicationFormData.ts` is designed for easy Sanity integration:

### Current Structure:
```typescript
export const applicationFormData: FormSection[]
```

### Future Sanity Integration:
```typescript
// Simply replace the import
import { applicationFormData } from '@/sanity/queries/applicationForm';
// Or fetch in the component:
const formData = await sanityFetch({ query: APPLICATION_FORM_QUERY });
```

### Migration Steps (Future):

1. **Create Sanity Schema** for form sections and questions
2. **Create GROQ query** to fetch form structure
3. **Replace data import** in ApplicationForm component
4. **Add submission handler** to save responses to Sanity

The TypeScript interfaces can remain largely unchanged, making the migration seamless.

## Current Submission Behavior

The submit button currently:
- Validates all fields in the final section
- Logs form data to console
- Shows a success alert
- Does NOT send data anywhere (ready for backend integration)

## Testing the Form

1. Navigate to: [http://localhost:3000/apply](http://localhost:3000/apply)
2. Scroll to "Online Application Form" section
3. Fill out the multi-step form
4. Test validation by trying to proceed without filling required fields
5. Test conditional questions (e.g., fat loss question)
6. Submit the form to see console output

## File Structure

```
src/
├── data/
│   └── applicationFormData.ts          # Form questions data
├── components/
│   └── ApplicationForm/
│       ├── ApplicationForm.tsx         # Main form component
│       └── FormField.tsx               # Reusable field component
└── app/
    └── (frontend)/
        └── apply/
            └── page.tsx                # Apply page with integrated form
```

## Styling

- Uses **brand colors** from the design system
- **Gradient backgrounds** for visual interest
- **Hover and focus states** for interactivity
- **Responsive design** (mobile, tablet, desktop)
- **Smooth transitions** and animations
- **Accessibility-first** approach

## Next Steps

When ready to implement submission:

1. **Create API endpoint** (`/api/application-submit`)
2. **Update submit handler** in ApplicationForm.tsx
3. **Add loading states** during submission
4. **Implement email notifications** or Sanity storage
5. **Add success/error pages** or modals
6. **Implement file upload** if needed for medical documents

## Notes

- All questions from the PDFs are included
- Form uses client-side validation (server-side should be added)
- Data is stored in component state (not persisted between sessions)
- Submit button is functional but doesn't send data yet
- Ready for Sanity CMS integration with minimal changes
