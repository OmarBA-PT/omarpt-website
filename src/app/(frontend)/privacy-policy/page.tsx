import React from 'react';
import { notFound } from 'next/navigation';
import PageBuilder from '@/components/PageBuilder';
import PageHero from '@/components/Page/PageHero';
import {
  getPrivacyPolicy,
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
  getOrganizationDataFromSiteSettings,
  generateStructuredDataScript,
} from '@/lib/structuredData';
import BreadcrumbStructuredData from '@/components/StructuredData/BreadcrumbStructuredData';
import Breadcrumb from '@/components/UI/Breadcrumb';
import { SITE_CONFIG } from '@/lib/constants';

export async function generateMetadata() {
  const [pageBuilderData, privacyData] = await Promise.all([getPageBuilderData(), getPrivacyPolicy()]);

  const siteSettings = pageBuilderData.siteSettings;

  if (!siteSettings) {
    return {
      title: `Privacy Policy | ${SITE_CONFIG.ORGANIZATION_NAME}`,
      description: 'Privacy policy for our website and how we handle your data',
    };
  }

  const title = privacyData?.title || 'Privacy Policy';

  return generatePageMetadata({
    title,
    description:
      siteSettings.siteDescription || 'Privacy policy for our website and how we handle your data',
    siteSettings,
    canonicalUrl: generateCanonicalUrl('/privacy-policy'),
  });
}

const PrivacyPolicyPage = async () => {
  const [privacyData, pageBuilderData] = await Promise.all([
    getPrivacyPolicy(),
    getPageBuilderData(),
  ]);

  const siteSettings = pageBuilderData.siteSettings;

  // If the page is hidden or doesn't exist, show 404
  if (!privacyData || privacyData.hide) {
    notFound();
  }

  const baseUrl = getBaseUrl();

  // Generate breadcrumb data
  const breadcrumbItems = [
    { name: 'Home', url: baseUrl },
    { name: privacyData.title || 'Privacy Policy', url: `${baseUrl}/privacy-policy` },
  ];

  // Generate Article structured data
  let articleSchema;
  if (siteSettings && privacyData._updatedAt) {
    const organizationData = getOrganizationDataFromSiteSettings(siteSettings, baseUrl);

    articleSchema = generateArticleSchema({
      headline: privacyData.title || 'Privacy Policy',
      description: siteSettings.siteDescription || undefined,
      datePublished: privacyData._updatedAt,
      dateModified: privacyData._updatedAt,
      author: {
        name: siteSettings.siteTitle || SITE_CONFIG.ORGANIZATION_NAME,
        type: 'Organization',
      },
      publisher: organizationData,
      url: `${baseUrl}/privacy-policy`,
    });
  }

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

      {/* Page Hero */}
      <PageHero
        title={privacyData.title || 'Privacy Policy'}
        documentId={privacyData._id}
        documentType={privacyData._type}
      />

      {/* Breadcrumb */}
      <Breadcrumb pageTitle={privacyData.title || 'Privacy Policy'} />

      <Container textAlign='left'>
        {/* Page Content */}
        {privacyData.topText && <p className='font-bold mb-8'>{privacyData.topText}</p>}
        {privacyData.content && (
          <PageBuilder
            content={privacyData.content as any}
            documentId={privacyData._id}
            documentType={privacyData._type}
            pageBuilderData={pageBuilderData}
            alignment='left'
          />
        )}
      </Container>
    </>
  );
};

export default PrivacyPolicyPage;
