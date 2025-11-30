# Contact Form Implementation Guide

This guide explains how to implement a secure, production-ready contact form using React Hook Form, Next.js API Routes, and Resend email service. This implementation includes comprehensive security measures, styled email templates, and CMS-configurable settings.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Dependencies Installation](#dependencies-installation)
4. [Environment Configuration](#environment-configuration)
5. [Security Implementation](#security-implementation)
6. [Email Templates](#email-templates)
7. [API Route Setup](#api-route-setup)
8. [Frontend Contact Form Component](#frontend-contact-form-component)
9. [Sanity CMS Integration (Optional)](#sanity-cms-integration-optional)
10. [Testing the Implementation](#testing-the-implementation)
11. [Production Deployment](#production-deployment)
12. [Troubleshooting](#troubleshooting)

---

## Overview

This contact form implementation includes:

- **Security Features:**
  - Honeypot field for bot detection
  - Rate limiting (3 requests per IP per hour)
  - Input sanitization to prevent XSS/injection attacks
  - Email validation
  - Required field validation

- **Email Functionality:**
  - Admin notification email (to business owner)
  - User confirmation email (to form submitter)
  - Styled HTML email templates with brand colors
  - Reply-to functionality for easy responses

- **User Experience:**
  - Real-time form validation with react-hook-form
  - Loading states and error handling
  - Success message display
  - Accessible form fields with proper ARIA attributes

---

## Prerequisites

- Next.js 13+ with App Router
- React 18+
- TypeScript (recommended)
- A Resend account (free tier available at https://resend.com)

---

## Dependencies Installation

Install the required packages:

```bash
npm install resend react-hook-form
```

**Package Versions Used:**
- `resend`: ^6.1.2
- `react-hook-form`: ^7.65.0

---

## Environment Configuration

### 1. Create a Resend Account

1. Go to https://resend.com and create an account
2. Navigate to API Keys section
3. Create a new API key
4. Copy the API key (starts with `re_`)

### 2. Set Up Environment Variables

Create or update your `.env.local` file:

```env
# Resend API Key
RESEND_API_KEY="re_your_api_key_here"

# Email address where contact form submissions will be sent
NEXT_PUBLIC_CONTACT_EMAIL="your-email@example.com"

# Email address that will appear as the "from" address
# For testing: Use onboarding@resend.dev (Resend's test domain)
# For production: MUST be an address at your verified domain (e.g., noreply@yourdomain.com)
RESEND_FROM_EMAIL="Your Company <onboarding@resend.dev>"

# Your site's base URL (used for email logo links)
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

### 3. Domain Verification (Production Only)

For **production**, you must verify your domain with Resend:

1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `yourdomain.com`)
4. Add the DNS records provided by Resend to your domain provider
5. Wait for verification (can take up to 24-48 hours)
6. Update `RESEND_FROM_EMAIL` to use your verified domain:
   ```env
   RESEND_FROM_EMAIL="Your Company <noreply@yourdomain.com>"
   ```

**Note:** Without domain verification, confirmation emails can only be sent to the email address you signed up with (development/testing only).

---

## Security Implementation

### 1. Honeypot Field (Bot Detection)

The honeypot field is a hidden input that humans won't see but bots will fill out:

```tsx
{/* Hidden honeypot field */}
<div className='hidden' aria-hidden='true'>
  <label htmlFor='honeypot'>Leave this field empty</label>
  <input
    type='text'
    id='honeypot'
    {...register('honeypot')}
    tabIndex={-1}
    autoComplete='off'
  />
</div>
```

**Server-side validation:**

```typescript
function validateHoneypot(honeypot: string | undefined): boolean {
  return !honeypot || honeypot === '';
}

// In POST handler
if (!validateHoneypot(honeypot)) {
  console.warn('Honeypot triggered - possible bot submission');
  // Return success to not alert the bot
  return NextResponse.json(
    { success: true, message: 'Message sent successfully' },
    { status: 200 }
  );
}
```

### 2. Rate Limiting

In-memory rate limiting (resets on server restart):

```typescript
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

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const requestData = requestLog.get(ip);

  if (!requestData) {
    requestLog.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (now - requestData.timestamp > RATE_LIMIT_WINDOW) {
    requestLog.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (requestData.count >= MAX_REQUESTS_PER_IP) {
    return false;
  }

  requestData.count += 1;
  return true;
}
```

**For production**, consider using Redis or Upstash for persistent rate limiting across server instances.

### 3. Input Sanitization

Prevent XSS and injection attacks:

```typescript
function sanitizeInput(input: string): string {
  return input.replace(/[<>]/g, '').trim();
}

// Apply to all user inputs
const sanitizedName = sanitizeInput(name);
const sanitizedEmail = sanitizeInput(email);
const sanitizedMessage = sanitizeInput(message);
```

### 4. Email Validation

```typescript
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
```

---

## Email Templates

### 1. Create Constants File

Create `src/lib/constants.ts`:

```typescript
export const SITE_CONFIG = {
  ORGANIZATION_NAME: 'Your Company Name',
  ORGANIZATION_EMAIL: {
    value: 'contact@yourcompany.com',
    link: 'mailto:contact@yourcompany.com',
  },
  ORGANIZATION_PHONE: {
    value: '+1 234 567 8900',
    link: 'tel:+12345678900',
  },
  ORGANIZATION_ADDRESS: {
    value: '123 Main Street, City, State 12345',
    link: 'https://maps.google.com/?q=123+Main+Street',
  },
  PRODUCTION_DOMAIN: 'https://yourcompany.com',
} as const;
```

### 2. Admin Notification Email Template

Create `src/lib/email-templates/adminNotificationEmail.ts`:

```typescript
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
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f5; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">

              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">
                    New Contact Form Submission
                  </h1>
                </td>
              </tr>

              <!-- Main Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="margin: 0 0 30px 0; color: #333333; font-size: 16px;">
                    You have received a new message from your website contact form:
                  </p>

                  <!-- Contact Details -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f9f9f9; border-left: 4px solid #667eea; border-radius: 4px; margin-bottom: 30px;">
                    <tr>
                      <td style="padding: 20px;">
                        <h2 style="margin: 0 0 15px 0; color: #667eea; font-size: 18px;">
                          Contact Information
                        </h2>
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                          <tr>
                            <td style="padding: 8px 0; color: #555; font-size: 14px;">
                              <strong>Name:</strong> ${name}
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; color: #555; font-size: 14px;">
                              <strong>Email:</strong>
                              <a href="mailto:${email}" style="color: #667eea; text-decoration: none;">
                                ${email}
                              </a>
                            </td>
                          </tr>
                          ${phone ? `
                          <tr>
                            <td style="padding: 8px 0; color: #555; font-size: 14px;">
                              <strong>Phone:</strong>
                              <a href="tel:${phone.replace(/\s/g, '')}" style="color: #667eea; text-decoration: none;">
                                ${phone}
                              </a>
                            </td>
                          </tr>
                          ` : ''}
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- Message -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f9f9f9; border-radius: 4px; margin-bottom: 20px;">
                    <tr>
                      <td style="padding: 20px;">
                        <h2 style="margin: 0 0 15px 0; color: #333; font-size: 16px;">
                          Message:
                        </h2>
                        <p style="margin: 0; color: #333333; font-size: 14px; white-space: pre-wrap;">${message.replace(/\n/g, '<br>')}</p>
                      </td>
                    </tr>
                  </table>

                  <p style="font-size: 16px; color: #333333; text-align: center;">
                    You can reply directly to this email to get back to ${name}.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f9f9f9; padding: 20px 30px; border-radius: 0 0 8px 8px; text-align: center;">
                  <p style="margin: 0; color: #666666; font-size: 12px;">
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
```

### 3. Confirmation Email Template

Create `src/lib/email-templates/confirmationEmail.ts`:

```typescript
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
    emailIntroMessage = 'We have successfully received your message and will get back to you as soon as possible.',
    emailOutroMessage = 'If you have any urgent questions, feel free to reach out to us directly.',
  } = data;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thank you for contacting ${SITE_CONFIG.ORGANIZATION_NAME}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f5; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">

              <!-- Header with Logo -->
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
                  <img
                    src="${logoUrl}"
                    alt="${SITE_CONFIG.ORGANIZATION_NAME}"
                    width="250"
                    height="auto"
                    style="display: block; margin: 0 auto;"
                  />
                </td>
              </tr>

              <!-- Main Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px;">
                    ${emailGreeting} <strong>${name}</strong>,
                  </p>
                  <p style="margin: 0 0 30px 0; color: #333333; font-size: 16px;">
                    ${emailIntroMessage}
                  </p>

                  <!-- Message Details -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f9f9f9; border-left: 4px solid #667eea; border-radius: 4px; margin-bottom: 30px;">
                    <tr>
                      <td style="padding: 20px;">
                        <h2 style="margin: 0 0 15px 0; color: #667eea; font-size: 18px;">
                          Your Message Details
                        </h2>
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                          <tr>
                            <td style="padding: 8px 0; color: #555; font-size: 14px;">
                              <strong>Name:</strong> ${name}
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; color: #555; font-size: 14px;">
                              <strong>Email:</strong> ${email}
                            </td>
                          </tr>
                          ${phone ? `
                          <tr>
                            <td style="padding: 8px 0; color: #555; font-size: 14px;">
                              <strong>Phone:</strong> ${phone}
                            </td>
                          </tr>
                          ` : ''}
                          <tr>
                            <td style="padding: 8px 0; color: #555; font-size: 14px;">
                              <strong>Message:</strong>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0 0 0; color: #555; font-size: 14px;">${message.replace(/\n/g, '<br>')}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 0; color: #666666; font-size: 16px;">
                    ${emailOutroMessage}
                  </p>
                </td>
              </tr>

              <!-- Footer Signature -->
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 0 0 8px 8px;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                      <td align="center">
                        <img
                          src="${logoUrl}"
                          alt="${SITE_CONFIG.ORGANIZATION_NAME}"
                          width="200"
                          height="auto"
                          style="display: block; margin: 0 auto 8px auto;"
                        />
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
                            <td align="center" style="padding: 5px 0;">
                              <a href="${SITE_CONFIG.ORGANIZATION_ADDRESS.link}" style="color: #ffffff; text-decoration: none; font-size: 14px;">
                                ${SITE_CONFIG.ORGANIZATION_ADDRESS.value}
                              </a>
                            </td>
                          </tr>
                        </table>
                        <div style="border-top: 1px solid rgba(255,255,255,0.3); margin: 20px 0;"></div>
                        <p style="margin: 0; color: #ffffff; font-size: 12px; text-align: center;">
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
```

---

## API Route Setup

Create `src/app/api/contact/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { generateConfirmationEmail } from '@/lib/email-templates/confirmationEmail';
import { generateAdminNotificationEmail } from '@/lib/email-templates/adminNotificationEmail';
import { SITE_CONFIG } from '@/lib/constants';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_IP = 3;
const requestLog = new Map<string, { count: number; timestamp: number }>();

// Clean up old entries
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of requestLog.entries()) {
    if (now - data.timestamp > RATE_LIMIT_WINDOW) {
      requestLog.delete(ip);
    }
  }
}, RATE_LIMIT_WINDOW);

// Validation functions
function validateHoneypot(honeypot: string | undefined): boolean {
  return !honeypot || honeypot === '';
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function sanitizeInput(input: string): string {
  return input.replace(/[<>]/g, '').trim();
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const requestData = requestLog.get(ip);

  if (!requestData) {
    requestLog.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (now - requestData.timestamp > RATE_LIMIT_WINDOW) {
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
    // Get client IP
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown';

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.', rateLimited: true },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, phone, message, honeypot } = body;

    // Honeypot validation
    if (!validateHoneypot(honeypot)) {
      console.warn('Honeypot triggered - possible bot submission');
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

    // Validate email
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPhone = phone ? sanitizeInput(phone) : '';
    const sanitizedMessage = sanitizeInput(message);

    // Validate sanitized inputs
    if (!sanitizedName || !sanitizedEmail || !sanitizedMessage) {
      return NextResponse.json({ error: 'Invalid input detected.' }, { status: 400 });
    }

    // Get email addresses from environment
    const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
    const fromEmail = process.env.RESEND_FROM_EMAIL ||
      `${SITE_CONFIG.ORGANIZATION_NAME} <onboarding@resend.dev>`;

    if (!contactEmail) {
      console.error('NEXT_PUBLIC_CONTACT_EMAIL not set');
      return NextResponse.json(
        { error: 'Contact form is currently unavailable.' },
        { status: 500 }
      );
    }

    // Construct logo URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const logoUrl = `${baseUrl}/images/logo.png`;

    // Send admin notification email
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

    // Send confirmation email to user
    try {
      const confirmationEmailHtml = generateConfirmationEmail({
        name: sanitizedName,
        email: sanitizedEmail,
        phone: sanitizedPhone,
        message: sanitizedMessage,
        logoUrl,
      });

      const confirmationEmailResult = await resend.emails.send({
        from: fromEmail,
        to: sanitizedEmail,
        replyTo: SITE_CONFIG.ORGANIZATION_EMAIL.value,
        subject: `Thank you for contacting ${SITE_CONFIG.ORGANIZATION_NAME}`,
        html: confirmationEmailHtml,
      });

      if (confirmationEmailResult.error) {
        const errorObj = confirmationEmailResult.error as { statusCode?: number };
        if (errorObj.statusCode === 403) {
          console.warn('Confirmation email skipped - domain not verified');
        } else {
          console.error('Error sending confirmation email:', confirmationEmailResult.error);
        }
      }
    } catch (confirmationError) {
      console.error('Failed to send confirmation email:', confirmationError);
    }

    return NextResponse.json(
      { success: true, message: 'Message sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}
```

---

## Frontend Contact Form Component

Create `src/components/ContactForm.tsx`:

```tsx
'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  honeypot: string;
}

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    mode: 'onTouched',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
      honeypot: '',
    },
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit: SubmitHandler<ContactFormData> = async (data) => {
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok) {
        setStatus('success');
        reset();
      } else {
        setStatus('error');
        setErrorMessage(
          responseData.error || 'Failed to send message. Please try again.'
        );
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Failed to send message. Please try again.');
      console.error('Contact form error:', error);
    }
  };

  const getInputStyles = (fieldName: keyof ContactFormData) => {
    const hasError = errors[fieldName];
    return `w-full px-4 py-3 rounded-lg border-2 transition-all ${
      hasError
        ? 'border-red-500 focus:border-red-600 focus:ring-red-500'
        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
    } focus:outline-none focus:ring-2 focus:ring-opacity-20`;
  };

  const fieldDisabled = status === 'loading' || status === 'success';

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold mb-6">Contact Us</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Honeypot field - hidden */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="honeypot">Leave this field empty</label>
          <input
            type="text"
            id="honeypot"
            {...register('honeypot')}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {/* Name field */}
        <div>
          <label htmlFor="name" className="block font-medium mb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            {...register('name', {
              required: 'Please enter your name',
              minLength: { value: 2, message: 'Name must be at least 2 characters' },
            })}
            disabled={fieldDisabled}
            className={getInputStyles('name')}
            placeholder="Your name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Email field */}
        <div>
          <label htmlFor="email" className="block font-medium mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            {...register('email', {
              required: 'Please enter your email address',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Please enter a valid email address',
              },
            })}
            disabled={fieldDisabled}
            className={getInputStyles('email')}
            placeholder="your.email@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Phone field (optional) */}
        <div>
          <label htmlFor="phone" className="block font-medium mb-2">
            Phone <span className="text-gray-400 text-sm">(optional)</span>
          </label>
          <input
            type="tel"
            id="phone"
            {...register('phone')}
            disabled={fieldDisabled}
            className={getInputStyles('phone')}
            placeholder="+1 234 567 8900"
          />
        </div>

        {/* Message field */}
        <div>
          <label htmlFor="message" className="block font-medium mb-2">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            {...register('message', {
              required: 'Please enter a message',
              minLength: { value: 10, message: 'Message must be at least 10 characters' },
            })}
            disabled={fieldDisabled}
            rows={6}
            className={getInputStyles('message')}
            placeholder="Tell us how we can help you..."
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
          )}
        </div>

        {/* Error message */}
        {status === 'error' && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
            <p className="text-red-700">{errorMessage}</p>
          </div>
        )}

        {/* Submit button */}
        {status !== 'success' && (
          <button
            type="submit"
            disabled={fieldDisabled}
            className="w-full bg-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {status === 'loading' ? 'Sending...' : 'Send Message'}
          </button>
        )}
      </form>

      {/* Success message */}
      {status === 'success' && (
        <div className="bg-green-50 rounded-lg p-6 text-center mt-4">
          <h3 className="text-xl font-bold text-green-800 mb-2">
            Thank you for your message!
          </h3>
          <p className="text-green-700">
            We have received your message and will get back to you as soon as possible.
            You should also receive a confirmation email shortly.
          </p>
        </div>
      )}
    </div>
  );
};

