'use client';

import { useState, useRef, useEffect } from 'react';
import PageHero from '@/components/Page/PageHero';
import Container from '@/components/Layout/Container';
import Breadcrumb from '@/components/UI/Breadcrumb';
import { MdDownload, MdArrowBack } from 'react-icons/md';
import { BsClipboard2CheckFill } from 'react-icons/bs';
import ApplicationForm from '@/components/Forms/ApplicationForm/ApplicationForm';
import CardLight from '@/components/UI/CardLight';
import CardGradient from '@/components/UI/CardGradient';
import CTA from '@/components/UI/CTA';
import { maxCardWidth } from '@/utils/spacingConstants';
import PrivacyStatement from '@/components/UI/PrivacyStatement';
import {
  loadPersistedFormState,
  clearPersistedFormState,
} from '@/components/Forms/ApplicationForm/useFormPersistence';
import type {
  APPLY_PAGE_QUERYResult,
  APPLY_PRIVACY_STATEMENT_QUERYResult,
} from '@/sanity/types';
import type { FormSection } from '@/data/applicationFormData';

interface ApplyPageClientProps {
  generalContent: APPLY_PAGE_QUERYResult | null;
  privacyStatement: APPLY_PRIVACY_STATEMENT_QUERYResult | null;
  questionnaireSections: FormSection[];
}

