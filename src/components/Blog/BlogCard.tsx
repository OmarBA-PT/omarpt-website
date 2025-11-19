import React from 'react';
import Link from 'next/link';
import { FaUser, FaCalendar } from 'react-icons/fa6';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import UnifiedImage from '@/components/UI/UnifiedImage';

interface BlogCardProps {
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

const BlogCard = (props: BlogCardProps) => {
  const { title, slug, subtitle, author, mainImage, _createdAt, overrideDate, hasOverrideDate } =
    props;

  const formattedDate = formatBlogDate(_createdAt, overrideDate, hasOverrideDate);

  // Don't render if no title (should be filtered out at parent level)
  if (!title) return null;

  const blogPostUrl = slug?.current ? `/blog/${slug.current}` : '#';

  return (
    <Link href={blogPostUrl} className='block w-full h-full'>
      <div className='w-full h-full bg-brand-white-dark rounded-lg shadow-sm overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:scale-103 cursor-pointer group'>
        {/* Blog Post Image */}
        <div className='relative w-full aspect-[4/3] bg-gray-900 overflow-hidden flex-shrink-0'>
          <UnifiedImage
            src={mainImage}
            alt={`${title || 'Blog post'} image`}
            mode='fill'
            objectFit='cover'
            priority
            generateSchema
            schemaContext='blog'
            sizes='(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 60vw'
            sanityWidth={2400}
            quality={95}
            className='transition-all duration-300'
            fallback={
              <div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900'>
                <div className='text-center text-white/70'>
                  <div className='text-h2 mb-2'>📝</div>
                </div>
              </div>
            }
          />
        </div>

        {/* Blog Post Details */}
        <div className='p-6 flex flex-col flex-grow text-left'>
          {/* Title */}
          <h2 className='text-h6 font-medium mb-6 text-brand-secondary transition-all duration-300 leading-tight group-hover:underline line-clamp-2'>
            {title}
          </h2>

          <div className='flex justify-between mb-6'>
            {/* Author */}
            {author && (
              <div className='flex items-center text-body-sm'>
                <FaUser className='mr-2 text-subtle' />
                <span>{author}</span>
              </div>
            )}

            {/* Date */}
            <div className='flex items-center text-body-sm'>
              <FaCalendar className='mr-2 text-subtle' />
              <span className='text-subtle'>{formattedDate}</span>
            </div>
          </div>

          {/* Subtitle */}
          {subtitle && (
            <div className='text-body-base leading-snug line-clamp-3 flex-grow'>{subtitle}</div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