export default ContactForm;
```

---

## Sanity CMS Integration (Optional)

If you want to make the contact form messages editable via Sanity CMS:

### 1. Create Contact Form Settings Schema

Create `src/sanity/schemas/contactFormSettings.ts`:

```typescript
import { defineType, defineField } from 'sanity';
import { EnvelopeIcon } from '@sanity/icons';

export const contactFormSettingsType = defineType({
  name: 'contactFormSettings',
  title: 'Contact Form Settings',
  type: 'document',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Form Title',
      description: 'Optional title displayed at the top of the contact form',
    }),
    defineField({
      name: 'subtitle',
      type: 'text',
      title: 'Form Subtitle',
      rows: 2,
    }),
    defineField({
      name: 'messagePlaceholder',
      type: 'string',
      title: 'Message Field Placeholder',
      initialValue: 'Tell us how we can help you...',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'successHeading',
      type: 'string',
      title: 'Success Message Heading',
      initialValue: 'Thank you for your message!',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'successMessage',
      type: 'text',
      title: 'Success Message Text',
      rows: 3,
      initialValue:
        'We have received your message and will get back to you as soon as possible.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'emailGreeting',
      type: 'string',
      title: 'Email Greeting',
      description: 'e.g., "Hi" or "Hello"',
      initialValue: 'Hi',
      validation: (Rule) => Rule.required().max(20),
    }),
    defineField({
      name: 'emailIntroMessage',
      type: 'text',
      title: 'Email Introduction Message',
      rows: 2,
      initialValue: 'We have received your message and will get back to you soon.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'emailOutroMessage',
      type: 'text',
      title: 'Email Closing Message',
      rows: 2,
      initialValue: 'If you have urgent questions, feel free to reach out directly.',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Contact Form Settings',
      };
    },
  },
});
```

### 2. Create GROQ Query

In `src/sanity/lib/queries.ts`:

```typescript
import { defineQuery } from 'next-sanity';

