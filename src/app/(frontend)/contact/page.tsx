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
import { MdEmail, MdPhone, MdSend } from 'react-icons/md';

export async function generateMetadata() {
  return generatePageMetadata({
    title: 'Contact Us',
    description:
      "Get in touch with us for general enquiries or apply for coaching if you're ready to start your fitness journey.",
    siteSettings: null,
    canonicalUrl: generateCanonicalUrl('/contact'),
  });
}

const ContactPage = () => {
  const baseUrl = getBaseUrl();

  // Generate breadcrumb data
  const breadcrumbItems = [
    { name: 'Home', url: baseUrl },
    { name: 'Contact Us', url: `${baseUrl}/contact` },
  ];

  // Generate Article structured data
  const articleSchema = generateArticleSchema({
    headline: 'Contact Us',
    description: 'Get in touch with us for general enquiries or apply for coaching.',
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
    url: `${baseUrl}/contact`,
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
        title='Contact Us'
        subtTitle='Get in touch for general enquiries or start your coaching journey'
      />

      {/* Breadcrumb */}
      <Breadcrumb pageTitle='Contact Us' />

      <Container textAlign='center'>
        {/* Introduction */}
        <div className='max-w-3xl mx-auto mb-12'>
          <p className='text-body-lg'>
            Have a question or want to learn more about our coaching services? Fill in the contact
            form below and we&apos;ll get back to you as soon as possible.
          </p>
        </div>

        {/* Contact Methods */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-16'>
          {/* Email */}
          <div className='bg-gray-50 rounded-lg p-6 border-2 border-gray-200'>
            <MdEmail className='w-8 h-8 text-brand-primary mx-auto mb-3' />
            <h3 className='text-h6 font-semibold mb-2'>Email Us</h3>
            <a
              href='mailto:info@omaniatraining.com'
              className='text-body-base text-brand-primary hover:text-brand-secondary transition-colors'>
              info@omaniatraining.com
            </a>
          </div>

          {/* Phone */}
          <div className='bg-gray-50 rounded-lg p-6 border-2 border-gray-200'>
            <MdPhone className='w-8 h-8 text-brand-primary mx-auto mb-3' />
            <h3 className='text-h6 font-semibold mb-2'>Call Us</h3>
            <a
              href='tel:+447123456789'
              className='text-body-base text-brand-primary hover:text-brand-secondary transition-colors'>
              +44 7123 456789
            </a>
          </div>
        </div>

        {/* Contact Form Placeholder */}
        <div className='max-w-2xl mx-auto mb-16'>
          <h2 className='text-h4 font-semibold mb-6'>Send us a message</h2>
          <div className='bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center'>
            <MdSend className='w-12 h-12 text-gray-400 mx-auto mb-4' />
            <p className='text-body-lg text-gray-500'>Contact Form Coming Soon</p>
            <p className='text-body-sm text-gray-400 mt-2'>
              This is where the contact form will be implemented
            </p>
          </div>
        </div>

        {/* Ready to Apply CTA */}
        <div className='bg-brand-gradient-charcoal-linear rounded-lg p-8 md:p-12 max-w-3xl mx-auto'>
          <h2 className='text-h4 font-semibold text-gradient-primary mb-4'>
            Ready to Start Your Coaching Journey?
          </h2>
          <p className='text-body-lg text-brand-white mb-6'>
            If you&apos;re ready to commit to your fitness goals and want to begin coaching right
            away, submit a full application instead.
          </p>
          <Link
            href='/apply'
            className='inline-block bg-brand-primary hover:bg-brand-secondary text-brand-charcoal font-semibold px-8 py-4 rounded-lg transition-colors text-body-lg'>
            Apply for Coaching
          </Link>
        </div>
      </Container>
    </>
  );
};

export default ContactPage;
