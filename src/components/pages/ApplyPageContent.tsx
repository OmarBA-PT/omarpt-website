import React from 'react';
import { getBaseUrl } from '@/lib/metadata';
import { generateArticleSchema, generateStructuredDataScript } from '@/lib/structuredData';
import { transformQuestionnaireData } from '@/lib/utils/transformQuestionnaireData';
import {
  getOrganizationName,
  getOrganizationEmail,
  getOrganizationEmailLink,
} from '@/lib/organizationInfo';
import ApplyPageClient from '@/components/pages/ApplyPageClient';
import type {
  APPLY_PAGE_QUERYResult,
  APPLY_PRIVACY_STATEMENT_QUERYResult,
  APPLY_QUESTIONNAIRE_QUERYResult,
} from '@/sanity/types';
import type { PageBuilderData } from '@/actions';

interface ApplyPageContentProps {
  applyPageData: APPLY_PAGE_QUERYResult;
  applyPrivacyStatement: APPLY_PRIVACY_STATEMENT_QUERYResult;
  applyQuestionnaire: APPLY_QUESTIONNAIRE_QUERYResult;
  pageBuilderData: PageBuilderData;
}

const ApplyPageContent = ({ applyPageData, applyPrivacyStatement, applyQuestionnaire, pageBuilderData }: ApplyPageContentProps) => {
  const baseUrl = getBaseUrl();

  const { businessContactInfo } = pageBuilderData;
  const orgName = getOrganizationName(businessContactInfo);
  const organizationEmail = getOrganizationEmail(businessContactInfo);
  const organizationEmailLink = getOrganizationEmailLink(businessContactInfo);

  // Transform questionnaire data from Sanity format to form-compatible format
  const questionnaireSections = transformQuestionnaireData(applyQuestionnaire);

  // Fallback values if Sanity data is not available
  const pageTitle = applyPageData?.title || 'Apply for Coaching';
  const pageSubtitle =
    applyPageData?.subtitle || 'Take the first step towards achieving your fitness goals';

  // Generate Article structured data using actual Sanity dates
  const articleSchema = generateArticleSchema({
    headline: pageTitle,
    description: pageSubtitle,
    datePublished: applyPageData?._createdAt || new Date().toISOString(),
    dateModified: applyPageData?._updatedAt || new Date().toISOString(),
    author: {
      name: orgName,
      type: 'Organization',
    },
    publisher: {
      name: orgName,
      url: baseUrl,
      logo: `${baseUrl}/logo.png`,
    },
    url: `${baseUrl}/apply`,
  });

  return (
    <>
      {/* Structured Data */}
      {articleSchema && (
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={generateStructuredDataScript(articleSchema)}
        />
      )}

      {/* Client Component */}
      <ApplyPageClient
        generalContent={applyPageData}
        privacyStatement={applyPrivacyStatement}
        questionnaireSections={questionnaireSections}
        organizationEmail={organizationEmail}
        organizationEmailLink={organizationEmailLink}
        organizationName={orgName}
      />
    </>
  );
};

export default ApplyPageContent;
