import MaintenancePage from '@/components/MaintenancePage/MaintenancePage';
import type { Metadata } from 'next';
import { fetchOrganizationName } from '@/lib/organizationInfo';

export async function generateMetadata(): Promise<Metadata> {
  const orgName = await fetchOrganizationName();

  return {
    title: `${orgName} | Coming Soon`,
    description: 'New website on its way. Check back soon!',
    openGraph: {
      title: `${orgName} - Coming Soon`,
      description: 'New website on its way. Check back soon!',
      images: [
        {
          url: '/images/og-image.png',
          width: 1200,
          height: 630,
          alt: orgName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${orgName} | Coming Soon`,
      description: 'New website on its way. Check back soon!',
      images: ['/images/og-image.png'],
    },
  };
}

const MaintenanceModePage = async () => {
  const orgName = await fetchOrganizationName();

  return <MaintenancePage organizationName={orgName} />;
};

export default MaintenanceModePage;
