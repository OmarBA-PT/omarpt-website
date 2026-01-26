import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font, Link } from '@react-pdf/renderer';
import { FormSection, FormQuestion, QuestionType } from '@/data/applicationFormData';
import { contactDetailsStepData } from '@/components/Forms/ApplicationForm/data/contactDetailsStepData';
import { SITE_CONFIG } from '@/lib/constants';

// Register fonts for better typography
// Using Google Fonts CDN with proper variant support
Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://fonts.gstatic.com/s/roboto/v30/KFOkCnqEu92Fr1Mu52xPKTM1K9nz.ttf',
      fontWeight: 400,
      fontStyle: 'italic',
    },
    {
      src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlvAx05IsDqlA.ttf',
      fontWeight: 500,
    },
    {
      src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmEU9vAx05IsDqlA.ttf',
      fontWeight: 700,
    },
  ],
});

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    paddingTop: 40,
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 60, // Extra space for footer to prevent overlap
    fontFamily: 'Roboto',
  },
  header: {
    marginBottom: 20,
    borderBottom: '2 solid #000000',
    paddingBottom: 15,
  },
  headerLogoOnly: {
    marginBottom: 15,
    paddingBottom: 10,
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  logoContainerSimple: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  logo: {
    width: 80,
    height: 'auto',
  },
  contactInfo: {
    fontSize: 9,
    textAlign: 'right',
    lineHeight: 1.4,
    marginTop: 10,
  },
  businessNameText: {
    fontSize: 11,
    fontWeight: 700,
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 10,
    textAlign: 'center',
    color: '#555555',
    marginBottom: 10,
  },
  submissionInstructions: {
    fontSize: 9,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 15,
    paddingTop: 10,
    borderTop: '1 solid #DDDDDD',
  },
  instructionLine: {
    marginBottom: 3,
  },
  emailHighlight: {
    fontWeight: 700,
    textDecoration: 'underline',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 5,
    backgroundColor: '#F0F0F0',
    padding: 8,
    borderLeft: '3 solid #000000',
  },
  sectionDescription: {
    fontSize: 9,
    fontStyle: 'italic',
    marginBottom: 10,
    paddingLeft: 11,
    color: '#666666',
  },
  questionGroup: {
    marginBottom: 15,
    paddingLeft: 8,
  },
  questionGroupTitle: {
    fontSize: 11,
    fontWeight: 700,
    marginBottom: 8,
    textDecoration: 'underline',
  },
  question: {
    marginBottom: 12,
  },
  questionText: {
    fontSize: 10,
    fontWeight: 500,
    marginBottom: 4,
  },
  helperText: {
    fontSize: 8,
    fontStyle: 'italic',
    color: '#666666',
    marginBottom: 4,
  },
  placeholder: {
    fontSize: 8,
    fontStyle: 'italic',
    color: '#999999',
    marginBottom: 4,
  },
  conditionalNotice: {
    fontSize: 8,
    fontStyle: 'italic',
    color: '#666666',
    marginBottom: 4,
  },
  required: {
    color: '#CC0000',
    fontSize: 10,
  },
  optionsContainer: {
    marginTop: 4,
    marginLeft: 5,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  checkbox: {
    width: 12,
    height: 12,
    border: '1 solid #000000',
    marginRight: 6,
  },
  radioButton: {
    width: 12,
    height: 12,
    border: '1 solid #000000',
    borderRadius: 6,
    marginRight: 6,
  },
  optionLabel: {
    fontSize: 9,
    flex: 1,
  },
  textInputLine: {
    borderBottom: '1 solid #CCCCCC',
    height: 20,
    marginTop: 4,
    marginLeft: 5,
  },
  textAreaBox: {
    border: '1 solid #CCCCCC',
    minHeight: 60,
    marginTop: 4,
    marginLeft: 5,
    padding: 5,
  },
  textAreaLines: {
    flexDirection: 'column',
    gap: 8,
  },
  textAreaLine: {
    borderBottom: '1 dotted #CCCCCC',
    height: 12,
  },
  yesNoContainer: {
    flexDirection: 'row',
    marginTop: 4,
    marginLeft: 5,
    gap: 20,
  },
  subQuestions: {
    marginLeft: 20,
    marginTop: 8,
    paddingLeft: 8,
    borderLeft: '1 solid #DDDDDD',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 8,
    textAlign: 'center',
    color: '#666666',
    borderTop: '1 solid #DDDDDD',
    paddingTop: 10,
  },
  pageNumber: {
    fontSize: 8,
    textAlign: 'center',
    color: '#666666',
  },
  // Styles for filled/checked answers
  checkedCheckbox: {
    width: 12,
    height: 12,
    border: '1 solid #000000',
    marginRight: 6,
    backgroundColor: '#000000',
  },
  checkedRadio: {
    width: 12,
    height: 12,
    border: '1 solid #000000',
    borderRadius: 6,
    marginRight: 6,
    backgroundColor: '#000000',
  },
  answeredText: {
    fontSize: 9,
    marginTop: 4,
    marginLeft: 5,
    paddingBottom: 4,
    borderBottom: '1 solid #CCCCCC',
    color: '#000000',
  },
  answeredTextArea: {
    fontSize: 9,
    border: '1 solid #CCCCCC',
    marginTop: 4,
    marginLeft: 5,
    padding: 5,
    minHeight: 60,
    color: '#000000',
  },
  privacyStatement: {
    backgroundColor: '#F5F5F5',
    border: '1 solid #DDDDDD',
    borderRadius: 4,
    padding: 12,
    marginTop: 20,
    marginBottom: 15,
  },
  privacyTitle: {
    fontSize: 11,
    fontWeight: 700,
    marginBottom: 6,
    color: '#000000',
  },
  privacyText: {
    fontSize: 8,
    lineHeight: 1.5,
    marginBottom: 4,
    color: '#333333',
  },
  privacyLink: {
    fontSize: 8,
    color: '#0066CC',
    textDecoration: 'underline',
    marginTop: 4,
  },
});

