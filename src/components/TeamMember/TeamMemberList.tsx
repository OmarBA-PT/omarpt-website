import React from 'react';
import { stegaClean } from 'next-sanity';
import TeamMember from './TeamMember';
import { maxCardWidth } from '@/utils/spacingConstants';
import type { TEAM_MEMBERS_QUERYResult } from '@/sanity/types';

type Category = 'primary' | 'secondary';
type DisplayStyle = 'detailed' | 'condensed';
type LayoutType =
  | 'primary-detailed-single'
  | 'primary-detailed-multiple'
  | 'primary-condensed'
  | 'secondary-detailed-single'
  | 'secondary-detailed-multiple'
  | 'secondary-condensed';

interface TeamMemberListProps {
  category: Category;
  displayStyle: DisplayStyle;
  teamMembers: TEAM_MEMBERS_QUERYResult;
}

const TeamMemberList = ({ category, displayStyle, teamMembers }: TeamMemberListProps) => {
  // Filter team members by category
  // Use stegaClean to strip Sanity's invisible stega encoding for reliable string comparison in draft mode
  const filteredMembers =
    teamMembers?.filter((member) => stegaClean(member.category) === stegaClean(category)) || [];

  if (filteredMembers.length === 0) {
    return null;
  }

  // TEST CODE: single member scenario
  // const filteredMembers = teamMembers?.filter((member) => member.category === category).slice(0, 1);

  const isPrimary = category === 'primary';
  const isSingleMember = filteredMembers.length === 1;
  const isCondensed = displayStyle === 'condensed';

  /**
   * Determines the layout type based on category, display style, and member count
   */
  const getLayoutType = (): LayoutType => {
    if (isPrimary) {
      if (isCondensed) return 'primary-condensed';
      return isSingleMember ? 'primary-detailed-single' : 'primary-detailed-multiple';
    }

    // Secondary category
    if (isCondensed) return 'secondary-condensed';
    return isSingleMember ? 'secondary-detailed-single' : 'secondary-detailed-multiple';
  };

  /**
   * Returns container flex/grid classes based on category and display style
   */
  const getContainerClasses = (): string => {
    if (isPrimary) {
      // Primary single member: centered with optional maxCardWidth
      if (isSingleMember) {
        return `flex justify-center ${isCondensed ? maxCardWidth : ''} mx-auto`;
      }
      // Primary multiple: Flex layout with 2 per row on desktop, centered last row
      return 'flex flex-wrap justify-center gap-6 md:gap-8';
    }

    // Secondary category
    if (isSingleMember) {
      // Secondary single detailed: centered with maxCardWidth
      return `${maxCardWidth} mx-auto`;
    }
    // Secondary multiple (both condensed and detailed): 3 per row on desktop
    return 'flex flex-wrap justify-center gap-6 lg:gap-8';
  };

  /**
   * Returns individual member wrapper width classes for flex layout
   */
  const getMemberWrapperClasses = (): string => {
    if (isPrimary) {
      if (isSingleMember) return 'w-full';
      // Primary multiple: Use flex-basis with max-width to maintain consistent widths
      // This allows centering of last row while keeping equal heights via flex
      return 'w-full md:flex-[0_0_calc(50%-1rem)] md:max-w-[calc(50%-1rem)] flex flex-col';
    }

    // Secondary category
    if (isSingleMember) return 'w-full';

    // Secondary multiple (both condensed and detailed): 2 per row on tablet, 3 on desktop
    return 'w-full md:w-[calc((100%-1*1.5rem)/2)] lg:w-[calc((100%-2*2rem)/3)]';
  };

  const layoutType = getLayoutType();
  const containerClasses = getContainerClasses();
  const memberWrapperClasses = getMemberWrapperClasses();

  return (
    <div className={containerClasses}>
      {filteredMembers.map((member) => (
        <div key={member._id} className={memberWrapperClasses}>
          <TeamMember member={member} layout={layoutType} />
        </div>
      ))}
    </div>
  );
};

export default TeamMemberList;
