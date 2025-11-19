import type { StructureResolver } from 'sanity/structure';
import {
  HomeIcon,
  DocumentIcon,
  EditIcon,
  UsersIcon,
  HeartIcon,
  PlayIcon,
  CogIcon,
  DocumentTextIcon,
  FolderIcon,
} from '@sanity/icons';

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content Management')
    .items([
      // === HOME PAGE ===
      S.listItem()
        .id('homePage')
        .schemaType('homePage')
        .title('Home Page')
        .icon(HomeIcon)
        .child(
          S.editor().id('homePage').schemaType('homePage').documentId('homePage').title('Home Page')
        ),

      S.divider(),

      // === PAGES ===
      S.listItem()
        .id('pages')
        .title('Pages')
        .icon(DocumentIcon)
        .child(
          S.documentTypeList('page').title('Pages').filter('_type == "page" && _id != "homePage"')
        ),

      S.divider(),

      // === CLIENTS ===
      S.listItem()
        .id('clients')
        .title('Clients')
        .icon(HeartIcon)
        .child(
          S.editor().id('clients').schemaType('clients').documentId('clients').title('Clients')
        ),

      S.divider(),

      // === TEAM MEMBERS ===
      S.listItem()
        .id('teamMembers')
        .title('Team Members')
        .icon(UsersIcon)
        .child(
          S.documentTypeList('teamMember')
            .title('Team Members')
            .defaultOrdering([
              { field: 'displayOrder', direction: 'asc' },
              { field: 'name', direction: 'asc' },
            ])
        ),

      S.divider(),

      // === EQUIPMENT LIST ===
      S.listItem()
        .id('equipmentListSingleton')
        .title('Equipment List')
        .icon(CogIcon)
        .child(
          S.editor()
            .id('equipmentListSingleton')
            .schemaType('equipmentListSingleton')
            .documentId('equipmentListSingleton')
            .title('Equipment List')
        ),

      S.divider(),

      // === AUDIO SAMPLES ===
      S.listItem()
        .id('audioSamples')
        .title('Audio Samples')
        .icon(PlayIcon)
        .child(
          S.documentTypeList('audioSample')
            .title('Audio Samples')
            .defaultOrdering([{ field: '_createdAt', direction: 'desc' }])
        ),

      S.divider(),

      // === PROJECTS ===
      S.listItem()
        .id('projects')
        .title('Projects')
        .icon(FolderIcon)
        .child(
          S.documentTypeList('project')
            .title('Projects')
            .defaultOrdering([
              { field: 'order', direction: 'asc' },
              { field: 'name', direction: 'asc' },
            ])
        ),

      S.divider(),

      // === BLOG ===
      S.listItem()
        .id('blog')
        .title('Blog')
        .icon(EditIcon)
        .child(
          S.list()
            .title('Blog Management')
            .items([
              // Blog Index Page - Singleton
              S.listItem()
                .id('blogIndexPage')
                .schemaType('blogIndexPage')
                .title('Blog Index Page')
                .child(
                  S.editor()
                    .id('blogIndexPage')
                    .schemaType('blogIndexPage')
                    .documentId('blogIndexPage')
                    .title('Blog Index Page')
                ),
              // Individual Blog Posts
              S.listItem()
                .id('blogPosts')
                .title('Blog Posts')
                .child(
                  S.documentTypeList('blogPost')
                    .title('Blog Posts')
                    .defaultOrdering([{ field: '_createdAt', direction: 'desc' }])
                ),
            ])
        ),

      S.divider(),

      // === SITE MANAGEMENT ===
      S.listItem()
        .title('Site Management')
        .icon(CogIcon)
        .child(
          S.list()
            .title('Site Management')
            .items([
              // Header - Singleton
              S.listItem()
                .id('header')
                .schemaType('header')
                .title('Header')
                .child(
                  S.editor().id('header').schemaType('header').documentId('header').title('Header')
                ),
              // Footer - Singleton
              S.listItem()
                .id('footer')
                .schemaType('footer')
                .title('Footer')
                .child(
                  S.editor().id('footer').schemaType('footer').documentId('footer').title('Footer')
                ),
              // Company Links - Singleton
              S.listItem()
                .id('companyLinks')
                .schemaType('companyLinks')
                .title('Company Links')
                .child(
                  S.editor()
                    .id('companyLinks')
                    .schemaType('companyLinks')
                    .documentId('companyLinks')
                    .title('Company Links')
                ),
              // Site Settings - Singleton
              S.listItem()
                .id('siteSettings')
                .schemaType('siteSettings')
                .title('Site Settings')
                .child(
                  S.editor()
                    .id('siteSettings')
                    .schemaType('siteSettings')
                    .documentId('siteSettings')
                    .title('Site Settings')
                ),
              // Contact Form Settings - Singleton
              S.listItem()
                .id('contactFormSettings')
                .schemaType('contactFormSettings')
                .title('Contact Form')
                .child(
                  S.editor()
                    .id('contactFormSettings')
                    .schemaType('contactFormSettings')
                    .documentId('contactFormSettings')
                    .title('Contact Form Settings')
                ),

              S.divider(),

              // Legal - Menu for Terms & Conditions and Privacy Policy
              S.listItem()
                .id('legal')
                .title('Legal')
                .icon(DocumentTextIcon)
                .child(
                  S.list()
                    .title('Legal Documents')
                    .items([
                      // Terms & Conditions - Singleton
                      S.listItem()
                        .id('termsAndConditions')
                        .schemaType('termsAndConditions')
                        .title('Terms & Conditions')
                        .child(
                          S.editor()
                            .id('termsAndConditions')
                            .schemaType('termsAndConditions')
                            .documentId('termsAndConditions')
                            .title('Terms & Conditions')
                        ),
                      // Privacy Policy - Singleton
                      S.listItem()
                        .id('privacyPolicy')
                        .schemaType('privacyPolicy')
                        .title('Privacy Policy')
                        .child(
                          S.editor()
                            .id('privacyPolicy')
                            .schemaType('privacyPolicy')
                            .documentId('privacyPolicy')
                            .title('Privacy Policy')
                        ),
                    ])
                ),
            ])
        ),
    ]);
