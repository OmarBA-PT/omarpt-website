import React from 'react';
import { notFound } from 'next/navigation';
import PageBuilder from '@/components/PageBuilder';
import PageHero from '@/components/Page/PageHero';
import {
  getPageBySlug,
  getSiteSettings,
  getCompanyLinks,
  getContactFormSettings,
  getClients,
  getEquipmentList,
  getTeamMembers,
  getAllProjects,
} from '@/actions';
import Container from '@/components/Layout/Container';
import Card from '@/components/_blocks/Card';
import { closingCardSpacing } from '@/utils/spacingConstants';
import { generateMetadata as generatePageMetadata, generateCanonicalUrl, getBaseUrl } from '@/lib/metadata';
import {
  generateArticleSchema,
  getOrganizationDataFromSiteSettings,
  generateStructuredDataScript,
} from '@/lib/structuredData';
import BreadcrumbStructuredData from '@/components/StructuredData/BreadcrumbStructuredData';
import { urlFor } from '@/sanity/lib/image';
import { normalizeClosingCardForCard } from '@/utils/closingCardHelpers';
import Breadcrumb from '@/components/UI/Breadcrumb';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [siteSettings, page] = await Promise.all([getSiteSettings(), getPageBySlug(slug)]);

  if (!siteSettings) {
    return {
      title: 'Page | Taupiri Sound',
      description: 'Discover more about our content',
    };
  }

  if (!page) {
    return {
      title: 'Page Not Found | Taupiri Sound',
      description: 'The page you are looking for could not be found.',
    };
  }

  return generatePageMetadata({
    title: page.title || undefined,
    description: page.subtitle || siteSettings.siteDescription || undefined,
    siteSettings,
    canonicalUrl: generateCanonicalUrl(`/${slug}`),
  });
}

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const [
    page,
    siteSettings,
    companyLinks,
    contactFormSettings,
    clientsData,
    equipmentListData,
    teamMembersData,
    allProjectsData,
  ] = await Promise.all([
    getPageBySlug(slug),
    getSiteSettings(),
    getCompanyLinks(),
    getContactFormSettings(),
    getClients(),
    getEquipmentList(),
    getTeamMembers(),
    getAllProjects(),
  ]);

  if (!page) {
    notFound();
  }

  const baseUrl = getBaseUrl();

  // Generate breadcrumb data
  const breadcrumbItems = [
    { name: 'Home', url: baseUrl },
    { name: page.title || 'Page', url: `${baseUrl}/${slug}` },
  ];

  // Generate Article structured data
  let articleSchema;
  if (siteSettings && page._createdAt && page._updatedAt) {
    const organizationData = getOrganizationDataFromSiteSettings(siteSettings, baseUrl);

    articleSchema = generateArticleSchema({
      headline: page.title || 'Page',
      description: page.subtitle || undefined,
      image: page.heroImage ? urlFor(page.heroImage).width(1200).height(630).url() : undefined,
      datePublished: page._createdAt,
      dateModified: page._updatedAt,
      author: {
        name: siteSettings.siteTitle || 'Taupiri Sound',
        type: 'Organization',
      },
      publisher: organizationData,
      url: `${baseUrl}/${slug}`,
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
        titleTeReo={page.titleTeReo || null}
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
            siteSettings={siteSettings || undefined}
            companyLinks={companyLinks}
            clientsData={clientsData}
            equipmentListData={equipmentListData}
            teamMembersData={teamMembersData}
            allProjectsData={allProjectsData}
            contactFormSettings={contactFormSettings}
          />
        )}

        {/* Closing Card */}
        {page.hasClosingCard && page.closingCard && (
          <div className={closingCardSpacing}>
            <Card
              {...normalizeClosingCardForCard(page.closingCard)}
              documentId={page._id}
              documentType={page._type}
              fieldPathPrefix='closingCard'
              siteSettings={siteSettings || undefined}
              companyLinks={companyLinks}
            />
          </div>
        )}
      </Container>
    </>
  );
};

export default Page;
