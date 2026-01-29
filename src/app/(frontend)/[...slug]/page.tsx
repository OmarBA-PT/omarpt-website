import React from 'react';
import { notFound } from 'next/navigation';
import PageBuilder from '@/components/PageBuilder';
import PageHero from '@/components/Page/PageHero';
import { getPageBySlug, getPageBuilderData } from '@/actions';
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
import { urlFor } from '@/sanity/lib/image';
import Breadcrumb from '@/components/UI/Breadcrumb';
import { getOrganizationName, getOrganizationDescription } from '@/lib/organizationInfo';

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  // Join slug array to create the full path (e.g., ['about', 'team'] -> 'about/team')
  // For single segments, this is just the slug itself
  const slugPath = slug.join('/');
  // For Sanity query, we only use the first segment (top-level pages)
  const pageSlug = slug[0];

  const [pageBuilderData, page] = await Promise.all([getPageBuilderData(), getPageBySlug(pageSlug)]);

  const { seoMetaData, businessContactInfo } = pageBuilderData;
  const orgName = getOrganizationName(businessContactInfo);
  const orgDescription = getOrganizationDescription(businessContactInfo);

  if (!seoMetaData) {
    return {
      title: orgName,
      description: orgDescription,
    };
  }

  // For nested paths (e.g., /about/team), or if page not found, show 404 metadata
  if (!page || slug.length > 1) {
    return {
      title: `Page Not Found | ${orgName}`,
      description: 'The page you are looking for could not be found.',
    };
  }

  return generatePageMetadata({
    title: page.title || undefined,
    description: page.subtitle || seoMetaData.siteDescription || undefined,
    seoMetaData,
    businessContactInfo,
    canonicalUrl: generateCanonicalUrl(`/${slugPath}`),
  });
}

const Page = async ({ params }: { params: Promise<{ slug: string[] }> }) => {
  const { slug } = await params;
  // Join slug array to create the full path
  const slugPath = slug.join('/');
  // For Sanity query, we only use the first segment (top-level pages)
  const pageSlug = slug[0];

  const [page, pageBuilderData] = await Promise.all([
    getPageBySlug(pageSlug),
    getPageBuilderData(),
  ]);

  // For nested paths (e.g., /about/team), or if page not found, trigger 404
  if (!page || slug.length > 1) {
    notFound();
  }

  const { seoMetaData, businessContactInfo } = pageBuilderData;

  const baseUrl = getBaseUrl();

  // Generate breadcrumb data
  const breadcrumbItems = [
    { name: 'Home', url: baseUrl },
    { name: page.title || 'Page', url: `${baseUrl}/${slugPath}` },
  ];

  // Generate Article structured data
  let articleSchema;
  if (seoMetaData && page._createdAt && page._updatedAt) {
    const organizationData = getOrganizationDataFromSeoMetaData(seoMetaData, baseUrl, null, businessContactInfo);

    articleSchema = generateArticleSchema({
      headline: page.title || 'Page',
      description: page.subtitle || undefined,
      image: page.heroImage ? urlFor(page.heroImage).width(1200).height(630).url() : undefined,
      datePublished: page._createdAt,
      dateModified: page._updatedAt,
      author: {
        name: seoMetaData.siteTitle || getOrganizationName(businessContactInfo),
        type: 'Organization',
      },
      publisher: organizationData,
      url: `${baseUrl}/${slugPath}`,
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
        title={page.title || 'Untitled Page'}
        subtTitle={page.subtitle || null}
        documentId={page._id}
        documentType={page._type}
      />

      {/* Breadcrumb */}
      <Breadcrumb pageTitle={page.title || 'Untitled Page'} />

      <Container>
        {/* Page Content */}
        {page.content && (
          <PageBuilder
            content={page.content}
            documentId={page._id}
            documentType={page._type}
            pageBuilderData={pageBuilderData}
          />
        )}
      </Container>
    </>
  );
};

export default Page;
