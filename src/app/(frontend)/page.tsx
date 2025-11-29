import PageBuilder from '@/components/PageBuilder';
import Hero from '@/components/HomeHero/Hero';
import { getHomePage, getPageBuilderData } from '@/actions';
import { generateMetadata as generatePageMetadata, generateCanonicalUrl } from '@/lib/metadata';
import { SITE_CONFIG } from '@/lib/constants';

export async function generateMetadata() {
  const pageBuilderData = await getPageBuilderData();
  const siteSettings = pageBuilderData.siteSettings;

  if (!siteSettings) {
    return {
      title: SITE_CONFIG.ORGANIZATION_NAME,
      description: SITE_CONFIG.ORGANIZATION_DESCRIPTION,
    };
  }

  return generatePageMetadata({
    siteSettings,
    canonicalUrl: generateCanonicalUrl('/'),
  });
}

const Page = async () => {
  const [page, pageBuilderData] = await Promise.all([
    getHomePage(),
    getPageBuilderData(),
  ]);

  if (!page) {
    return <div>Page not found</div>;
  }

  return (
    <>
      {/* Hero Section */}
      <Hero
        heroStyle={page.heroStyle}
        heroImages={page.heroImages}
        heroVideo={page.heroVideo}
        heroImageTransitionDuration={page.heroImageTransitionDuration}
        h1Title={page.h1Title}
        mainTitle={page.mainTitle}
        subTitle={page.subTitle}
        heroCallToActionList={page.heroCallToActionList}
        hideScrollIndicator={page.hideScrollIndicator}
        heroDefaultContentPosition={page.heroDefaultContentPosition}
        heroContentPosition={page.heroContentPosition}
        documentId={page._id}
        documentType={page._type}
      />

      {/* Additional Page Builder Content */}
      {page.content && (
        <PageBuilder
          content={page.content as any}
          documentId={page._id}
          documentType={page._type}
          pageBuilderData={pageBuilderData}
          alignment='center'
        />
      )}
    </>
  );
};

export default Page;
