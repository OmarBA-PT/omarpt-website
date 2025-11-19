import React from 'react';
import { stegaClean } from 'next-sanity';
import type { GridLayoutBlock, RichTextBlock, EquipmentListBlock, CardBlock, ImageBlock as ImageBlockType, YouTubeVideoBlock, SpotifyWidgetBlock, BandcampWidgetBlock, AudioSamplePlayerBlock, ProjectListBlock, FeaturedProjectsBlock } from '@/types/blocks';
import type { EQUIPMENT_LIST_QUERYResult, ALL_PROJECTS_QUERYResult } from '@/sanity/types';
import Card from './Card';
import RichText from './RichText';
import EquipmentList from './EquipmentList';
import ProjectListComponent from './ProjectList';
import FeaturedProjectsComponent from './FeaturedProjects';
import ImageBlock from './Image';
import YouTubeVideo from './YouTubeVideo';
import SpotifyWidget from './SpotifyWidget';
import BandcampWidget from './BandcampWidget';
import AudioSamplePlayer from './AudioSamplePlayer';

interface GridLayoutProps extends GridLayoutBlock {
  documentId?: string;
  documentType?: string;
  fieldPathPrefix?: string;
  equipmentListData?: EQUIPMENT_LIST_QUERYResult | null;
  allProjectsData?: ALL_PROJECTS_QUERYResult | null;
}

const GridLayout = ({
  columns = '2',
  content,
  documentId,
  documentType,
  fieldPathPrefix,
  equipmentListData,
  allProjectsData,
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

  type GridContentItem = RichTextBlock | EquipmentListBlock | ProjectListBlock | FeaturedProjectsBlock | CardBlock | ImageBlockType | YouTubeVideoBlock | SpotifyWidgetBlock | BandcampWidgetBlock | AudioSamplePlayerBlock;

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

      case 'equipmentList':
        return (
          <div key={key} className={itemClasses}>
            <EquipmentList equipmentListData={equipmentListData} />
          </div>
        );

      case 'projectList':
        return (
          <div key={key} className={itemClasses}>
            <ProjectListComponent projects={allProjectsData || []} />
          </div>
        );

      case 'featuredProjects':
        return (
          <div key={key} className={itemClasses}>
            <FeaturedProjectsComponent projects={allProjectsData || []} />
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

      case 'audioSamplePlayer': {
        // Extract the expanded audioSamples data from the GROQ query
        const audioSamples = (item.audioSamples || []) as Array<{
          _id?: string;
          _type?: string;
          songName?: string;
          artistName?: string;
          services?: string[];
          image?: {
            asset?: { _ref?: string; _type?: string };
            alt?: string;
            hotspot?: unknown;
            crop?: unknown;
          };
          audioFile?: {
            asset?: {
              _id?: string;
              url?: string;
              mimeType?: string;
              size?: number;
              originalFilename?: string;
              duration?: number;
            };
          };
        }>;

        if (!audioSamples || audioSamples.length === 0) return null;

        return (
          <div key={key} className={itemClasses}>
            <AudioSamplePlayer
              audioSamples={audioSamples}
              documentId={documentId}
              documentType={documentType}
            />
          </div>
        );
      }

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