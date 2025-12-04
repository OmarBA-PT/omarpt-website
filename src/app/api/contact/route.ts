import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { generateConfirmationEmail } from '@/lib/email-templates/confirmationEmail';
import { generateAdminNotificationEmail } from '@/lib/email-templates/adminNotificationEmail';
import { SITE_CONFIG } from '@/lib/constants';
import { getContactFormSettings } from '@/actions';

// Initialize Resend with API key from environment variable
// IMPORTANT: Add RESEND_API_KEY to your .env.local file
const resend = new Resend(process.env.RESEND_API_KEY);

// IMPORTANT: Add these environment variables to your .env.local file:
// RESEND_API_KEY=your_resend_api_key_here
// NEXT_PUBLIC_CONTACT_EMAIL=your_contact_email@example.com
// RESEND_FROM_EMAIL=noreply@yourdomain.com (must be verified in Resend)

// ========================================
// RATE LIMITING CONFIGURATION
// ========================================
// Set this to false to disable rate limiting (useful for testing)
const ENABLE_RATE_LIMITING = false;

// Rate limiting configuration (in-memory, resets on server restart)
// For production, consider using a more robust solution like Redis or Upstash
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_REQUESTS_PER_IP = 3; // Maximum 3 submissions per IP per hour
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
// Bots often fill in all fields, including hidden ones
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
          error: 'Too many requests. Please try again later.',
          rateLimited: true,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, phone, message, honeypot } = body;

    // Honeypot validation (bot detection)
    if (!validateHoneypot(honeypot)) {
      console.warn('Honeypot triggered - possible bot submission');
      // Return success to not alert the bot
      return NextResponse.json(
        { success: true, message: 'Message sent successfully' },
        { status: 200 }
      );
    }

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required fields.' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!validateEmail(email)) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPhone = phone ? sanitizeInput(phone) : '';
    const sanitizedMessage = sanitizeInput(message);

    // Validate sanitized inputs aren't empty after sanitization
    if (!sanitizedName || !sanitizedEmail || !sanitizedMessage) {
      return NextResponse.json({ error: 'Invalid input detected.' }, { status: 400 });
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
            'Contact form is currently unavailable. Please contact us directly via phone or email.',
          configError: true,
        },
        { status: 500 }
      );
    }

    // Construct logo URL for email using NEXT_PUBLIC_BASE_URL
    // Note: In development (localhost), the image won't display in emails - this is expected
    // In production, ensure NEXT_PUBLIC_BASE_URL is set to your live domain in Vercel
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const logoUrl = `${baseUrl}/images/logos/logo-white.png`;

    // Fetch contact form settings from Sanity for customizable email content
    const contactFormSettings = await getContactFormSettings();

    // Send email to business owner using styled template
    const adminEmailHtml = generateAdminNotificationEmail({
      name: sanitizedName,
      email: sanitizedEmail,
      phone: sanitizedPhone,
      message: sanitizedMessage,
    });

    const adminEmailResult = await resend.emails.send({
      from: fromEmail,
      to: contactEmail,
      replyTo: sanitizedEmail,
      subject: `New Contact Form Submission from ${sanitizedName}`,
      html: adminEmailHtml,
    });

    if (adminEmailResult.error) {
      console.error('Error sending admin email:', adminEmailResult.error);
      throw new Error('Failed to send notification email');
    }

    // Send confirmation email to the sender using styled template
    // NOTE: On Resend free tier (without domain verification), confirmation emails can only
    // be sent to the email address you signed up with. Once you verify a domain, this will
    // work for any recipient email address.
    try {
      const confirmationEmailHtml = generateConfirmationEmail({
        name: sanitizedName,
        email: sanitizedEmail,
        phone: sanitizedPhone,
        message: sanitizedMessage,
        logoUrl,
        emailGreeting: contactFormSettings?.emailGreeting || undefined,
        emailIntroMessage: contactFormSettings?.emailIntroMessage || undefined,
        emailOutroMessage: contactFormSettings?.emailOutroMessage || undefined,
      });

      const confirmationEmailResult = await resend.emails.send({
        from: fromEmail,
        to: sanitizedEmail,
        replyTo: SITE_CONFIG.ORGANIZATION_EMAIL.value,
        subject: `Thank you for contacting ${SITE_CONFIG.ORGANIZATION_NAME}`,
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
      console.error('Failed to send confirmation email to sender:', confirmationError);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Message sent successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);

    // Check if it's a Resend-specific error
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to send message. Please try again later.';

    return NextResponse.json(
      {
        error:
          'We encountered an issue sending your message. Please try contacting us directly via email or phone.',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
