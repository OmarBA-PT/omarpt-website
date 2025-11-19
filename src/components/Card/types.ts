import type { SiteSettingsProps } from '@/types/shared';
import type { COMPANY_LINKS_QUERYResult, Card } from '@/sanity/types';

// Extract the image type from the Card type
export type CardImage = NonNullable<Card['image']>;

// Layout style type shared by all card components
export type CardLayoutStyle = 'stacked' | 'row';

// Shared config type
export interface DataAttributeConfig {
  projectId: string | undefined;
  dataset: string | undefined;
  baseUrl: string;
}

// Base props shared by all card components
export interface BaseCardProps {
  title?: string;
  subtitle?: string;
  content?: unknown[]; // Optional to support cards with just title/subtitle
  className?: string;
  isGridChild?: boolean;
  visualStyle?: 'light' | 'dark';
  documentId?: string;
  documentType?: string;
  fieldPathPrefix?: string;
  siteSettings?: SiteSettingsProps;
  companyLinks?: COMPANY_LINKS_QUERYResult;
  alignment?: 'left' | 'center' | 'right';
  createDataAttributeConfig: DataAttributeConfig;
}
