import React from 'react';
import Link from 'next/link';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';

interface BlogPost {
  _id: string;
  title: string | null;
  slug: {
    current?: string;
  } | null;
}

interface BlogPostNavigationProps {
  prevPost?: BlogPost | null;
  nextPost?: BlogPost | null;
}

interface NavigationLinkProps {
  post: BlogPost;
  direction: 'prev' | 'next';
}

const NavigationLink = ({ post, direction }: NavigationLinkProps) => {
  const isNext = direction === 'next';
  const label = isNext ? 'Next Post' : 'Previous Post';
  const Icon = isNext ? FaChevronRight : FaChevronLeft;

  const commonStyles = {
    link: 'group bg-brand-white-dark shadow-sm rounded-lg py-6 px-6 w-full hover:bg-brand-primary/5 hover:shadow-md transition-all duration-200 cursor-pointer flex items-start gap-4',
    iconWrapper:
      'group-hover:bg-brand-primary p-3 rounded-full transition-all duration-200 group-hover:shadow-sm',
    icon: 'text-brand-secondary group-hover:text-brand-white transition-colors duration-200',
    title:
      'text-body-lg font-semibold group-hover:text-brand-secondary transition-colors duration-300 line-clamp-2',
  };

  return (
    <Link
      href={`/blog/${post.slug?.current}`}
      className={`${commonStyles.link} ${isNext ? 'text-right' : ''}`}>
      {!isNext && (
        <div className='flex-shrink-0 mt-1'>
          <div className={commonStyles.iconWrapper}>
            <Icon className={commonStyles.icon} />
          </div>
        </div>
      )}
      <div className='min-w-0 flex-1'>
        <p className='text-body-sm font-medium mb-1 text-subtle'>{label}</p>
        <p className={commonStyles.title}>{post.title || 'Untitled Post'}</p>
      </div>
      {isNext && (
        <div className='flex-shrink-0 mt-1'>
          <div className={commonStyles.iconWrapper}>
            <Icon className={commonStyles.icon} />
          </div>
        </div>
      )}
    </Link>
  );
};

export default function BlogPostNavigation({ prevPost, nextPost }: BlogPostNavigationProps) {
  if (!prevPost && !nextPost) return null;

  return (
    <nav className='pt-8 mt-8'>
      <div className='flex flex-col sm:flex-row justify-between gap-6 sm:items-stretch'>
        <div className='flex-1 flex'>
          {prevPost?.slug?.current ? (
            <NavigationLink post={prevPost} direction='prev' />
          ) : (
            <div className='flex-1' />
          )}
        </div>
        <div className='flex-1 flex'>
          {nextPost?.slug?.current ? (
            <NavigationLink post={nextPost} direction='next' />
          ) : (
            <div className='flex-1' />
          )}
        </div>
      </div>
    </nav>
  );
}
