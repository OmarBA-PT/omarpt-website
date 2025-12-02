import { useState, useEffect, useRef } from 'react';
import { GroupState } from './types';

interface QuestionGroup {
  id: string;
  title?: string;
  questions: any[];
}

interface UseGroupStateProps {
  currentStep: number;
  questionGroups: QuestionGroup[];
  stepsVisitedForward: Set<number>;
}

export const useGroupState = ({
  currentStep,
  questionGroups,
  stepsVisitedForward,
}: UseGroupStateProps) => {
  const [groupState, setGroupState] = useState<GroupState>({});
  const prevStepRef = useRef(currentStep);

  // Initialize group state when step changes
  useEffect(() => {
    const initializeGroupState = () => {
      // Check if we're moving backwards or if this step hasn't been initialized
      const isMovingBackwards = currentStep < prevStepRef.current;
      const stepNotInitialized = !groupState[currentStep];
      const isReturningToPreviouslyVisitedStep =
        stepsVisitedForward.has(currentStep) && isMovingBackwards;

      const newState: GroupState[number] = {};
      const isSingleGroup = questionGroups.length === 1;

      questionGroups.forEach((_, groupIndex) => {
        if (isSingleGroup) {
          // Single group: ALWAYS expanded and non-collapsible (forward or backward navigation)
          newState[groupIndex] = { isExpanded: true, isVisited: true };
        } else if (isReturningToPreviouslyVisitedStep) {
          // When returning to a previously visited step, collapse ALL groups but mark them as visited
          newState[groupIndex] = { isExpanded: false, isVisited: true };
        } else if (groupIndex === 0) {
          // Multiple groups: first one expanded and visited
          newState[groupIndex] = { isExpanded: true, isVisited: true };
        } else {
          // Rest collapsed and unvisited
          newState[groupIndex] = { isExpanded: false, isVisited: false };
        }
      });

      // Only reset state if moving backwards or step not initialized
      if (isMovingBackwards || stepNotInitialized) {
        setGroupState((prev) => ({ ...prev, [currentStep]: newState }));
      }

      // Update previous step reference
      prevStepRef.current = currentStep;
    };

    initializeGroupState();
  }, [currentStep, questionGroups, stepsVisitedForward, groupState]);

  return { groupState, setGroupState };
};
