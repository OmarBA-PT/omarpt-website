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
import { MdEmail, MdPhone, MdMessage } from 'react-icons/md';
import ContactForm from '@/components/Forms/ContactForm/ContactForm';
import { getContactFormSettings, getContactPage } from '@/actions';
import CardLight from '@/components/CardLight/CardLight';
import ExpandingContentWrapper from '@/components/UI/ExpandingContentWrapper';
import { maxCardWidth } from '@/utils/spacingConstants';

export async function generateMetadata() {
  // Fetch contact page data for metadata
  const contactPageData = await getContactPage();

  return generatePageMetadata({
    title: contactPageData?.title || 'Contact Us',
    description:
      contactPageData?.subtitle ||
      "Get in touch with us for general enquiries or apply for coaching if you're ready to start your fitness journey.",
    siteSettings: null,
    canonicalUrl: generateCanonicalUrl('/contact'),
  });
}

const ContactPage = async () => {
  const baseUrl = getBaseUrl();

  // Fetch contact page data and form settings from Sanity
  const [contactPageData, contactFormSettings] = await Promise.all([
    getContactPage(),
    getContactFormSettings(),
  ]);

  // Fallback values if Sanity data is not available
  const pageTitle = contactPageData?.title || 'Contact Us';
  const pageSubtitle =
    contactPageData?.subtitle ||
    'Get in touch for general enquiries or start your coaching journey';

  // Generate breadcrumb data
  const breadcrumbItems = [
    { name: 'Home', url: baseUrl },
    { name: pageTitle, url: `${baseUrl}/contact` },
  ];

  // Generate Article structured data
  const articleSchema = generateArticleSchema({
    headline: pageTitle,
    description: pageSubtitle,
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
      <PageHero title={pageTitle} subtTitle={pageSubtitle} />

      {/* Breadcrumb */}
      <Breadcrumb pageTitle={pageTitle} />

      <Container textAlign='center'>
        {/* Introduction */}
        <div className='max-w-3xl mx-auto mb-12'>
          <p className='text-body-lg'>
            Have a question or want to learn more about our coaching services? Get in touch using
            any method below and we&apos;ll get back to you as soon as possible.
          </p>
        </div>

        {/* Contact Methods */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 mx-auto mb-16 ${maxCardWidth}`}>
          {/* Contact Form */}
          <CardLight className='md:col-span-2' title='Send me a message' icon={MdMessage}>
            <p className='mb-4'>Submit your enquiry using my contact form.</p>

            <ExpandingContentWrapper
              expandLabel='Show Contact Form'
              collapseLabel='Hide Contact Form'
              showOnDesktop={true}
              alwaysCentered={true}>
              <ContactForm className='py-8' settings={contactFormSettings} />
            </ExpandingContentWrapper>
          </CardLight>

          {/* Email */}
          <CardLight title='Email Us' icon={MdEmail}>
            <a
              href={SITE_CONFIG.ORGANIZATION_EMAIL.link}
              className='text-body-base hover:text-brand-secondary transition-colors'>
              {SITE_CONFIG.ORGANIZATION_EMAIL.value}
            </a>
          </CardLight>

          {/* Phone */}
          <CardLight title='Call Us' icon={MdPhone}>
            <a
              href={SITE_CONFIG.ORGANIZATION_PHONE.link}
              className='text-body-base hover:text-brand-secondary transition-colors'>
              {SITE_CONFIG.ORGANIZATION_PHONE.value}
            </a>
          </CardLight>
        </div>

        {/* Ready to Apply CTA */}
        <div
          className={`bg-brand-gradient-charcoal-linear rounded-lg p-8 md:p-12 max-w-3xl mx-auto ${maxCardWidth}`}>
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
