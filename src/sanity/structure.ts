import type { StructureResolver } from 'sanity/structure';
import {
  HomeIcon,
  DocumentIcon,
  CogIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  SparklesIcon,
  BlockContentIcon,
  CheckmarkCircleIcon,
  ClipboardIcon,
  DocumentPdfIcon,
  LockIcon,
  MenuIcon,
} from '@sanity/icons';

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content Management')
    .items([
      // === HOME PAGE ===
      S.listItem()
        .id('homePage')
        .title('Home Page')
        .icon(HomeIcon)
        .child(
          S.list()
            .title('Home Page')
            .items([
              // Hero Section
              S.listItem()
                .id('homePageHero')
                .schemaType('homePageHero')
                .title('Hero')
                .icon(SparklesIcon)
                .child(
                  S.editor()
                    .id('homePageHero')
                    .schemaType('homePageHero')
                    .documentId('homePageHero')
                    .title('Hero'),
                ),
              // Custom Sections
              S.listItem()
                .id('homePageSections')
                .schemaType('homePageSections')
                .title('Custom Sections')
                .icon(BlockContentIcon)
                .child(
                  S.editor()
                    .id('homePageSections')
                    .schemaType('homePageSections')
                    .documentId('homePageSections')
                    .title('Custom Sections'),
                ),
            ]),
        ),

      S.divider(),

      // === FAQ PAGE ===
      S.listItem()
        .id('faqPage')
        .schemaType('faqPage')
        .title('FAQ Page')
        .icon(DocumentTextIcon)
        .child(
          S.editor().id('faqPage').schemaType('faqPage').documentId('faqPage').title('FAQ Page'),
        ),

      // === CONTACT PAGE ===
      S.listItem()
        .id('contact')
        .title('Contact')
        .icon(EnvelopeIcon)
        .child(
          S.list()
            .title('Contact')
            .items([
              // General Content
              S.listItem()
                .id('contactGeneralContent')
                .schemaType('contactGeneralContent')
                .title('General Content')
                .icon(DocumentTextIcon)
                .child(
                  S.editor()
                    .id('contactGeneralContent')
                    .schemaType('contactGeneralContent')
                    .documentId('contactGeneralContent')
                    .title('General Content'),
                ),
              // Contact Form
              S.listItem()
                .id('contactFormSettings')
                .schemaType('contactFormSettings')
                .title('Contact Form')
                .icon(CheckmarkCircleIcon)
                .child(
                  S.editor()
                    .id('contactFormSettings')
                    .schemaType('contactFormSettings')
                    .documentId('contactFormSettings')
                    .title('Contact Form'),
                ),
              // Confirmation Email
              S.listItem()
                .id('contactConfirmationEmail')
                .schemaType('contactConfirmationEmail')
                .title('Confirmation Email')
                .icon(EnvelopeIcon)
                .child(
                  S.editor()
                    .id('contactConfirmationEmail')
                    .schemaType('contactConfirmationEmail')
                    .documentId('contactConfirmationEmail')
                    .title('Confirmation Email'),
                ),
            ]),
        ),

      // === APPLY SECTION ===
      S.listItem()
        .id('apply')
        .title('Apply')
        .icon(DocumentIcon)
        .child(
          S.list()
            .title('Apply')
            .items([
              // General Content
              S.listItem()
                .id('applyPage')
                .schemaType('applyPage')
                .title('General Content')
                .icon(DocumentTextIcon)
                .child(
                  S.editor()
                    .id('applyPage')
                    .schemaType('applyPage')
                    .documentId('applyPage')
                    .title('General Content'),
                ),
              // Questionnaire
              S.listItem()
                .id('applyQuestionnaire')
                .schemaType('applyQuestionnaire')
                .title('Questionnaire')
                .icon(ClipboardIcon)
                .child(
                  S.editor()
                    .id('applyQuestionnaire')
                    .schemaType('applyQuestionnaire')
                    .documentId('applyQuestionnaire')
                    .title('Questionnaire'),
                ),
              // PDF Settings
              S.listItem()
                .id('applyPdfSettings')
                .schemaType('applyPdfSettings')
                .title('PDF Specific')
                .icon(DocumentPdfIcon)
                .child(
                  S.editor()
                    .id('applyPdfSettings')
                    .schemaType('applyPdfSettings')
                    .documentId('applyPdfSettings'),
                ),
              // Privacy Statement
              S.listItem()
                .id('applyPrivacyStatement')
                .schemaType('applyPrivacyStatement')
                .title('Privacy Statement')
                .icon(LockIcon)
                .child(
                  S.editor()
                    .id('applyPrivacyStatement')
                    .schemaType('applyPrivacyStatement')
                    .documentId('applyPrivacyStatement')
                    .title('Privacy Statement'),
                ),
            ]),
        ),

      // === LEGAL ===
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
                    .title('Terms & Conditions'),
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
                    .title('Privacy Policy'),
                ),
            ]),
        ),

      // === NAVIGATION ===
      S.listItem()
        .id('navigation')
        .title('Navigation')
        .icon(MenuIcon)
        .child(
          S.list()
            .title('Navigation')
            .items([
              // Header - Singleton
              S.listItem()
                .id('header')
                .schemaType('header')
                .title('Header')
                .child(
                  S.editor().id('header').schemaType('header').documentId('header').title('Header'),
                ),
              // Footer - Singleton
              S.listItem()
                .id('footer')
                .schemaType('footer')
                .title('Footer')
                .child(
                  S.editor().id('footer').schemaType('footer').documentId('footer').title('Footer'),
                ),
            ]),
        ),

      S.divider(),

      // === PAGES ===
      S.listItem()
        .id('pages')
        .title(' Custom Pages')
        .icon(DocumentIcon)
        .child(
          S.documentTypeList('page').title('Pages').filter('_type == "page" && _id != "homePage"'),
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
              // Company Links - Singleton
              S.listItem()
                .id('companyLinks')
                .schemaType('companyLinks')
                .title('Company & Social Links')
                .child(
                  S.editor()
                    .id('companyLinks')
                    .schemaType('companyLinks')
                    .documentId('companyLinks')
                    .title('Company Links'),
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
                    .title('Site Settings'),
                ),
            ]),
        ),
    ]);
