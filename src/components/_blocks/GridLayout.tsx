import React from 'react';
import { stegaClean } from 'next-sanity';
import type { GridLayoutBlock, RichTextBlock, CardBlock, ImageBlock as ImageBlockType, YouTubeVideoBlock, SpotifyWidgetBlock, BandcampWidgetBlock } from '@/types/blocks';
import Card from './Card';
import RichText from './RichText';
import ImageBlock from './Image';
import YouTubeVideo from './YouTubeVideo';
import SpotifyWidget from './SpotifyWidget';
import BandcampWidget from './BandcampWidget';

interface GridLayoutProps extends GridLayoutBlock {
  documentId?: string;
  documentType?: string;
  fieldPathPrefix?: string;
}

const GridLayout = ({
  columns = '2',
  content,
  documentId,
  documentType,
  fieldPathPrefix,
}: GridLayoutProps) => {
  if (!content || !Array.isArray(content) || content.length === 0) {
    return null;
  }

  const cleanColumns = stegaClean(columns) || '2';
  const validColumns = ['2', '3', '4'].includes(cleanColumns) ? cleanColumns : '2';

  const getGridClasses = (cols: string) => {
    switch (cols) {
      case '2':
        return 'w-full md:w-[calc(50%-16px)]';
      case '3':
        return 'w-full md:w-[calc(50%-16px)] lg:w-[calc(33.333%-22px)]';
      case '4':
        return 'w-full md:w-[calc(50%-16px)] lg:w-[calc(25%-24px)]';
      default:
        return 'w-full md:w-[calc(50%-16px)]';
    }
  };

  const itemClasses = getGridClasses(validColumns);

  type GridContentItem = RichTextBlock | CardBlock | ImageBlockType | YouTubeVideoBlock | SpotifyWidgetBlock | BandcampWidgetBlock;

  const renderGridItem = (item: GridContentItem, idx: number) => {
    const key = item._key || idx;
    const baseProps = {
      documentId,
      documentType,
      fieldPathPrefix: fieldPathPrefix
        ? `${fieldPathPrefix}.content[_key=="${item._key}"]`
        : `content[_key=="${item._key}"]`,
    };

    switch (item._type) {
      case 'richText':
        return (
          <div key={key} className={itemClasses}>
            <RichText {...item} {...baseProps} />
          </div>
        );

      case 'card':
        return (
          <Card
            key={key}
            {...item}
            {...baseProps}
            className={itemClasses}
            isGridChild
          />
        );

      case 'imageBlock':
        return (
          <div key={key} className={itemClasses}>
            <ImageBlock
              {...item}
              {...baseProps}
              pathPrefix={baseProps.fieldPathPrefix}
            />
          </div>
        );

      case 'youTubeVideo':
        return (
          <div key={key} className={itemClasses}>
            <YouTubeVideo {...item} {...baseProps} />
          </div>
        );

      case 'spotifyWidget':
        return (
          <div key={key} className={itemClasses}>
            <SpotifyWidget {...item} {...baseProps} />
          </div>
        );

      case 'bandcampWidget':
        return (
          <div key={key} className={itemClasses}>
            <BandcampWidget {...item} {...baseProps} />
          </div>
        );

      default:
        console.warn(`Unknown grid item type: ${(item as { _type: string })._type}`);
        return null;
    }
  };

  return (
    <div className='w-full flex justify-center flex-wrap gap-4 md:gap-8'>
      {content.map((item, idx) => renderGridItem(item, idx))}
    </div>
  );
};

export default GridLayout;