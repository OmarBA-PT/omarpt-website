import React from 'react';
import { createDataAttribute } from 'next-sanity';
import type {
  COMPANY_LINKS_QUERYResult,
  CLIENTS_QUERYResult,
  EQUIPMENT_LIST_QUERYResult,
  TEAM_MEMBERS_QUERYResult,
  ALL_PROJECTS_QUERYResult,
  FEATURED_PROJECTS_QUERYResult,
  CONTACT_FORM_SETTINGS_QUERYResult,
  RichText as RichTextType,
  Quote as QuoteType,
  TwoColumnLayout as TwoColumnLayoutType,
  CtaButton as CtaButtonType,
  CtaCalloutLink as CtaCalloutLinkType,
  CtaBlogPost as CtaBlogPostType,
  ImageBlock as ImageBlockType,
  ImageGallery as ImageGalleryType,
  YouTubeVideo as YouTubeVideoType,
  SpotifyWidget as SpotifyWidgetType,
  BandcampWidget as BandcampWidgetType,
  AudioSamplePlayer as AudioSamplePlayerType,
  CompanyLinksBlock as CompanyLinksBlockType,
  BlockListWithStats as BlockListWithStatsType,
  CheckList as CheckListType,
  ItemList as ItemListType,
  EquipmentList as EquipmentListType,
  ClientList as ClientListType,
  TeamMemberList as TeamMemberListType,
  ProjectList as ProjectListType,
  FeaturedProjects as FeaturedProjectsType,
  ContactForm as ContactFormType,
  Divider as DividerType,
  Card as CardType,
  GridLayout as GridLayoutType,
} from '@/sanity/types';
import type { SiteSettingsProps } from '@/types/shared';

// Import all block components
import RichText from '@/components/_blocks/RichText';
import Quote from '@/components/_blocks/Quote';
import TwoColumnLayout from '@/components/_blocks/TwoColumnLayout';
import CTAButton from '@/components/_blocks/CTAButton';
import CTACalloutLinkComponent from '@/components/_blocks/CTACalloutLink';
import CTABlogPost from '@/components/_blocks/CTABlogPost';
import ImageBlock from '@/components/_blocks/Image';
import ImageGallery from '@/components/_blocks/ImageGallery';
import YouTubeVideo from '@/components/_blocks/YouTubeVideo';
import SpotifyWidget from '@/components/_blocks/SpotifyWidget';
import BandcampWidget from '@/components/_blocks/BandcampWidget';
import AudioSamplePlayer from '@/components/_blocks/AudioSamplePlayer';
import CompanyLinksBlock from '@/components/_blocks/CompanyLinksBlock';
import BlockListWithStats from '@/components/_blocks/BlockListWithStats';
import CheckList from '@/components/_blocks/CheckList';
import ItemList from '@/components/_blocks/ItemList';
import EquipmentList from '@/components/_blocks/EquipmentList';
import ClientList from '@/components/_blocks/ClientList';
import TeamMemberListComponent from '@/components/_blocks/TeamMemberList';
import ProjectListComponent from '@/components/_blocks/ProjectList';
import FeaturedProjectsComponent from '@/components/_blocks/FeaturedProjects';
import ContactFormComponent from '@/components/_blocks/ContactForm';
import Divider from '@/components/UI/Divider';
import Card from '@/components/_blocks/Card';
import GridLayout from '@/components/_blocks/GridLayout';

interface RenderBlockConfig {
  projectId?: string;
  dataset?: string;
  baseUrl?: string;
}

interface RenderBlockOptions {
  documentId?: string;
  documentType?: string;
  blockPath: string;
  siteSettings?: SiteSettingsProps;
  companyLinks?: COMPANY_LINKS_QUERYResult;
  clientsData?: CLIENTS_QUERYResult | null;
  equipmentListData?: EQUIPMENT_LIST_QUERYResult | null;
  teamMembersData?: TEAM_MEMBERS_QUERYResult | null;
  allProjectsData?: ALL_PROJECTS_QUERYResult | null;
  contactFormSettings?: CONTACT_FORM_SETTINGS_QUERYResult | null;
  alignment?: 'left' | 'center' | 'right';
  config?: RenderBlockConfig;
}

