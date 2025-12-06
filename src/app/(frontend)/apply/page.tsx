'use client';

import { useState } from 'react';
import PageHero from '@/components/Page/PageHero';
import Container from '@/components/Layout/Container';
import Breadcrumb from '@/components/UI/Breadcrumb';
import { MdDownload, MdPlayArrow, MdArrowBack } from 'react-icons/md';
import ApplicationForm from '@/components/Forms/ApplicationForm/ApplicationForm';
import CardLight from '@/components/UI/CardLight';
import CardGradient from '@/components/UI/CardGradient';
import CTA from '@/components/UI/CTA';
import { maxCardWidth } from '@/utils/spacingConstants';

const ApplyPage = () => {
  const [showForm, setShowForm] = useState(false);

  const pageTitle = 'Apply for Coaching';
  const pageSubtitle = 'Take the first step towards achieving your fitness goals';

  const handleDownloadPdf = () => {
    // Add timestamp to prevent caching
    const url = `/api/generate-application-pdf?v=${Date.now()}`;
    window.location.href = url;
  };

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
          <div className='mb-8'>
            <CTA as='button' variant='outline-light' onClick={() => setShowForm(false)}>
              <div className='flex items-center gap-2'>
                <MdArrowBack className='w-5 h-5' />
                <span>Back to Options</span>
              </div>
            </CTA>
          </div>

          {/* Application Form */}
          <ApplicationForm />
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
          <CardLight showBorder title='Start your online application' icon={MdPlayArrow}>
            <p className='mb-6'>Start your application using my online form.</p>
            <CTA as='button' variant='filled' onClick={() => setShowForm(true)}>
              Begin Application
            </CTA>
          </CardLight>

          {/* PDF Download Option */}
          <CardLight title='Download PDFs instead' icon={MdDownload}>
            <p className='mb-6'>
              If you prefer, you can complete my forms on PDF and email them to me instead.
            </p>
            <CTA as='button' variant='filled' onClick={handleDownloadPdf}>
              Download Forms
            </CTA>
          </CardLight>
        </div>

        {/* Just Enquiring CTA */}
        <CardGradient
          title='Just Enquiring?'
          body='Not ready to apply yet? No problem! Use our contact form to ask any questions you might have about our coaching services.'
          ctaText='Contact Us'
          ctaHref='/contact'
        />
      </Container>
    </>
  );
};

export default ApplyPage;
