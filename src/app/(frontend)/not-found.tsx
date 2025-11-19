import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/Page/PageHero';
import Container from '@/components/Layout/Container';
import CTA from '@/components/UI/CTA';
import Breadcrumb from '@/components/UI/Breadcrumb';
import { FaQuestionCircle } from 'react-icons/fa';

const META_DESCRIPTION = 'Sorry, the page you are looking for could not be found.';

export const metadata: Metadata = {
  title: 'Page Not Found - Taupiri Sound',
  description: META_DESCRIPTION,
  robots: 'noindex, nofollow',
  openGraph: {
    title: 'Page Not Found - Taupiri Sound',
    description: META_DESCRIPTION,
    type: 'website',
  },
};

const navigationLinks = [
  {
    href: '/',
    icon: '🏠',
    title: 'Home',
    description: 'Discover our latest news and featured content',
  },
  {
    href: '/discography',
    icon: '🎵',
    title: 'Discography',
    description: 'Explore our complete collection of music releases',
  },
  {
    href: '/blog',
    icon: '📝',
    title: 'Blog',
    description: 'Read our latest news, stories, and insights',
  },
];

interface NavigationLinkProps {
  href: string;
  icon: string;
  title: string;
  description: string;
}

const NavigationLink = ({ href, icon, title, description }: NavigationLinkProps) => (
  <Link
    href={href}
    className='group bg-brand-white-dark shadow-sm rounded-lg p-4 hover:bg-brand-primary/10 hover:shadow-md transition-all duration-200'>
    <div className='text-body-base font-medium mb-2 group-hover:underline group-hover:underline-offset-4'>
      {icon} {title}
    </div>
    <div className='text-body-sm text-gray-600'>{description}</div>
  </Link>
);

export default function NotFound() {
  return (
    <>
      <PageHero title='Page Not Found' />
      <Breadcrumb pageTitle='Page Not Found' />

      <Container>
        <div className='flex flex-col items-center text-center pb-12 md:pb-16'>
          <FaQuestionCircle className='text-[150px] sm:text-[250px] text-brand-primary mb-8 md:mb-12' />

          <div className='max-w-2xl mb-8 md:mb-12'>
            <h2 className='text-h3 md:text-h2 mb-4'>Oops! We can&apos;t find that page</h2>
            <p className='text-body-lg md:text-body-xl leading-relaxed mb-6'>
              The page you&apos;re looking for doesn&apos;t exist or may have been moved. Don&apos;t
              worry though - there&apos;s plenty to explore at Taupiri Sound!
            </p>
          </div>

          <div className='w-full max-w-4xl mb-12'>
            <h3 className='text-h4 mb-6'>Here are some popular pages to get you back on track:</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8'>
              {navigationLinks.map((link, index) => (
                <NavigationLink key={index} {...link} />
              ))}
            </div>
          </div>

          <CTA href='/' variant='filled' className='text-body-lg'>
            Take Me Home
          </CTA>
        </div>
      </Container>
    </>
  );
}
