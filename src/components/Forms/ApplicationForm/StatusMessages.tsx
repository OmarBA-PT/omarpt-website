import React from 'react';
import { MdError } from 'react-icons/md';
import { FormStatus } from './types';
import { maxCardWidth } from '@/utils/spacingConstants';

interface StatusMessagesProps {
  status: FormStatus;
  errorMessage?: string;
  errorCount?: number;
  showValidationError?: boolean;
}

const StatusMessages = ({
  status,
  errorMessage,
  errorCount = 0,
  showValidationError = false,
}: StatusMessagesProps) => {
  return (
    <>
      {/* Success Message */}
      {status === 'success' && (
        <div className={`mb-6 bg-black p-8 mx-auto rounded-lg ${maxCardWidth}`}>
          <div className='text-center'>
            <h3 className='text-h4 font-bold text-brand-secondary mb-2'>
              Thank you for your application!
            </h3>
            <p className='text-body-base mb-2'>
              We have received your submission and will get back to you as soon as possible.
            </p>
            <p className=''>You should also receive a confirmation email shortly.</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {status === 'error' && (
        <div className='mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg'>
          <div className='flex items-start'>
            <MdError className='w-5 h-5 text-red-500 mt-0.5 mr-3 shrink-0' />
            <div>
              <h3 className='text-body-base font-semibold text-red-800 mb-1 text-left'>
                Submission Error
              </h3>
              <p className='text-body-sm text-red-700'>{errorMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Validation Error Summary Banner */}
      {status !== 'success' && showValidationError && errorCount > 0 && (
        <div className='mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg'>
          <div className='flex items-start text-left'>
            <MdError className='w-5 h-5 text-red-500 mt-0.5 mr-3 shrink-0' />
            <div>
              <h3 className='text-body-base font-semibold text-red-800 mb-1'>
                Fields Require Attention
              </h3>
              <p className='text-body-sm text-red-700'>
                {errorCount} {errorCount === 1 ? 'field requires' : 'fields require'} your
                attention. Please check the highlighted {errorCount === 1 ? 'field' : 'fields'}{' '}
                below.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StatusMessages;
