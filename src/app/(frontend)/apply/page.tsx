import {
  generateMetadata as generatePageMetadata,
  generateCanonicalUrl,
  getBaseUrl,
} from '@/lib/metadata';
import { generateArticleSchema, generateStructuredDataScript } from '@/lib/structuredData';
import BreadcrumbStructuredData from '@/components/StructuredData/BreadcrumbStructuredData';
import { SITE_CONFIG } from '@/lib/constants';
import { getApplyPage, getApplyPrivacyStatement, getApplyQuestionnaire, getSiteSettings } from '@/actions';
import { transformQuestionnaireData } from '@/lib/utils/transformQuestionnaireData';
import ApplyPageClient from './ApplyPageClient';

export async function generateMetadata() {
  // Fetch apply page data and site settings for metadata
  const [applyPageData, siteSettings] = await Promise.all([
    getApplyPage(),
    getSiteSettings(),
  ]);

  // Hard-coded fallback values (lowest priority)
  const fallbackTitle = 'Apply Now';
  const fallbackDescription =
    'Take the first step towards achieving your fitness goals. Apply for personalised coaching with Omania Training today.';

  // Priority: Page-specific Sanity data > Hard-coded fallbacks
  const ogTitle = applyPageData?.title || fallbackTitle;
  const ogDescription = applyPageData?.subtitle || fallbackDescription;

  return generatePageMetadata({
    title: ogTitle,
    description: ogDescription,
    siteSettings,
    canonicalUrl: generateCanonicalUrl('/apply'),
  });
}

const ApplyPage = async () => {
  const baseUrl = getBaseUrl();

  // Fetch apply page data from Sanity
  const [applyPageData, applyPrivacyStatement, applyQuestionnaire] = await Promise.all([
    getApplyPage(),
    getApplyPrivacyStatement(),
    getApplyQuestionnaire(),
  ]);

  // Transform questionnaire data from Sanity format to form-compatible format
  const questionnaireSections = transformQuestionnaireData(applyQuestionnaire);

  // Fallback values if Sanity data is not available
  const pageTitle = applyPageData?.title || 'Apply for Coaching';
  const pageSubtitle =
    applyPageData?.subtitle || 'Take the first step towards achieving your fitness goals';

  // Generate breadcrumb data
  const breadcrumbItems = [
    { name: 'Home', url: baseUrl },
    { name: pageTitle, url: `${baseUrl}/apply` },
  ];

  // Generate Article structured data using actual Sanity dates
  const articleSchema = generateArticleSchema({
    headline: pageTitle,
    description: pageSubtitle,
    datePublished: applyPageData?._createdAt || new Date().toISOString(),
    dateModified: applyPageData?._updatedAt || new Date().toISOString(),
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
      <ApplyPageClient
        generalContent={applyPageData}
        privacyStatement={applyPrivacyStatement}
        questionnaireSections={questionnaireSections}
      />
    </>
  );
};

export default ApplyPage;
