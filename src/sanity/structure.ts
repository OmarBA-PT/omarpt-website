import type { StructureResolver } from 'sanity/structure';
import {
  HomeIcon,
  DocumentIcon,
  CogIcon,
  DocumentTextIcon,
  EnvelopeIcon,
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

      // === FAQ PAGE ===
      S.listItem()
        .id('faqPage')
        .schemaType('faqPage')
        .title('FAQ Page')
        .icon(DocumentTextIcon)
        .child(
          S.editor().id('faqPage').schemaType('faqPage').documentId('faqPage').title('FAQ Page')
        ),

      // === CONTACT PAGE ===
      S.listItem()
        .id('contactPage')
        .schemaType('contactPage')
        .title('Contact Page')
        .icon(EnvelopeIcon)
        .child(
          S.editor().id('contactPage').schemaType('contactPage').documentId('contactPage').title('Contact Page')
        ),

      // === APPLY PAGE ===
      S.listItem()
        .id('applyPage')
        .schemaType('applyPage')
        .title('Apply Page')
        .icon(DocumentIcon)
        .child(
          S.editor().id('applyPage').schemaType('applyPage').documentId('applyPage').title('Apply Page')
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
