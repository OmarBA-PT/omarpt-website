'use client';

import React, { useState, useRef } from 'react';
import UnifiedImage from '@/components/UI/UnifiedImage';
import CTA from '@/components/UI/CTA';
import { createSanityDataAttribute } from '@/utils/sectionHelpers';
import type { ALL_PROJECTS_QUERYResult } from '@/sanity/types';

type Project = NonNullable<ALL_PROJECTS_QUERYResult>[number];

interface ProjectCardProps {
  project: Project;
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

const ProjectCard = ({ project, isOpen, onToggle, className = '' }: ProjectCardProps) => {
  const { name, description, link, linkLabel, image } = project;
  const [isHovered, setIsHovered] = useState(false);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const touchMoved = useRef(false);

  const hasLink = !!link;
  const displayLinkLabel = linkLabel || 'More info';

  /**
   * Get Sanity field path for live editing
   */
  const getFieldPath = (field: string): string => field;

  /**
   * Handle touch start - record starting position
   */
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
    touchMoved.current = false;
  };

  /**
   * Handle touch move - detect if user is swiping
   */
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartPos.current) return;

    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartPos.current.x);
    const deltaY = Math.abs(touch.clientY - touchStartPos.current.y);

    // If moved more than 10px in any direction, consider it a swipe/scroll
    if (deltaX > 10 || deltaY > 10) {
      touchMoved.current = true;
    }
  };

  /**
   * Handle touch end - only toggle if it was a tap (not a swipe)
   */
  const handleTouchEnd = (e: React.TouchEvent) => {
    // Only toggle if this was a tap (not a swipe)
    if (!touchMoved.current && touchStartPos.current) {
      // If overlay is not open, prevent default and show overlay
      if (!isOpen) {
        e.preventDefault();
        onToggle();
      }
      // If overlay is already open, allow clicks through to the link
    }

    // Reset tracking
    touchStartPos.current = null;
    touchMoved.current = false;
  };

  /**
   * Handle click for non-touch devices
   */
  const handleClick = (e: React.MouseEvent) => {
    // Only handle if it's a hover-capable device (desktop)
    if (window.matchMedia('(hover: hover)').matches) {
      // On desktop, clicks work normally with hover
      return;
    }

    // On touch devices without proper touch events, use click
    if (!isOpen) {
      e.preventDefault();
      onToggle();
    }
  };

  // Show overlay on hover (desktop) or when open (mobile)
  const showOverlay = isHovered || isOpen;

  return (
    <div
      className={`relative aspect-square overflow-hidden group cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      {...createSanityDataAttribute(project._id, project._type, '')}>
      {/* Project Image */}
      <div className='relative w-full h-full'>
        <UnifiedImage
          src={image}
          alt={image?.alt || `${name} project image`}
          mode='fill'
          sizeContext='gallery'
          objectFit='cover'
          generateSchema
          schemaContext='gallery'
          documentId={project._id}
          documentType={project._type}
          fieldPath={getFieldPath('image')}
        />
      </div>

      {/* Overlay with Project Info */}
      <div
        className={`absolute inset-0 bg-brand-black/85 flex flex-col items-center justify-center p-2 transition-opacity duration-300 ${
          showOverlay ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}>
        {/* Project Name */}
        {name && (
          <p
            className='text-brand-white-dark font-bold text-center mb-2'
            {...createSanityDataAttribute(project._id, project._type, getFieldPath('name'))}>
            {name}
          </p>
        )}

        {/* Project Description */}
        {description && (
          <p
            className='text-subtle text-center mb-4'
            {...createSanityDataAttribute(project._id, project._type, getFieldPath('description'))}>
            {description}
          </p>
        )}

        {/* Link Button - Only if link exists and overlay is visible */}
        {hasLink && showOverlay && (
          <CTA
            href={link}
            variant='filled'
            target='_blank'
            rel='noopener noreferrer'
            shortOnMobile
            {...createSanityDataAttribute(project._id, project._type, getFieldPath('link'))}>
            {displayLinkLabel}
          </CTA>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
