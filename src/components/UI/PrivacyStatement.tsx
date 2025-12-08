import React from 'react';
import Link from 'next/link';
import { MdLock, MdOpenInNew } from 'react-icons/md';

const PrivacyStatement = () => {
  return (
    <div className='bg-brand-gradient-charcoal-linear rounded-lg p-8 max-w-3xl mx-auto'>
      <div className='flex items-start gap-4 text-left'>
        <MdLock className='w-6 h-6 text-brand-primary shrink-0 mt-1' />
        <div>
          <h3 className='text-h6 font-semibold text-gradient-primary mb-3'>Your Privacy Matters</h3>
          <p className='text-body-base text-brand-white mb-3'>
            I take your privacy seriously. All information you provide will be used solely for
            processing your coaching application and creating your personalised fitness plan.
          </p>
          <p className='text-body-base text-brand-white mb-3'>
            I will never share your personal information with third parties, and it will only be
            retained for as long as necessary to provide my coaching services to you.
          </p>
          <Link
            href='/privacy-policy'
            target='_blank'
            rel='noopener noreferrer'
            className='text-brand-primary hover:text-brand-secondary transition-colors text-body-base underline inline-flex items-center gap-1'>
            Read my full Privacy Policy
            <MdOpenInNew className='w-4 h-4' />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyStatement;
