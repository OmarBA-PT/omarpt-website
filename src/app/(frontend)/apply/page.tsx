import {
  generateMetadata as generatePageMetadata,
  generateCanonicalUrl,
  getBaseUrl,
} from '@/lib/metadata';
import { generateArticleSchema, generateStructuredDataScript } from '@/lib/structuredData';
import BreadcrumbStructuredData from '@/components/StructuredData/BreadcrumbStructuredData';
import { SITE_CONFIG } from '@/lib/constants';
import { getApplyPage } from '@/actions';
import ApplyPageClient from './ApplyPageClient';

export async function generateMetadata() {
  // Fetch apply page data for metadata
  const applyPageData = await getApplyPage();

  // Hard-coded values for now - will eventually come from Sanity
  const ogTitle = 'Apply Now';
  const ogDescription =
    'Take the first step towards achieving your fitness goals. Apply for personalised coaching with Omania Training today.';

  return generatePageMetadata({
    title: applyPageData?.title || ogTitle,
    description: applyPageData?.subtitle || ogDescription,
    siteSettings: null,
    canonicalUrl: generateCanonicalUrl('/apply'),
  });
}

const ApplyPage = async () => {
  const baseUrl = getBaseUrl();

  // Fetch apply page data from Sanity
  const applyPageData = await getApplyPage();

  // Fallback values if Sanity data is not available
  const pageTitle = applyPageData?.title || 'Apply for Coaching';
  const pageSubtitle =
    applyPageData?.subtitle || 'Take the first step towards achieving your fitness goals';

  // Generate breadcrumb data
  const breadcrumbItems = [
    { name: 'Home', url: baseUrl },
    { name: pageTitle, url: `${baseUrl}/apply` },
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

      {/* Client Component */}
      <ApplyPageClient />
    </>
  );
};

export default ApplyPage;
