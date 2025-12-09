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
  getSiteSettings,
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
  getOrganizationDataFromSiteSettings,
  getWebSiteDataFromSiteSettings,
  getLocalBusinessDataFromSiteSettings,
  generateStructuredDataScript,
} from '@/lib/structuredData';
import { SITE_CONFIG } from '@/lib/constants';

export async function generateMetadata() {
  const siteSettings = await getSiteSettings();
  if (!siteSettings) {
    return {
      title: `${SITE_CONFIG.ORGANIZATION_NAME} | ${SITE_CONFIG.ORGANIZATION_DESCRIPTION}`,
      description: `Welcome to ${SITE_CONFIG.ORGANIZATION_NAME}`,
    };
  }

  return generateDefaultMetadata({
    siteSettings,
    image: siteSettings.defaultOgImage, // Set default OG image at layout level
  });
}

const FrontendLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const headerData = await getHeader();
  const footerData = await getFooter();
  const siteSettingsData = await getSiteSettings();
  const companyLinksData = await getCompanyLinks();
  const legalPagesVisibilityData = await getLegalPagesVisibility();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || SITE_CONFIG.PRODUCTION_DOMAIN;

  // Generate structured data if site settings are available
  let organizationSchema;
  let webSiteSchema;
  let localBusinessSchema;

  if (siteSettingsData) {
    const organizationData = getOrganizationDataFromSiteSettings(siteSettingsData, baseUrl);
    const webSiteData = getWebSiteDataFromSiteSettings(siteSettingsData, baseUrl);
    const localBusinessData = getLocalBusinessDataFromSiteSettings(siteSettingsData, baseUrl);

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
              <Header headerData={headerData} />
              <main id='main-content' className='flex-1 min-h-screen'>
                {children}
              </main>
              <Footer
                footerData={footerData}
                companyLinksData={companyLinksData}
                legalPagesVisibilityData={legalPagesVisibilityData}
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
