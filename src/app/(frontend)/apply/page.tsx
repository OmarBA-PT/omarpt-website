import {
  generateMetadata as generatePageMetadata,
  generateCanonicalUrl,
} from '@/lib/metadata';
import {
  getApplyPage,
  getApplyPrivacyStatement,
  getApplyQuestionnaire,
  getPageBuilderData,
} from '@/actions';
import ApplyPageContent from '@/components/pages/ApplyPageContent';

export async function generateMetadata() {
  // Fetch apply page data and page builder data for metadata
  const [applyPageData, pageBuilderData] = await Promise.all([
    getApplyPage(),
    getPageBuilderData(),
  ]);

  const { seoMetaData, businessContactInfo } = pageBuilderData;

  // Hard-coded fallback values (lowest priority)
  const fallbackTitle = 'Apply Now';
  const fallbackDescription = '';

  // Priority: Page-specific Sanity data > Hard-coded fallbacks
  const ogTitle = applyPageData?.title || fallbackTitle;
  const ogDescription = applyPageData?.subtitle || fallbackDescription;

  return generatePageMetadata({
    title: ogTitle,
    description: ogDescription,
    seoMetaData,
    businessContactInfo,
    canonicalUrl: generateCanonicalUrl('/apply'),
  });
}

const ApplyPage = async () => {
  // Fetch apply page data from Sanity
  const [applyPageData, applyPrivacyStatement, applyQuestionnaire, pageBuilderData] =
    await Promise.all([
      getApplyPage(),
      getApplyPrivacyStatement(),
      getApplyQuestionnaire(),
      getPageBuilderData(),
    ]);

  return (
    <ApplyPageContent
      applyPageData={applyPageData}
      applyPrivacyStatement={applyPrivacyStatement}
      applyQuestionnaire={applyQuestionnaire}
      pageBuilderData={pageBuilderData}
    />
  );
};

export default ApplyPage;
