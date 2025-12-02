import React from 'react';
import { MdExpandMore, MdCheckCircle } from 'react-icons/md';
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
  children,
  onHeaderClick,
  onNextQuestion,
  setGroupRef,
}: QuestionGroupProps) => {
  const currentGroupState = groupState[currentStep]?.[groupIndex];
  const isExpanded = currentGroupState?.isExpanded ?? false;
  const isVisited = currentGroupState?.isVisited ?? false;
  const nextGroupVisited = groupState[currentStep]?.[groupIndex + 1]?.isVisited;

  return (
    <div>
      <div
        ref={(el) => setGroupRef(groupKey, el)}
        className={`rounded-lg border transition-all ${
          isVisited
            ? 'bg-white/40 border-gray-200'
            : 'bg-gray-50/40 border-gray-300 border-dashed'
        }`}>
        {/* Group Header */}
        <div
          className={`p-6 flex items-center justify-between ${
            !isSingleGroup && isVisited ? 'cursor-pointer hover:bg-white/60' : ''
          } transition-colors`}
          onClick={() => !isSingleGroup && onHeaderClick(groupIndex)}>
          <div className='flex items-center gap-3 flex-1'>
            {groupTitle && (
              <h3
                className={`text-body-lg font-semibold ${
                  isVisited ? 'text-brand-secondary' : 'text-gray-500'
                }`}>
                {groupTitle}
              </h3>
            )}
            {isVisited && groupComplete && !isExpanded && (
              <MdCheckCircle className='w-5 h-5 text-green-500' />
            )}
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
        <div
          className={`px-6 pb-6 space-y-4 border-t border-gray-200 pt-6 ${
            isExpanded ? '' : 'hidden'
          }`}>
          {children}
        </div>
      </div>

      {/* Next Question Button - Hidden for radio-only groups since they auto-progress */}
      {!isLastGroup && isExpanded && !nextGroupVisited && !hasOnlyRadioButtons && (
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
