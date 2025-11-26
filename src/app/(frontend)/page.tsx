import React from 'react';
import PageBuilder from '@/components/PageBuilder';
import Hero from '@/components/HomeHero/Hero';
import { getHomePage, getSiteSettings, getCompanyLinks, getContactFormSettings } from '@/actions';
import { generateMetadata as generatePageMetadata, generateCanonicalUrl } from '@/lib/metadata';
import { SITE_CONFIG } from '@/lib/constants';

export async function generateMetadata() {
  const siteSettings = await getSiteSettings();
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
  const [page, siteSettings, companyLinks, contactFormSettings] = await Promise.all([
    getHomePage(),
    getSiteSettings(),
    getCompanyLinks(),
    getContactFormSettings(),
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
          siteSettings={siteSettings || undefined}
          companyLinks={companyLinks}
          contactFormSettings={contactFormSettings}
          alignment='center'
        />
      )}
    </>
  );
};

export default Page;