export const CONTACT_FORM_SETTINGS_QUERY = defineQuery(`*[_id == "contactFormSettings"][0]{
  _id,
  title,
  subtitle,
  messagePlaceholder,
  successHeading,
  successMessage,
  emailGreeting,
  emailIntroMessage,
  emailOutroMessage
}`);
```

### 3. Create Action

In `src/actions/contactFormSettings.ts`:

```typescript
import { sanityFetch } from '@/sanity/lib/client';
import { CONTACT_FORM_SETTINGS_QUERY } from '@/sanity/lib/queries';

export async function getContactFormSettings() {
  const { data } = await sanityFetch({
    query: CONTACT_FORM_SETTINGS_QUERY,
  });
  return data;
}
```

### 4. Update Component to Use Settings

```tsx
import { getContactFormSettings } from '@/actions/contactFormSettings';

// In your component or page
const settings = await getContactFormSettings();

<ContactForm settings={settings} />
```

---

## Testing the Implementation

### Local Development Testing

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to your contact form page**

3. **Test the honeypot:**
   - Open browser dev tools
   - Find the hidden honeypot field
   - Manually fill it in
   - Submit the form
   - You should see a success message, but no email will be sent

4. **Test validation:**
   - Try submitting empty form (should show validation errors)
   - Enter invalid email (should show error)
   - Enter message less than 10 characters (should show error)

5. **Test successful submission:**
   - Fill in all required fields correctly
   - Submit the form
   - Check that you receive the admin notification email
   - **Note:** Confirmation email will only work if:
     - You're using the email address you signed up with on Resend (free tier), OR
     - You've verified a domain in Resend (production)

6. **Test rate limiting:**
   - Submit the form 4 times in quick succession
   - The 4th submission should be rate-limited

### Production Testing Checklist

- [ ] Domain verified in Resend
- [ ] All environment variables set in Vercel/hosting platform
- [ ] `RESEND_FROM_EMAIL` uses verified domain
- [ ] Logo URL is absolute and accessible
- [ ] Rate limiting works across server instances (consider Redis)
- [ ] Emails arrive in inbox (not spam folder)
- [ ] Reply-to functionality works correctly
- [ ] Mobile responsive design tested
- [ ] Accessibility tested (screen reader, keyboard navigation)

---

## Production Deployment

### 1. Vercel Environment Variables

Add these to your Vercel project settings:

```
RESEND_API_KEY=re_your_production_api_key
NEXT_PUBLIC_CONTACT_EMAIL=contact@yourdomain.com
RESEND_FROM_EMAIL=Your Company <noreply@yourdomain.com>
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

