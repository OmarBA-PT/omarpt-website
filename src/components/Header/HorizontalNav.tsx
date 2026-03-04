'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HorizontalNavData,
  HorizontalNavCTAData,
  getHorizontalNavLinkProps,
  getHorizontalNavLinkLabel,
} from '@/utils/navigationHelpers';
import CTAList from '@/components/UI/CTAList';

interface HorizontalNavProps {
  navLinks: HorizontalNavData | null;
  navCtas: HorizontalNavCTAData | null;
}

const HorizontalNav = ({ navLinks, navCtas }: HorizontalNavProps) => {
  const pathname = usePathname();
  const hasLinks = navLinks && navLinks.length > 0;
  const hasCtas = navCtas && navCtas.length > 0;

  // If no links and no CTAs, don't render anything
  if (!hasLinks && !hasCtas) {
    return null;
  }

  // Filter out hidden links
  const visibleLinks = hasLinks ? navLinks.filter((link) => !link.hideLink) : [];

  return (
    <nav className=''>
      <div className='hidden xl:flex items-center gap-6'>
        {/* Navigation Links */}
        {visibleLinks.length > 0 && (
          <ul className='flex items-center gap-12'>
            {visibleLinks.map((link, index) => {
              const linkProps = getHorizontalNavLinkProps(link);
              const label = getHorizontalNavLinkLabel(link);
              const linkPath = (link.computedHref || '/').split('#')[0] || '/';
              const isActive = pathname === linkPath;
              return (
                <li key={`${link.computedHref}-${index}`}>
                  <Link
                    {...linkProps}
                    aria-current={isActive ? 'page' : undefined}
                    className={`transition-colors ${isActive ? 'text-brand-primary' : 'text-brand-white hover:text-brand-primary'}`}
                    style={{
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
                    }}>
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        {/* Navigation CTAs on far right */}
        {hasCtas && (
          <div className='ml-6'>
            <CTAList ctaList={navCtas} alignment='flex-row' fullWidth={false} />
          </div>
        )}
      </div>
    </nav>
  );
};

export default HorizontalNav;
