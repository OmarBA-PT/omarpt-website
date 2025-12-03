'use client';

import React from 'react';

const DownloadPdfButton = () => {
  const handleDownload = () => {
    // Add timestamp to prevent caching
    const url = `/api/generate-application-pdf?v=${Date.now()}`;
    window.location.href = url;
  };

  return (
    <button
      onClick={handleDownload}
      className='inline-block bg-brand-primary hover:bg-brand-secondary text-brand-white font-semibold px-6 py-3 rounded-lg text-body-sm transition-colors'>
      Download Forms
    </button>
  );
};

export default DownloadPdfButton;