### 2. Domain Verification

1. In Resend dashboard, add your production domain
2. Add DNS records to your domain provider:
   - TXT record for domain verification
   - MX records for email routing
   - SPF record for email authentication
   - DKIM record for email signing
3. Wait for verification (can take 24-48 hours)
4. Test email sending from production

### 3. Logo Setup

Ensure your logo is accessible:

1. Place logo in `public/images/logo.png`
2. Verify the URL works: `https://yourdomain.com/images/logo.png`
3. Logo should be:
   - PNG or JPEG format
   - Reasonable file size (< 100KB)
   - Appropriate dimensions (recommended: 250px wide)

### 4. Rate Limiting Enhancement (Recommended)

For production, replace in-memory rate limiting with Redis or Upstash:

```bash
npm install @upstash/redis
```

```typescript
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

async function checkRateLimit(ip: string): Promise<boolean> {
  const key = `ratelimit:contact:${ip}`;
  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, 3600); // 1 hour
  }

  return count <= 3;
}
```

---

## Troubleshooting

### Emails Not Sending

**Problem:** Admin notification email not sending

**Solutions:**
- Check that `RESEND_API_KEY` is set correctly
- Verify API key is valid in Resend dashboard
- Check server logs for error messages
- Ensure `NEXT_PUBLIC_CONTACT_EMAIL` is set

