/**
 * Styled admin notification email template for new contact form submissions
 * Uses brand colors for professional appearance
 */

interface AdminNotificationEmailData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export function generateAdminNotificationEmail(data: AdminNotificationEmailData): string {
  const { name, email, phone, message } = data;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Form Submission</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Chau+Philomene+One&display=swap" rel="stylesheet">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f5; padding: 40px 20px;">
        <tr>
          <td align="center">
            <!-- Main Container -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">

              <!-- Header with Brand Gradient -->
              <tr>
                <td style="background: linear-gradient(135deg, #ffb200 0%, #ff8400 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
                  <h1 style="margin: 0; color: #282828; font-size: 24px; font-weight: 600; letter-spacing: 0.5px;">
                    New Contact Form Submission
                  </h1>
                </td>
              </tr>

              <!-- Main Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="margin: 0 0 30px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                    You have received a new message from your website contact form:
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
                          ${
                            phone
                              ? `
                          <tr>
                            <td style="padding: 8px 0; color: #555; font-size: 14px;">
                              <strong style="color: #282828;">Phone:</strong>
                              <a href="tel:${phone.replace(/\s/g, '')}" style="color: #ff8400; text-decoration: none;">
                                ${phone}
                              </a>
                            </td>
                          </tr>
                          `
                              : ''
                          }
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- Message Box -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f9f9f9; border-radius: 4px; margin-bottom: 20px;">
                    <tr>
                      <td style="padding: 20px;">
                        <h2 style="margin: 0 0 15px 0; color: #282828; font-size: 16px; font-weight: 600;">
                          Message:
                        </h2>
                        <p style="margin: 0; color: #333333; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message.replace(/\n/g, '<br>')}</p>
                      </td>
                    </tr>
                  </table>

                  <!-- Quick Reply -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                      <td align="center" style="padding: 20px 0;">
                        <p style="font-size: 16px; color: #333333;">
                          You can reply directly to this email to get back to ${name}.
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
                    This message was sent via the contact form on your website.
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
