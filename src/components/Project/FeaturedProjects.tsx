'use client';

import React, { useState, useEffect, useRef } from 'react';
import ProjectCard from './ProjectCard';
import type { FEATURED_PROJECTS_QUERYResult } from '@/sanity/types';

interface FeaturedProjectsProps {
  projects: FEATURED_PROJECTS_QUERYResult;
}

const FeaturedProjects = ({ projects }: FeaturedProjectsProps) => {
  const [openProjectId, setOpenProjectId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const innerContainerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const isUserInteracting = useRef<boolean>(false);
  const translateX = useRef<number>(0);
  const dragStartX = useRef<number>(0);
  const dragStartTranslateX = useRef<number>(0);
  const isDragging = useRef<boolean>(false);

  // Configuration
  const SCROLL_SPEED = 40; // Pixels per second - adjust this to make it faster/slower
  const REPETITIONS = 3; // Number of times we repeat the projects array for seamless infinite scroll

  useEffect(() => {
    const container = scrollContainerRef.current;
    const innerContainer = innerContainerRef.current;
    if (!container || !innerContainer || !projects || projects.length === 0) return;

    // Get the actual width of a single project item
    const firstChild = innerContainer.firstElementChild as HTMLElement;
    if (!firstChild) return;

    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      // Pause animation if user is interacting
      if (isUserInteracting.current) {
        lastTime = currentTime;
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
      lastTime = currentTime;

      // Continuous smooth scrolling using CSS transform
      const scrollAmount = SCROLL_SPEED * deltaTime;
      translateX.current -= scrollAmount;

      // Calculate the width of one complete set of original projects
      // Each project item has the same width, so multiply by the count
      const itemWidth = firstChild.offsetWidth;
      const singleSetWidth = itemWidth * projects.length;

      // Use modulo to create seamless infinite loop
      // When we've scrolled one full set, jump back by that amount
      // This is seamless because the content repeats
      if (Math.abs(translateX.current) >= singleSetWidth) {
        // Add back the single set width to loop seamlessly
        translateX.current = translateX.current + singleSetWidth;
      }

      innerContainer.style.transform = `translate3d(${translateX.current}px, 0, 0)`;

      animationRef.current = requestAnimationFrame(animate);
    };

    // Handle drag/touch start - pause animation and record starting position
    const handleInteractionStart = (e: TouchEvent | PointerEvent) => {
      isUserInteracting.current = true;
      isDragging.current = false;

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      dragStartX.current = clientX;
      dragStartTranslateX.current = translateX.current;
    };

    // Handle drag/touch move - update position if user is dragging
    const handleInteractionMove = (e: TouchEvent | PointerEvent) => {
      if (!isUserInteracting.current) return;

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const deltaX = clientX - dragStartX.current;

      // If moved more than 5px, consider it a drag
      if (Math.abs(deltaX) > 5) {
        // Close any open overlay when user starts dragging
        if (!isDragging.current && openProjectId) {
          setOpenProjectId(null);
        }
        isDragging.current = true;
      }

      // Update position based on drag
      if (isDragging.current && innerContainer) {
        translateX.current = dragStartTranslateX.current + deltaX;

        // Apply seamless looping logic during drag
        const firstChild = innerContainer.firstElementChild as HTMLElement;
        if (firstChild) {
          const itemWidth = firstChild.offsetWidth;
          const singleSetWidth = itemWidth * projects.length;

          if (Math.abs(translateX.current) >= singleSetWidth) {
            translateX.current = translateX.current + singleSetWidth;
            dragStartTranslateX.current = translateX.current;
          }
        }

        innerContainer.style.transform = `translate3d(${translateX.current}px, 0, 0)`;
      }
    };

    // Handle drag/touch end - resume animation after delay
    const handleInteractionEnd = () => {
      setTimeout(() => {
        isUserInteracting.current = false;
        isDragging.current = false;
      }, 100);
    };

    // Add event listeners for touch and pointer events
    container.addEventListener('touchstart', handleInteractionStart, { passive: true });
    container.addEventListener('touchmove', handleInteractionMove, { passive: true });
    container.addEventListener('touchend', handleInteractionEnd, { passive: true });
    container.addEventListener('pointerdown', handleInteractionStart);
    container.addEventListener('pointermove', handleInteractionMove);
    container.addEventListener('pointerup', handleInteractionEnd);

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      container.removeEventListener('touchstart', handleInteractionStart);
      container.removeEventListener('touchmove', handleInteractionMove);
      container.removeEventListener('touchend', handleInteractionEnd);
      container.removeEventListener('pointerdown', handleInteractionStart);
      container.removeEventListener('pointermove', handleInteractionMove);
      container.removeEventListener('pointerup', handleInteractionEnd);
    };
  }, [projects, SCROLL_SPEED]);

  if (!projects || projects.length === 0) {
    return (
      <div className='text-center py-8'>
        <p className='text-body-base text-subtle'>No featured projects available.</p>
      </div>
    );
  }

  const handleToggle = (projectId: string) => {
    setOpenProjectId((prev) => (prev === projectId ? null : projectId));
  };

  // Repeat the projects array REPETITIONS times for seamless infinite scroll
  const repeatedProjects = Array(REPETITIONS).fill(projects).flat();

  return (
    <div
      ref={scrollContainerRef}
      className='relative overflow-hidden'
      style={{
        touchAction: 'pan-x',
      }}>
      <div
        ref={innerContainerRef}
        className='flex'
        style={{
          willChange: 'transform',
        }}>
        {repeatedProjects.map((project, index) => (
          <div
            key={`${project._id}-${index}`}
            className='flex-shrink-0 w-1/2 md:w-1/5'>
            <ProjectCard
              project={project}
              isOpen={openProjectId === project._id}
              onToggle={() => handleToggle(project._id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProjects;
