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
  generateFAQPageSchema,
  getOrganizationDataFromSiteSettings,
  generateStructuredDataScript,
  FAQItem,
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
      description: 'Frequently asked questions about my services',
    };
  }

  const title = faqData?.title || 'FAQ';
  const description = faqData?.subtitle || siteSettings.siteDescription || 'Frequently asked questions about my services';

  return generatePageMetadata({
    title,
    description,
    siteSettings,
    canonicalUrl: generateCanonicalUrl('/faq'),
  });
}

/**
 * Recursively extracts FAQ items from page content.
 * Searches through all content blocks including nested structures.
 */
function extractFAQItemsFromContent(content: unknown[]): FAQItem[] {
  const faqItems: FAQItem[] = [];

  const processBlock = (block: unknown) => {
    if (!block || typeof block !== 'object') return;

    const typedBlock = block as { _type?: string; faqItems?: Array<{ question?: string; answer?: string }>; content?: unknown[] };

    // Check if this is an FAQ block
    if (typedBlock._type === 'faqBlock' && Array.isArray(typedBlock.faqItems)) {
      for (const item of typedBlock.faqItems) {
        if (item.question && item.answer) {
          faqItems.push({
            question: item.question,
            answer: item.answer,
          });
        }
      }
    }

    // Recursively process nested content
    if (Array.isArray(typedBlock.content)) {
      for (const nestedBlock of typedBlock.content) {
        processBlock(nestedBlock);
      }
    }
  };

  for (const block of content) {
    processBlock(block);
  }

  return faqItems;
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

  // Extract FAQ items from page content for FAQPage schema
  const faqItems = faqData.content ? extractFAQItemsFromContent(faqData.content as unknown[]) : [];
  const faqPageSchema = generateFAQPageSchema(faqItems);

  // Generate Article structured data
  let articleSchema;
  if (siteSettings && faqData._updatedAt) {
    const organizationData = getOrganizationDataFromSiteSettings(siteSettings, baseUrl);

    articleSchema = generateArticleSchema({
      headline: faqData.title || 'FAQ',
      description: faqData.subtitle || siteSettings.siteDescription || undefined,
      datePublished: faqData._createdAt || faqData._updatedAt,
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
      {faqPageSchema && (
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={generateStructuredDataScript(faqPageSchema)}
        />
      )}
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
