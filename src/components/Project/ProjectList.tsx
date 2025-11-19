'use client';

import React, { useState } from 'react';
import ProjectCard from './ProjectCard';
import type { ALL_PROJECTS_QUERYResult } from '@/sanity/types';

interface ProjectListProps {
  projects: ALL_PROJECTS_QUERYResult;
}

const ProjectList = ({ projects }: ProjectListProps) => {
  const [openProjectId, setOpenProjectId] = useState<string | null>(null);

  if (!projects || projects.length === 0) {
    return (
      <div className='text-center py-8'>
        <p className='text-body-base text-subtle'>No projects available.</p>
      </div>
    );
  }

  const handleToggle = (projectId: string) => {
    setOpenProjectId((prev) => (prev === projectId ? null : projectId));
  };

  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-0'>
      {projects.map((project) => (
        <ProjectCard
          key={project._id}
          project={project}
          isOpen={openProjectId === project._id}
          onToggle={() => handleToggle(project._id)}
        />
      ))}
    </div>
  );
};

export default ProjectList;