// Add _key to block types (added by Sanity when blocks are in arrays)
type WithKey<T> = T & { _key: string };

// Union type of all possible block types with _key
type BlockType =
  | WithKey<RichTextType>
  | WithKey<QuoteType>
  | WithKey<TwoColumnLayoutType>
  | WithKey<CtaButtonType>
  | WithKey<CtaCalloutLinkType>
  | WithKey<CtaBlogPostType>
  | WithKey<ImageBlockType>
  | WithKey<ImageGalleryType>
  | WithKey<YouTubeVideoType>
  | WithKey<SpotifyWidgetType>
  | WithKey<BandcampWidgetType>
  | WithKey<AudioSamplePlayerType>
  | WithKey<CompanyLinksBlockType>
  | WithKey<BlockListWithStatsType>
  | WithKey<CheckListType>
  | WithKey<ItemListType>
  | WithKey<EquipmentListType>
  | WithKey<ClientListType>
  | WithKey<TeamMemberListType>
  | WithKey<ProjectListType>
  | WithKey<FeaturedProjectsType>
  | WithKey<ContactFormType>
  | WithKey<DividerType>
  | WithKey<CardType>
  | WithKey<GridLayoutType>;

/**
 * Shared block rendering logic used by both PageBuilder and Card components.
 * This eliminates duplication and ensures consistent block rendering across the app.
 */
