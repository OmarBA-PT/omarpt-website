import React from 'react';
import { notFound } from 'next/navigation';
import PageBuilder from '@/components/PageBuilder';
import PageHero from '@/components/Page/PageHero';
import { getPrivacyPolicy, getPageBuilderData } from '@/actions';
import Container from '@/components/Layout/Container';
import {
  generateMetadata as generatePageMetadata,
  generateCanonicalUrl,
  getBaseUrl,
} from '@/lib/metadata';
import {
  generateArticleSchema,
  getOrganizationDataFromSeoMetaData,
  generateStructuredDataScript,
} from '@/lib/structuredData';
import BreadcrumbStructuredData from '@/components/StructuredData/BreadcrumbStructuredData';
import Breadcrumb from '@/components/UI/Breadcrumb';
import { SITE_CONFIG } from '@/lib/constants';
import { getOrganizationName } from '@/lib/organizationInfo';
import PageSection from '@/components/Layout/PageSection';

export async function generateMetadata() {
  const [pageBuilderData, privacyData] = await Promise.all([
    getPageBuilderData(),
    getPrivacyPolicy(),
  ]);

  const { seoMetaData, businessContactInfo } = pageBuilderData;
  const orgName = getOrganizationName(businessContactInfo);

  if (!seoMetaData) {
    return {
      title: `Privacy Policy | ${orgName}`,
      description: 'Privacy policy for my website and how I handle your data',
    };
  }

  const title = privacyData?.title || 'Privacy Policy';

  return generatePageMetadata({
    title,
    description:
      seoMetaData.siteDescription || 'Privacy policy for my website and how I handle your data',
    seoMetaData,
    businessContactInfo,
    canonicalUrl: generateCanonicalUrl('/privacy-policy'),
  });
}

const PrivacyPolicyPage = async () => {
  const [privacyData, pageBuilderData] = await Promise.all([
    getPrivacyPolicy(),
    getPageBuilderData(),
  ]);

  const { seoMetaData, businessContactInfo } = pageBuilderData;
  const orgName = getOrganizationName(businessContactInfo);

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
  if (seoMetaData && privacyData._updatedAt) {
    const organizationData = getOrganizationDataFromSeoMetaData(seoMetaData, baseUrl, null, businessContactInfo);

    articleSchema = generateArticleSchema({
      headline: privacyData.title || 'Privacy Policy',
      description: seoMetaData.siteDescription || undefined,
      datePublished: privacyData._updatedAt,
      dateModified: privacyData._updatedAt,
      author: {
        name: seoMetaData.siteTitle || orgName,
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
        {/* Hard-coded Contact Information Section */}
        <PageSection title='Contact Information'>
          <div className='space-y-4'>
            <p>If you have questions about this Privacy Policy, please contact me:</p>
            <p>
              <strong>Email:</strong>{' '}
              <a
                href={SITE_CONFIG.ORGANIZATION_EMAIL.link}
                className='text-brand-primary hover:underline'>
                {SITE_CONFIG.ORGANIZATION_EMAIL.value}
              </a>
            </p>
            <p>
              <strong>Phone:</strong>{' '}
              <a
                href={SITE_CONFIG.ORGANIZATION_PHONE.link}
                className='text-brand-primary hover:underline'>
                {SITE_CONFIG.ORGANIZATION_PHONE.value}
              </a>
            </p>
          </div>
        </PageSection>
      </Container>
    </>
  );
};

export default PrivacyPolicyPage;