const ApplyPageClient = ({ generalContent, privacyStatement, questionnaireSections }: ApplyPageClientProps) => {
  const [showForm, setShowForm] = useState(false);
  const [showPrivacyConsent, setShowPrivacyConsent] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [hasSavedApplication, setHasSavedApplication] = useState(false);
  const backButtonRef = useRef<HTMLDivElement>(null);

  // Check for saved application data when returning to default view
  useEffect(() => {
    if (!showForm && !showPrivacyConsent) {
      const savedState = loadPersistedFormState();
      setHasSavedApplication(!!savedState);
    }
  }, [showForm, showPrivacyConsent]);

  // Derive values with fallbacks from Sanity data
  const pageTitle = generalContent?.title || 'Apply for Coaching';
  const pageSubtitle =
    generalContent?.subtitle || 'Take the first step towards achieving your fitness goals';
  const introduction =
    generalContent?.introduction ||
    "Ready to start your fitness journey? Choose how you'd like to apply below.";
  const applyOnlineTitle = generalContent?.applyOnlineTitle || 'Submit online';
  const applyOnlineSubtitle =
    generalContent?.applyOnlineSubtitle || 'Submit your application using my online form.';
  const downloadPdfTitle = generalContent?.downloadPdfTitle || 'Download PDF';
  const downloadPdfSubtitle =
    generalContent?.downloadPdfSubtitle ||
    'If you prefer, you can apply via PDF and email back to me.';
  const closingCardTitle = generalContent?.closingCardTitle || 'Just enquiring?';
  const closingCardBody =
    generalContent?.closingCardBody ||
    'Not ready to apply yet? No problem! Get in contact to ask any questions you might have about my coaching services.';
  const closingCardCtaText = generalContent?.closingCardCtaText || 'Contact Me';

  // Compute closing card href (following Contact page pattern)
  let closingCardHref = '/contact'; // default fallback
  if (generalContent?.linkType === 'external' && generalContent?.externalUrl) {
    closingCardHref = generalContent.externalUrl;
  } else if (generalContent?.linkType === 'internal') {
    const internalHref = generalContent?.internalLink?.href || '/';
    const sectionId = generalContent?.pageSectionId;
    closingCardHref = sectionId ? `${internalHref}#${sectionId}` : internalHref;
  }

  // Privacy statement values
  const privacyTitle = privacyStatement?.title;
  const privacyBody = privacyStatement?.body;

  const handleStartApplication = () => {
    setShowPrivacyConsent(true);
    // Smooth scroll to back button after state updates
    setTimeout(() => {
      backButtonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleContinueApplication = () => {
    // Skip privacy consent, go directly to form (data is already saved)
    setShowForm(true);
    setTimeout(() => {
      backButtonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleRestartApplication = () => {
    // Clear saved data and start fresh with privacy consent
    clearPersistedFormState();
    setHasSavedApplication(false);
    setShowPrivacyConsent(true);
    setTimeout(() => {
      backButtonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleProceedToForm = () => {
    setShowForm(true);
    // Smooth scroll to back button after state updates
    setTimeout(() => {
      backButtonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleBackToOptions = () => {
    setShowForm(false);
    setShowPrivacyConsent(false);
    // Re-check for saved application data (may have been cleared on successful submission)
    const savedState = loadPersistedFormState();
    setHasSavedApplication(!!savedState);
  };

  const handleDownloadPdf = async () => {
    setPdfError(null);
    setIsDownloading(true);

    try {
      // Add timestamp to prevent caching
      const url = `/api/generate-application-pdf?v=${Date.now()}`;
      const response = await fetch(url);

      if (!response.ok) {
        // Try to parse error message from JSON response
        let errorMessage = 'Failed to download PDF. Please try again or contact me directly.';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If JSON parsing fails, use default message
        }
        setPdfError(errorMessage);
        setIsDownloading(false);
        return;
      }

      // Get the PDF blob and create download link
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'Omania-Training-Application-Form.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      setIsDownloading(false);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      setPdfError('An unexpected error occurred. Please try again.');
      setIsDownloading(false);
    }
  };

  const handleScrollToBackButton = () => {
    // Scroll to show the Back to Options button (for successful submissions)
    backButtonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (showPrivacyConsent && !showForm) {
    // Privacy consent view - shown before the form
    return (
      <>
        {/* Page Hero */}
        <PageHero title={pageTitle} subtTitle={pageSubtitle} />

        {/* Breadcrumb */}
        <Breadcrumb pageTitle={pageTitle} />

        <Container textAlign='center'>
          {/* Back/Cancel Button */}
          <div ref={backButtonRef} className='mb-8'>
            <CTA as='button' variant='outline-light' onClick={handleBackToOptions}>
              <div className='flex items-center gap-2'>
                <MdArrowBack className='w-5 h-5' />
                <span>Back to Options</span>
              </div>
            </CTA>
          </div>

          {/* Privacy Statement */}
          <div className='mb-8'>
            <PrivacyStatement title={privacyTitle} body={privacyBody} />
          </div>

          {/* Proceed Button */}
          <CTA as='button' variant='filled' onClick={handleProceedToForm}>
            Proceed
          </CTA>
        </Container>
      </>
    );
  }

  if (showForm) {
    // Form view - full page application form
    return (
      <>
        {/* Page Hero */}
        <PageHero title={pageTitle} subtTitle={pageSubtitle} />

        {/* Breadcrumb */}
        <Breadcrumb pageTitle={pageTitle} />

        <Container textAlign='center'>
          {/* Back/Cancel Button */}
          <div ref={backButtonRef} className='mb-8'>
            <CTA as='button' variant='outline-light' onClick={handleBackToOptions}>
              <div className='flex items-center gap-2'>
                <MdArrowBack className='w-5 h-5' />
                <span>Back to Options</span>
              </div>
            </CTA>
          </div>

          {/* Application Form */}
          <ApplicationForm
            onScrollToBackButton={handleScrollToBackButton}
            questionnaireSections={questionnaireSections}
          />

          {/* Privacy Statement Below Form */}
          <div className='mt-12'>
            <PrivacyStatement title={privacyTitle} body={privacyBody} />
          </div>
        </Container>
      </>
    );
  }

  // Default view - application options
  return (
    <>
      {/* Page Hero */}
      <PageHero title={pageTitle} subtTitle={pageSubtitle} />

      {/* Breadcrumb */}
      <Breadcrumb pageTitle={pageTitle} />

      <Container textAlign='center'>
        {/* Introduction */}
        <div className='max-w-3xl mx-auto mb-12'>
          <p className='text-body-lg'>{introduction}</p>
        </div>

        {/* Application Options */}
        <div className={`grid grid-cols-1 gap-6 mx-auto mb-16 ${maxCardWidth}`}>
          {/* Start Application Option */}
          <CardLight showBorder title={applyOnlineTitle} icon={BsClipboard2CheckFill}>
            <p className='mb-6'>{applyOnlineSubtitle}</p>
            {hasSavedApplication ? (
              <div className='flex flex-col md:flex-row gap-4 justify-center items-center'>
                <CTA as='button' variant='filled' onClick={handleContinueApplication}>
                  Continue Application
                </CTA>
                <CTA as='button' variant='outline-light' onClick={handleRestartApplication}>
                  Restart
                </CTA>
              </div>
            ) : (
              <CTA as='button' variant='filled' onClick={handleStartApplication}>
                Start Application
              </CTA>
            )}
          </CardLight>

          {/* PDF Download Option */}
          <CardLight title={downloadPdfTitle} icon={MdDownload}>
            <p className='mb-6'>{downloadPdfSubtitle}</p>
            <CTA as='button' variant='filled' onClick={handleDownloadPdf} disabled={isDownloading}>
              {isDownloading ? 'Downloading...' : 'Download Form'}
            </CTA>
            {pdfError && (
              <div className='mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-body-sm'>
                {pdfError}
              </div>
            )}
          </CardLight>
        </div>

        {/* Just Enquiring CTA */}
        <CardGradient
          title={closingCardTitle}
          body={closingCardBody}
          ctaText={closingCardCtaText}
          ctaHref={closingCardHref}
        />
      </Container>
    </>
  );
};

export default ApplyPageClient;
