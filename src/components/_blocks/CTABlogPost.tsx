import React from 'react';
import Link from 'next/link';
import { FaUser, FaCalendar } from 'react-icons/fa6';
import UnifiedImage from '@/components/UI/UnifiedImage';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { maxCardWidth } from '@/utils/spacingConstants';

// Interface that matches the dereferenced blog post data from GROQ queries
interface DereferencedBlogPost {
  _id: string;
  _createdAt: string;
  title: string | null;
  slug?: { current?: string | null } | null;
  subtitle?: string | null;
  author?: string | null;
  mainImage?: SanityImageSource | null;
  hasOverrideDate?: boolean | null;
  overrideDate?: string | null;
}

// Type for referenced (not dereferenced) blog post
interface ReferencedBlogPost {
  _ref: string;
  _type: 'reference';
}

interface CTABlogPostProps {
  blogPost?: DereferencedBlogPost | ReferencedBlogPost | null;
  className?: string;
}

// Type guard to check if blog post is dereferenced
function isDereferencedBlogPost(
  blogPost: DereferencedBlogPost | ReferencedBlogPost | null | undefined
): blogPost is DereferencedBlogPost {
  return blogPost !== null && blogPost !== undefined && '_id' in blogPost && 'title' in blogPost;
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

const CTABlogPost = ({ blogPost, className = '' }: CTABlogPostProps) => {
  // Don't render if no blog post is selected or if it's not dereferenced
  if (!blogPost || !isDereferencedBlogPost(blogPost)) {
    return null;
  }

  const { title, slug, subtitle, author, mainImage, _createdAt, overrideDate, hasOverrideDate } =
    blogPost;

  // Don't render if essential data is missing
  if (!title) {
    return null;
  }

  const formattedDate = formatBlogDate(_createdAt, overrideDate, hasOverrideDate);
  const imageAlt = (mainImage as { alt?: string })?.alt || `${title} image`;
  const blogPostUrl = slug?.current ? `/blog/${slug.current}` : '#';

  const cardContent = (
    <div
      className={`${maxCardWidth} mx-auto bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden flex flex-col md:flex-row transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer group text-left`}>
      {/* Blog Post Image - Mobile: full width on top, Desktop: left side with 4:3 aspect ratio */}
      <div className='relative w-full md:w-5/12 aspect-[4/3] bg-gray-900 overflow-hidden flex-shrink-0'>
        <UnifiedImage
          src={mainImage}
          alt={imageAlt}
          mode='fill'
          sizeContext='card'
          objectFit='cover'
          sizes='(max-width: 768px) 100vw, 33vw'
          className='transition-all duration-300'
          priority
          fallback={
            <div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900'>
              <div className='text-center text-white/70'>
                <div className='text-h2 mb-2'>📝</div>
              </div>
            </div>
          }
        />
      </div>

      {/* Blog Post Details - Mobile: below image, Desktop: right side */}
      <div className='p-4 md:p-6 flex flex-col items-start'>
        {/* Title */}
        <p className='text-h6 font-medium mb-3 text-gray-800 transition-all duration-300 leading-tight group-hover:underline line-clamp-2'>
          {title}
        </p>

        {/* Author and Date */}
        <div className='flex justify-between items-center w-full sm:w-auto gap-4 mb-3'>
          {/* Author */}
          {author && (
            <div className='flex items-center text-body-sm'>
              <FaUser className='mr-2 text-brand-secondary flex-shrink-0' />
              <span>{author}</span>
            </div>
          )}

          {/* Date */}
          <div className='flex items-center text-body-sm'>
            <FaCalendar className='mr-2 text-brand-secondary flex-shrink-0' />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Subtitle */}
        {subtitle && <div className='leading-snug line-clamp-3 mb-4'>{subtitle}</div>}

        {/* Read More Link */}
        <div className='text-brand-secondary font-semibold text-body-sm group-hover:underline'>
          Read more →
        </div>
      </div>
    </div>
  );

  // Wrap the entire card in a Next.js Link
  return (
    <div className={className}>
      <Link
        href={blogPostUrl}
        className='block w-full h-full text-inherit no-underline'
        aria-label={`Read blog post: ${title}`}>
        {cardContent}
      </Link>
    </div>
  );
};

export default CTABlogPost;
