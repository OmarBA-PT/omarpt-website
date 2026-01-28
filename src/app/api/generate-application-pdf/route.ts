import { NextResponse } from 'next/server';
import { generateApplicationPDFBuffer } from '@/lib/utils/generateApplicationPDF';
import { fetchOrganizationName } from '@/lib/organizationInfo';

export const dynamic = 'force-dynamic';

/**
 * GET endpoint - generates blank application form PDF (no submitted data)
 */
export async function GET() {
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
        'Content-Disposition': 'attachment; filename="Omania-Training-Application-Form.pdf"',
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
    let filename = 'Omania-Training-Application-Form.pdf';
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