export const renderBlock = (block: unknown, options: RenderBlockOptions): React.ReactNode => {
  const {
    documentId,
    documentType,
    blockPath,
    siteSettings,
    companyLinks,
    clientsData,
    equipmentListData,
    teamMembersData,
    allProjectsData,
    contactFormSettings,
    alignment = 'center',
    config,
  } = options;

  // Type narrow to BlockType
  const typedBlock = block as BlockType;

  // Wrapper for Sanity live editing
  const BlockWrapper = ({ children }: { children: React.ReactNode }) => {
    if (documentId && documentType && config) {
      return (
        <div
          data-sanity={createDataAttribute({
            ...config,
            id: documentId,
            type: documentType,
            path: blockPath,
          }).toString()}>
          {children}
        </div>
      );
    }
    return <div>{children}</div>;
  };

  switch (typedBlock._type) {
    case 'divider': {
      const dividerBlock = typedBlock as WithKey<DividerType>;
      return (
        <BlockWrapper key={dividerBlock._key}>
          <Divider size='half' color='dark' />
        </BlockWrapper>
      );
    }

    case 'richText': {
      const richTextBlock = typedBlock as WithKey<RichTextType>;
      return (
        <BlockWrapper key={richTextBlock._key}>
          <RichText
            {...richTextBlock}
            inheritAlignment={alignment}
            fullWidth={
              documentType === 'blogPost' ||
              documentType === 'termsAndConditions' ||
              documentType === 'privacyPolicy'
            }
          />
        </BlockWrapper>
      );
    }

    case 'quote': {
      const quoteBlock = typedBlock as WithKey<QuoteType>;
      return (
        <BlockWrapper key={quoteBlock._key}>
          <Quote {...quoteBlock} inheritAlignment={alignment} />
        </BlockWrapper>
      );
    }

    case 'twoColumnLayout': {
      const twoColBlock = typedBlock as WithKey<TwoColumnLayoutType>;
      return (
        <BlockWrapper key={twoColBlock._key}>
          <TwoColumnLayout
            {...twoColBlock}
            documentId={documentId}
            documentType={documentType}
            pathPrefix={blockPath}
            siteSettings={siteSettings}
            companyLinks={companyLinks}
            clientsData={clientsData}
            equipmentListData={equipmentListData}
            teamMembersData={teamMembersData}
            contactFormSettings={contactFormSettings}
            alignment={alignment}
          />
        </BlockWrapper>
      );
    }

    case 'ctaButton': {
      const ctaButtonBlock = typedBlock as WithKey<CtaButtonType>;
      return (
        <BlockWrapper key={ctaButtonBlock._key}>
          <CTAButton {...ctaButtonBlock} inheritAlignment={alignment} />
        </BlockWrapper>
      );
    }

    case 'ctaCalloutLink': {
      const ctaCalloutBlock = typedBlock as WithKey<CtaCalloutLinkType>;
      return (
        <BlockWrapper key={ctaCalloutBlock._key}>
          <CTACalloutLinkComponent {...ctaCalloutBlock} />
        </BlockWrapper>
      );
    }

    case 'ctaBlogPost': {
      const ctaBlogPostBlock = typedBlock as WithKey<CtaBlogPostType>;
      return (
        <BlockWrapper key={ctaBlogPostBlock._key}>
          <CTABlogPost {...ctaBlogPostBlock} />
        </BlockWrapper>
      );
    }

    case 'imageBlock': {
      const imageBlockBlock = typedBlock as WithKey<ImageBlockType>;
      return (
        <BlockWrapper key={imageBlockBlock._key}>
          <ImageBlock
            {...imageBlockBlock}
            documentId={documentId}
            documentType={documentType}
            pathPrefix={blockPath}
          />
        </BlockWrapper>
      );
    }

    case 'imageGallery': {
      const imageGalleryBlock = typedBlock as WithKey<ImageGalleryType>;
      return (
        <BlockWrapper key={imageGalleryBlock._key}>
          <ImageGallery
            {...imageGalleryBlock}
            documentId={documentId}
            documentType={documentType}
            pathPrefix={blockPath}
          />
        </BlockWrapper>
      );
    }

    case 'youTubeVideo': {
      const youTubeBlock = typedBlock as WithKey<YouTubeVideoType>;
      return (
        <BlockWrapper key={youTubeBlock._key}>
          <YouTubeVideo {...youTubeBlock} />
        </BlockWrapper>
      );
    }

    case 'spotifyWidget': {
      const spotifyBlock = typedBlock as WithKey<SpotifyWidgetType>;
      return (
        <BlockWrapper key={spotifyBlock._key}>
          <SpotifyWidget
            {...spotifyBlock}
            documentId={documentId}
            documentType={documentType}
            pathPrefix={blockPath}
          />
        </BlockWrapper>
      );
    }

    case 'bandcampWidget': {
      const bandcampBlock = typedBlock as WithKey<BandcampWidgetType>;
      return (
        <BlockWrapper key={bandcampBlock._key}>
          <BandcampWidget
            {...bandcampBlock}
            documentId={documentId}
            documentType={documentType}
            pathPrefix={blockPath}
          />
        </BlockWrapper>
      );
    }

    case 'audioSamplePlayer': {
      const audioSamplePlayerBlock = typedBlock as WithKey<AudioSamplePlayerType>;

      // The audioSamples references are expanded by GROQ query
      const audioSamples = (audioSamplePlayerBlock.audioSamples || []) as Array<{
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

      if (!audioSamples || audioSamples.length === 0) {
        return null;
      }

      return (
        <BlockWrapper key={audioSamplePlayerBlock._key}>
          <AudioSamplePlayer
            audioSamples={audioSamples}
            documentId={documentId}
            documentType={documentType}
          />
        </BlockWrapper>
      );
    }

    case 'companyLinksBlock': {
      const companyLinksBlockBlock = typedBlock as WithKey<CompanyLinksBlockType>;
      return (
        <BlockWrapper key={companyLinksBlockBlock._key}>
          <CompanyLinksBlock
            {...companyLinksBlockBlock}
            companyLinks={companyLinks?.companyLinks || null}
          />
        </BlockWrapper>
      );
    }

    case 'blockListWithStats': {
      const blockListWithStatsBlock = typedBlock as WithKey<BlockListWithStatsType>;
      return (
        <BlockWrapper key={blockListWithStatsBlock._key}>
          <BlockListWithStats
            {...blockListWithStatsBlock}
            documentId={documentId}
            documentType={documentType}
            fieldPathPrefix={blockPath}
          />
        </BlockWrapper>
      );
    }

    case 'checkList': {
      const checkListBlock = typedBlock as WithKey<CheckListType>;
      return (
        <BlockWrapper key={checkListBlock._key}>
          <CheckList
            {...checkListBlock}
            documentId={documentId}
            documentType={documentType}
            fieldPathPrefix={blockPath}
          />
        </BlockWrapper>
      );
    }

    case 'itemList': {
      const itemListBlock = typedBlock as WithKey<ItemListType>;
      return (
        <BlockWrapper key={itemListBlock._key}>
          <ItemList {...itemListBlock} inheritAlignment={alignment} />
        </BlockWrapper>
      );
    }

    case 'equipmentList': {
      const equipmentListBlock = typedBlock as WithKey<EquipmentListType>;
      return (
        <BlockWrapper key={equipmentListBlock._key}>
          <EquipmentList equipmentListData={equipmentListData} />
        </BlockWrapper>
      );
    }

    case 'clientList': {
      const clientListBlock = typedBlock as WithKey<ClientListType>;
      return (
        <BlockWrapper key={clientListBlock._key}>
          <ClientList
            documentId={clientsData?._id || 'clients'}
            documentType='clients'
            clientsData={clientsData}
          />
        </BlockWrapper>
      );
    }

    case 'teamMemberList': {
      const teamMemberListBlock = typedBlock as WithKey<TeamMemberListType>;
      return (
        <BlockWrapper key={teamMemberListBlock._key}>
          <TeamMemberListComponent
            category={teamMemberListBlock.category as 'primary' | 'secondary'}
            displayStyle={teamMemberListBlock.displayStyle as 'detailed' | 'condensed'}
            teamMembers={teamMembersData || []}
          />
        </BlockWrapper>
      );
    }

    case 'projectList': {
      const projectListBlock = typedBlock as WithKey<ProjectListType>;
      return (
        <BlockWrapper key={projectListBlock._key}>
          <ProjectListComponent projects={allProjectsData || []} />
        </BlockWrapper>
      );
    }

    case 'featuredProjects': {
      const featuredProjectsBlock = typedBlock as WithKey<FeaturedProjectsType>;
      // Projects are already dereferenced in the GROQ query via the contentProjection
      // The schema type shows references, but at runtime they're dereferenced objects
      const featuredProjects = (featuredProjectsBlock.projects ||
        []) as unknown as FEATURED_PROJECTS_QUERYResult;

      return (
        <BlockWrapper key={featuredProjectsBlock._key}>
          <FeaturedProjectsComponent projects={featuredProjects} />
        </BlockWrapper>
      );
    }

    case 'contactForm': {
      const contactFormBlock = typedBlock as WithKey<ContactFormType>;
      return (
        <BlockWrapper key={contactFormBlock._key}>
          <ContactFormComponent settings={contactFormSettings} />
        </BlockWrapper>
      );
    }

    case 'card': {
      const cardBlock = typedBlock as WithKey<CardType>;
      return (
        <BlockWrapper key={cardBlock._key}>
          <Card
            {...cardBlock}
            documentId={documentId}
            documentType={documentType}
            fieldPathPrefix={blockPath}
            siteSettings={siteSettings}
            companyLinks={companyLinks}
            alignment={alignment}
          />
        </BlockWrapper>
      );
    }

    case 'gridLayout': {
      const gridLayoutBlock = typedBlock as WithKey<GridLayoutType>;
      return (
        <BlockWrapper key={gridLayoutBlock._key}>
          <GridLayout
            {...gridLayoutBlock}
            documentId={documentId}
            documentType={documentType}
            fieldPathPrefix={blockPath}
            equipmentListData={equipmentListData}
          />
        </BlockWrapper>
      );
    }

    default: {
      // TypeScript exhaustiveness check - this ensures all BlockType cases are handled
      // If you get a TypeScript error here, you're missing a case in the switch statement
      const exhaustiveCheck: never = typedBlock;

      if (process.env.NODE_ENV === 'development') {
        const unknownBlock = exhaustiveCheck as { _type?: string };
        console.warn(
          `[blockRenderer] Unhandled block type: "${unknownBlock._type || 'unknown'}"`,
          '\nBlock data:',
          exhaustiveCheck,
          '\nThis block type may need to be added to the renderBlock switch statement in src/utils/blockRenderer.tsx'
        );
      }
      return null;
    }
  }
};
