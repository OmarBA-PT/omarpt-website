import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { generateApplicationConfirmationEmail } from '@/lib/email-templates/applicationConfirmationEmail';
import { generateApplicationAdminNotificationEmail } from '@/lib/email-templates/applicationAdminNotificationEmail';
import { SITE_CONFIG } from '@/lib/constants';
import { applicationFormData } from '@/data/applicationFormData';
import {
  generateApplicationPDFBuffer,
  generatePDFFilename,
} from '@/lib/utils/generateApplicationPDF';

// Initialize Resend with API key from environment variable
const resend = new Resend(process.env.RESEND_API_KEY);

// ========================================
// RATE LIMITING CONFIGURATION
// ========================================
// Set this to false to disable rate limiting (useful for testing)
const ENABLE_RATE_LIMITING = false;

// Rate limiting configuration (in-memory, resets on server restart)
// For production, consider using a more robust solution like Redis or Upstash
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_REQUESTS_PER_IP = 2; // Maximum 2 application submissions per IP per hour
const requestLog = new Map<string, { count: number; timestamp: number }>();

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of requestLog.entries()) {
    if (now - data.timestamp > RATE_LIMIT_WINDOW) {
      requestLog.delete(ip);
    }
  }
}, RATE_LIMIT_WINDOW);

// Simple honeypot field validation (bot detection)
function validateHoneypot(honeypot: string | undefined): boolean {
  return !honeypot || honeypot === '';
}

// Validate email format
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Sanitize input to prevent injection attacks
function sanitizeInput(input: string): string {
  return input.replace(/[<>]/g, '').trim();
}

// Check rate limit for IP address
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const requestData = requestLog.get(ip);

  if (!requestData) {
    requestLog.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (now - requestData.timestamp > RATE_LIMIT_WINDOW) {
    // Reset the count if the window has passed
    requestLog.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (requestData.count >= MAX_REQUESTS_PER_IP) {
    return false;
  }

  requestData.count += 1;
  return true;
}

export async function POST(request: Request) {
  try {
    // Get client IP for rate limiting
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown';

    // Check rate limit (only if enabled)
    if (ENABLE_RATE_LIMITING && !checkRateLimit(ip)) {
      return NextResponse.json(
        {
          error: 'Too many application submissions. Please try again later.',
          rateLimited: true,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { formData, honeypot } = body;

    // Honeypot validation (bot detection)
    if (!validateHoneypot(honeypot)) {
      console.warn('Honeypot triggered - possible bot submission');
      // Return success to not alert the bot
      return NextResponse.json(
        { success: true, message: 'Application submitted successfully' },
        { status: 200 }
      );
    }

    // Validate required personal information fields
    if (!formData.fullName || !formData.email || !formData.phone) {
      return NextResponse.json(
        { error: 'Name, email, and phone are required fields.' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!validateEmail(formData.email)) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }

    // Sanitize personal information inputs
    const sanitizedName = sanitizeInput(formData.fullName);
    const sanitizedEmail = sanitizeInput(formData.email);
    const sanitizedPhone = sanitizeInput(formData.phone);

    // Validate sanitized inputs aren't empty after sanitization
    if (!sanitizedName || !sanitizedEmail || !sanitizedPhone) {
      return NextResponse.json({ error: 'Invalid input detected.' }, { status: 400 });
    }

    // Sanitize all form data
    const sanitizedFormData: Record<string, any> = {};
    for (const [key, value] of Object.entries(formData)) {
      if (typeof value === 'string') {
        sanitizedFormData[key] = sanitizeInput(value);
      } else if (Array.isArray(value)) {
        sanitizedFormData[key] = value.map((v) => (typeof v === 'string' ? sanitizeInput(v) : v));
      } else {
        sanitizedFormData[key] = value;
      }
    }

    // Get contact email from environment variable
    const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
    const fromEmail =
      process.env.RESEND_FROM_EMAIL || `${SITE_CONFIG.ORGANIZATION_NAME} <onboarding@resend.dev>`;

    if (!contactEmail) {
      console.error('NEXT_PUBLIC_CONTACT_EMAIL environment variable is not set');
      return NextResponse.json(
        {
          error:
            'Application form is currently unavailable. Please contact us directly via phone or email.',
          configError: true,
        },
        { status: 500 }
      );
    }

    // Construct logo URL for email
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const logoUrl = `${baseUrl}/images/logos/logo-white.png`;

    // Generate PDF with submitted answers
    let pdfBuffer: Buffer | null = null;
    let pdfFilename = '';
    try {
      console.log('Generating PDF with submitted form data...');
      pdfBuffer = await generateApplicationPDFBuffer(sanitizedFormData);
      pdfFilename = generatePDFFilename(sanitizedName);
      console.log(`✓ PDF generated successfully: ${pdfFilename}`);
    } catch (pdfError) {
      console.error('Error generating PDF:', pdfError);
      // Continue without PDF attachment if generation fails
      console.warn('Continuing to send email without PDF attachment');
    }

    // Send email to business owner using styled template
    const adminEmailHtml = generateApplicationAdminNotificationEmail({
      name: sanitizedName,
      email: sanitizedEmail,
      phone: sanitizedPhone,
      formData: sanitizedFormData,
      sections: applicationFormData,
      logoUrl,
    });

    // Prepare email payload with optional PDF attachment
    const emailPayload: any = {
      from: fromEmail,
      to: contactEmail,
      replyTo: sanitizedEmail,
      subject: `New Application Form Submission from ${sanitizedName}`,
      html: adminEmailHtml,
    };

    // Add PDF attachment if generated successfully
    if (pdfBuffer) {
      emailPayload.attachments = [
        {
          filename: pdfFilename,
          content: pdfBuffer.toString('base64'),
        },
      ];
      console.log('✓ PDF attachment added to email');
    }

    const adminEmailResult = await resend.emails.send(emailPayload);

    if (adminEmailResult.error) {
      console.error('Error sending admin email:', adminEmailResult.error);
      throw new Error('Failed to send notification email');
    }

    console.log('✓ Admin notification email sent successfully (with PDF attachment)');

    // Send confirmation email to the applicant using styled template
    try {
      const confirmationEmailHtml = generateApplicationConfirmationEmail({
        name: sanitizedName,
        email: sanitizedEmail,
        phone: sanitizedPhone,
        formData: sanitizedFormData,
        sections: applicationFormData,
        logoUrl,
      });

      const confirmationEmailResult = await resend.emails.send({
        from: fromEmail,
        to: sanitizedEmail,
        replyTo: SITE_CONFIG.ORGANIZATION_EMAIL.value,
        subject: `Application Received - ${SITE_CONFIG.ORGANIZATION_NAME}`,
        html: confirmationEmailHtml,
      });

      if (confirmationEmailResult.error) {
        // Check if it's the domain verification error
        const errorObj = confirmationEmailResult.error as { statusCode?: number; message?: string };
        if (errorObj.statusCode === 403) {
          console.warn(
            'Confirmation email skipped - domain not verified. This is expected in development.',
            'The admin notification email was sent successfully.'
          );
        } else {
          console.error('Error sending confirmation email:', confirmationEmailResult.error);
        }
      } else {
        console.log('✓ Confirmation email sent successfully to:', sanitizedEmail);
      }
    } catch (confirmationError) {
      // Log error but don't fail the request if confirmation email fails
      console.error('Failed to send confirmation email to applicant:', confirmationError);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Application submitted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Application form submission error:', error);

    // Check if it's a Resend-specific error
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Failed to submit application. Please try again later.';

    return NextResponse.json(
      {
        error: 'We encountered an issue submitting your application.',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
