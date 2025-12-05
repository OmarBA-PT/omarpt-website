/**
 * Styled confirmation email template for contact form submissions
 * Uses brand colors and includes professional signature
 * IMPORTANT: Uses colors that work in both light and dark modes without media queries
 */

import { SITE_CONFIG } from '@/lib/constants';
import { EMAIL_COLORS, EMAIL_STYLES } from './emailStyles';

interface ConfirmationEmailData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  logoUrl: string;
  emailGreeting?: string;
  emailIntroMessage?: string;
  emailOutroMessage?: string;
}

export function generateConfirmationEmail(data: ConfirmationEmailData): string {
  const {
    name,
    email,
    phone,
    message,
    logoUrl,
    emailGreeting = 'Hi',
    emailIntroMessage = 'I have successfully received your message and will aim to get back to you as soon as possible.',
    emailOutroMessage = 'If you have any urgent questions, feel free to reach out to me directly.',
  } = data;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thank you for contacting ${SITE_CONFIG.ORGANIZATION_NAME}</title>
    </head>
    <body style="${EMAIL_STYLES.body}">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="${EMAIL_STYLES.outerTable}">
        <tr>
          <td align="center">
            <!-- Main Container -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="${EMAIL_STYLES.container}">

              <!-- Header with Logo and Brand -->
              <tr>
                <td style="${EMAIL_STYLES.header}">
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
                              <span style="${EMAIL_STYLES.brandNameGold}">Omania</span>
                              <span style="${EMAIL_STYLES.brandNameTraining}">Training</span>
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
                  <p style="margin: 0 0 20px 0; ${EMAIL_STYLES.textPrimary}">
                    ${emailGreeting} <strong style="color: ${EMAIL_COLORS.textWhite};">${name}</strong>,
                  </p>
                  <p style="margin: 0 0 30px 0; ${EMAIL_STYLES.textPrimary}">
                    ${emailIntroMessage}
                  </p>

                  <!-- Message Details Box -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="${EMAIL_STYLES.infoBox}">
                    <tr>
                      <td style="padding: 20px;">
                        <h2 style="${EMAIL_STYLES.infoBoxHeading}">
                          Your Message Details
                        </h2>
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                          <tr>
                            <td style="${EMAIL_STYLES.infoBoxText}">
                              <strong style="${EMAIL_STYLES.infoBoxLabel}">Name:</strong> ${name}
                            </td>
                          </tr>
                          <tr>
                            <td style="${EMAIL_STYLES.infoBoxText}">
                              <strong style="${EMAIL_STYLES.infoBoxLabel}">Email:</strong> ${email}
                            </td>
                          </tr>
                          ${
                            phone
                              ? `
                          <tr>
                            <td style="${EMAIL_STYLES.infoBoxText}">
                              <strong style="${EMAIL_STYLES.infoBoxLabel}">Phone:</strong> ${phone}
                            </td>
                          </tr>
                          `
                              : ''
                          }
                          <tr>
                            <td style="${EMAIL_STYLES.infoBoxText}">
                              <strong style="${EMAIL_STYLES.infoBoxLabel}">Message:</strong>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0 0 0; color: ${EMAIL_COLORS.textInBox}; font-size: 14px; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 0; ${EMAIL_STYLES.textSecondary}">
                    ${emailOutroMessage}
                  </p>
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
