-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailResendTokens" INTEGER NOT NULL DEFAULT 2,
    "password" TEXT NOT NULL,
    "locationId" INTEGER,
    "role" INTEGER NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "currency" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_status_changelog" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "status" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_status_changelog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_labels" (
    "id" SERIAL NOT NULL,
    "labelId" INTEGER NOT NULL,
    "assignerId" INTEGER NOT NULL,
    "assigneeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_labels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "labels" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "assigneeType" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "labels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "targetId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "isCommon" BOOLEAN NOT NULL DEFAULT false,
    "countryId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "disease_areas" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "isCommon" BOOLEAN NOT NULL DEFAULT false,
    "parentDiseaseAreaId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "disease_areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "influencers" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "invitendByUserId" INTEGER,
    "stakeholderId" INTEGER,
    "affiliateCode" TEXT NOT NULL,
    "gender" INTEGER,
    "dateOfBirth" TIMESTAMP(3),
    "ethnicityId" INTEGER,
    "type" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "influencers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "influencer_survey_amounts" (
    "id" SERIAL NOT NULL,
    "influencerId" INTEGER NOT NULL,
    "surveyType" INTEGER NOT NULL,
    "desiredAmount" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "influencer_survey_amounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "influencer_survey_amount_changelog" (
    "id" SERIAL NOT NULL,
    "influencerSurveyAmountId" INTEGER NOT NULL,
    "desiredAmount" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "influencer_survey_amount_changelog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "influencer_campaign_amounts" (
    "id" SERIAL NOT NULL,
    "influencerId" INTEGER NOT NULL,
    "postType" INTEGER NOT NULL,
    "desiredAmount" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "influencer_campaign_amounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "influencer_campaign_amount_changelog" (
    "id" SERIAL NOT NULL,
    "influencerCampaignAmountId" INTEGER NOT NULL,
    "desiredAmount" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "influencer_campaign_amount_changelog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "influencer_followers" (
    "id" SERIAL NOT NULL,
    "influencerId" INTEGER NOT NULL,
    "stakeholderId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "influencer_followers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "influencer_disease_areas" (
    "id" SERIAL NOT NULL,
    "influencerId" INTEGER NOT NULL,
    "diseaseAreaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "influencer_disease_areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admins" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "isSuperuser" BOOLEAN NOT NULL DEFAULT false,
    "isAIBot" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_roles" (
    "id" SERIAL NOT NULL,
    "adminId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_roles" (
    "id" SERIAL NOT NULL,
    "role" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_permissions" (
    "id" SERIAL NOT NULL,
    "adminId" INTEGER NOT NULL,
    "permissionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" SERIAL NOT NULL,
    "permission" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "id" SERIAL NOT NULL,
    "roleId" INTEGER NOT NULL,
    "permissionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_titles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_titles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdByUserId" INTEGER,
    "isCommon" BOOLEAN NOT NULL DEFAULT false,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_products" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_products" (
    "id" SERIAL NOT NULL,
    "campaignId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaign_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "survey_products" (
    "id" SERIAL NOT NULL,
    "surveyId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "survey_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "genericName" TEXT NOT NULL DEFAULT '',
    "createdByUserId" INTEGER,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "isBranded" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "companyId" INTEGER NOT NULL,
    "companyTitleId" INTEGER NOT NULL,
    "industryId" INTEGER,
    "ambassadorId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_products" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "client_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "industries" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "industries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discover_client_markets" (
    "id" SERIAL NOT NULL,
    "discoverClientId" INTEGER NOT NULL,
    "locationId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "discover_client_markets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discover_client_disease_areas" (
    "id" SERIAL NOT NULL,
    "discoverClientId" INTEGER NOT NULL,
    "diseaseAreaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "discover_client_disease_areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discover_clients" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "companyId" INTEGER,
    "companyTitleId" INTEGER,
    "industryId" INTEGER,
    "email" TEXT,
    "locationId" INTEGER,
    "status" INTEGER NOT NULL,
    "invitationToken" TEXT,
    "contactedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "discover_clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discover_client_products" (
    "id" SERIAL NOT NULL,
    "discoverClientId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "discover_client_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_disease_areas" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "diseaseAreaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "client_disease_areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_markets" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "locationId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "client_markets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stakeholders" (
    "id" SERIAL NOT NULL,
    "socialPlatformId" INTEGER NOT NULL,
    "socialPlatformUserId" TEXT NOT NULL,
    "socialPlatformUsername" TEXT,
    "iv" TEXT,
    "bio" TEXT,
    "type" INTEGER NOT NULL,
    "isRegistered" BOOLEAN NOT NULL DEFAULT false,
    "isSML" BOOLEAN NOT NULL DEFAULT false,
    "isQA" BOOLEAN NOT NULL DEFAULT false,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "followersCount" INTEGER,
    "influencerId" INTEGER,
    "locationId" INTEGER,
    "ethnicityId" INTEGER,
    "gender" INTEGER,
    "dateOfBirth" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stakeholders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stakeholder_posts" (
    "id" SERIAL NOT NULL,
    "stakeholderId" INTEGER NOT NULL,
    "postTimestamp" TIMESTAMP(3) NOT NULL,
    "content" TEXT,
    "language" TEXT,
    "overallSentiment" INTEGER,
    "comments" INTEGER,
    "likes" INTEGER,
    "isReported" BOOLEAN,
    "reportComment" TEXT,
    "preprocessedContent" TEXT,
    "isContentProcessed" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stakeholder_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_content_token_occurences" (
    "id" SERIAL NOT NULL,
    "postId" INTEGER NOT NULL,
    "tokenId" INTEGER NOT NULL,
    "occurences" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "post_content_token_occurences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_content_tokens" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "tokenType" INTEGER NOT NULL,
    "occurences" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "post_content_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_symptoms" (
    "id" SERIAL NOT NULL,
    "stakeholderPostId" INTEGER NOT NULL,
    "symptomId" INTEGER NOT NULL,
    "symptomSentiment" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "post_symptoms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_disease_areas" (
    "id" SERIAL NOT NULL,
    "stakeholderPostId" INTEGER NOT NULL,
    "diseaseAreaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "post_disease_areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_brands" (
    "id" SERIAL NOT NULL,
    "stakeholderPostId" INTEGER NOT NULL,
    "brandId" INTEGER NOT NULL,
    "brandSentiment" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "post_brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_products" (
    "id" SERIAL NOT NULL,
    "stakeholderPostId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "productSentiment" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "post_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_struggles" (
    "id" SERIAL NOT NULL,
    "stakeholderPostId" INTEGER NOT NULL,
    "struggleId" INTEGER NOT NULL,
    "struggleSentiment" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "post_struggles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_interests" (
    "id" SERIAL NOT NULL,
    "stakeholderPostId" INTEGER NOT NULL,
    "interestId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "post_interests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_themes" (
    "id" SERIAL NOT NULL,
    "stakeholderPostId" INTEGER NOT NULL,
    "themeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "post_themes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "themes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "themes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient_caregiver_disease_areas" (
    "id" SERIAL NOT NULL,
    "stakeholderId" INTEGER NOT NULL,
    "diseaseAreaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patient_caregiver_disease_areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stakeholder_interests" (
    "id" SERIAL NOT NULL,
    "interestId" INTEGER NOT NULL,
    "stakeholderId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stakeholder_interests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interests" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "interests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ethnicities" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ethnicities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "struggles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "struggles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "symptoms" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "symptoms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaigns" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "platformProductOrderId" INTEGER NOT NULL,
    "dateStart" TIMESTAMP(3),
    "dateEnd" TIMESTAMP(3),
    "description" TEXT,
    "influencersCount" INTEGER,
    "ageMin" INTEGER,
    "ageMax" INTEGER,
    "language" INTEGER,
    "targetAudienceDescription" TEXT,
    "socialPlatformId" INTEGER,
    "postType" INTEGER,
    "clientCompanyWebsite" TEXT,
    "instructions" TEXT,
    "contract" TEXT,
    "isContractApproved" BOOLEAN NOT NULL DEFAULT false,
    "report" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_example_images" (
    "id" SERIAL NOT NULL,
    "campaignId" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaign_example_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_stakeholder_types" (
    "id" SERIAL NOT NULL,
    "campaignId" INTEGER NOT NULL,
    "stakeholderType" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "campaign_stakeholder_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_influencers_sizes" (
    "id" SERIAL NOT NULL,
    "campaignId" INTEGER NOT NULL,
    "influencerSizeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "campaign_influencers_sizes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "influencers_sizes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "from" INTEGER NOT NULL,
    "to" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "influencers_sizes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_reports" (
    "id" SERIAL NOT NULL,
    "platformProductOrderId" INTEGER NOT NULL,
    "campaignId" INTEGER NOT NULL,
    "reportType" INTEGER,
    "status" INTEGER NOT NULL,
    "description" TEXT,
    "reach" BOOLEAN,
    "numOfLikes" BOOLEAN,
    "numOfComments" BOOLEAN,
    "websiteClicks" BOOLEAN,
    "engagement" BOOLEAN,
    "costPerTarget" BOOLEAN,
    "costPerClick" BOOLEAN,
    "costPerLike" BOOLEAN,
    "costPerComment" BOOLEAN,
    "costPerEngagement" BOOLEAN,
    "overlap" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaign_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_influencer_performances" (
    "id" SERIAL NOT NULL,
    "campaignId" INTEGER NOT NULL,
    "influencerId" INTEGER NOT NULL,
    "submissionLink" TEXT NOT NULL,
    "trackingCode" TEXT,
    "postTimestamp" TIMESTAMP(3),
    "comments" INTEGER,
    "likes" INTEGER,
    "costPerTarget" DECIMAL(65,30),
    "costPerClick" DECIMAL(65,30),
    "reach" DECIMAL(65,30),
    "engagement" DECIMAL(65,30),
    "websiteClick" INTEGER,
    "overlap" DECIMAL(65,30),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaign_influencer_performances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_influencer_likers" (
    "id" SERIAL NOT NULL,
    "campaignInfluencerPerformanceId" INTEGER NOT NULL,
    "stakeholderId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaign_influencer_likers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ambassadors" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "companyId" INTEGER NOT NULL,
    "companyTitleId" INTEGER NOT NULL,
    "affiliateCode" TEXT NOT NULL,
    "invitedByAdminId" INTEGER NOT NULL,
    "industryId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ambassadors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_media_listenings" (
    "id" SERIAL NOT NULL,
    "platformProductOrderId" INTEGER NOT NULL,
    "subscriptionLength" INTEGER,
    "monthlyTokens" INTEGER,
    "smlDescription" TEXT,
    "startedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "social_media_listenings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_sml_token_balances" (
    "id" SERIAL NOT NULL,
    "smlId" INTEGER NOT NULL,
    "chatMessageId" INTEGER,
    "tokenBalance" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "client_sml_token_balances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sml_platforms" (
    "id" SERIAL NOT NULL,
    "smlId" INTEGER NOT NULL,
    "socialPlatformId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sml_platforms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_platforms" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "social_platforms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "surveys" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "platformProductOrderId" INTEGER NOT NULL,
    "dateStart" TIMESTAMP(3),
    "dateEnd" TIMESTAMP(3),
    "language" INTEGER,
    "surveyDescription" TEXT,
    "participantCount" INTEGER,
    "questionCount" INTEGER,
    "ageMin" INTEGER,
    "ageMax" INTEGER,
    "participantsDescription" TEXT,
    "surveyType" INTEGER,
    "fileUploadUrl" TEXT,
    "instructionsDescription" TEXT,
    "questionCredits" INTEGER,
    "link" TEXT,
    "contract" TEXT,
    "isContractApproved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "surveys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "survey_example_images" (
    "id" SERIAL NOT NULL,
    "surveyId" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "survey_example_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_survey_token_balances" (
    "id" SERIAL NOT NULL,
    "surveyId" INTEGER NOT NULL,
    "chatMessageId" INTEGER,
    "tokenBalance" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "client_survey_token_balances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "survey_questions" (
    "id" SERIAL NOT NULL,
    "surveyId" INTEGER NOT NULL,
    "questionText" TEXT NOT NULL,
    "questionType" INTEGER NOT NULL,
    "order" INTEGER,
    "questionCredit" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "survey_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "survey_responses" (
    "id" SERIAL NOT NULL,
    "surveyId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "surveyQuestionId" INTEGER NOT NULL,
    "surveyOptionId" INTEGER,
    "surveyResponseText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "survey_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "survey_options" (
    "id" SERIAL NOT NULL,
    "surveyQuestionId" INTEGER NOT NULL,
    "optionText" TEXT NOT NULL,
    "order" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "survey_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "benefits" (
    "id" SERIAL NOT NULL,
    "benefitPartnershipId" INTEGER,
    "benefitCompanyLink" TEXT,
    "description" TEXT,
    "benefitCategoryId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "benefits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "benefit_suggestions" (
    "id" SERIAL NOT NULL,
    "authorId" INTEGER NOT NULL,
    "partnershipName" TEXT NOT NULL,
    "partnershipLink" TEXT,
    "argumentDescription" TEXT NOT NULL,
    "outcomeDescription" TEXT NOT NULL,
    "statusDescription" TEXT,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "benefit_suggestions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "benefit_locations" (
    "id" SERIAL NOT NULL,
    "benefitId" INTEGER NOT NULL,
    "locationId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "benefit_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "benefit_upvote_counts" (
    "id" SERIAL NOT NULL,
    "benefitSuggestionId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "isUpvoted" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "benefit_upvote_counts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "benefit_partnerships" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "benefit_partnerships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "benefit_categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "benefit_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" SERIAL NOT NULL,
    "transactionFlowId" INTEGER NOT NULL,
    "status" INTEGER NOT NULL,
    "availableAmounts" DECIMAL(65,30) NOT NULL,
    "unavailableAmounts" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction_flows" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "userId" INTEGER NOT NULL,
    "type" INTEGER NOT NULL,
    "productOrderId" INTEGER,
    "vendorId" INTEGER,
    "amount" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transaction_flows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "influencer_ambassador_withdrawals" (
    "id" SERIAL NOT NULL,
    "userStatementId" INTEGER NOT NULL,
    "bankAccountFirstName" TEXT NOT NULL,
    "bankAccountLastName" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "bankAddress" TEXT NOT NULL,
    "iban" TEXT NOT NULL,
    "swiftBic" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "influencer_ambassador_withdrawals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "custom_statements" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "productOrderId" INTEGER NOT NULL,
    "statementName" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "type" INTEGER NOT NULL,
    "subTypeId" INTEGER NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "statementDate" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "isBalanceChange" BOOLEAN NOT NULL,
    "status" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "custom_statements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "custom_statements_subtypes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "custom_statements_subtypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "custom_statement_vendors" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "custom_statement_vendors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_vendors" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "finance_vendors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_product_order_labels" (
    "id" SERIAL NOT NULL,
    "labelId" INTEGER NOT NULL,
    "assignerId" INTEGER NOT NULL,
    "platformProductOrderId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_product_order_labels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_product_orders" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "platformProduct" INTEGER NOT NULL,
    "ambassadorCommission" DECIMAL(65,30),
    "budget" DECIMAL(65,30),
    "currencyId" INTEGER,
    "status" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_product_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_product_order_status_changelog" (
    "id" SERIAL NOT NULL,
    "platformProductOrderId" INTEGER NOT NULL,
    "status" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "platform_product_order_status_changelog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_product_order_genders" (
    "id" SERIAL NOT NULL,
    "productOrderId" INTEGER NOT NULL,
    "gender" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_product_order_genders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_product_order_locations" (
    "id" SERIAL NOT NULL,
    "productOrderId" INTEGER NOT NULL,
    "locationId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_product_order_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_product_order_disease_areas" (
    "id" SERIAL NOT NULL,
    "productOrderId" INTEGER NOT NULL,
    "diseaseAreaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_product_order_disease_areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_product_order_interests" (
    "id" SERIAL NOT NULL,
    "productOrderId" INTEGER NOT NULL,
    "interestId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_product_order_interests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_product_order_ethnicities" (
    "id" SERIAL NOT NULL,
    "productOrderId" INTEGER NOT NULL,
    "ethnicityId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_product_order_ethnicities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_product_order_struggles" (
    "id" SERIAL NOT NULL,
    "productOrderId" INTEGER NOT NULL,
    "struggleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_product_order_struggles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_product_order_symptoms" (
    "id" SERIAL NOT NULL,
    "productOrderId" INTEGER NOT NULL,
    "symptomId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_product_order_symptoms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_product_order_chat_messages" (
    "id" SERIAL NOT NULL,
    "chatRoomId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deleteForAll" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_product_order_chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_order_chat_room_members" (
    "id" SERIAL NOT NULL,
    "productOrderChatRoomId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_order_chat_room_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_product_order_chat_rooms" (
    "id" SERIAL NOT NULL,
    "productOrderId" INTEGER NOT NULL,
    "isGroupRoom" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_product_order_chat_rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_product_order_comments" (
    "id" SERIAL NOT NULL,
    "comment" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "productOrderId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_product_order_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_product_order_influencers" (
    "id" SERIAL NOT NULL,
    "productOrderId" INTEGER NOT NULL,
    "influencerId" INTEGER NOT NULL,
    "agreedAmount" DECIMAL(65,30) NOT NULL,
    "currency" INTEGER NOT NULL,
    "status" INTEGER NOT NULL,
    "signedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_product_order_influencers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "currencies" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "currencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "files" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calendar_events" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "meetUrl" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "eventType" INTEGER NOT NULL,
    "creatorId" INTEGER NOT NULL,
    "organizerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "calendar_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calendar_event_attendees" (
    "id" SERIAL NOT NULL,
    "calendarEventId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "calendar_event_attendees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" SERIAL NOT NULL,
    "type" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "link" TEXT,
    "variant" TEXT NOT NULL DEFAULT 'info',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_users" (
    "id" SERIAL NOT NULL,
    "notificationId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "seen" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_payloads" (
    "id" SERIAL NOT NULL,
    "notificationId" INTEGER NOT NULL,
    "userId" INTEGER,
    "adminId" INTEGER,
    "influencerId" INTEGER,
    "ambassadorId" INTEGER,
    "clientId" INTEGER,
    "campaignId" INTEGER,
    "campaignReportId" INTEGER,
    "socialMediaListeningId" INTEGER,
    "surveyId" INTEGER,
    "calendarEventId" INTEGER,
    "transactionId" INTEGER,
    "transactionFlowId" INTEGER,
    "platformProductOrderId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_payloads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "influencer_followers_distributions" (
    "id" SERIAL NOT NULL,
    "mean" DECIMAL(65,30) NOT NULL,
    "standardDeviation" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "influencer_followers_distributions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "influencer_followers_distribution_ranges" (
    "id" SERIAL NOT NULL,
    "influencerFollowersDistributionId" INTEGER NOT NULL,
    "from" DECIMAL(65,30),
    "to" DECIMAL(65,30),
    "count" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "influencer_followers_distribution_ranges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "influencer_followers_distribution_influencers" (
    "id" SERIAL NOT NULL,
    "influencerFollowersDistributionRangeId" INTEGER NOT NULL,
    "influencerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "influencer_followers_distribution_influencers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "influencer_campaign_desired_amount_distributions" (
    "id" SERIAL NOT NULL,
    "mean" DECIMAL(65,30) NOT NULL,
    "standardDeviation" DECIMAL(65,30) NOT NULL,
    "influencerFollowersDistributionRangeId" INTEGER NOT NULL,
    "postType" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "influencer_campaign_desired_amount_distributions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "influencer_campaign_desired_amount_distribution_ranges" (
    "id" SERIAL NOT NULL,
    "influencerCampaignDesiredAmountDistributionId" INTEGER NOT NULL,
    "from" DECIMAL(65,30),
    "to" DECIMAL(65,30),
    "count" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "influencer_campaign_desired_amount_distribution_ranges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "influencer_survey_desired_amount_distributions" (
    "id" SERIAL NOT NULL,
    "mean" DECIMAL(65,30) NOT NULL,
    "standardDeviation" DECIMAL(65,30) NOT NULL,
    "surveyType" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "influencer_survey_desired_amount_distributions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "influencer_survey_desired_amount_distribution_ranges" (
    "id" SERIAL NOT NULL,
    "influencerSurveyDesiredAmountDistributionId" INTEGER NOT NULL,
    "from" DECIMAL(65,30),
    "to" DECIMAL(65,30),
    "count" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "influencer_survey_desired_amount_distribution_ranges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "legals" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "type" INTEGER NOT NULL,
    "language" TEXT,
    "version" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "legals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_legal_consents" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "legalId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_legal_consents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_labels_assigneeId_labelId_key" ON "user_labels"("assigneeId", "labelId");

-- CreateIndex
CREATE UNIQUE INDEX "labels_name_assigneeType_key" ON "labels"("name", "assigneeType");

-- CreateIndex
CREATE UNIQUE INDEX "locations_name_countryId_key" ON "locations"("name", "countryId");

-- CreateIndex
CREATE UNIQUE INDEX "disease_areas_name_key" ON "disease_areas"("name");

-- CreateIndex
CREATE UNIQUE INDEX "influencers_userId_key" ON "influencers"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "influencers_affiliateCode_key" ON "influencers"("affiliateCode");

-- CreateIndex
CREATE UNIQUE INDEX "influencer_survey_amounts_influencerId_surveyType_key" ON "influencer_survey_amounts"("influencerId", "surveyType");

-- CreateIndex
CREATE UNIQUE INDEX "influencer_campaign_amounts_influencerId_postType_key" ON "influencer_campaign_amounts"("influencerId", "postType");

-- CreateIndex
CREATE UNIQUE INDEX "influencer_followers_influencerId_stakeholderId_key" ON "influencer_followers"("influencerId", "stakeholderId");

-- CreateIndex
CREATE UNIQUE INDEX "influencer_disease_areas_influencerId_diseaseAreaId_key" ON "influencer_disease_areas"("influencerId", "diseaseAreaId");

-- CreateIndex
CREATE UNIQUE INDEX "admins_userId_key" ON "admins"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "admin_roles_adminId_roleId_key" ON "admin_roles"("adminId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "admin_permissions_adminId_permissionId_key" ON "admin_permissions"("adminId", "permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_permission_key" ON "permissions"("permission");

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_roleId_permissionId_key" ON "role_permissions"("roleId", "permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "company_titles_name_key" ON "company_titles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "companies_name_key" ON "companies"("name");

-- CreateIndex
CREATE UNIQUE INDEX "company_products_companyId_productId_key" ON "company_products"("companyId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_products_campaignId_productId_key" ON "campaign_products"("campaignId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "survey_products_surveyId_productId_key" ON "survey_products"("surveyId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "products_name_genericName_key" ON "products"("name", "genericName");

-- CreateIndex
CREATE UNIQUE INDEX "clients_userId_key" ON "clients"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "client_products_clientId_productId_key" ON "client_products"("clientId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "industries_name_key" ON "industries"("name");

-- CreateIndex
CREATE UNIQUE INDEX "discover_client_markets_discoverClientId_locationId_key" ON "discover_client_markets"("discoverClientId", "locationId");

-- CreateIndex
CREATE UNIQUE INDEX "discover_client_disease_areas_discoverClientId_diseaseAreaI_key" ON "discover_client_disease_areas"("discoverClientId", "diseaseAreaId");

-- CreateIndex
CREATE UNIQUE INDEX "discover_client_products_discoverClientId_productId_key" ON "discover_client_products"("discoverClientId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "client_disease_areas_clientId_diseaseAreaId_key" ON "client_disease_areas"("clientId", "diseaseAreaId");

-- CreateIndex
CREATE UNIQUE INDEX "client_markets_clientId_locationId_key" ON "client_markets"("clientId", "locationId");

-- CreateIndex
CREATE UNIQUE INDEX "stakeholders_socialPlatformId_socialPlatformUserId_key" ON "stakeholders"("socialPlatformId", "socialPlatformUserId");

-- CreateIndex
CREATE UNIQUE INDEX "stakeholders_influencerId_socialPlatformId_key" ON "stakeholders"("influencerId", "socialPlatformId");

-- CreateIndex
CREATE UNIQUE INDEX "post_content_token_occurences_postId_tokenId_key" ON "post_content_token_occurences"("postId", "tokenId");

-- CreateIndex
CREATE UNIQUE INDEX "post_content_tokens_token_key" ON "post_content_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "themes_name_key" ON "themes"("name");

-- CreateIndex
CREATE UNIQUE INDEX "interests_name_key" ON "interests"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ethnicities_name_key" ON "ethnicities"("name");

-- CreateIndex
CREATE UNIQUE INDEX "struggles_name_key" ON "struggles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "symptoms_name_key" ON "symptoms"("name");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_example_images_campaignId_imageUrl_key" ON "campaign_example_images"("campaignId", "imageUrl");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_stakeholder_types_campaignId_stakeholderType_key" ON "campaign_stakeholder_types"("campaignId", "stakeholderType");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_influencers_sizes_campaignId_influencerSizeId_key" ON "campaign_influencers_sizes"("campaignId", "influencerSizeId");

-- CreateIndex
CREATE UNIQUE INDEX "influencers_sizes_name_key" ON "influencers_sizes"("name");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_reports_campaignId_key" ON "campaign_reports"("campaignId");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_reports_id_status_key" ON "campaign_reports"("id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_influencer_performances_trackingCode_key" ON "campaign_influencer_performances"("trackingCode");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_influencer_performances_campaignId_influencerId_key" ON "campaign_influencer_performances"("campaignId", "influencerId");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_influencer_likers_campaignInfluencerPerformanceId__key" ON "campaign_influencer_likers"("campaignInfluencerPerformanceId", "stakeholderId");

-- CreateIndex
CREATE UNIQUE INDEX "ambassadors_userId_key" ON "ambassadors"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "sml_platforms_smlId_socialPlatformId_key" ON "sml_platforms"("smlId", "socialPlatformId");

-- CreateIndex
CREATE UNIQUE INDEX "social_platforms_name_key" ON "social_platforms"("name");

-- CreateIndex
CREATE UNIQUE INDEX "survey_example_images_surveyId_imageUrl_key" ON "survey_example_images"("surveyId", "imageUrl");

-- CreateIndex
CREATE UNIQUE INDEX "survey_responses_userId_surveyQuestionId_surveyOptionId_key" ON "survey_responses"("userId", "surveyQuestionId", "surveyOptionId");

-- CreateIndex
CREATE UNIQUE INDEX "benefit_locations_benefitId_locationId_key" ON "benefit_locations"("benefitId", "locationId");

-- CreateIndex
CREATE UNIQUE INDEX "benefit_upvote_counts_benefitSuggestionId_userId_key" ON "benefit_upvote_counts"("benefitSuggestionId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "benefit_categories_name_key" ON "benefit_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "platform_product_order_genders_productOrderId_gender_key" ON "platform_product_order_genders"("productOrderId", "gender");

-- CreateIndex
CREATE UNIQUE INDEX "platform_product_order_locations_productOrderId_locationId_key" ON "platform_product_order_locations"("productOrderId", "locationId");

-- CreateIndex
CREATE UNIQUE INDEX "platform_product_order_disease_areas_productOrderId_disease_key" ON "platform_product_order_disease_areas"("productOrderId", "diseaseAreaId");

-- CreateIndex
CREATE UNIQUE INDEX "platform_product_order_interests_productOrderId_interestId_key" ON "platform_product_order_interests"("productOrderId", "interestId");

-- CreateIndex
CREATE UNIQUE INDEX "platform_product_order_ethnicities_productOrderId_ethnicity_key" ON "platform_product_order_ethnicities"("productOrderId", "ethnicityId");

-- CreateIndex
CREATE UNIQUE INDEX "platform_product_order_struggles_productOrderId_struggleId_key" ON "platform_product_order_struggles"("productOrderId", "struggleId");

-- CreateIndex
CREATE UNIQUE INDEX "platform_product_order_symptoms_productOrderId_symptomId_key" ON "platform_product_order_symptoms"("productOrderId", "symptomId");

-- CreateIndex
CREATE UNIQUE INDEX "product_order_chat_room_members_productOrderChatRoomId_user_key" ON "product_order_chat_room_members"("productOrderChatRoomId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "platform_product_order_influencers_productOrderId_influence_key" ON "platform_product_order_influencers"("productOrderId", "influencerId");

-- CreateIndex
CREATE UNIQUE INDEX "currencies_code_key" ON "currencies"("code");

-- CreateIndex
CREATE UNIQUE INDEX "calendar_event_attendees_calendarEventId_userId_key" ON "calendar_event_attendees"("calendarEventId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "notification_payloads_notificationId_key" ON "notification_payloads"("notificationId");

-- CreateIndex
CREATE UNIQUE INDEX "legals_type_language_version_key" ON "legals"("type", "language", "version");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_status_changelog" ADD CONSTRAINT "user_status_changelog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_labels" ADD CONSTRAINT "user_labels_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_labels" ADD CONSTRAINT "user_labels_assignerId_fkey" FOREIGN KEY ("assignerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_labels" ADD CONSTRAINT "user_labels_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "labels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disease_areas" ADD CONSTRAINT "disease_areas_parentDiseaseAreaId_fkey" FOREIGN KEY ("parentDiseaseAreaId") REFERENCES "disease_areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "influencers" ADD CONSTRAINT "influencers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "influencers" ADD CONSTRAINT "influencers_invitendByUserId_fkey" FOREIGN KEY ("invitendByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "influencers" ADD CONSTRAINT "influencers_ethnicityId_fkey" FOREIGN KEY ("ethnicityId") REFERENCES "ethnicities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "influencer_survey_amounts" ADD CONSTRAINT "influencer_survey_amounts_influencerId_fkey" FOREIGN KEY ("influencerId") REFERENCES "influencers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "influencer_survey_amount_changelog" ADD CONSTRAINT "influencer_survey_amount_changelog_influencerSurveyAmountI_fkey" FOREIGN KEY ("influencerSurveyAmountId") REFERENCES "influencer_survey_amounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "influencer_campaign_amounts" ADD CONSTRAINT "influencer_campaign_amounts_influencerId_fkey" FOREIGN KEY ("influencerId") REFERENCES "influencers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "influencer_campaign_amount_changelog" ADD CONSTRAINT "influencer_campaign_amount_changelog_influencerCampaignAmo_fkey" FOREIGN KEY ("influencerCampaignAmountId") REFERENCES "influencer_campaign_amounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "influencer_followers" ADD CONSTRAINT "influencer_followers_influencerId_fkey" FOREIGN KEY ("influencerId") REFERENCES "influencers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "influencer_followers" ADD CONSTRAINT "influencer_followers_stakeholderId_fkey" FOREIGN KEY ("stakeholderId") REFERENCES "stakeholders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "influencer_disease_areas" ADD CONSTRAINT "influencer_disease_areas_influencerId_fkey" FOREIGN KEY ("influencerId") REFERENCES "influencers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "influencer_disease_areas" ADD CONSTRAINT "influencer_disease_areas_diseaseAreaId_fkey" FOREIGN KEY ("diseaseAreaId") REFERENCES "disease_areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_roles" ADD CONSTRAINT "admin_roles_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_roles" ADD CONSTRAINT "admin_roles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "platform_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_permissions" ADD CONSTRAINT "admin_permissions_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_permissions" ADD CONSTRAINT "admin_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "platform_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_products" ADD CONSTRAINT "company_products_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_products" ADD CONSTRAINT "company_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_products" ADD CONSTRAINT "campaign_products_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_products" ADD CONSTRAINT "campaign_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "survey_products" ADD CONSTRAINT "survey_products_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "surveys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "survey_products" ADD CONSTRAINT "survey_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_companyTitleId_fkey" FOREIGN KEY ("companyTitleId") REFERENCES "company_titles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "industries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_ambassadorId_fkey" FOREIGN KEY ("ambassadorId") REFERENCES "ambassadors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_products" ADD CONSTRAINT "client_products_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_products" ADD CONSTRAINT "client_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discover_client_markets" ADD CONSTRAINT "discover_client_markets_discoverClientId_fkey" FOREIGN KEY ("discoverClientId") REFERENCES "discover_clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discover_client_markets" ADD CONSTRAINT "discover_client_markets_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discover_client_disease_areas" ADD CONSTRAINT "discover_client_disease_areas_discoverClientId_fkey" FOREIGN KEY ("discoverClientId") REFERENCES "discover_clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discover_client_disease_areas" ADD CONSTRAINT "discover_client_disease_areas_diseaseAreaId_fkey" FOREIGN KEY ("diseaseAreaId") REFERENCES "disease_areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discover_clients" ADD CONSTRAINT "discover_clients_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discover_clients" ADD CONSTRAINT "discover_clients_companyTitleId_fkey" FOREIGN KEY ("companyTitleId") REFERENCES "company_titles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discover_clients" ADD CONSTRAINT "discover_clients_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "industries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discover_clients" ADD CONSTRAINT "discover_clients_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discover_client_products" ADD CONSTRAINT "discover_client_products_discoverClientId_fkey" FOREIGN KEY ("discoverClientId") REFERENCES "discover_clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discover_client_products" ADD CONSTRAINT "discover_client_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_disease_areas" ADD CONSTRAINT "client_disease_areas_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_disease_areas" ADD CONSTRAINT "client_disease_areas_diseaseAreaId_fkey" FOREIGN KEY ("diseaseAreaId") REFERENCES "disease_areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_markets" ADD CONSTRAINT "client_markets_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_markets" ADD CONSTRAINT "client_markets_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stakeholders" ADD CONSTRAINT "stakeholders_influencerId_fkey" FOREIGN KEY ("influencerId") REFERENCES "influencers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stakeholders" ADD CONSTRAINT "stakeholders_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stakeholders" ADD CONSTRAINT "stakeholders_ethnicityId_fkey" FOREIGN KEY ("ethnicityId") REFERENCES "ethnicities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stakeholders" ADD CONSTRAINT "stakeholders_socialPlatformId_fkey" FOREIGN KEY ("socialPlatformId") REFERENCES "social_platforms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stakeholder_posts" ADD CONSTRAINT "stakeholder_posts_stakeholderId_fkey" FOREIGN KEY ("stakeholderId") REFERENCES "stakeholders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_content_token_occurences" ADD CONSTRAINT "post_content_token_occurences_postId_fkey" FOREIGN KEY ("postId") REFERENCES "stakeholder_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_content_token_occurences" ADD CONSTRAINT "post_content_token_occurences_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "post_content_tokens"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_symptoms" ADD CONSTRAINT "post_symptoms_stakeholderPostId_fkey" FOREIGN KEY ("stakeholderPostId") REFERENCES "stakeholder_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_symptoms" ADD CONSTRAINT "post_symptoms_symptomId_fkey" FOREIGN KEY ("symptomId") REFERENCES "symptoms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_disease_areas" ADD CONSTRAINT "post_disease_areas_diseaseAreaId_fkey" FOREIGN KEY ("diseaseAreaId") REFERENCES "disease_areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_disease_areas" ADD CONSTRAINT "post_disease_areas_stakeholderPostId_fkey" FOREIGN KEY ("stakeholderPostId") REFERENCES "stakeholder_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_brands" ADD CONSTRAINT "post_brands_stakeholderPostId_fkey" FOREIGN KEY ("stakeholderPostId") REFERENCES "stakeholder_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_brands" ADD CONSTRAINT "post_brands_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_products" ADD CONSTRAINT "post_products_stakeholderPostId_fkey" FOREIGN KEY ("stakeholderPostId") REFERENCES "stakeholder_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_products" ADD CONSTRAINT "post_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_struggles" ADD CONSTRAINT "post_struggles_stakeholderPostId_fkey" FOREIGN KEY ("stakeholderPostId") REFERENCES "stakeholder_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_struggles" ADD CONSTRAINT "post_struggles_struggleId_fkey" FOREIGN KEY ("struggleId") REFERENCES "struggles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_interests" ADD CONSTRAINT "post_interests_interestId_fkey" FOREIGN KEY ("interestId") REFERENCES "interests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_interests" ADD CONSTRAINT "post_interests_stakeholderPostId_fkey" FOREIGN KEY ("stakeholderPostId") REFERENCES "stakeholder_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_themes" ADD CONSTRAINT "post_themes_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "themes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_themes" ADD CONSTRAINT "post_themes_stakeholderPostId_fkey" FOREIGN KEY ("stakeholderPostId") REFERENCES "stakeholder_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_caregiver_disease_areas" ADD CONSTRAINT "patient_caregiver_disease_areas_stakeholderId_fkey" FOREIGN KEY ("stakeholderId") REFERENCES "stakeholders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_caregiver_disease_areas" ADD CONSTRAINT "patient_caregiver_disease_areas_diseaseAreaId_fkey" FOREIGN KEY ("diseaseAreaId") REFERENCES "disease_areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stakeholder_interests" ADD CONSTRAINT "stakeholder_interests_interestId_fkey" FOREIGN KEY ("interestId") REFERENCES "interests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stakeholder_interests" ADD CONSTRAINT "stakeholder_interests_stakeholderId_fkey" FOREIGN KEY ("stakeholderId") REFERENCES "stakeholders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_platformProductOrderId_fkey" FOREIGN KEY ("platformProductOrderId") REFERENCES "platform_product_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_example_images" ADD CONSTRAINT "campaign_example_images_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_stakeholder_types" ADD CONSTRAINT "campaign_stakeholder_types_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_influencers_sizes" ADD CONSTRAINT "campaign_influencers_sizes_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_influencers_sizes" ADD CONSTRAINT "campaign_influencers_sizes_influencerSizeId_fkey" FOREIGN KEY ("influencerSizeId") REFERENCES "influencers_sizes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_reports" ADD CONSTRAINT "campaign_reports_platformProductOrderId_fkey" FOREIGN KEY ("platformProductOrderId") REFERENCES "platform_product_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_reports" ADD CONSTRAINT "campaign_reports_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_influencer_performances" ADD CONSTRAINT "campaign_influencer_performances_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_influencer_performances" ADD CONSTRAINT "campaign_influencer_performances_influencerId_fkey" FOREIGN KEY ("influencerId") REFERENCES "influencers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_influencer_likers" ADD CONSTRAINT "campaign_influencer_likers_campaignInfluencerPerformanceId_fkey" FOREIGN KEY ("campaignInfluencerPerformanceId") REFERENCES "campaign_influencer_performances"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_influencer_likers" ADD CONSTRAINT "campaign_influencer_likers_stakeholderId_fkey" FOREIGN KEY ("stakeholderId") REFERENCES "stakeholders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ambassadors" ADD CONSTRAINT "ambassadors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ambassadors" ADD CONSTRAINT "ambassadors_invitedByAdminId_fkey" FOREIGN KEY ("invitedByAdminId") REFERENCES "admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ambassadors" ADD CONSTRAINT "ambassadors_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ambassadors" ADD CONSTRAINT "ambassadors_companyTitleId_fkey" FOREIGN KEY ("companyTitleId") REFERENCES "company_titles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ambassadors" ADD CONSTRAINT "ambassadors_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "industries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_media_listenings" ADD CONSTRAINT "social_media_listenings_platformProductOrderId_fkey" FOREIGN KEY ("platformProductOrderId") REFERENCES "platform_product_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_sml_token_balances" ADD CONSTRAINT "client_sml_token_balances_chatMessageId_fkey" FOREIGN KEY ("chatMessageId") REFERENCES "platform_product_order_chat_messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_sml_token_balances" ADD CONSTRAINT "client_sml_token_balances_smlId_fkey" FOREIGN KEY ("smlId") REFERENCES "social_media_listenings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sml_platforms" ADD CONSTRAINT "sml_platforms_smlId_fkey" FOREIGN KEY ("smlId") REFERENCES "social_media_listenings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sml_platforms" ADD CONSTRAINT "sml_platforms_socialPlatformId_fkey" FOREIGN KEY ("socialPlatformId") REFERENCES "social_platforms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "surveys" ADD CONSTRAINT "surveys_platformProductOrderId_fkey" FOREIGN KEY ("platformProductOrderId") REFERENCES "platform_product_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "survey_example_images" ADD CONSTRAINT "survey_example_images_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "surveys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_survey_token_balances" ADD CONSTRAINT "client_survey_token_balances_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "surveys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_survey_token_balances" ADD CONSTRAINT "client_survey_token_balances_chatMessageId_fkey" FOREIGN KEY ("chatMessageId") REFERENCES "platform_product_order_chat_messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "survey_questions" ADD CONSTRAINT "survey_questions_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "surveys"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "survey_responses" ADD CONSTRAINT "survey_responses_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "surveys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "survey_responses" ADD CONSTRAINT "survey_responses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "survey_responses" ADD CONSTRAINT "survey_responses_surveyOptionId_fkey" FOREIGN KEY ("surveyOptionId") REFERENCES "survey_options"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "survey_options" ADD CONSTRAINT "survey_options_surveyQuestionId_fkey" FOREIGN KEY ("surveyQuestionId") REFERENCES "survey_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "benefits" ADD CONSTRAINT "benefits_benefitPartnershipId_fkey" FOREIGN KEY ("benefitPartnershipId") REFERENCES "benefit_partnerships"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "benefits" ADD CONSTRAINT "benefits_benefitCategoryId_fkey" FOREIGN KEY ("benefitCategoryId") REFERENCES "benefit_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "benefit_suggestions" ADD CONSTRAINT "benefit_suggestions_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "benefit_locations" ADD CONSTRAINT "benefit_locations_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "benefit_locations" ADD CONSTRAINT "benefit_locations_benefitId_fkey" FOREIGN KEY ("benefitId") REFERENCES "benefits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "benefit_upvote_counts" ADD CONSTRAINT "benefit_upvote_counts_benefitSuggestionId_fkey" FOREIGN KEY ("benefitSuggestionId") REFERENCES "benefit_suggestions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "benefit_upvote_counts" ADD CONSTRAINT "benefit_upvote_counts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_transactionFlowId_fkey" FOREIGN KEY ("transactionFlowId") REFERENCES "transaction_flows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_flows" ADD CONSTRAINT "transaction_flows_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "finance_vendors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_flows" ADD CONSTRAINT "transaction_flows_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_flows" ADD CONSTRAINT "transaction_flows_productOrderId_fkey" FOREIGN KEY ("productOrderId") REFERENCES "platform_product_orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_statements" ADD CONSTRAINT "custom_statements_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_statements" ADD CONSTRAINT "custom_statements_subTypeId_fkey" FOREIGN KEY ("subTypeId") REFERENCES "custom_statements_subtypes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_statements" ADD CONSTRAINT "custom_statements_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "custom_statement_vendors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_product_order_labels" ADD CONSTRAINT "platform_product_order_labels_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "labels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_product_order_labels" ADD CONSTRAINT "platform_product_order_labels_assignerId_fkey" FOREIGN KEY ("assignerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_product_order_labels" ADD CONSTRAINT "platform_product_order_labels_platformProductOrderId_fkey" FOREIGN KEY ("platformProductOrderId") REFERENCES "platform_product_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_product_orders" ADD CONSTRAINT "platform_product_orders_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_product_orders" ADD CONSTRAINT "platform_product_orders_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "currencies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_product_order_status_changelog" ADD CONSTRAINT "platform_product_order_status_changelog_platformProductOrd_fkey" FOREIGN KEY ("platformProductOrderId") REFERENCES "platform_product_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_product_order_genders" ADD CONSTRAINT "platform_product_order_genders_productOrderId_fkey" FOREIGN KEY ("productOrderId") REFERENCES "platform_product_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_product_order_locations" ADD CONSTRAINT "platform_product_order_locations_productOrderId_fkey" FOREIGN KEY ("productOrderId") REFERENCES "platform_product_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_product_order_locations" ADD CONSTRAINT "platform_product_order_locations_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_product_order_disease_areas" ADD CONSTRAINT "platform_product_order_disease_areas_productOrderId_fkey" FOREIGN KEY ("productOrderId") REFERENCES "platform_product_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_product_order_disease_areas" ADD CONSTRAINT "platform_product_order_disease_areas_diseaseAreaId_fkey" FOREIGN KEY ("diseaseAreaId") REFERENCES "disease_areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_product_order_interests" ADD CONSTRAINT "platform_product_order_interests_productOrderId_fkey" FOREIGN KEY ("productOrderId") REFERENCES "platform_product_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_product_order_interests" ADD CONSTRAINT "platform_product_order_interests_interestId_fkey" FOREIGN KEY ("interestId") REFERENCES "interests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_product_order_ethnicities" ADD CONSTRAINT "platform_product_order_ethnicities_productOrderId_fkey" FOREIGN KEY ("productOrderId") REFERENCES "platform_product_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_product_order_ethnicities" ADD CONSTRAINT "platform_product_order_ethnicities_ethnicityId_fkey" FOREIGN KEY ("ethnicityId") REFERENCES "ethnicities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_product_order_struggles" ADD CONSTRAINT "platform_product_order_struggles_productOrderId_fkey" FOREIGN KEY ("productOrderId") REFERENCES "platform_product_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_product_order_struggles" ADD CONSTRAINT "platform_product_order_struggles_struggleId_fkey" FOREIGN KEY ("struggleId") REFERENCES "struggles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_product_order_symptoms" ADD CONSTRAINT "platform_product_order_symptoms_productOrderId_fkey" FOREIGN KEY ("productOrderId") REFERENCES "platform_product_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_product_order_symptoms" ADD CONSTRAINT "platform_product_order_symptoms_symptomId_fkey" FOREIGN KEY ("symptomId") REFERENCES "symptoms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_product_order_chat_messages" ADD CONSTRAINT "platform_product_order_chat_messages_chatRoomId_fkey" FOREIGN KEY ("chatRoomId") REFERENCES "platform_product_order_chat_rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_product_order_chat_messages" ADD CONSTRAINT "platform_product_order_chat_messages_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_order_chat_room_members" ADD CONSTRAINT "product_order_chat_room_members_productOrderChatRoomId_fkey" FOREIGN KEY ("productOrderChatRoomId") REFERENCES "platform_product_order_chat_rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_order_chat_room_members" ADD CONSTRAINT "product_order_chat_room_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_product_order_chat_rooms" ADD CONSTRAINT "platform_product_order_chat_rooms_productOrderId_fkey" FOREIGN KEY ("productOrderId") REFERENCES "platform_product_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_product_order_comments" ADD CONSTRAINT "platform_product_order_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_product_order_comments" ADD CONSTRAINT "platform_product_order_comments_productOrderId_fkey" FOREIGN KEY ("productOrderId") REFERENCES "platform_product_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_product_order_influencers" ADD CONSTRAINT "platform_product_order_influencers_productOrderId_fkey" FOREIGN KEY ("productOrderId") REFERENCES "platform_product_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_product_order_influencers" ADD CONSTRAINT "platform_product_order_influencers_influencerId_fkey" FOREIGN KEY ("influencerId") REFERENCES "influencers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calendar_events" ADD CONSTRAINT "calendar_events_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calendar_events" ADD CONSTRAINT "calendar_events_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calendar_event_attendees" ADD CONSTRAINT "calendar_event_attendees_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calendar_event_attendees" ADD CONSTRAINT "calendar_event_attendees_calendarEventId_fkey" FOREIGN KEY ("calendarEventId") REFERENCES "calendar_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_users" ADD CONSTRAINT "notification_users_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "notifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_users" ADD CONSTRAINT "notification_users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_payloads" ADD CONSTRAINT "notification_payloads_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "notifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_payloads" ADD CONSTRAINT "notification_payloads_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_payloads" ADD CONSTRAINT "notification_payloads_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_payloads" ADD CONSTRAINT "notification_payloads_ambassadorId_fkey" FOREIGN KEY ("ambassadorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_payloads" ADD CONSTRAINT "notification_payloads_influencerId_fkey" FOREIGN KEY ("influencerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_payloads" ADD CONSTRAINT "notification_payloads_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_payloads" ADD CONSTRAINT "notification_payloads_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_payloads" ADD CONSTRAINT "notification_payloads_campaignReportId_fkey" FOREIGN KEY ("campaignReportId") REFERENCES "campaign_reports"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_payloads" ADD CONSTRAINT "notification_payloads_socialMediaListeningId_fkey" FOREIGN KEY ("socialMediaListeningId") REFERENCES "social_media_listenings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_payloads" ADD CONSTRAINT "notification_payloads_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "surveys"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_payloads" ADD CONSTRAINT "notification_payloads_calendarEventId_fkey" FOREIGN KEY ("calendarEventId") REFERENCES "calendar_events"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_payloads" ADD CONSTRAINT "notification_payloads_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_payloads" ADD CONSTRAINT "notification_payloads_transactionFlowId_fkey" FOREIGN KEY ("transactionFlowId") REFERENCES "transaction_flows"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_payloads" ADD CONSTRAINT "notification_payloads_platformProductOrderId_fkey" FOREIGN KEY ("platformProductOrderId") REFERENCES "platform_product_orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "influencer_followers_distribution_ranges" ADD CONSTRAINT "influencer_followers_distribution_ranges_influencerFollowe_fkey" FOREIGN KEY ("influencerFollowersDistributionId") REFERENCES "influencer_followers_distributions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "influencer_followers_distribution_influencers" ADD CONSTRAINT "influencer_followers_distribution_influencers_influencerFo_fkey" FOREIGN KEY ("influencerFollowersDistributionRangeId") REFERENCES "influencer_followers_distribution_ranges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "influencer_followers_distribution_influencers" ADD CONSTRAINT "influencer_followers_distribution_influencers_influencerId_fkey" FOREIGN KEY ("influencerId") REFERENCES "influencers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "influencer_campaign_desired_amount_distributions" ADD CONSTRAINT "influencer_campaign_desired_amount_distributions_influence_fkey" FOREIGN KEY ("influencerFollowersDistributionRangeId") REFERENCES "influencer_followers_distribution_ranges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "influencer_campaign_desired_amount_distribution_ranges" ADD CONSTRAINT "influencer_campaign_desired_amount_distribution_ranges_inf_fkey" FOREIGN KEY ("influencerCampaignDesiredAmountDistributionId") REFERENCES "influencer_campaign_desired_amount_distributions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "influencer_survey_desired_amount_distribution_ranges" ADD CONSTRAINT "influencer_survey_desired_amount_distribution_ranges_influ_fkey" FOREIGN KEY ("influencerSurveyDesiredAmountDistributionId") REFERENCES "influencer_survey_desired_amount_distributions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_legal_consents" ADD CONSTRAINT "user_legal_consents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_legal_consents" ADD CONSTRAINT "user_legal_consents_legalId_fkey" FOREIGN KEY ("legalId") REFERENCES "legals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
