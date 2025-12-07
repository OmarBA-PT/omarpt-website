import React from 'react';
import { MdError } from 'react-icons/md';
import { FormStatus } from './types';
import { maxCardWidth } from '@/utils/spacingConstants';
import { SITE_CONFIG } from '@/lib/constants';

interface StatusMessagesProps {
  status: FormStatus;
  errorMessage?: string;
  errorCount?: number;
  showValidationError?: boolean;
  onDownloadPDF?: () => void;
}

const StatusMessages = ({
  status,
  errorMessage,
  errorCount = 0,
  showValidationError = false,
  onDownloadPDF,
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
            <div className='flex-1 text-left'>
              <h3 className='text-body-base font-semibold text-red-800 mb-1'>Submission Error</h3>
              <p className='text-body-sm text-red-700 mb-3'>{errorMessage}</p>
              <div className='text-body-sm text-red-700'>
                <p className='mb-2'>
                  I sincerely apologize for this inconvenience. However don't worry, your answers
                  have been collected and inserted into a PDF for your convenience. To complete your
                  application, please follow these steps:
                </p>
                <ol className='list-decimal list-inside space-y-1 mb-3'>
                  <li>
                    <button
                      type='button'
                      onClick={onDownloadPDF}
                      className='text-red-900 underline hover:text-red-950 font-semibold cursor-pointer text-left'>
                      Download your application (answers already inserted) as a PDF
                    </button>
                  </li>
                  <li>
                    Email it to me at{' '}
                    <a
                      href={SITE_CONFIG.ORGANIZATION_EMAIL.link}
                      className='text-red-900 underline hover:text-red-950 font-semibold'>
                      {SITE_CONFIG.ORGANIZATION_EMAIL.value}
                    </a>
                  </li>
                </ol>
              </div>
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
              <h3 className='text-body-base font-semibold text-red-800 mb-1 text-left'>
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
