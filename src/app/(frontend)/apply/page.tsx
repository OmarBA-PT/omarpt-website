import Link from 'next/link';
import PageHero from '@/components/Page/PageHero';
import Container from '@/components/Layout/Container';
import {
  generateMetadata as generatePageMetadata,
  generateCanonicalUrl,
  getBaseUrl,
} from '@/lib/metadata';
import { generateArticleSchema, generateStructuredDataScript } from '@/lib/structuredData';
import BreadcrumbStructuredData from '@/components/StructuredData/BreadcrumbStructuredData';
import Breadcrumb from '@/components/UI/Breadcrumb';
import { SITE_CONFIG } from '@/lib/constants';
import { MdDownload, MdQuestionAnswer, MdLock } from 'react-icons/md';
import ApplicationForm from '@/components/Forms/ApplicationForm/ApplicationForm';

export async function generateMetadata() {
  return generatePageMetadata({
    title: 'Apply for Coaching',
    description:
      'Ready to start your fitness journey? Submit your coaching application and take the first step towards achieving your goals.',
    siteSettings: null,
    canonicalUrl: generateCanonicalUrl('/apply'),
  });
}

const ApplyPage = () => {
  const baseUrl = getBaseUrl();

  // Generate breadcrumb data
  const breadcrumbItems = [
    { name: 'Home', url: baseUrl },
    { name: 'Apply for Coaching', url: `${baseUrl}/apply` },
  ];

  // Generate Article structured data
  const articleSchema = generateArticleSchema({
    headline: 'Apply for Coaching',
    description:
      'Submit your coaching application and take the first step towards achieving your fitness goals.',
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    author: {
      name: SITE_CONFIG.ORGANIZATION_NAME,
      type: 'Organization',
    },
    publisher: {
      name: SITE_CONFIG.ORGANIZATION_NAME,
      url: baseUrl,
      logo: `${baseUrl}/logo.png`,
    },
    url: `${baseUrl}/apply`,
  });

  return (
    <>
      {/* Structured Data */}
      <BreadcrumbStructuredData items={breadcrumbItems} />
      {articleSchema && (
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={generateStructuredDataScript(articleSchema)}
        />
      )}

      {/* Page Hero */}
      <PageHero
        title='Apply for Coaching'
        subtTitle='Take the first step towards achieving your fitness goals'
      />

      {/* Breadcrumb */}
      <Breadcrumb pageTitle='Apply for Coaching' />

      <Container textAlign='center'>
        {/* Introduction */}
        <div className='hidden max-w-3xl mx-auto mb-12'>
          <p className='text-body-lg mb-4'>
            Thank you for your interest in our coaching services! We&apos;re excited to help you
            reach your fitness goals.
          </p>
          <p className='text-body-base'>
            Choose how you&apos;d like to proceed below. You can complete the online application
            form, download PDF forms to complete by hand, or submit a simple enquiry if you&apos;re
            not ready to apply yet.
          </p>
        </div>

        {/* Application Options */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16'>
          {/* Online Form Option */}
          <div className='bg-brand-gradient-charcoal-linear rounded-lg p-8 border-2 border-brand-primary'>
            <MdQuestionAnswer className='w-10 h-10 text-brand-primary mx-auto mb-4' />
            <h3 className='text-h5 font-semibold text-gradient-primary mb-4'>Complete Online</h3>
            <p className='text-body-base text-brand-white mb-6'>
              Fill out the application form below on this page. Quick and easy!
            </p>
          </div>

          {/* PDF Download Option */}
          <div className='bg-gray-50 rounded-lg p-8 border-2 border-gray-200'>
            <MdDownload className='w-10 h-10 text-brand-primary mx-auto mb-4' />
            <h3 className='text-h5 font-semibold mb-4'>Download PDFs</h3>
            <p className='text-body-base mb-6'>
              Print, complete by hand, scan and email back to us.
            </p>
            <a
              href='/api/generate-application-pdf'
              download
              className='inline-block bg-brand-primary hover:bg-brand-secondary text-brand-white font-semibold px-6 py-3 rounded-lg text-body-sm transition-colors'>
              Download Forms
            </a>
          </div>

          {/* Simple Enquiry Option */}
          <div className='bg-gray-50 rounded-lg p-8 border-2 border-gray-200'>
            <MdQuestionAnswer className='w-10 h-10 text-brand-primary mx-auto mb-4' />
            <h3 className='text-h5 font-semibold mb-4'>Just Enquiring?</h3>
            <p className='text-body-base mb-6'>
              Not ready to apply? Ask a question via our contact form.
            </p>
            <Link
              href='/contact'
              className='inline-block bg-brand-primary hover:bg-brand-secondary font-semibold px-6 py-3 rounded-lg transition-colors text-body-sm'>
              Contact Us
            </Link>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className='bg-brand-gradient-charcoal-linear rounded-lg p-8 max-w-3xl mx-auto mb-16'>
          <div className='flex items-start gap-4 text-left'>
            <MdLock className='w-6 h-6 text-brand-primary shrink-0 mt-1' />
            <div>
              <h3 className='text-h6 font-semibold text-gradient-primary mb-3'>
                Your Privacy Matters
              </h3>
              <p className='text-body-base text-brand-white mb-3'>
                We take your privacy seriously. All information you provide will be used solely for
                processing your coaching application and creating your personalized fitness plan.
              </p>
              <p className='text-body-base text-brand-white mb-3'>
                We will never share your personal information with third parties, and it will only
                be retained for as long as necessary to provide our coaching services to you.
              </p>
              <Link
                href='/privacy-policy'
                className='text-brand-primary hover:text-brand-secondary transition-colors text-body-base underline'>
                Read our full Privacy Policy
              </Link>
            </div>
          </div>
        </div>

        {/* Application Form Section */}
        <div className='mb-16'>
          <div className='max-w-3xl mx-auto mb-8'>
            <h2 className='text-h4 font-semibold mb-4'>Online Application Form</h2>
            <p className='text-body-base mb-6'>
              Please complete the form below as thoroughly as possible. The more information you
              provide, the better we can understand your needs and create a personalized coaching
              plan that&apos;s right for you.
            </p>
          </div>

          {/* Application Form */}
          <ApplicationForm />
        </div>
      </Container>
    </>
  );
};

export default ApplyPage;