interface ApplicationFormPDFProps {
  formData: FormSection[];
  submittedAnswers?: Record<string, any>; // Optional: user's submitted answers to populate the form
  logoUrl: string;
  businessName: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  websiteUrl: string;
  pdfTitle?: string | null;
  pdfSubtitle?: string | null;
  privacyTitle?: string | null;
  privacyBody?: string | null;
}

const ApplicationFormPDF: React.FC<ApplicationFormPDFProps> = ({
  formData,
  submittedAnswers,
  logoUrl,
  businessName,
  contactEmail,
  contactPhone,
  contactAddress,
  websiteUrl,
  pdfTitle,
  pdfSubtitle,
  privacyTitle,
  privacyBody,
}) => {
  // Default PDF title and subtitle values
  const displayPdfTitle = pdfTitle || 'Coaching Application Form';
  const displayPdfSubtitle = pdfSubtitle || 'Please complete the form below as thoroughly as possible.';

  // Default privacy statement values
  const displayPrivacyTitle = privacyTitle || 'Your Privacy Matters';
  const defaultPrivacyBody = `I take your privacy seriously. All information you provide will be used solely for processing your coaching application and creating your personalised fitness plan.

I will never share your personal information with third parties, and it will only be retained for as long as necessary to provide my coaching services to you.`;
  const displayPrivacyBody = privacyBody || defaultPrivacyBody;
  // Split body into paragraphs for rendering
  const privacyParagraphs = displayPrivacyBody.split('\n\n').filter((p) => p.trim());
  const renderQuestion = (question: FormQuestion, level: number = 0) => {
    const isConditional = !!question.conditionalOn;

    return (
      <View key={question.id} style={styles.question} wrap={false}>
        {/* Question Text */}
        <Text style={styles.questionText}>{question.question}</Text>

        {/* Helper Text */}
        {question.helperText && <Text style={styles.helperText}>{question.helperText}</Text>}

        {/* Placeholder Text */}
        {question.placeholder && <Text style={styles.placeholder}>({question.placeholder})</Text>}

        {/* Conditional Question Notice for radio/yesno types */}
        {isConditional && (question.type === 'radio' || question.type === 'yesno') && (
          <Text style={styles.conditionalNotice}>
            (Leave blank if this question does not apply)
          </Text>
        )}

        {/* Render input based on type */}
        {renderQuestionInput(question)}

        {/* Sub-questions (always shown in PDF for completeness) */}
        {question.subQuestions && question.subQuestions.length > 0 && (
          <View style={styles.subQuestions}>
            {question.subQuestions.map((subQ) => renderQuestion(subQ, level + 1))}
          </View>
        )}
      </View>
    );
  };

  const renderQuestionInput = (question: FormQuestion) => {
    // Get the submitted answer for this question (if any)
    const answer = submittedAnswers?.[question.id];

    switch (question.type) {
      case 'radio':
        return (
          <View style={styles.optionsContainer}>
            {question.options?.map((option) => {
              const isChecked = answer === option.value;
              return (
                <View key={option.value} style={styles.option}>
                  <View style={isChecked ? styles.checkedRadio : styles.radioButton} />
                  <Text style={styles.optionLabel}>{option.label}</Text>
                </View>
              );
            })}
          </View>
        );

      case 'checkbox':
        return (
          <View style={styles.optionsContainer}>
            {question.options?.map((option) => {
              // Check if this option is in the answer array
              const isChecked = Array.isArray(answer) && answer.includes(option.value);
              return (
                <View key={option.value} style={styles.option}>
                  <View style={isChecked ? styles.checkedCheckbox : styles.checkbox} />
                  <Text style={styles.optionLabel}>{option.label}</Text>
                </View>
              );
            })}
          </View>
        );

      case 'yesno':
        return (
          <View style={styles.yesNoContainer}>
            <View style={styles.option}>
              <View style={answer === 'yes' ? styles.checkedRadio : styles.radioButton} />
              <Text style={styles.optionLabel}>Yes</Text>
            </View>
            <View style={styles.option}>
              <View style={answer === 'no' ? styles.checkedRadio : styles.radioButton} />
              <Text style={styles.optionLabel}>No</Text>
            </View>
          </View>
        );

      case 'text':
        // Show the answer text if provided, otherwise show empty line
        if (answer && typeof answer === 'string') {
          return <Text style={styles.answeredText}>{answer}</Text>;
        }
        return <View style={styles.textInputLine} />;

      case 'textarea':
        // Show the answer text if provided, otherwise show empty text area
        if (answer && typeof answer === 'string') {
          return <Text style={styles.answeredTextArea}>{answer}</Text>;
        }
        return (
          <View style={styles.textAreaBox}>
            <View style={styles.textAreaLines}>
              {[...Array(4)].map((_, i) => (
                <View key={i} style={styles.textAreaLine} />
              ))}
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  // Combine contact details section with form sections
  const allSections = [contactDetailsStepData, ...formData];
  const isLastSection = (index: number) => index === allSections.length - 1;

  return (
    <Document>
      {allSections.map((section, sectionIndex) => (
        <Page key={section.id} size='A4' style={styles.page}>
          {/* Header with title - Only on first page (not fixed) */}
          {sectionIndex === 0 && (
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Image style={styles.logo} src={logoUrl} />
                <View style={styles.contactInfo}>
                  <Text style={styles.businessNameText}>{businessName}</Text>
                  <Text>{contactEmail}</Text>
                  <Text>{contactPhone}</Text>
                  <Text>{contactAddress}</Text>
                </View>
              </View>
              <Text style={styles.title}>{displayPdfTitle}</Text>
              <Text style={styles.subtitle}>{displayPdfSubtitle}</Text>
              <View style={styles.submissionInstructions}>
                <Text style={styles.instructionLine}>
                  Once the form is complete, please email to{' '}
                  <Text style={styles.emailHighlight}>{contactEmail}</Text>
                </Text>
                <Text style={styles.instructionLine}>
                  You can also complete this form online instead at {websiteUrl}/apply
                </Text>
              </View>
            </View>
          )}

          {/* Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.description && (
              <Text style={styles.sectionDescription}>{section.description}</Text>
            )}

            {/* Question Groups */}
            {section.questionGroups.map((group) => (
              <View key={group.id} style={styles.questionGroup} wrap={false}>
                {group.title && <Text style={styles.questionGroupTitle}>{group.title}</Text>}
                {group.questions.map((question) => renderQuestion(question))}
              </View>
            ))}
          </View>

          {/* Privacy Statement - at the end of the last section */}
          {isLastSection(sectionIndex) && (
            <View style={styles.privacyStatement} wrap={false}>
              <Text style={styles.privacyTitle}>{displayPrivacyTitle}</Text>
              {privacyParagraphs.map((paragraph, index) => (
                <Text key={index} style={styles.privacyText}>
                  {paragraph}
                </Text>
              ))}
              <Text style={styles.privacyText}>
                For more information please read my full privacy policy at{' '}
                {SITE_CONFIG.PRODUCTION_DOMAIN}/privacy-policy
              </Text>
            </View>
          )}

          {/* Submission Instructions - at the end of the last section */}
          {isLastSection(sectionIndex) && (
            <View style={styles.submissionInstructions}>
              <Text style={styles.instructionLine}>
                Once the form is complete, please email to{' '}
                <Text style={styles.emailHighlight}>{contactEmail}</Text>
              </Text>
              <Text style={styles.instructionLine}>
                You can also complete this form online instead at {websiteUrl}/apply
              </Text>
            </View>
          )}

          {/* Footer */}
          <View style={styles.footer} fixed>
            <Text style={{ marginBottom: 4 }}>{businessName}</Text>
            <Text style={{ marginBottom: 4 }}>
              {websiteUrl} | {contactEmail} | {contactPhone}
            </Text>
            <Text
              style={styles.pageNumber}
              render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
            />
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default ApplicationFormPDF;
