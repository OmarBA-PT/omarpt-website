'use client';

import { useState, useRef } from 'react';
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

const ApplyPageClient = () => {
  const [showForm, setShowForm] = useState(false);
  const [showPrivacyConsent, setShowPrivacyConsent] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const backButtonRef = useRef<HTMLDivElement>(null);

  const pageTitle = 'Apply for Coaching';
  const pageSubtitle = 'Take the first step towards achieving your fitness goals';

  const handleStartApplication = () => {
    setShowPrivacyConsent(true);
    // Smooth scroll to back button after state updates
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
            <PrivacyStatement />
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
          <ApplicationForm onScrollToBackButton={handleScrollToBackButton} />

          {/* Privacy Statement Below Form */}
          <div className='mt-12'>
            <PrivacyStatement />
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
          <p className='text-body-lg'>
            Ready to start your fitness journey? Choose how you&apos;d like to apply below.
          </p>
        </div>

        {/* Application Options */}
        <div className={`grid grid-cols-1 gap-6 mx-auto mb-16 ${maxCardWidth}`}>
          {/* Start Application Option */}
          <CardLight showBorder title='Submit online' icon={BsClipboard2CheckFill}>
            <p className='mb-6'>Submit your application using my online form.</p>
            <CTA as='button' variant='filled' onClick={handleStartApplication}>
              Start Application
            </CTA>
          </CardLight>

          {/* PDF Download Option */}
          <CardLight title='Download PDF' icon={MdDownload}>
            <p className='mb-6'>If you prefer, you can apply via PDF and email back to me.</p>
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
          title='Just Enquiring?'
          body='Not ready to apply yet? No problem! Get in contact to ask any questions you might have about my coaching services.'
          ctaText='Contact Me'
          ctaHref='/contact'
        />
      </Container>
    </>
  );
};

export default ApplyPageClient;
