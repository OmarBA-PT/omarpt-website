import React from 'react';
import MaintenancePage from '@/components/MaintenancePage/MaintenancePage';
import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: `${SITE_CONFIG.ORGANIZATION_NAME} | Coming Soon`,
  description: 'New website on its way. Check back soon!',
  openGraph: {
    title: `${SITE_CONFIG.ORGANIZATION_NAME} - Coming Soon`,
    description: 'New website on its way. Check back soon!',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.ORGANIZATION_NAME}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_CONFIG.ORGANIZATION_NAME} | Coming Soon`,
    description: 'New website on its way. Check back soon!',
    images: ['/images/og-image.png'],
  },
};

const MaintenanceModePage = () => {
  return <MaintenancePage />;
};

export default MaintenanceModePage;
