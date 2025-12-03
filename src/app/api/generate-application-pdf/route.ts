import React from 'react';
import { NextResponse } from 'next/server';
import ReactPDF from '@react-pdf/renderer';
import ApplicationFormPDF from '@/components/PDF/ApplicationFormPDF';
import { applicationFormData } from '@/data/applicationFormData';
import { SITE_CONFIG } from '@/lib/constants';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Read optimized logo file (much smaller for PDFs) and convert to base64 data URI
    // Using logo-pdf-optimized.png (13KB) instead of logo.png (1.6MB) to keep PDF file size small
    const logoPath = path.join(process.cwd(), 'public', 'images', 'logos', 'logo-pdf-optimized.png');
    const logoBuffer = fs.readFileSync(logoPath);
    const logoBase64 = logoBuffer.toString('base64');
    const logoUrl = `data:image/png;base64,${logoBase64}`;

    // Create the PDF document element using JSX-like syntax
    const pdfDocument = React.createElement(ApplicationFormPDF, {
      formData: applicationFormData,
      logoUrl: logoUrl,
      businessName: SITE_CONFIG.ORGANIZATION_NAME,
      contactEmail: SITE_CONFIG.ORGANIZATION_EMAIL.value,
      contactPhone: SITE_CONFIG.ORGANIZATION_PHONE.value,
      contactAddress: SITE_CONFIG.ORGANIZATION_ADDRESS.value,
      websiteUrl: SITE_CONFIG.PRODUCTION_DOMAIN,
    });

    // Render to stream (type assertion needed because ApplicationFormPDF returns a Document component)
    const stream = await ReactPDF.renderToStream(pdfDocument as any);

    // Convert stream to buffer
    const chunks: Uint8Array[] = [];
    for await (const chunk of stream) {
      if (chunk instanceof Uint8Array) {
        chunks.push(chunk);
      } else if (typeof chunk === 'string') {
        chunks.push(new TextEncoder().encode(chunk));
      } else if (Buffer.isBuffer(chunk)) {
        chunks.push(new Uint8Array(chunk));
      }
    }

    // Concatenate all chunks
    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const pdfBuffer = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      pdfBuffer.set(chunk, offset);
      offset += chunk.length;
    }

    // Return the PDF as a downloadable file
    return new NextResponse(pdfBuffer, {
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
        error: 'Failed to generate PDF',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
