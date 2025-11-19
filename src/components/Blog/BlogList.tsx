import React from 'react';
import BlogCard from './BlogCard';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

interface BlogPost {
  _id: string;
  _createdAt: string;
  title: string | null;
  slug?: { current?: string | null } | null;
  subtitle?: string | null;
  author?: string | null;
  heroImage?: SanityImageSource | null;
  hasOverrideDate?: boolean | null;
  overrideDate?: string | null;
  hasClosingCard?: boolean | null;
  closingCard?: unknown;
}

interface BlogListProps {
  posts: BlogPost[];
  noPostsText: string;
}

const BlogList = ({ posts, noPostsText }: BlogListProps) => {
  // Filter out posts without titles (shouldn't happen but for safety)
  const validPosts = posts.filter((post) => post.title);

  if (validPosts.length === 0) {
    return (
      <div className='text-center py-16'>
        <p className='text-body-lg'>{noPostsText}</p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8'>
      {validPosts.map((post) => (
        <div key={post._id} className='flex'>
          <BlogCard {...post} />
        </div>
      ))}
    </div>
  );
};

export default BlogList;
