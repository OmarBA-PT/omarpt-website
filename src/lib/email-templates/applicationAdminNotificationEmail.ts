/**
 * Styled admin notification email template for application form submissions
 * Uses brand colors for professional appearance
 * Designed to be print-friendly on A4 paper
 * IMPORTANT: Uses colors that work in both light and dark modes without media queries
 */

import { SITE_CONFIG } from '@/lib/constants';
import type { FormSection } from '@/data/applicationFormData';
import { EMAIL_COLORS, EMAIL_STYLES } from './emailStyles';

interface ApplicationAdminNotificationEmailData {
  name: string;
  email: string;
  phone: string;
  formData: Record<string, any>;
  sections: FormSection[];
}

/**
 * Formats the answer for display in the email
 * Handles arrays (checkboxes), yes/no, and regular text
 * For radio buttons and checkboxes, looks up the full label text from the question options
 */
function formatAnswer(
  value: any,
  questionType?: string,
  questionOptions?: { label: string; value: string }[]
): string {
  if (value === undefined || value === null || value === '') {
    return '<em style="color: #999;">Not answered</em>';
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return '<em style="color: #999;">Not answered</em>';
    }

    // For checkbox arrays, look up the full label text for each value
    if (questionOptions && questionOptions.length > 0) {
      return value
        .map((val) => {
          const option = questionOptions.find((opt) => opt.value === val);
          return option ? option.label : val;
        })
        .join(', ');
    }

    return value.join(', ');
  }

  if (typeof value === 'boolean' || questionType === 'yesno') {
    return value === true || value === 'yes' ? 'Yes' : 'No';
  }

  // For radio buttons, look up the full label text
  if (questionType === 'radio' && questionOptions && questionOptions.length > 0) {
    const option = questionOptions.find((opt) => opt.value === value);
    if (option) {
      return option.label;
    }
  }

  return String(value).replace(/\n/g, '<br>');
}

