import React from 'react';
import { MdExpandMore, MdCheckCircle, MdCancel } from 'react-icons/md';
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
          isVisited
            ? 'bg-brand-charcoal-light rounded-xl'
            : 'bg-gray-50/40 border-gray-300 border-dashed'
        }`}>
        {/* Group Header */}
        <div
          className={`p-6 flex items-center justify-between ${
            !isSingleGroup && isVisited ? 'cursor-pointer hover:bg-black' : ''
          } transition-colors ${
            showGreenTick ? 'bg-green-50/60' : showRedCross ? 'bg-red-50/60' : ''
          }`}
          onClick={() => !isSingleGroup && isVisited && onHeaderClick(groupIndex)}>
          <div className='flex items-center gap-3 flex-1'>
            {groupTitle && (
              <h3
                className={`text-body-lg font-semibold ${
                  isVisited ? 'text-brand-secondary' : 'text-gray-500'
                }`}>
                {groupTitle}
              </h3>
            )}
            {showGreenTick && <MdCheckCircle className='w-5 h-5 text-green-500' />}
            {showRedCross && <MdCancel className='w-5 h-5 text-red-500' />}
          </div>
          {!isSingleGroup && (
            <MdExpandMore
              className={`w-6 h-6 transition-transform ${isExpanded ? 'rotate-180' : ''} ${
                isVisited ? 'text-brand-secondary' : 'text-gray-400'
              }`}
            />
          )}
        </div>

        {/* Group Content */}
        <div className={`px-6 pb-6 space-y-4 ${isExpanded ? '' : 'hidden'}`}>{children}</div>
      </div>

      {/* Next Question Button - Hidden for radio-only groups since they auto-progress, unless conditional fields are visible */}
      {!isLastGroup &&
        isExpanded &&
        !nextGroupVisited &&
        (!hasOnlyRadioButtons || hasVisibleConditionals) && (
          <div className='flex justify-center my-6'>
            <button
              type='button'
              onClick={() => onNextQuestion(groupIndex)}
              disabled={!groupComplete}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                groupComplete
                  ? 'bg-brand-primary text-white hover:bg-brand-primary/90 hover:shadow-md'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}>
              Next Question
            </button>
          </div>
        )}
    </div>
  );
};

export default QuestionGroup;
