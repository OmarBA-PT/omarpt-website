import { NextResponse } from 'next/server';
import { generateApplicationPDFBuffer } from '@/lib/utils/generateApplicationPDF';
import { fetchOrganizationName } from '@/lib/organizationInfo';

export const dynamic = 'force-dynamic';

// ========================================
// RATE LIMITING CONFIGURATION
// ========================================
// Only enabled in production to avoid friction during local development
const ENABLE_RATE_LIMITING = process.env.NEXT_PUBLIC_ENV === 'production';

// In-memory rate limiting (resets on server restart)
// PDF generation is resource-intensive, so limits are conservative
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_REQUESTS_PER_IP = 10; // Maximum 10 PDF generations per IP per hour
const requestLog = new Map<string, { count: number; timestamp: number }>();

// Clean up expired entries periodically
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

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded ? forwarded.split(',')[0].trim() : 'unknown';
}

// Helper function to convert a string to dash-separated format for filenames
const toDashSeparated = (str: string): string => {
  return str
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '');
};

/**
 * GET endpoint - generates blank application form PDF (no submitted data)
 */
export async function GET(request: Request) {
  if (ENABLE_RATE_LIMITING && !checkRateLimit(getClientIp(request))) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.', rateLimited: true },
      { status: 429 }
    );
  }

  try {
    // Fetch organization name from Sanity (with fallback)
    const organizationName = await fetchOrganizationName();

    // Generate PDF without form data (blank form)
    const pdfBuffer = await generateApplicationPDFBuffer({}, organizationName);

    // Return the PDF as a downloadable file
    // Note: Buffer is compatible with Response body in Next.js (type assertion needed for TS)
    return new Response(pdfBuffer as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${toDashSeparated(organizationName)}-Application-Form.pdf"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate PDF. Please try again or contact me directly.',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST endpoint - generates PDF with submitted form data
 */
export async function POST(request: Request) {
  if (ENABLE_RATE_LIMITING && !checkRateLimit(getClientIp(request))) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.', rateLimited: true },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { formData } = body;

    if (!formData) {
      return NextResponse.json({ error: 'Form data is required' }, { status: 400 });
    }

    // Fetch organization name from Sanity (with fallback)
    const organizationName = await fetchOrganizationName();

    // Generate PDF with submitted form data using the shared utility function
    const pdfBuffer = await generateApplicationPDFBuffer(formData, organizationName);

    // Generate filename using applicant name if available
    let filename = `${toDashSeparated(organizationName)}-Application-Form.pdf`;
    if (formData.fullName) {
      const sanitizedName = formData.fullName
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '_')
        .substring(0, 50);
      const date = new Date().toISOString().split('T')[0];
      filename = `Application_${sanitizedName}_${date}.pdf`;
    }

    // Return the PDF as a downloadable file
    // Note: Buffer is compatible with Response body in Next.js (type assertion needed for TS)
    return new Response(pdfBuffer as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate PDF. Please try again or contact me directly.',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
