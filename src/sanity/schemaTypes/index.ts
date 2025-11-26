import { type SchemaTypeDefinition } from 'sanity';


import { blockContentType } from './blockContentType';
import { pageType } from './pageType';
import { homePageType } from './homePageType';
import { headerType } from './headerType';
import { footerType } from './footerType';
import { pageBuilderType } from './pageBuilderType';
import { pageSectionType } from './pageSectionType';
import { subSectionType } from './subSectionType';
import { subSubSectionType } from './subSubSectionType';
import { contentWrapperType } from './contentWrapperType';
import { dividerType } from './blocks/dividerType';
import { richTextType } from './blocks/richTextType';
import { cardType } from './blocks/cardType';
import { gridLayoutType } from './blocks/gridLayoutType';
import { imageType } from './blocks/imageType';
import { imageGalleryType } from './blocks/imageGalleryType';
import { youTubeVideoType } from './blocks/youTubeVideoType';
import { quoteType } from './blocks/quoteType';
import { statementType } from './blocks/statementType';
import { twoColumnLayoutType } from './blocks/twoColumnLayoutType';
import { ctaButtonType } from './blocks/ctaButtonType';
import { ctaCalloutLinkType } from './blocks/ctaCalloutLinkType';
import { embeddedCtaButtonType } from './blocks/embeddedCtaButtonType';
import { homeHeroCtaButtonType } from './blocks/homeHeroCtaButtonType';
import { companyLinksBlockType } from './blocks/companyLinksBlockType';
import { iconListType } from './blocks/iconListType';
import { detailedListType } from './blocks/detailedListType';
import { blockListWithStatsType } from './blocks/blockListWithStatsType';
import { checkListType } from './blocks/checkListType';
import { itemListType } from './blocks/itemListType';
import { serviceCardType } from './blocks/serviceCardType';
import { contactFormType } from './blocks/contactFormType';
import { siteSettingsType } from './siteSettingsType';
import { companyLinksType } from './companyLinksType';
import { companyLinksArrayType } from './shared/socialLinksArrayType';
import { ctaListType } from './shared/ctaListType';
import { navLinkType } from './navigation/navLinkType';
import { verticalNavLinkType } from './navigation/verticalNavLinkType';
import { verticalNavDividerType } from './navigation/verticalNavDividerType';
import { navSectionType } from './navigation/navSectionType';
import { termsAndConditionsType } from './termsAndConditionsType';
import { privacyPolicyType } from './privacyPolicyType';
import { contactFormSettingsType } from './contactFormSettingsType';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Documents
    siteSettingsType,
    companyLinksType,
    contactFormSettingsType,
    homePageType,
    pageType,
    termsAndConditionsType,
    privacyPolicyType,
    blockContentType,
    // Objects
    headerType,
    footerType,
    pageBuilderType,
    pageSectionType,
    subSectionType,
    subSubSectionType,
    contentWrapperType,
    dividerType,
    richTextType,
    cardType,
    gridLayoutType,
    imageType,
    imageGalleryType,
    youTubeVideoType,
    quoteType,
    statementType,
    twoColumnLayoutType,
    ctaButtonType,
    ctaCalloutLinkType,
    embeddedCtaButtonType,
    homeHeroCtaButtonType,
    companyLinksBlockType,
    iconListType,
    detailedListType,
    blockListWithStatsType,
    checkListType,
    itemListType,
    serviceCardType,
    contactFormType,
    // Shared Components
    companyLinksArrayType,
    ctaListType,
    // Navigation Components
    navLinkType,
    verticalNavLinkType,
    verticalNavDividerType,
    navSectionType,
  ],
};
