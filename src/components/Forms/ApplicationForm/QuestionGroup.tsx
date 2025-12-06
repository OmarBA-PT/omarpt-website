import React from 'react';
import { MdExpandMore, MdCheckCircle, MdCancel } from 'react-icons/md';
import CTA from '@/components/UI/CTA';
import { GroupState } from './types';

interface QuestionGroupProps {
  groupIndex: number;
  currentStep: number;
  groupState: GroupState;
  isSingleGroup: boolean;
  isLastGroup: boolean;
  groupComplete: boolean;
  groupKey: string;
  groupTitle?: string;
  hasOnlyRadioButtons: boolean;
  hasVisibleConditionals: boolean;
  hasFilledFields: boolean;
  hasIncompleteMandatory: boolean;
  children: React.ReactNode;
  onHeaderClick: (groupIndex: number) => void;
  onNextQuestion: (groupIndex: number) => void;
  setGroupRef: (key: string, el: HTMLDivElement | null) => void;
}

const QuestionGroup = ({
  groupIndex,
  currentStep,
  groupState,
  isSingleGroup,
  isLastGroup,
  groupComplete,
  groupKey,
  groupTitle,
  hasOnlyRadioButtons,
  hasVisibleConditionals,
  hasFilledFields,
  hasIncompleteMandatory,
  children,
  onHeaderClick,
  onNextQuestion,
  setGroupRef,
}: QuestionGroupProps) => {
  const currentGroupState = groupState[currentStep]?.[groupIndex];
  const isExpanded = currentGroupState?.isExpanded ?? false;
  const isVisited = currentGroupState?.isVisited ?? false;
  const nextGroupVisited = groupState[currentStep]?.[groupIndex + 1]?.isVisited;

  // Determine validation state for visual feedback
  // Show green tick: visited, has filled fields, no incomplete mandatory fields, collapsed
  const showGreenTick = isVisited && hasFilledFields && !hasIncompleteMandatory && !isExpanded;
  // Show red cross: visited, has incomplete mandatory fields, collapsed
  // Note: We don't require hasFilledFields here because even if fields were cleared,
  // we still want to show the error state if there are incomplete mandatory fields
  const showRedCross = isVisited && hasIncompleteMandatory && !isExpanded;

  return (
    <div>
      <div
        ref={(el) => setGroupRef(groupKey, el)}
        className={`rounded-lg transition-all overflow-hidden ${
          isVisited ? 'bg-brand-charcoal-light rounded-xl' : 'border border-brand-charcoal-light'
        }`}>
        {/* Group Header */}
        <div
          className={`px-6 py-4 flex items-center justify-between ${
            !isSingleGroup && isVisited ? 'cursor-pointer hover:bg-black' : ''
          } transition-all ${showGreenTick || showRedCross ? 'bg-black hover:bg-white/10' : ''}`}
          onClick={() => !isSingleGroup && isVisited && onHeaderClick(groupIndex)}>
          <div className='flex items-center gap-3 flex-1'>
            {groupTitle && (
              <h3
                className={`text-body-lg font-semibold ${isVisited ? 'text-brand-secondary' : 'text-brand-charcoal-light'}`}>
                {groupTitle}
              </h3>
            )}
            {showGreenTick && <MdCheckCircle className='w-5 h-5 text-green-500' />}
            {showRedCross && <MdCancel className='w-5 h-5 text-red-500' />}
          </div>
          {!isSingleGroup && (
            <MdExpandMore
              className={`w-6 h-6 transition-transform ${isExpanded ? 'rotate-180' : ''} ${
                isVisited ? 'text-brand-secondary' : 'text-brand-charcoal'
              }`}
            />
          )}
        </div>

        {/* Group Content */}
        <div className={`px-6 pb-6 pt-3 space-y-4 ${isExpanded ? '' : 'hidden'}`}>{children}</div>
      </div>

      {/* Next Question Button - Hidden for radio-only groups since they auto-progress, unless conditional fields are visible */}
      {!isLastGroup &&
        isExpanded &&
        !nextGroupVisited &&
        (!hasOnlyRadioButtons || hasVisibleConditionals) && (
          <div className='flex justify-center my-6'>
            <CTA
              as='button'
              type='button'
              onClick={() => onNextQuestion(groupIndex)}
              disabled={!groupComplete}
              variant='filled'>
              Next Question
            </CTA>
          </div>
        )}
    </div>
  );
};

export default QuestionGroup;
