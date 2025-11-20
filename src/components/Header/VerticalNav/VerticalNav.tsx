'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import UnifiedImage from '@/components/UI/UnifiedImage';
import MenuButton from '../MenuButton';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import Divider from '@/components/UI/Divider';
import {
  VerticalNavData,
  VerticalNavCTAData,
  isNavigationSection,
  isNavigationLink,
  getNavLinkProps,
  getNavLinkLabel,
} from '@/utils/navigationHelpers';
import CTAList from '@/components/UI/CTAList';
import { FaExternalLinkAlt } from 'react-icons/fa';
import styles from './VerticalNav.module.css';
import { headerHeight } from '@/utils/spacingConstants';
import { SITE_CONFIG } from '@/lib/constants';

interface VerticalNavProps {
  isMenuOpen: boolean;
  onClose: () => void;
  navLinks: VerticalNavData | null;
  navCtas: VerticalNavCTAData | null;
}

const VerticalNav = ({ isMenuOpen, onClose, navLinks, navCtas }: VerticalNavProps) => {
  useBodyScrollLock(isMenuOpen);
  const focusTrapRef = useFocusTrap(isMenuOpen);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to top when menu opens
  useEffect(() => {
    if (isMenuOpen && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [isMenuOpen]);

  return (
    <div
      className={`fixed inset-0 z-60 transition-opacity duration-300 ${
        isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
      {/* Background Overlay */}
      <div
        className={`${styles.overlay} ${isMenuOpen ? styles.overlayOpen : styles.overlayClosed}`}
        onClick={onClose}
      />

      {/* Menu Sidebar */}
      <div
        ref={(el) => {
          // Type assertion is safe here since div element extends HTMLElement
          focusTrapRef.current = el as HTMLElement;
        }}
        id='mobile-navigation-menu'
        role='dialog'
        aria-modal='true'
        aria-label='Main navigation menu'
        className={`fixed top-0 right-0 h-full w-full md:w-90 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col bg-brand-gradient-charcoal-diag ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
        {/* Menu Header */}
        <div
          className={`flex items-center justify-center md:justify-between px-4 ${headerHeight} transition-all duration-300 relative z-10`}>
          {/* Logo in Menu - centered on mobile, left-aligned on desktop */}
          <Link href='/' onClick={onClose} className='flex items-center gap-2'>
            <div className='relative w-40 h-[60px]'>
              <UnifiedImage
                src='/images/logos/logo.png'
                alt={`${SITE_CONFIG.ORGANIZATION_NAME} Logo`}
                mode='fill'
                sizeContext='logo'
                objectFit='contain'
                sizes='160px'
              />
            </div>
          </Link>

          {/* Close Button - absolute on mobile to keep logo centered, relative on desktop */}
          <MenuButton
            variant='close'
            onClick={onClose}
            className='text-black absolute right-4 md:relative md:right-0'
          />
        </div>

        {/* Menu Navigation */}
        <div
          ref={scrollContainerRef}
          className='flex-1 overflow-y-auto overflow-x-hidden flex flex-col items-center md:items-start text-center md:text-left'
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#430c08 transparent',
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
            touchAction: 'pan-y',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.scrollbarColor = '#430c08 transparent';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.scrollbarColor = '#430c08 transparent';
          }}>
          {/* Navigation Links - grows to fill available space */}
          <nav className='px-10 py-10 w-full grow'>
            <div className='space-y-8'>
              {navLinks && navLinks.length > 0 ? (
                <>
                  {navLinks
                    .filter((section) => {
                      if (!isNavigationSection(section)) return false;
                      // Filter out sections that should be hidden entirely
                      if (section.hideSection) return false;
                      // Filter out sections hidden on desktop if we're on desktop
                      // RESPONSIVE VISIBILITY: hideOnDesktop aligns with HorizontalNav's lg breakpoint
                      // ⚠️ IMPORTANT: If HorizontalNav.tsx line 25 'lg:flex' changes, update this 'lg:hidden' accordingly
                      return true; // Let CSS handle desktop hiding
                    })
                    .map((section, sectionIndex, filteredSections) => {
                      if (!isNavigationSection(section)) return null;

                      // RESPONSIVE VISIBILITY: hideOnDesktop aligns with HorizontalNav's lg breakpoint
                      // ⚠️ IMPORTANT: If HorizontalNav.tsx line 25 'lg:flex' changes, update this 'lg:hidden' accordingly
                      const sectionVisibilityClass = section.hideOnDesktop ? 'lg:hidden' : '';

                      return (
                        <div key={`nav-section-${sectionIndex}`} className={sectionVisibilityClass}>
                          {/* Section Heading */}
                          {section.heading && (
                            <div className='mb-4'>
                              <p className='uppercase tracking-wide text-subtle/70'>
                                {section.heading}
                              </p>
                            </div>
                          )}

                          {/* Section Links */}
                          <div className='space-y-4 flex flex-col items-center md:items-start'>
                            {section.links?.map((link, linkIndex) => {
                              if (!isNavigationLink(link)) return null;

                              // Skip hidden navigation links
                              if (link.hideLink) return null;

                              const linkProps = getNavLinkProps(link);
                              const label = getNavLinkLabel(link);
                              const isExternal = link.linkType === 'external' || link.openInNewTab;

                              // RESPONSIVE VISIBILITY: hideOnDesktop aligns with HorizontalNav's lg breakpoint
                              // ⚠️ IMPORTANT: If HorizontalNav.tsx line 25 'lg:flex' changes, update this 'lg:hidden' accordingly
                              const linkVisibilityClass = link.hideOnDesktop ? 'lg:hidden' : '';

                              return (
                                <div
                                  key={`nav-link-${sectionIndex}-${linkIndex}`}
                                  className={linkVisibilityClass}>
                                  <Link
                                    {...linkProps}
                                    onClick={onClose}
                                    className='text-xl flex items-center justify-between w-full text-brand-white hover:text-brand-primary transition-colors'>
                                    <span>{label}</span>
                                    {isExternal && (
                                      <FaExternalLinkAlt className='text-body-xs text-current ml-2 shrink-0' />
                                    )}
                                  </Link>
                                </div>
                              );
                            })}
                          </div>

                          {/* Add divider between sections (but not after the last section) */}
                          {sectionIndex < filteredSections.length - 1 && (
                            <div className='pt-6'>
                              <Divider size='half' color='light' />
                            </div>
                          )}
                        </div>
                      );
                    })}
                </>
              ) : (
                <div className='text-body-base text-center'>No navigation links configured</div>
              )}
            </div>
          </nav>

          {/* Navigation CTAs - pinned to bottom on tall screens */}
          {navCtas && navCtas.length > 0 && (
            <div className='w-full px-10 pb-10 mt-auto'>
              <div className='pt-6 border-t border-brand-primary/50'>
                <div className='pt-6'>
                  <CTAList
                    ctaList={navCtas}
                    alignment='flex-col'
                    fullWidth={true}
                    onClick={onClose}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerticalNav;
