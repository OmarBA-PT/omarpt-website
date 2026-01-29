import React from 'react';
import { draftMode } from 'next/headers';
import { SanityLive } from '@/sanity/lib/live';
import '../globals.css';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import DisableDraftMode from '@/components/DisableDraftMode';
import NavigationScroll from '@/components/NavigationScroll';
import PageReadyTrigger from '@/components/PageReadyTrigger';
import { VisualEditingProvider } from '@/components/VisualEditingProvider';
import {
  getHeader,
  getFooter,
  getSeoMetaData,
  getBusinessContactInfo,
  getCompanyLinks,
  getLegalPagesVisibility,
} from '@/actions';
import { PageLoadProvider } from '@/contexts/PageLoadContext';
import { HeaderProvider } from '@/contexts/HeaderContext';
import { ColorProvider } from '@/contexts/ColorContext'; // TEMPORARY_DEV: Color switching for testing
import { HeroStyleProvider } from '@/contexts/HeroStyleContext'; // TEMPORARY_DEV: Hero style switching for testing
import { generateMetadata as generateDefaultMetadata } from '@/lib/metadata';
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateLocalBusinessSchema,
  getOrganizationDataFromSeoMetaData,
  getWebSiteDataFromSeoMetaData,
  getLocalBusinessDataFromSeoMetaData,
  generateStructuredDataScript,
} from '@/lib/structuredData';
import { SITE_CONFIG } from '@/lib/constants';
import { getOrganizationName, getOrganizationDescription } from '@/lib/organizationInfo';

export async function generateMetadata() {
  const [seoMetaData, businessContactInfo] = await Promise.all([
    getSeoMetaData(),
    getBusinessContactInfo(),
  ]);

  const orgName = getOrganizationName(businessContactInfo);
  const orgDescription = getOrganizationDescription(businessContactInfo);

  if (!seoMetaData) {
    return {
      title: `${orgName} | ${orgDescription}`,
      description: `Welcome to ${orgName}`,
    };
  }

  return generateDefaultMetadata({
    seoMetaData,
    businessContactInfo,
    image: seoMetaData.defaultOgImage, // Set default OG image at layout level
  });
}

const FrontendLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [headerData, footerData, seoMetaDataResult, businessContactInfoData, companyLinksData, legalPagesVisibilityData] = await Promise.all([
    getHeader(),
    getFooter(),
    getSeoMetaData(),
    getBusinessContactInfo(),
    getCompanyLinks(),
    getLegalPagesVisibility(),
  ]);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || SITE_CONFIG.PRODUCTION_DOMAIN;

  // Get organization name for passing to client components
  const orgName = getOrganizationName(businessContactInfoData);

  // Generate structured data if SEO meta data is available
  let organizationSchema;
  let webSiteSchema;
  let localBusinessSchema;

  if (seoMetaDataResult) {
    const organizationData = getOrganizationDataFromSeoMetaData(
      seoMetaDataResult,
      baseUrl,
      companyLinksData,
      businessContactInfoData
    );
    const webSiteData = getWebSiteDataFromSeoMetaData(seoMetaDataResult, baseUrl, businessContactInfoData);
    const localBusinessData = getLocalBusinessDataFromSeoMetaData(
      seoMetaDataResult,
      baseUrl,
      companyLinksData,
      businessContactInfoData
    );

    organizationSchema = generateOrganizationSchema(organizationData);
    webSiteSchema = generateWebSiteSchema(webSiteData);
    localBusinessSchema = generateLocalBusinessSchema(localBusinessData);
  }

  return (
    <ColorProvider>
      <HeroStyleProvider>
        <PageLoadProvider>
          <HeaderProvider>
            <NavigationScroll />
            <PageReadyTrigger />

            {/* Structured Data */}
            {organizationSchema && (
              <script
                type='application/ld+json'
                dangerouslySetInnerHTML={generateStructuredDataScript(organizationSchema)}
              />
            )}
            {webSiteSchema && (
              <script
                type='application/ld+json'
                dangerouslySetInnerHTML={generateStructuredDataScript(webSiteSchema)}
              />
            )}
            {localBusinessSchema && (
              <script
                type='application/ld+json'
                dangerouslySetInnerHTML={generateStructuredDataScript(localBusinessSchema)}
              />
            )}

            <div className='min-h-screen flex flex-col'>
              <Header headerData={headerData} organizationName={orgName} />
              <main id='main-content' className='flex-1 min-h-screen'>
                {children}
              </main>
              <Footer
                footerData={footerData}
                companyLinksData={companyLinksData}
                legalPagesVisibilityData={legalPagesVisibilityData}
                organizationName={orgName}
                businessContactInfo={businessContactInfoData}
              />
              {(await draftMode()).isEnabled && (
                <>
                  <SanityLive />
                  <VisualEditingProvider />
                  <DisableDraftMode />
                </>
              )}
            </div>
          </HeaderProvider>
        </PageLoadProvider>
      </HeroStyleProvider>
    </ColorProvider>
  );
};

export default FrontendLayout;
