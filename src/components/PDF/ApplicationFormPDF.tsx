import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { FormSection, FormQuestion, QuestionType } from '@/data/applicationFormData';

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
    marginBottom: 10,
  },
  logoContainerSimple: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  logo: {
    width: 120,
    height: 'auto',
  },
  logoSmall: {
    width: 80,
    height: 'auto',
  },
  contactInfo: {
    fontSize: 9,
    textAlign: 'right',
    lineHeight: 1.4,
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 10,
    textAlign: 'center',
    color: '#555555',
    marginBottom: 15,
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
});

interface ApplicationFormPDFProps {
  formData: FormSection[];
  logoUrl: string;
  businessName: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  websiteUrl: string;
}

const ApplicationFormPDF: React.FC<ApplicationFormPDFProps> = ({
  formData,
  logoUrl,
  businessName,
  contactEmail,
  contactPhone,
  contactAddress,
  websiteUrl,
}) => {
  const renderQuestion = (question: FormQuestion, level: number = 0) => {
    const isRequired = question.required;

    return (
      <View key={question.id} style={styles.question} wrap={false}>
        {/* Question Text */}
        <Text style={styles.questionText}>
          {question.question}
          {isRequired && <Text style={styles.required}> *</Text>}
        </Text>

        {/* Helper Text */}
        {question.helperText && <Text style={styles.helperText}>{question.helperText}</Text>}

        {/* Placeholder Text */}
        {question.placeholder && <Text style={styles.placeholder}>({question.placeholder})</Text>}

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
    switch (question.type) {
      case 'radio':
        return (
          <View style={styles.optionsContainer}>
            {question.options?.map((option) => (
              <View key={option.value} style={styles.option}>
                <View style={styles.radioButton} />
                <Text style={styles.optionLabel}>{option.label}</Text>
              </View>
            ))}
          </View>
        );

      case 'checkbox':
        return (
          <View style={styles.optionsContainer}>
            {question.options?.map((option) => (
              <View key={option.value} style={styles.option}>
                <View style={styles.checkbox} />
                <Text style={styles.optionLabel}>{option.label}</Text>
              </View>
            ))}
          </View>
        );

      case 'yesno':
        return (
          <View style={styles.yesNoContainer}>
            <View style={styles.option}>
              <View style={styles.radioButton} />
              <Text style={styles.optionLabel}>Yes</Text>
            </View>
            <View style={styles.option}>
              <View style={styles.radioButton} />
              <Text style={styles.optionLabel}>No</Text>
            </View>
          </View>
        );

      case 'text':
        return <View style={styles.textInputLine} />;

      case 'textarea':
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

  return (
    <Document>
      {formData.map((section, sectionIndex) => (
        <Page key={section.id} size='A4' style={styles.page}>
          {/* Header with title - Only on first page (not fixed) */}
          {sectionIndex === 0 && (
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Image style={styles.logo} src={logoUrl} />
                <View style={styles.contactInfo}>
                  <Text>{businessName}</Text>
                  <Text>{websiteUrl}</Text>
                  <Text>{contactEmail}</Text>
                  <Text>{contactPhone}</Text>
                  <Text>{contactAddress}</Text>
                </View>
              </View>
              <Text style={styles.title}>Coaching Application Form</Text>
              <Text style={styles.subtitle}>
                Please complete all sections as thoroughly as possible
              </Text>
            </View>
          )}

          {/* Logo only header - All pages (fixed so it repeats) */}
          <View style={styles.headerLogoOnly} fixed>
            <View style={styles.logoContainerSimple}>
              <Image style={styles.logoSmall} src={logoUrl} />
            </View>
          </View>

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

          {/* Footer */}
          <View style={styles.footer} fixed>
            <Text>
              {businessName} | {websiteUrl} | {contactEmail} | {contactPhone}
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
