'use client';

import React from 'react';
import ProjectListComponent from '@/components/Project/ProjectList';
import type { ALL_PROJECTS_QUERYResult } from '@/sanity/types';

interface ProjectListProps {
  projects?: ALL_PROJECTS_QUERYResult;
}

const ProjectList = ({ projects }: ProjectListProps) => {
  if (!projects || projects.length === 0) {
    return null;
  }

  return <ProjectListComponent projects={projects} />;
};

export default ProjectList;
