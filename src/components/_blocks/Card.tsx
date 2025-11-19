'use client';

import React from 'react';
import { stegaClean } from 'next-sanity';
import type { Card as CardType } from '@/sanity/types';
import { client } from '@/sanity/lib/client';
import CardNoImage from '../Card/CardNoImage';
import CardBanner from '../Card/CardBanner';
import CardIcon from '../Card/CardIcon';

import type { SiteSettingsProps } from '@/types/shared';
import type { COMPANY_LINKS_QUERYResult } from '@/sanity/types';

interface CardProps extends Omit<CardType, '_type'> {
  _key?: string;
  className?: string;
  isGridChild?: boolean;
  documentId?: string;
  documentType?: string;
  fieldPathPrefix?: string;
  siteSettings?: SiteSettingsProps;
  companyLinks?: COMPANY_LINKS_QUERYResult;
  alignment?: 'left' | 'center' | 'right';
}

const { projectId, dataset, stega } = client.config();
const createDataAttributeConfig = {
  projectId,
  dataset,
  baseUrl: typeof stega.studioUrl === 'string' ? stega.studioUrl : '',
};

const Card = (props: CardProps) => {
  const {
    title,
    subtitle,
    visualStyle = 'light',
    imageType = 'none',
    image,
    iconNoImageLayoutStyle,
    content,
    className = '',
    isGridChild = false,
    documentId,
    documentType,
    fieldPathPrefix,
    siteSettings,
    companyLinks,
    alignment = 'center',
  } = props;

  const cleanTitle = stegaClean(title);
  const cleanSubtitle = stegaClean(subtitle);
  const cleanVisualStyle = (stegaClean(visualStyle) as 'light' | 'dark') || 'light';
  const cleanImageType = stegaClean(imageType) || 'none';

  // Determine layout style based on image type
  let cleanLayoutStyle: 'stacked' | 'row' = 'stacked';
  if (cleanImageType === 'icon' || cleanImageType === 'none') {
    const iconLayout = stegaClean(iconNoImageLayoutStyle);
    cleanLayoutStyle = (iconLayout as 'stacked' | 'row') || 'stacked';
  }
  // Banner is always stacked

  // Don't render completely empty cards (no title, subtitle, or content)
  if (
    (!cleanTitle || cleanTitle.trim() === '') &&
    (!cleanSubtitle || cleanSubtitle.trim() === '') &&
    (!content || content.length === 0)
  ) {
    return null;
  }

  // Common props for all card components
  const commonProps = {
    title: cleanTitle,
    subtitle: cleanSubtitle,
    content,
    className,
    isGridChild,
    visualStyle: cleanVisualStyle,
    documentId,
    documentType,
    fieldPathPrefix,
    siteSettings,
    companyLinks,
    alignment,
    createDataAttributeConfig,
  };

  // Banner Image - Stacked (only option for banner)
  if (cleanImageType === 'banner' && image?.asset?._ref) {
    return <CardBanner {...commonProps} image={image} />;
  }

  // Icon
  if (cleanImageType === 'icon' && image?.asset?._ref) {
    return <CardIcon {...commonProps} image={image} layoutStyle={cleanLayoutStyle} />;
  }

  // No Image
  return <CardNoImage {...commonProps} layoutStyle={cleanLayoutStyle} />;
};

export default Card;
