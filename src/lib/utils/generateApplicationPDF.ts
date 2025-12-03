import React from 'react';
import ReactPDF from '@react-pdf/renderer';
import ApplicationFormPDF from '@/components/PDF/ApplicationFormPDF';
import { applicationFormData } from '@/data/applicationFormData';
import { SITE_CONFIG } from '@/lib/constants';
import fs from 'fs';
import path from 'path';

/**
 * Generates a PDF buffer from submitted application form data
 * This buffer can be used for email attachments or downloads
 *
 * @param submittedFormData - The form data submitted by the user
 * @returns Promise<Buffer> - PDF file as a Buffer
 */
export async function generateApplicationPDFBuffer(
  submittedFormData: Record<string, any>
): Promise<Buffer> {
  try {
    // Read logo file and convert to base64 data URI for reliable PDF embedding
    const logoPath = path.join(process.cwd(), 'public', 'images', 'logos', 'logo.png');
    const logoBuffer = fs.readFileSync(logoPath);
    const logoBase64 = logoBuffer.toString('base64');
    const logoUrl = `data:image/png;base64,${logoBase64}`;

    // Create the PDF document element with submitted form data
    const pdfDocument = React.createElement(ApplicationFormPDF, {
      formData: applicationFormData,
      submittedAnswers: submittedFormData, // Pass the user's submitted answers
      logoUrl: logoUrl,
      businessName: SITE_CONFIG.ORGANIZATION_NAME,
      contactEmail: SITE_CONFIG.ORGANIZATION_EMAIL.value,
      contactPhone: SITE_CONFIG.ORGANIZATION_PHONE.value,
      contactAddress: SITE_CONFIG.ORGANIZATION_ADDRESS.value,
      websiteUrl: SITE_CONFIG.PRODUCTION_DOMAIN,
    });

    // Render to stream
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

    // Concatenate all chunks into a single buffer
    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const pdfBuffer = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      pdfBuffer.set(chunk, offset);
      offset += chunk.length;
    }

    // Convert Uint8Array to Node.js Buffer for compatibility with email libraries
    return Buffer.from(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF buffer:', error);
    throw new Error(
      `Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Generates a filename for the PDF based on applicant name and timestamp
 *
 * @param applicantName - Name of the applicant
 * @returns string - Formatted filename (e.g., "Application_John_Doe_2024-03-15.pdf")
 */
export function generatePDFFilename(applicantName: string): string {
  // Sanitize name for filename (remove special characters, replace spaces with underscores)
  const sanitizedName = applicantName
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 50); // Limit length

  // Get current date in YYYY-MM-DD format
  const date = new Date().toISOString().split('T')[0];

  return `Application_${sanitizedName}_${date}.pdf`;
}
