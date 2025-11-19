import React from 'react';
import { notFound } from 'next/navigation';
import { getBlogPostBySlug, getAdjacentBlogPosts } from '@/actions/blog';
import {
  getCompanyLinks,
  getSiteSettings,
  getContactFormSettings,
  getClients,
  getAllProjects,
} from '@/actions';
import Container from '@/components/Layout/Container';
import Card from '@/components/_blocks/Card';
import PageBuilder from '@/components/PageBuilder';
import { FaUser, FaCalendar } from 'react-icons/fa6';
import UnifiedImage from '@/components/UI/UnifiedImage';
import { urlFor } from '@/sanity/lib/image';
import type { PAGE_QUERYResult } from '@/sanity/types';
import {
  blogHeaderBottomSpacing,
  closingCardSpacing,
  headerHeight,
} from '@/utils/spacingConstants';
import {
  generateMetadata as generatePageMetadata,
  generateCanonicalUrl,
  getBaseUrl,
} from '@/lib/metadata';
import {
  generateBlogPostSchema,
  getOrganizationDataFromSiteSettings,
  generateStructuredDataScript,
} from '@/lib/structuredData';
import BreadcrumbStructuredData from '@/components/StructuredData/BreadcrumbStructuredData';
import { normalizeClosingCardForCard } from '@/utils/closingCardHelpers';
import BlogPostNavigation from '@/components/Blog/BlogPostNavigation';
import CTA from '@/components/UI/CTA';
import Breadcrumb from '@/components/UI/Breadcrumb';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

