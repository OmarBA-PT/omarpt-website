import PageBuilder from '@/components/PageBuilder';
import Hero from '@/components/HomeHero/Hero';
import { getHomePageHero, getHomePageSections, getPageBuilderData } from '@/actions';
import { generateMetadata as generatePageMetadata, generateCanonicalUrl } from '@/lib/metadata';
import { SITE_CONFIG } from '@/lib/constants';
import type { PAGE_QUERYResult } from '@/sanity/types';

export async function generateMetadata() {
  const pageBuilderData = await getPageBuilderData();
  const seoMetaData = pageBuilderData.seoMetaData;

  if (!seoMetaData) {
    return {
      title: SITE_CONFIG.ORGANIZATION_NAME,
      description: SITE_CONFIG.ORGANIZATION_DESCRIPTION,
    };
  }

  return generatePageMetadata({
    seoMetaData,
    canonicalUrl: generateCanonicalUrl('/'),
  });
}

const Page = async () => {
  const [hero, sections, pageBuilderData] = await Promise.all([
    getHomePageHero(),
    getHomePageSections(),
    getPageBuilderData(),
  ]);

  if (!hero) {
    return <div>Page not found</div>;
  }

  return (
    <>
      {/* Hero Section */}
      <Hero
        heroStyle={hero.heroStyle}
        heroImages={hero.heroImages}
        heroVideo={hero.heroVideo}
        heroImageTransitionDuration={hero.heroImageTransitionDuration}
        h1Title={hero.h1Title}
        mainTitle={hero.mainTitle}
        subTitle={hero.subTitle}
        heroCallToActionList={hero.heroCallToActionList}
        hideScrollIndicator={hero.hideScrollIndicator}
        heroDefaultContentPosition={hero.heroDefaultContentPosition}
        heroContentPosition={hero.heroContentPosition}
        documentId={hero._id}
        documentType={hero._type}
      />

      {/* Additional Page Builder Content */}
      {sections?.content && (
        <PageBuilder
          content={sections.content as NonNullable<PAGE_QUERYResult>['content']}
          documentId={sections._id}
          documentType={sections._type}
          pageBuilderData={pageBuilderData}
          alignment='center'
        />
      )}
    </>
  );
};

export default Page;
