'use client';

import React from 'react';
import UnifiedImage from '@/components/UI/UnifiedImage';
import PortableTextWrapper from '@/components/UI/PortableTextWrapper';
import { createComponents } from '@/sanity/portableTextComponents';
import { createSanityDataAttribute } from '@/utils/sectionHelpers';
import ProfilePlaceholder from './ProfilePlaceholder';
import type { TEAM_MEMBERS_QUERYResult } from '@/sanity/types';

type TeamMember = NonNullable<TEAM_MEMBERS_QUERYResult>[number];
type LayoutType =
  | 'primary-detailed-single'
  | 'primary-detailed-multiple'
  | 'primary-condensed'
  | 'secondary-detailed-single'
  | 'secondary-detailed-multiple'
  | 'secondary-condensed';

interface TeamMemberProps {
  member: TeamMember;
  layout: LayoutType;
}

const TeamMember = ({ member, layout }: TeamMemberProps) => {
  const { name, role, profilePicture, description } = member;

  // Layout flags
  const isPrimary = layout.startsWith('primary');
  const isDetailed = layout.includes('detailed');
  const isSingleSecondary = layout === 'secondary-detailed-single';
  const isPrimaryMultiColumn =
    layout === 'primary-condensed' || layout === 'primary-detailed-multiple';

  /**
   * Get Sanity field path for live editing
   */
  const getFieldPath = (field: string): string => field;

  /**
   * Card container styling - only for primary members
   * Primary members have a white card background with shadow
   */
  const getContainerClass = (): string => {
    if (!isPrimary) return '';

    const baseCardStyles = 'bg-brand-white-dark p-0 md:p-10 rounded-lg shadow-sm overflow-hidden';
    const singleCardLayout = 'flex lg:flex-row lg:gap-6 lg:items-center';
    const multiColumnHeight = 'h-full'; // Stretch to fill wrapper height

    return isPrimaryMultiColumn
      ? `${baseCardStyles} ${multiColumnHeight}`
      : `${baseCardStyles} ${singleCardLayout}`;
  };

  /**
   * Layout classes - controls flex direction and spacing
   */
  const getLayoutClass = (): string => {
    return isSingleSecondary ? 'flex flex-col sm:flex-row gap-6 items-start' : 'flex flex-col';
  };

  /**
   * Alignment classes - controls text and item alignment
   */
  const getAlignmentClass = (): string => {
    if (isPrimary || !isSingleSecondary) {
      return 'items-center text-center';
    }
    return 'items-center text-center sm:items-start sm:text-left';
  };

  /**
   * Content wrapper padding - only for primary (card-style)
   */
  const getContentPaddingClass = (): string => {
    if (isPrimary) {
      const basePadding = 'mt-6 pb-6 md:pb-0';
      const horizontalPadding = isPrimaryMultiColumn ? 'px-6' : 'lg:mt-0 px-6';
      return `${basePadding} ${horizontalPadding}`;
    }

    return isSingleSecondary ? '' : 'mt-4 px-2 sm:px-0';
  };

  /**
   * Photo size and shape classes
   */
  const getPhotoSizeClass = (): string => {
    // Secondary condensed: smaller photo
    if (layout === 'secondary-condensed') {
      return 'w-full max-w-80 sm:max-w-none sm:w-2/3 md:w-full aspect-square rounded-lg';
    }

    // Primary layouts
    if (isPrimary) {
      const baseClasses = 'w-full aspect-square md:rounded-lg';
      const singleCardClasses = 'md:w-1/2 md:self-start mx-auto';
      return isPrimaryMultiColumn ? baseClasses : `${singleCardClasses} ${baseClasses}`;
    }

    // Secondary detailed single: fixed size on left
    if (isSingleSecondary) {
      return 'w-full max-w-80 sm:w-48 sm:h-48 aspect-square flex-shrink-0 rounded-lg mx-auto';
    }

    // Secondary detailed multiple: responsive
    return 'w-full max-w-80 sm:max-w-none sm:w-2/3 md:w-full aspect-square rounded-lg';
  };

  /**
   * Get text alignment for rich text components
   */
  const getTextAlignment = (): 'center' | 'left' => {
    return isPrimary || !isSingleSecondary ? 'center' : 'left';
  };

  const containerClass = getContainerClass();
  const layoutClass = getLayoutClass();
  const alignmentClass = getAlignmentClass();
  const contentPaddingClass = getContentPaddingClass();
  const photoSizeClass = getPhotoSizeClass();
  const textAlignment = getTextAlignment();
  const components = createComponents(textAlignment);

  return (
    <div className={`${containerClass} ${layoutClass} ${alignmentClass}`}>
      {/* Profile Picture */}
      <div
        className={`relative ${photoSizeClass} overflow-hidden flex-shrink-0 md:max-h-[calc(80svh-5rem)] md:max-w-[calc(80svh-5rem)]`}
        {...createSanityDataAttribute(member._id, member._type, getFieldPath('profilePicture'))}>
        {profilePicture?.asset ? (
          <UnifiedImage
            src={profilePicture}
            alt={profilePicture.alt || `${name} profile picture`}
            mode='fill'
            objectFit='cover'
            sizes='(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 60vw'
            sanityWidth={1600}
            quality={95}
            generateSchema
            schemaContext='profile'
            documentId={member._id}
            documentType={member._type}
            fieldPath={getFieldPath('profilePicture')}
          />
        ) : (
          <ProfilePlaceholder />
        )}
      </div>

      {/* Content */}
      <div className={`${contentPaddingClass} ${isSingleSecondary ? 'flex-1' : 'w-full'}`}>
        {/* Name */}
        {name && (
          <p
            className={`${isPrimary ? 'text-h3 md:text-h5 lg:text-h4' : 'text-h5'} mb-1`}
            {...createSanityDataAttribute(member._id, member._type, getFieldPath('name'))}>
            {name}
          </p>
        )}

        {/* Role */}
        {role && (
          <p
            className={`text-subtle ${isPrimary ? 'text-body-xl' : 'text-body-lg'}`}
            {...createSanityDataAttribute(member._id, member._type, getFieldPath('role'))}>
            {role}
          </p>
        )}

        {/* Description - only for detailed views */}
        {isDetailed && description && description.length > 0 && (
          <div
            className={`${isPrimary ? 'mt-4' : 'mt-1'}`}
            {...createSanityDataAttribute(member._id, member._type, getFieldPath('description'))}>
            <PortableTextWrapper
              value={description}
              components={components}
              className='text-body-base'
              dataAttributes={createSanityDataAttribute(
                member._id,
                member._type,
                getFieldPath('description')
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamMember;
