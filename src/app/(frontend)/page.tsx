import PageBuilder from '@/components/PageBuilder';
import Hero from '@/components/HomeHero/Hero';
import { getHomePageHero, getHomePageSections, getPageBuilderData } from '@/actions';
import { generateMetadata as generatePageMetadata, generateCanonicalUrl } from '@/lib/metadata';
import type { PAGE_QUERYResult } from '@/sanity/types';
import { getOrganizationName, getOrganizationDescription } from '@/lib/organizationInfo';

export async function generateMetadata() {
  const pageBuilderData = await getPageBuilderData();
  const { seoMetaData, businessContactInfo } = pageBuilderData;

  const orgName = getOrganizationName(businessContactInfo);
  const orgDescription = getOrganizationDescription(businessContactInfo);

  if (!seoMetaData) {
    return {
      title: orgName,
      description: orgDescription,
    };
  }

  return generatePageMetadata({
    seoMetaData,
    businessContactInfo,
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
