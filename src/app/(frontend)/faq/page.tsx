import { notFound } from 'next/navigation';
import PageBuilder from '@/components/PageBuilder';
import PageHero from '@/components/Page/PageHero';
import {
  getFaqPage,
  getPageBuilderData,
} from '@/actions';
import Container from '@/components/Layout/Container';
import {
  generateMetadata as generatePageMetadata,
  generateCanonicalUrl,
  getBaseUrl,
} from '@/lib/metadata';
import {
  generateArticleSchema,
  getOrganizationDataFromSiteSettings,
  generateStructuredDataScript,
} from '@/lib/structuredData';
import BreadcrumbStructuredData from '@/components/StructuredData/BreadcrumbStructuredData';
import Breadcrumb from '@/components/UI/Breadcrumb';
import { SITE_CONFIG } from '@/lib/constants';

export async function generateMetadata() {
  const [pageBuilderData, faqData] = await Promise.all([getPageBuilderData(), getFaqPage()]);

  const siteSettings = pageBuilderData.siteSettings;

  if (!siteSettings) {
    return {
      title: `FAQ | ${SITE_CONFIG.ORGANIZATION_NAME}`,
      description: 'Frequently asked questions about our services',
    };
  }

  const title = faqData?.title || 'FAQ';
  const description = faqData?.subtitle || siteSettings.siteDescription || 'Frequently asked questions about our services';

  return generatePageMetadata({
    title,
    description,
    siteSettings,
    canonicalUrl: generateCanonicalUrl('/faq'),
  });
}

const FAQPage = async () => {
  const [faqData, pageBuilderData] = await Promise.all([
    getFaqPage(),
    getPageBuilderData(),
  ]);

  const siteSettings = pageBuilderData.siteSettings;

  // If the page doesn't exist, show 404
  if (!faqData) {
    notFound();
  }

  const baseUrl = getBaseUrl();

  // Generate breadcrumb data
  const breadcrumbItems = [
    { name: 'Home', url: baseUrl },
    { name: faqData.title || 'FAQ', url: `${baseUrl}/faq` },
  ];

  // Generate Article structured data
  let articleSchema;
  if (siteSettings && faqData._updatedAt) {
    const organizationData = getOrganizationDataFromSiteSettings(siteSettings, baseUrl);

    articleSchema = generateArticleSchema({
      headline: faqData.title || 'FAQ',
      description: faqData.subtitle || siteSettings.siteDescription || undefined,
      datePublished: faqData._updatedAt,
      dateModified: faqData._updatedAt,
      author: {
        name: siteSettings.siteTitle || SITE_CONFIG.ORGANIZATION_NAME,
        type: 'Organization',
      },
      publisher: organizationData,
      url: `${baseUrl}/faq`,
    });
  }

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
        title={faqData.title || 'FAQ'}
        subtTitle={faqData.subtitle}
        documentId={faqData._id}
        documentType={faqData._type}
      />

      {/* Breadcrumb */}
      <Breadcrumb pageTitle={faqData.title || 'FAQ'} />

      <Container textAlign='center'>
        {/* Page Content */}
        {faqData.content && (
          <PageBuilder
            content={faqData.content as any}
            documentId={faqData._id}
            documentType={faqData._type}
            pageBuilderData={pageBuilderData}
            alignment='center'
          />
        )}
      </Container>
    </>
  );
};

export default FAQPage;
