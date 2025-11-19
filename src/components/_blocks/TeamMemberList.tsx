'use client';

import React from 'react';
import { TeamMemberList as TeamMemberListComponent } from '@/components/TeamMember';
import type { TEAM_MEMBERS_QUERYResult } from '@/sanity/types';

interface TeamMemberListProps {
  category: 'primary' | 'secondary';
  displayStyle: 'detailed' | 'condensed';
  teamMembers?: TEAM_MEMBERS_QUERYResult;
}

const TeamMemberList = ({ category, displayStyle, teamMembers }: TeamMemberListProps) => {
  if (!teamMembers || teamMembers.length === 0) {
    return null;
  }

  return (
    <TeamMemberListComponent
      category={category}
      displayStyle={displayStyle}
      teamMembers={teamMembers}
    />
  );
};

export default TeamMemberList;