function formatBlogDate(
  createdAt: string,
  overrideDate?: string | null,
  hasOverrideDate?: boolean | null
): string {
  const date = hasOverrideDate && overrideDate ? new Date(overrideDate) : new Date(createdAt);
  return date
    .toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
    .toUpperCase();
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const [siteSettings, post] = await Promise.all([getSiteSettings(), getBlogPostBySlug(slug)]);

  if (!siteSettings) {
    return {
      title: 'Blog Post | Taupiri Sound',
      description: 'Read our latest article',
    };
  }

  if (!post) {
    return {
      title: 'Blog Post Not Found | Taupiri Sound',
      description: 'The blog post you are looking for could not be found.',
    };
  }

  // Calculate published and modified dates (same logic as in the page component)
  const publishedTime =
    post.hasOverrideDate && post.overrideDate ? post.overrideDate : post._createdAt;
  const modifiedTime = post._updatedAt;

  return generatePageMetadata({
    title: post.title || undefined,
    description: post.subtitle || siteSettings.siteDescription || undefined,
    siteSettings,
    image: post.mainImage?.asset?._ref ? post.mainImage : undefined, // Only pass image if it exists, otherwise use default
    canonicalUrl: generateCanonicalUrl(`/blog/${slug}`),
    publishedTime,
    modifiedTime,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const [
    post,
    companyLinks,
    siteSettings,
    contactFormSettings,
    clientsData,
    adjacentPosts,
    allProjectsData,
  ] = await Promise.all([
    getBlogPostBySlug(slug),
    getCompanyLinks(),
    getSiteSettings(),
    getContactFormSettings(),
    getClients(),
    getAdjacentBlogPosts(slug),
    getAllProjects(),
  ]);

  if (!post) {
    notFound();
  }

  const formattedDate = formatBlogDate(post._createdAt, post.overrideDate, post.hasOverrideDate);
  const baseUrl = getBaseUrl();

  // Generate breadcrumb data
  const breadcrumbItems = [
    { name: 'Home', url: baseUrl },
    { name: 'Blog', url: `${baseUrl}/blog` },
    { name: post.title || 'Blog Post', url: `${baseUrl}/blog/${slug}` },
  ];

  // Generate BlogPosting structured data
  let blogPostSchema;
  if (siteSettings) {
    const publishDate =
      post.hasOverrideDate && post.overrideDate ? post.overrideDate : post._createdAt;
    const modifiedDate = post._updatedAt;

    const organizationData = getOrganizationDataFromSiteSettings(siteSettings, baseUrl);

    blogPostSchema = generateBlogPostSchema({
      headline: post.title || 'Blog Post',
      description: post.subtitle || undefined,
      image: post.mainImage ? urlFor(post.mainImage).width(1200).height(630).url() : undefined,
      datePublished: publishDate,
      dateModified: modifiedDate,
      author: {
        name: post.author || siteSettings.siteTitle || 'Taupiri Sound',
        type: 'Person',
      },
      publisher: organizationData,
      url: `${baseUrl}/blog/${slug}`,
    });
  }

  return (
    <>
      {/* Structured Data */}
      <BreadcrumbStructuredData items={breadcrumbItems} />
      {blogPostSchema && (
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={generateStructuredDataScript(blogPostSchema)}
        />
      )}

      <div className={headerHeight}></div>

      {/* Breadcrumb */}
      <Breadcrumb pageTitle='Blog' pageTitleClickable={true} pageTitleHref='/blog' />

      <Container textAlign='left'>
        {/* Article Header */}
        <div className={`text-left ${blogHeaderBottomSpacing}`}>
          {/* Title */}
          <h1 className='mb-4 text-h1 md:text-h2 text-body leading-tight'>{post.title}</h1>

          {/* Subtitle */}
          {post.subtitle && (
            <p className='mb-6 md:mb-8 text-body-2xl leading-relaxed whitespace-pre-line'>
              {post.subtitle}
            </p>
          )}

          {/* Author and Date */}
          <div className='flex flex-wrap items-center gap-4'>
            {/* Author */}
            {post.author && (
              <div className='flex items-center text-body-base text-subtle'>
                <FaUser className='mr-2' />
                <span>{post.author}</span>
              </div>
            )}

            {/* Date */}
            <div className='flex items-center text-body-base text-subtle'>
              <FaCalendar className='mr-2' />
              <span>{formattedDate}</span>
            </div>
          </div>

          {/* Horizontal line */}
          <hr className='border-t border-subtle' />
        </div>

        {/* Main Image - displayed between horizontal line and content */}
        {post.mainImage && (
          <div className={`'w-full ${blogHeaderBottomSpacing}`}>
            <div className='relative w-full aspect-[16/9] overflow-hidden rounded-lg'>
              <UnifiedImage
                src={post.mainImage}
                alt={post.title || 'Blog post image'}
                mode='fill'
                sizeContext='hero'
                objectFit='cover'
                priority
                generateSchema
                schemaContext='blog'
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw'
                className='rounded-lg'
              />
            </div>
          </div>
        )}

        {/* Article Content Container */}
        {post.content && (
          <div className='bg-brand-white-dark/30 rounded-lg shadow-sm px-6 md:px-16 py-12 md:py-18'>
            <div className='text-left'>
              <PageBuilder
                content={post.content as NonNullable<PAGE_QUERYResult>['content']}
                documentId={post._id}
                documentType='blogPost'
                companyLinks={companyLinks}
                clientsData={clientsData}
                allProjectsData={allProjectsData}
                contactFormSettings={contactFormSettings}
                alignment='left'
              />
            </div>
          </div>
        )}

        {/* Prev & Next Links */}
        <BlogPostNavigation prevPost={adjacentPosts?.prevPost} nextPost={adjacentPosts?.nextPost} />

        <div className='flex justify-center mt-8'>
          <CTA href='/blog' variant='outline-light'>
            Back to blog
          </CTA>
        </div>

        {/* Closing Card */}
        {post.hasClosingCard && post.closingCard && (
          <div className={closingCardSpacing}>
            <Card
              {...normalizeClosingCardForCard(post.closingCard)}
              documentId={post._id}
              documentType={post._type}
              fieldPathPrefix='closingCard'
              siteSettings={siteSettings || undefined}
              companyLinks={companyLinks}
            />
          </div>
        )}
      </Container>
    </>
  );
}
