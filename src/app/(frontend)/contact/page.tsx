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
import { getContactFormSettings, getContactGeneralContent, getPageBuilderData } from '@/actions';
import { getOrganizationName } from '@/lib/organizationInfo';
import CardLight from '@/components/UI/CardLight';
import ExpandingContentWrapper from '@/components/UI/ExpandingContentWrapper';
import { maxCardWidth } from '@/utils/spacingConstants';
import CardGradient from '@/components/UI/CardGradient';

export async function generateMetadata() {
  // Fetch contact page data and page builder data for metadata
  const [contactPageData, pageBuilderData] = await Promise.all([
    getContactGeneralContent(),
    getPageBuilderData(),
  ]);

  const { seoMetaData, businessContactInfo } = pageBuilderData;

  // Hard-coded fallback values (lowest priority)
  const fallbackTitle = 'Contact Me';
  const fallbackDescription =
    'Get in touch with Omania Training for general enquiries or to discuss your fitness goals and coaching options.';

  // Priority: Page-specific Sanity data > Hard-coded fallbacks
  const ogTitle = contactPageData?.title || fallbackTitle;
  const ogDescription = contactPageData?.subtitle || fallbackDescription;

  return generatePageMetadata({
    title: ogTitle,
    description: ogDescription,
    seoMetaData,
    businessContactInfo,
    canonicalUrl: generateCanonicalUrl('/contact'),
  });
}

const ContactPage = async () => {
  const baseUrl = getBaseUrl();

  // Fetch contact page data, form settings, and page builder data from Sanity
  const [contactPageData, contactFormSettings, pageBuilderData] = await Promise.all([
    getContactGeneralContent(),
    getContactFormSettings(),
    getPageBuilderData(),
  ]);

  const { businessContactInfo } = pageBuilderData;
  const orgName = getOrganizationName(businessContactInfo);

  // Fallback values if Sanity data is not available
  const pageTitle = contactPageData?.title || 'Contact Me';
  const pageSubtitle =
    contactPageData?.subtitle ||
    'Get in touch for general enquiries or start your coaching journey';

  // Introduction text
  const introduction =
    contactPageData?.introduction ||
    "Have a question or want to learn more about my coaching services? Get in touch using any method below and I'll get back to you as soon as possible.";

  // Contact card titles
  const emailTitle = contactPageData?.emailTitle || 'Email me';
  const phoneTitle = contactPageData?.phoneTitle || 'Call me';

  // Contact form card data
  const formTitle = contactFormSettings?.formTitle || 'Send me a message';
  const formSubtitle =
    contactFormSettings?.formSubtitle || 'Submit your enquiry using my contact form.';

  // Closing card data
  const closingCardTitle =
    contactPageData?.closingCardTitle || 'Ready to start your coaching journey?';
  const closingCardBody =
    contactPageData?.closingCardBody ||
    "If you're ready to commit to your fitness goals and want to begin coaching right away, submit a full application instead.";
  const closingCardCtaText = contactPageData?.closingCardCtaText || 'Apply for Coaching';

  // Compute the closing card href
  let closingCardHref = '/apply'; // default fallback
  if (contactPageData?.linkType === 'external' && contactPageData?.externalUrl) {
    closingCardHref = contactPageData.externalUrl;
  } else if (contactPageData?.linkType === 'internal') {
    const internalHref = contactPageData?.internalLink?.href || '/';
    const sectionId = contactPageData?.pageSectionId;
    closingCardHref = sectionId ? `${internalHref}#${sectionId}` : internalHref;
  }

  // Generate breadcrumb data
  const breadcrumbItems = [
    { name: 'Home', url: baseUrl },
    { name: pageTitle, url: `${baseUrl}/contact` },
  ];

  // Generate Article structured data using actual Sanity dates
  const articleSchema = generateArticleSchema({
    headline: pageTitle,
    description: pageSubtitle,
    datePublished: contactPageData?._createdAt || new Date().toISOString(),
    dateModified: contactPageData?._updatedAt || new Date().toISOString(),
    author: {
      name: orgName,
      type: 'Organization',
    },
    publisher: {
      name: orgName,
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
          <p className='text-body-lg'>{introduction}</p>
        </div>

        {/* Contact Methods */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 mx-auto mb-16 ${maxCardWidth}`}>
          {/* Contact Form */}
          <CardLight
            id='contact-form'
            showBorder
            className='md:col-span-2'
            title={formTitle}
            icon={MdMessage}>
            <p className='mb-4'>{formSubtitle}</p>

            <ExpandingContentWrapper
              expandLabel='Show Contact Form'
              collapseLabel='Hide Contact Form'
              showOnDesktop={true}
              alwaysCentered={true}>
              <ContactForm className='py-8' settings={contactFormSettings} />
            </ExpandingContentWrapper>
          </CardLight>

          {/* Email */}
          <CardLight title={emailTitle} icon={MdEmail}>
            <a
              href={SITE_CONFIG.ORGANIZATION_EMAIL.link}
              className='text-body-base hover:text-brand-secondary transition-colors'>
              {SITE_CONFIG.ORGANIZATION_EMAIL.value}
            </a>
          </CardLight>

          {/* Phone */}
          <CardLight title={phoneTitle} icon={MdPhone}>
            <a
              href={SITE_CONFIG.ORGANIZATION_PHONE.link}
              className='text-body-base hover:text-brand-secondary transition-colors'>
              {SITE_CONFIG.ORGANIZATION_PHONE.value}
            </a>
          </CardLight>
        </div>

        {/* Ready to Apply CTA */}
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

export default ContactPage;
