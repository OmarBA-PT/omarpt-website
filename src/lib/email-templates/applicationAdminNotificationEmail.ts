/**
 * Styled admin notification email template for application form submissions
 * Uses brand colors for professional appearance
 * Designed to be print-friendly on A4 paper
 */

import type { FormSection } from '@/data/applicationFormData';

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
 */
function formatAnswer(value: any, questionType?: string): string {
  if (value === undefined || value === null || value === '') {
    return '<em style="color: #999;">Not answered</em>';
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return '<em style="color: #999;">Not answered</em>';
    }
    return value.join(', ');
  }

  if (typeof value === 'boolean' || questionType === 'yesno') {
    return value === true || value === 'yes' ? 'Yes' : 'No';
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
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Chau+Philomene+One&display=swap" rel="stylesheet">
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
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="700" class="email-container" style="max-width: 700px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">

              <!-- Header with Brand Gradient -->
              <tr>
                <td style="background: linear-gradient(135deg, #ffb200 0%, #ff8400 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
                  <h1 style="margin: 0; color: #282828; font-size: 24px; font-weight: 600; letter-spacing: 0.5px;">
                    New Application Form Submission
                  </h1>
                </td>
              </tr>

              <!-- Main Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="margin: 0 0 30px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                    Someone has submitted an application form via your website. They have also received a confirmation email. Below are the details of their submission:
                  </p>

                  <!-- Contact Details Box -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f9f9f9; border-left: 4px solid #ffb200; border-radius: 4px; margin-bottom: 30px;">
                    <tr>
                      <td style="padding: 20px;">
                        <h2 style="margin: 0 0 15px 0; color: #ffb200; font-size: 18px; font-weight: 600;">
                          Contact Information
                        </h2>
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                          <tr>
                            <td style="padding: 8px 0; color: #555; font-size: 14px;">
                              <strong style="color: #282828;">Name:</strong> ${name}
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; color: #555; font-size: 14px;">
                              <strong style="color: #282828;">Email:</strong>
                              <a href="mailto:${email}" style="color: #ff8400; text-decoration: none;">
                                ${email}
                              </a>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; color: #555; font-size: 14px;">
                              <strong style="color: #282828;">Phone:</strong>
                              <a href="tel:${phone.replace(/\s/g, '')}" style="color: #ff8400; text-decoration: none;">
                                ${phone}
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- Application Details -->
                  <h2 style="margin: 0 0 20px 0; color: #282828; font-size: 20px; font-weight: 600;">
                    Application Details
                  </h2>

                  ${sections
                    .map(
                      section => `
                    <!-- Section: ${section.title} -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 25px; page-break-inside: avoid;">
                      <tr>
                        <td style="background-color: #282828; padding: 12px 20px; border-radius: 4px 4px 0 0;">
                          <h3 style="margin: 0; color: #ffb200; font-size: 16px; font-weight: 600;">
                            ${section.title}
                          </h3>
                        </td>
                      </tr>
                      <tr>
                        <td style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 4px 4px;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                            ${section.questions
                              .map((question, qIndex) => {
                                const answer = formatAnswer(formData[question.id], question.type);
                                let subQuestionsHtml = '';

                                // Handle sub-questions
                                if (question.subQuestions && question.subQuestions.length > 0) {
                                  subQuestionsHtml = question.subQuestions
                                    .map(subQ => {
                                      const subAnswer = formatAnswer(formData[subQ.id], subQ.type);
                                      return `
                                        <tr>
                                          <td style="padding: 12px 0 12px 20px; border-top: 1px solid #e0e0e0;">
                                            <div style="color: #666; font-size: 13px; margin-bottom: 4px;">
                                              <em>${subQ.question}</em>
                                            </div>
                                            <div style="color: #333; font-size: 14px; line-height: 1.6;">
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
                                    <td style="padding: 12px 0; ${qIndex > 0 ? 'border-top: 1px solid #e0e0e0;' : ''}">
                                      <div style="color: #282828; font-size: 14px; font-weight: 600; margin-bottom: 4px;">
                                        ${question.question}
                                      </div>
                                      <div style="color: #555; font-size: 14px; line-height: 1.6;">
                                        ${answer}
                                      </div>
                                    </td>
                                  </tr>
                                  ${subQuestionsHtml}
                                `;
                              })
                              .join('')}
                          </table>
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
                        <p style="margin: 0 0 10px 0; font-size: 16px; color: #333333; font-weight: 600;">
                          Follow-up Actions
                        </p>
                        <p style="margin: 0; font-size: 14px; color: #666666; line-height: 1.6;">
                          You can reply directly to <a href="mailto:${email}" style="color: #ff8400; text-decoration: none;">${email}</a> or call <a href="tel:${phone.replace(/\s/g, '')}" style="color: #ff8400; text-decoration: none;">${phone}</a> to follow up with ${name}.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f9f9f9; padding: 20px 30px; border-radius: 0 0 8px 8px; text-align: center;">
                  <p style="margin: 0; color: #666666; font-size: 12px; line-height: 1.5;">
                    This application was submitted via the application form on your website.<br>
                    The applicant has received a confirmation email with a copy of their submission.
                  </p>
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
