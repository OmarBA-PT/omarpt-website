/**
 * Styled confirmation email template for contact form submissions
 * Uses brand colors and includes professional signature
 */

import { SITE_CONFIG } from '@/lib/constants';

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
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f5; padding: 40px 20px;">
        <tr>
          <td align="center">
            <!-- Main Container -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">

              <!-- Header with Logo and Brand Gradient -->
              <tr>
                <td style="background: linear-gradient(90deg, #616161 0%, #000000 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
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
                              <!-- Business Name - Using solid colors for email client compatibility -->
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
                  <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                    ${emailGreeting} <strong>${name}</strong>,
                  </p>
                  <p style="margin: 0 0 30px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                    ${emailIntroMessage}
                  </p>

                  <!-- Message Details Box -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f9f9f9; border-left: 4px solid #ffb200; border-radius: 4px; margin-bottom: 30px;">
                    <tr>
                      <td style="padding: 20px;">
                        <h2 style="margin: 0 0 15px 0; color: #ffb200; font-size: 18px; font-weight: 600;">
                          Your Message Details
                        </h2>
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                          <tr>
                            <td style="padding: 8px 0; color: #555; font-size: 14px;">
                              <strong style="color: #282828;">Name:</strong> ${name}
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; color: #555; font-size: 14px;">
                              <strong style="color: #282828;">Email:</strong> ${email}
                            </td>
                          </tr>
                          ${
                            phone
                              ? `
                          <tr>
                            <td style="padding: 8px 0; color: #555; font-size: 14px;">
                              <strong style="color: #282828;">Phone:</strong> ${phone}
                            </td>
                          </tr>
                          `
                              : ''
                          }
                          <tr>
                            <td style="padding: 8px 0; color: #555; font-size: 14px;">
                              <strong style="color: #282828;">Message:</strong>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0 0 0; color: #555; font-size: 14px; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 0; color: #666666; font-size: 16px; line-height: 1.6;">
                    ${emailOutroMessage}
                  </p>
                </td>
              </tr>

              <!-- Signature Section -->
              <tr>
                <td style="background: linear-gradient(90deg, #616161 0%, #000000 100%); padding: 30px; border-radius: 0 0 8px 8px;">
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
