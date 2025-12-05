/**
 * Styled confirmation email template for application form submissions
 * Uses brand colors and includes professional signature
 * Designed to be print-friendly on A4 paper
 * IMPORTANT: Uses colors that work in both light and dark modes without media queries
 */

import { SITE_CONFIG } from '@/lib/constants';
import type { FormSection } from '@/data/applicationFormData';

interface ApplicationConfirmationEmailData {
  name: string;
  email: string;
  phone: string;
  formData: Record<string, any>;
  sections: FormSection[];
  logoUrl: string;
}

/**
 * Formats the answer for display in the email
 * Handles arrays (checkboxes), yes/no, and regular text
 * For radio buttons and checkboxes, looks up the full label text from the question options
 */
function formatAnswer(value: any, questionType?: string, questionOptions?: { label: string; value: string }[]): string {
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

export function generateApplicationConfirmationEmail(
  data: ApplicationConfirmationEmailData
): string {
  const { name, email, phone, formData, sections, logoUrl } = data;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Application Received - ${SITE_CONFIG.ORGANIZATION_NAME}</title>
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
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f5; padding: 40px 20px;">
        <tr>
          <td align="center">
            <!-- Main Container -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="700" class="email-container" style="max-width: 700px; background-color: #1a1a1a; border-radius: 8px; border: 1px solid #333333;">

              <!-- Header with Logo and Brand -->
              <tr>
                <td style="background-color: #2a2a2a; padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                      <td align="center">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="display: inline-block;">
                          <tr>
                            <td align="center" valign="middle" style="padding-right: 12px;">
                              <!-- Logo -->
                              <img
                                src="${logoUrl}"
                                alt="${SITE_CONFIG.ORGANIZATION_NAME} Logo"
                                width="80"
                                height="auto"
                                style="display: block; margin: 0; filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8));"
                              />
                            </td>
                            <td align="left" valign="middle" style="white-space: nowrap;">
                              <!-- Business Name -->
                              <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 32px; font-weight: 600; color: #ffb200; display: inline; line-height: 1.2; margin-right: 8px;">Omania</span>
                              <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 22px; font-weight: 500; color: #cccccc; display: inline; line-height: 1.2;">Training</span>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Main Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="margin: 0 0 20px 0; color: #e0e0e0; font-size: 16px; line-height: 1.6;">
                    Hi <strong style="color: #ffffff;">${name}</strong>,
                  </p>
                  <p style="margin: 0 0 30px 0; color: #e0e0e0; font-size: 16px; line-height: 1.6;">
                    Thank you for submitting your application! I have successfully received your submission and will review it carefully. I'll get back to you as soon as possible.
                  </p>

                  <!-- Contact Information Box -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #2a2a2a; border-left: 4px solid #ffb200; border-radius: 4px; margin-bottom: 30px;">
                    <tr>
                      <td style="padding: 20px;">
                        <h2 style="margin: 0 0 15px 0; color: #ffb200; font-size: 18px; font-weight: 600;">
                          Your Contact Information
                        </h2>
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                          <tr>
                            <td style="padding: 8px 0; color: #c0c0c0; font-size: 14px;">
                              <strong style="color: #ffffff;">Name:</strong> ${name}
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; color: #c0c0c0; font-size: 14px;">
                              <strong style="color: #ffffff;">Email:</strong> ${email}
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; color: #c0c0c0; font-size: 14px;">
                              <strong style="color: #ffffff;">Phone:</strong> ${phone}
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- Application Details -->
                  <h2 style="margin: 0 0 20px 0; color: #ffffff; font-size: 20px; font-weight: 600;">
                    Your Application Details
                  </h2>

                  ${sections
                    .map(
                      section => `
                    <!-- Section: ${section.title} -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 25px;">
                      <tr>
                        <td style="background-color: #3a3a3a; padding: 12px 20px; border-radius: 4px 4px 0 0;">
                          <h3 style="margin: 0; color: #ffb200; font-size: 16px; font-weight: 600;">
                            ${section.title}
                          </h3>
                        </td>
                      </tr>
                      <tr>
                        <td style="background-color: #2a2a2a; padding: 20px; border-radius: 0 0 4px 4px;">
                          ${section.questionGroups
                            .map((group, groupIndex) => {
                              // Filter out questions that have conditionalOn (they are subquestions)
                              const parentQuestions = group.questions.filter(q => !q.conditionalOn);
                              const allQuestions = group.questions;

                              return `
                                ${group.title ? `
                                  <!-- Group Title -->
                                  <div style="margin-top: ${groupIndex > 0 ? '20px' : '0'}; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 2px solid #ffb200;">
                                    <h4 style="margin: 0; color: #ff8400; font-size: 15px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                                      ${group.title}
                                    </h4>
                                  </div>
                                ` : ''}

                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: ${groupIndex < section.questionGroups.length - 1 ? '15px' : '0'};">
                                  ${parentQuestions
                                    .map((question, qIndex) => {
                                      const answer = formatAnswer(formData[question.id], question.type, question.options);

                                      // Collect all subquestions (both from subQuestions array and sibling questions with conditionalOn)
                                      const subQuestions = [
                                        ...(question.subQuestions || []),
                                        ...allQuestions.filter(q => q.conditionalOn?.questionId === question.id)
                                      ];

                                      let subQuestionsHtml = '';
                                      if (subQuestions.length > 0) {
                                        subQuestionsHtml = subQuestions
                                          .map((subQ) => {
                                            const subAnswer = formatAnswer(formData[subQ.id], subQ.type, subQ.options);
                                            return `
                                              <tr>
                                                <td style="padding: 8px 0 8px 30px; border-left: 3px solid #ffb200; margin-left: 10px;">
                                                  <div style="color: #b0b0b0; font-size: 13px; font-style: italic; margin-bottom: 4px;">
                                                    ↳ ${subQ.question}
                                                  </div>
                                                  <div style="color: #c0c0c0; font-size: 14px; line-height: 1.6; padding-left: 15px;">
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
                                          <td style="padding: 10px 0; ${qIndex > 0 ? 'border-top: 1px solid #404040;' : ''}">
                                            <div style="color: #ffffff; font-size: 14px; font-weight: 600; margin-bottom: 4px;">
                                              ${question.question}
                                            </div>
                                            <div style="color: #c0c0c0; font-size: 14px; line-height: 1.6; padding-left: 5px;">
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

                  <p style="margin: 30px 0 0 0; color: #b0b0b0; font-size: 16px; line-height: 1.6;">
                    If you have any urgent questions, feel free to reach out to me directly.
                  </p>
                </td>
              </tr>

              <!-- Signature Section -->
              <tr>
                <td style="background-color: #2a2a2a; padding: 30px; border-radius: 0 0 8px 8px;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                      <td align="center">
                        <!-- Business Name -->
                        <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 32px; font-weight: 600; color: #ffb200; display: inline; line-height: 1.2; margin-right: 8px;">Omania</span>
                        <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 22px; font-weight: 500; color: #cccccc; display: inline; line-height: 1.2;">Training</span>
                        <!-- Contact Info -->
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                          <tr>
                            <td align="center" style="padding: 5px 0;">
                              <a href="${SITE_CONFIG.ORGANIZATION_EMAIL.link}" style="color: #ffffff; text-decoration: none; font-size: 14px;">
                                ${SITE_CONFIG.ORGANIZATION_EMAIL.value}
                              </a>
                            </td>
                          </tr>
                          <tr>
                            <td align="center" style="padding: 5px 0;">
                              <a href="${SITE_CONFIG.ORGANIZATION_PHONE.link}" style="color: #ffffff; text-decoration: none; font-size: 14px;">
                                ${SITE_CONFIG.ORGANIZATION_PHONE.value}
                              </a>
                            </td>
                          </tr>
                          <tr>
                            <td align="center" style="padding: 5px 0; color: #ffffff; font-size: 14px;">
                              <a href="${SITE_CONFIG.ORGANIZATION_ADDRESS.link}" style="color: #ffffff; text-decoration: none; font-size: 14px;">
                                ${SITE_CONFIG.ORGANIZATION_ADDRESS.value}
                              </a>
                            </td>
                          </tr>
                          <tr>
                            <td align="center" style="padding: 5px 0; color: #ffffff; font-size: 14px;">
                              <a href="${SITE_CONFIG.PRODUCTION_DOMAIN}" style="color: #ffffff; text-decoration: none; font-size: 14px;">
                                ${SITE_CONFIG.PRODUCTION_DOMAIN}
                              </a>
                            </td>
                          </tr>
                        </table>

                        <!-- Divider -->
                        <div style="border-top: 1px solid rgba(255, 178, 0, 0.3); margin: 20px 0;"></div>

                        <!-- Footer Text -->
                        <p style="margin: 0; color: #ffffff; font-size: 12px; text-align: center; line-height: 1.5;">
                          This is an automated confirmation email from ${SITE_CONFIG.ORGANIZATION_NAME}.
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