**Problem:** Confirmation email not sending

**Solutions:**
- Verify your domain in Resend (production only)
- For development: confirmation only works with your Resend signup email
- Check for 403 errors in logs (indicates domain not verified)
- Ensure `RESEND_FROM_EMAIL` uses verified domain

### Form Validation Issues

**Problem:** Form submits even with errors

**Solution:**
- Check that `react-hook-form` validation rules are set correctly
- Verify `handleSubmit` is wrapping your submit function
- Check browser console for errors

**Problem:** Validation messages not showing

**Solution:**
- Ensure error messages are rendering: `{errors.fieldName && <p>{errors.fieldName.message}</p>}`
- Check that `formState: { errors }` is destructured from `useForm`

### Rate Limiting Not Working

**Problem:** Can submit more than 3 times

**Solutions:**
- In development with hot reload, the Map gets reset
- In production with multiple server instances, use Redis
- Check that IP extraction is working: `const ip = request.headers.get('x-forwarded-for')`

### Styling Issues

**Problem:** Email templates not displaying correctly

**Solutions:**
- Use inline styles only (no CSS classes)
- Test in multiple email clients (Gmail, Outlook, etc.)
- Use tables for layout (email HTML is old-school)
- Avoid modern CSS (flexbox, grid)

### Security Concerns

**Always ensure:**
- Honeypot field is truly hidden (`className="hidden"`)
- All inputs are sanitized before sending emails
- Rate limiting is active and working
- Email validation is strict
- HTTPS is used in production

---

## Summary

This contact form implementation provides:

✅ **Security:** Honeypot, rate limiting, input sanitization
✅ **User Experience:** Real-time validation, loading states, success messages
✅ **Email Functionality:** Admin notifications and user confirmations
✅ **Customization:** Styled email templates with brand colors
✅ **CMS Integration:** Optional Sanity CMS for content management
✅ **Production Ready:** Environment configuration, error handling, logging

For questions or issues, refer to:
- [Resend Documentation](https://resend.com/docs)
- [React Hook Form Documentation](https://react-hook-form.com/)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
