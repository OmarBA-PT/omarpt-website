'use client';

import React from 'react';
import FeaturedProjectsComponent from '@/components/Project/FeaturedProjects';
import type { FEATURED_PROJECTS_QUERYResult } from '@/sanity/types';

interface FeaturedProjectsProps {
  projects?: FEATURED_PROJECTS_QUERYResult;
}

const FeaturedProjects = ({ projects }: FeaturedProjectsProps) => {
  if (!projects || projects.length === 0) {
    return null;
  }

  return <FeaturedProjectsComponent projects={projects} />;
};

export default FeaturedProjects;
