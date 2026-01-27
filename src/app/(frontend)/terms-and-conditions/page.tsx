import React from 'react';
import { notFound } from 'next/navigation';
import PageBuilder from '@/components/PageBuilder';
import PageHero from '@/components/Page/PageHero';
import { getTermsAndConditions, getPageBuilderData } from '@/actions';
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
import PageSection from '@/components/Layout/PageSection';

export async function generateMetadata() {
  const [pageBuilderData, termsData] = await Promise.all([
    getPageBuilderData(),
    getTermsAndConditions(),
  ]);

  const seoMetaData = pageBuilderData.seoMetaData;

  if (!seoMetaData) {
    return {
      title: `Terms & Conditions | ${SITE_CONFIG.ORGANIZATION_NAME}`,
      description: 'Terms and conditions for using my website and services',
    };
  }

  const title = termsData?.title || 'Terms & Conditions';

  return generatePageMetadata({
    title,
    description:
      seoMetaData.siteDescription || 'Terms and conditions for using my website and services',
    seoMetaData,
    canonicalUrl: generateCanonicalUrl('/terms-and-conditions'),
  });
}

const TermsAndConditionsPage = async () => {
  const [termsData, pageBuilderData] = await Promise.all([
    getTermsAndConditions(),
    getPageBuilderData(),
  ]);

  const seoMetaData = pageBuilderData.seoMetaData;

  // If the page is hidden or doesn't exist, show 404
  if (!termsData || termsData.hide) {
    notFound();
  }

  const baseUrl = getBaseUrl();

  // Generate breadcrumb data
  const breadcrumbItems = [
    { name: 'Home', url: baseUrl },
    { name: termsData.title || 'Terms & Conditions', url: `${baseUrl}/terms-and-conditions` },
  ];

  // Generate Article structured data
  let articleSchema;
  if (seoMetaData && termsData._updatedAt) {
    const organizationData = getOrganizationDataFromSeoMetaData(seoMetaData, baseUrl);

    articleSchema = generateArticleSchema({
      headline: termsData.title || 'Terms & Conditions',
      description: seoMetaData.siteDescription || undefined,
      datePublished: termsData._updatedAt,
      dateModified: termsData._updatedAt,
      author: {
        name: seoMetaData.siteTitle || SITE_CONFIG.ORGANIZATION_NAME,
        type: 'Organization',
      },
      publisher: organizationData,
      url: `${baseUrl}/terms-and-conditions`,
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
        title={termsData.title || 'Terms & Conditions'}
        documentId={termsData._id}
        documentType={termsData._type}
      />

      {/* Breadcrumb */}
      <Breadcrumb pageTitle={termsData.title || 'Terms & Conditions'} />

      <Container textAlign='left'>
        {/* Page Content */}
        {termsData.topText && <p className='font-bold mb-8'>{termsData.topText}</p>}
        {termsData.content && (
          <PageBuilder
            content={termsData.content as any}
            documentId={termsData._id}
            documentType={termsData._type}
            pageBuilderData={pageBuilderData}
            alignment='left'
          />
        )}
        {/* Hard-coded Contact Information Section */}
        <PageSection title='Contact Information'>
          <div className='space-y-4'>
            <p>If you have questions about these Terms &amp; Conditions, please contact me:</p>
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

export default TermsAndConditionsPage;
