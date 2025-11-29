// Pages actions
export { getHomePage, getPageBySlug, getAllPages } from './pages';

// Site data actions
export { getHeader, getFooter, getSiteSettings, getCompanyLinks, getContactFormSettings, getLegalPagesVisibility, getPageBuilderData } from './siteData';
export type { PageBuilderData } from './siteData';

// Legal actions
export { getTermsAndConditions, getPrivacyPolicy } from './legal';

// Types
export type {
  HOME_PAGE_QUERYResult,
  PAGE_QUERYResult,
} from './types';