export function generateApplicationAdminNotificationEmail(
  data: ApplicationAdminNotificationEmailData
): string {
  const { name, email, phone, formData, sections } = data;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Application Form Submission</title>
      <style>
        @media print {
          body {
            background-color: white !important;
            padding: 0 !important;
          }
          .email-container {
            box-shadow: none !important;
            max-width: 100% !important;
            width: 100% !important;
          }
          .no-print {
            display: none !important;
          }
        }
      </style>
    </head>
    <body style="${EMAIL_STYLES.body}">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="${EMAIL_STYLES.outerTable}">
        <tr>
          <td align="center">
            <!-- Main Container -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="700" class="email-container" style="${EMAIL_STYLES.containerWide}">

              <!-- Header with Logo and Brand -->
              <tr>
                <td style="${EMAIL_STYLES.header}">
                  <!-- Header Title -->
                  <h1 style="margin: 20px 0 0 0; color: ${EMAIL_COLORS.brandGold}; font-size: 24px; font-weight: 600; letter-spacing: 0.5px;">
                    New Application Form Submission
                  </h1>
                </td>
              </tr>

              <!-- Main Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="margin: 0 0 30px 0; ${EMAIL_STYLES.textPrimary}">
                    Someone has submitted an application form via your website. They have also received a confirmation email. The details from their submission are below, and a PDF copy of their application is also attached for your records.
                  </p>

                  <!-- Contact Details Box -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="${EMAIL_STYLES.infoBox}">
                    <tr>
                      <td style="padding: 20px;">
                        <h2 style="${EMAIL_STYLES.infoBoxHeading}">
                          Contact Information
                        </h2>
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                          <tr>
                            <td style="${EMAIL_STYLES.infoBoxText}">
                              <strong style="${EMAIL_STYLES.infoBoxLabel}">Name:</strong> ${name}
                            </td>
                          </tr>
                          <tr>
                            <td style="${EMAIL_STYLES.infoBoxText}">
                              <strong style="${EMAIL_STYLES.infoBoxLabel}">Email:</strong>
                              <a href="mailto:${email}" style="${EMAIL_STYLES.link}">
                                ${email}
                              </a>
                            </td>
                          </tr>
                          <tr>
                            <td style="${EMAIL_STYLES.infoBoxText}">
                              <strong style="${EMAIL_STYLES.infoBoxLabel}">Phone:</strong>
                              <a href="tel:${phone.replace(/\s/g, '')}" style="${EMAIL_STYLES.link}">
                                ${phone}
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- Application Details -->
                  <h2 style="margin: 0 0 20px 0; color: ${EMAIL_COLORS.textWhite}; font-size: 20px; font-weight: 600;">
                    Application Details
                  </h2>

                  ${sections
                    .map(
                      (section) => `
                    <!-- Section: ${section.title} -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 25px; page-break-inside: avoid;">
                      <tr>
                        <td style="background-color: ${EMAIL_COLORS.sectionHeaderBackground}; padding: 12px 20px; border-radius: 4px 4px 0 0;">
                          <h3 style="margin: 0; color: ${EMAIL_COLORS.brandGold}; font-size: 16px; font-weight: 600;">
                            ${section.title}
                          </h3>
                        </td>
                      </tr>
                      <tr>
                        <td style="background-color: ${EMAIL_COLORS.infoBoxBackground}; padding: 20px; border-radius: 0 0 4px 4px;">
                          ${section.questionGroups
                            .map((group, groupIndex) => {
                              // Filter out questions that have conditionalOn (they are subquestions)
                              const parentQuestions = group.questions.filter(
                                (q) => !q.conditionalOn
                              );
                              const allQuestions = group.questions;

                              return `
                                ${
                                  group.title
                                    ? `
                                  <!-- Group Title -->
                                  <div style="margin-top: ${groupIndex > 0 ? '20px' : '0'}; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 2px solid ${EMAIL_COLORS.brandGold};">
                                    <h4 style="margin: 0; color: ${EMAIL_COLORS.brandOrange}; font-size: 15px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                                      ${group.title}
                                    </h4>
                                  </div>
                                `
                                    : ''
                                }

                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: ${groupIndex < section.questionGroups.length - 1 ? '15px' : '0'};">
                                  ${parentQuestions
                                    .map((question, qIndex) => {
                                      const answer = formatAnswer(
                                        formData[question.id],
                                        question.type,
                                        question.options
                                      );

                                      // Collect all subquestions (both from subQuestions array and sibling questions with conditionalOn)
                                      const subQuestions = [
                                        ...(question.subQuestions || []),
                                        ...allQuestions.filter(
                                          (q) => q.conditionalOn?.questionId === question.id
                                        ),
                                      ];

                                      let subQuestionsHtml = '';
                                      if (subQuestions.length > 0) {
                                        subQuestionsHtml = subQuestions
                                          .map((subQ) => {
                                            const subAnswer = formatAnswer(
                                              formData[subQ.id],
                                              subQ.type,
                                              subQ.options
                                            );
                                            return `
                                              <tr>
                                                <td style="padding: 8px 0 8px 30px; border-left: 3px solid ${EMAIL_COLORS.brandGold}; margin-left: 10px;">
                                                  <div style="color: ${EMAIL_COLORS.textSubQuestion}; font-size: 13px; font-style: italic; margin-bottom: 4px;">
                                                    ↳ ${subQ.question}
                                                  </div>
                                                  <div style="color: ${EMAIL_COLORS.textInBox}; font-size: 14px; line-height: 1.6; padding-left: 15px;">
                                                    ${subAnswer}
                                                  </div>
                                                </td>
                                              </tr>
                                            `;
                                          })
                                          .join('');
                                      }

                                      return `
                                        <tr>
                                          <td style="padding: 10px 0; ${qIndex > 0 ? `border-top: 1px solid ${EMAIL_COLORS.sectionDivider};` : ''}">
                                            <div style="color: ${EMAIL_COLORS.textWhite}; font-size: 14px; font-weight: 600; margin-bottom: 4px;">
                                              ${question.question}
                                            </div>
                                            <div style="color: ${EMAIL_COLORS.textInBox}; font-size: 14px; line-height: 1.6; padding-left: 5px;">
                                              ${answer}
                                            </div>
                                          </td>
                                        </tr>
                                        ${subQuestionsHtml}
                                      `;
                                    })
                                    .join('')}
                                </table>
                              `;
                            })
                            .join('')}
                        </td>
                      </tr>
                    </table>
                  `
                    )
                    .join('')}

                  <!-- Quick Reply -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 30px;">
                    <tr>
                      <td align="center" style="padding: 20px 0;">
                        <p style="margin: 0 0 10px 0; font-size: 16px; color: ${EMAIL_COLORS.textWhite}; font-weight: 600;">
                          Follow-up Actions
                        </p>
                        <p style="margin: 0; font-size: 14px; color: ${EMAIL_COLORS.textSecondary}; line-height: 1.6;">
                          You can reply directly to <a href="mailto:${email}" style="${EMAIL_STYLES.link}">${email}</a> or call <a href="tel:${phone.replace(/\s/g, '')}" style="${EMAIL_STYLES.link}">${phone}</a> to follow up with ${name}.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Signature Section -->
              <tr>
                <td style="${EMAIL_STYLES.footer}">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                      <td align="center">
                        <!-- Business Name -->
                        <span style="${EMAIL_STYLES.brandNameGold}">Omania</span>
                        <span style="${EMAIL_STYLES.brandNameTraining}">Training</span>
                        <!-- Contact Info -->
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                          <tr>
                            <td align="center" style="padding: 5px 0;">
                              <a href="${SITE_CONFIG.ORGANIZATION_EMAIL.link}" style="${EMAIL_STYLES.contactInfoLink}">
                                ${SITE_CONFIG.ORGANIZATION_EMAIL.value}
                              </a>
                            </td>
                          </tr>
                          <tr>
                            <td align="center" style="padding: 5px 0;">
                              <a href="${SITE_CONFIG.ORGANIZATION_PHONE.link}" style="${EMAIL_STYLES.contactInfoLink}">
                                ${SITE_CONFIG.ORGANIZATION_PHONE.value}
                              </a>
                            </td>
                          </tr>
                          <tr>
                            <td align="center" style="padding: 5px 0; color: ${EMAIL_COLORS.textWhite}; font-size: 14px;">
                              <a href="${SITE_CONFIG.ORGANIZATION_ADDRESS.link}" style="${EMAIL_STYLES.contactInfoLink}">
                                ${SITE_CONFIG.ORGANIZATION_ADDRESS.value}
                              </a>
                            </td>
                          </tr>
                          <tr>
                            <td align="center" style="padding: 5px 0; color: ${EMAIL_COLORS.textWhite}; font-size: 14px;">
                              <a href="${SITE_CONFIG.PRODUCTION_DOMAIN}" style="${EMAIL_STYLES.contactInfoLink}">
                                ${SITE_CONFIG.PRODUCTION_DOMAIN}
                              </a>
                            </td>
                          </tr>
                        </table>

                        <!-- Divider -->
                        <div style="${EMAIL_STYLES.footerDivider}"></div>

                        <!-- Footer Text -->
                        <p style="${EMAIL_STYLES.footerText}">
                          This application was submitted via the application form on your website.<br>
                          The applicant has received a confirmation email with a copy of their submission.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
