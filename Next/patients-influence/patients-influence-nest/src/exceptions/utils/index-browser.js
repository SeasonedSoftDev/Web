
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum
} = require('@prisma/client/runtime/index-browser')


const Prisma = {}

exports.Prisma = Prisma

/**
 * Prisma Client JS version: 4.14.0
 * Query Engine version: d9a4c5988f480fa576d43970d5a23641aa77bc9c
 */
Prisma.prismaVersion = {
  client: "4.14.0",
  engine: "d9a4c5988f480fa576d43970d5a23641aa77bc9c"
}

Prisma.PrismaClientKnownRequestError = () => {
  throw new Error(`PrismaClientKnownRequestError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  throw new Error(`PrismaClientUnknownRequestError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientRustPanicError = () => {
  throw new Error(`PrismaClientRustPanicError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientInitializationError = () => {
  throw new Error(`PrismaClientInitializationError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientValidationError = () => {
  throw new Error(`PrismaClientValidationError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.NotFoundError = () => {
  throw new Error(`NotFoundError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  throw new Error(`sqltag is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.empty = () => {
  throw new Error(`empty is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.join = () => {
  throw new Error(`join is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.raw = () => {
  throw new Error(`raw is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.validator = () => (val) => val


/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}

/**
 * Enums
 */

exports.Prisma.AdminPermissionScalarFieldEnum = {
  id: 'id',
  adminId: 'adminId',
  permissionId: 'permissionId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AdminRoleScalarFieldEnum = {
  id: 'id',
  adminId: 'adminId',
  roleId: 'roleId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AdminScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  isSuperuser: 'isSuperuser',
  isAIBot: 'isAIBot',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AmbassadorScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  companyId: 'companyId',
  companyTitleId: 'companyTitleId',
  affiliateCode: 'affiliateCode',
  invitedByAdminId: 'invitedByAdminId',
  industryId: 'industryId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BenefitCategoryScalarFieldEnum = {
  id: 'id',
  name: 'name',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BenefitLocationScalarFieldEnum = {
  id: 'id',
  benefitId: 'benefitId',
  locationId: 'locationId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BenefitPartnershipScalarFieldEnum = {
  id: 'id',
  name: 'name',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BenefitScalarFieldEnum = {
  id: 'id',
  benefitPartnershipId: 'benefitPartnershipId',
  benefitCompanyLink: 'benefitCompanyLink',
  description: 'description',
  benefitCategoryId: 'benefitCategoryId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BenefitSuggestionScalarFieldEnum = {
  id: 'id',
  authorId: 'authorId',
  partnershipName: 'partnershipName',
  partnershipLink: 'partnershipLink',
  argumentDescription: 'argumentDescription',
  outcomeDescription: 'outcomeDescription',
  statusDescription: 'statusDescription',
  isApproved: 'isApproved',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BenefitUpvoteCountScalarFieldEnum = {
  id: 'id',
  benefitSuggestionId: 'benefitSuggestionId',
  userId: 'userId',
  isUpvoted: 'isUpvoted',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CalendarEventAttendeeScalarFieldEnum = {
  id: 'id',
  calendarEventId: 'calendarEventId',
  userId: 'userId',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CalendarEventScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  meetUrl: 'meetUrl',
  startTime: 'startTime',
  endTime: 'endTime',
  eventType: 'eventType',
  creatorId: 'creatorId',
  organizerId: 'organizerId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CampaignExampleImageScalarFieldEnum = {
  id: 'id',
  campaignId: 'campaignId',
  imageUrl: 'imageUrl',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CampaignInfluencerLikerScalarFieldEnum = {
  id: 'id',
  campaignInfluencerPerformanceId: 'campaignInfluencerPerformanceId',
  stakeholderId: 'stakeholderId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CampaignInfluencerPerformanceScalarFieldEnum = {
  id: 'id',
  campaignId: 'campaignId',
  influencerId: 'influencerId',
  submissionLink: 'submissionLink',
  trackingCode: 'trackingCode',
  postTimestamp: 'postTimestamp',
  comments: 'comments',
  likes: 'likes',
  costPerTarget: 'costPerTarget',
  costPerClick: 'costPerClick',
  reach: 'reach',
  engagement: 'engagement',
  websiteClick: 'websiteClick',
  overlap: 'overlap',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CampaignInfluencersSizeScalarFieldEnum = {
  id: 'id',
  campaignId: 'campaignId',
  influencerSizeId: 'influencerSizeId',
  createdAt: 'createdAt'
};

exports.Prisma.CampaignProductScalarFieldEnum = {
  id: 'id',
  campaignId: 'campaignId',
  productId: 'productId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CampaignReportScalarFieldEnum = {
  id: 'id',
  platformProductOrderId: 'platformProductOrderId',
  campaignId: 'campaignId',
  reportType: 'reportType',
  status: 'status',
  description: 'description',
  reach: 'reach',
  numOfLikes: 'numOfLikes',
  numOfComments: 'numOfComments',
  websiteClicks: 'websiteClicks',
  engagement: 'engagement',
  costPerTarget: 'costPerTarget',
  costPerClick: 'costPerClick',
  costPerLike: 'costPerLike',
  costPerComment: 'costPerComment',
  costPerEngagement: 'costPerEngagement',
  overlap: 'overlap',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CampaignScalarFieldEnum = {
  id: 'id',
  name: 'name',
  platformProductOrderId: 'platformProductOrderId',
  dateStart: 'dateStart',
  dateEnd: 'dateEnd',
  description: 'description',
  influencersCount: 'influencersCount',
  ageMin: 'ageMin',
  ageMax: 'ageMax',
  targetAudienceDescription: 'targetAudienceDescription',
  socialPlatformId: 'socialPlatformId',
  postType: 'postType',
  clientCompanyWebsite: 'clientCompanyWebsite',
  instructions: 'instructions',
  contract: 'contract',
  isContractApproved: 'isContractApproved',
  report: 'report',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CampaignStakeholderTypeScalarFieldEnum = {
  id: 'id',
  campaignId: 'campaignId',
  stakeholderType: 'stakeholderType',
  createdAt: 'createdAt'
};

exports.Prisma.ClientDiseaseAreaScalarFieldEnum = {
  id: 'id',
  clientId: 'clientId',
  diseaseAreaId: 'diseaseAreaId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ClientMarketScalarFieldEnum = {
  id: 'id',
  clientId: 'clientId',
  locationId: 'locationId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ClientProductScalarFieldEnum = {
  id: 'id',
  clientId: 'clientId',
  productId: 'productId',
  createdAt: 'createdAt'
};

exports.Prisma.ClientSMLTokenBalanceScalarFieldEnum = {
  id: 'id',
  smlId: 'smlId',
  chatMessageId: 'chatMessageId',
  tokenBalance: 'tokenBalance',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ClientScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  companyId: 'companyId',
  companyTitleId: 'companyTitleId',
  industryId: 'industryId',
  ambassadorId: 'ambassadorId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ClientSurveyTokenBalanceScalarFieldEnum = {
  id: 'id',
  surveyId: 'surveyId',
  chatMessageId: 'chatMessageId',
  tokenBalance: 'tokenBalance',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CompanyProductScalarFieldEnum = {
  id: 'id',
  companyId: 'companyId',
  productId: 'productId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CompanyScalarFieldEnum = {
  id: 'id',
  name: 'name',
  createdByUserId: 'createdByUserId',
  isCommon: 'isCommon',
  isApproved: 'isApproved',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CompanyTitleScalarFieldEnum = {
  id: 'id',
  name: 'name',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CurrencyScalarFieldEnum = {
  id: 'id',
  code: 'code',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CustomFinanceStatementScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  productOrderId: 'productOrderId',
  statementName: 'statementName',
  amount: 'amount',
  vendor: 'vendor',
  statementDate: 'statementDate',
  transactionFlowId: 'transactionFlowId',
  email: 'email',
  isBalanceChange: 'isBalanceChange',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  type: 'type'
};

exports.Prisma.DiscoverClientDiseaseAreaScalarFieldEnum = {
  id: 'id',
  discoverClientId: 'discoverClientId',
  diseaseAreaId: 'diseaseAreaId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DiscoverClientMarketScalarFieldEnum = {
  id: 'id',
  discoverClientId: 'discoverClientId',
  locationId: 'locationId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DiscoverClientProductScalarFieldEnum = {
  id: 'id',
  discoverClientId: 'discoverClientId',
  productId: 'productId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DiscoverClientScalarFieldEnum = {
  id: 'id',
  firstName: 'firstName',
  lastName: 'lastName',
  companyId: 'companyId',
  companyTitleId: 'companyTitleId',
  industryId: 'industryId',
  email: 'email',
  locationId: 'locationId',
  status: 'status',
  invitationToken: 'invitationToken',
  contactedAt: 'contactedAt',
  isDeleted: 'isDeleted',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DiseaseAreaScalarFieldEnum = {
  id: 'id',
  name: 'name',
  isCommon: 'isCommon',
  identifier: 'identifier',
  parentDiseaseAreaId: 'parentDiseaseAreaId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.EthnicityScalarFieldEnum = {
  id: 'id',
  name: 'name',
  identifier: 'identifier',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.FileScalarFieldEnum = {
  id: 'id',
  url: 'url',
  key: 'key',
  filename: 'filename',
  name: 'name',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.IndustryScalarFieldEnum = {
  id: 'id',
  name: 'name',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.InfluencerAmbassadorWithdrawScalarFieldEnum = {
  id: 'id',
  transactionId: 'transactionId',
  bankAccountFirstName: 'bankAccountFirstName',
  bankAccountLastName: 'bankAccountLastName',
  bankName: 'bankName',
  bankAddress: 'bankAddress',
  iban: 'iban',
  swiftBic: 'swiftBic',
  accountNumber: 'accountNumber',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.InfluencerCampaignAmountChangelogScalarFieldEnum = {
  id: 'id',
  influencerCampaignAmountId: 'influencerCampaignAmountId',
  desiredAmount: 'desiredAmount',
  createdAt: 'createdAt'
};

exports.Prisma.InfluencerCampaignAmountScalarFieldEnum = {
  id: 'id',
  influencerId: 'influencerId',
  postType: 'postType',
  desiredAmount: 'desiredAmount',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.InfluencerCampaignDesiredAmountDistributionRangeScalarFieldEnum = {
  id: 'id',
  influencerCampaignDesiredAmountDistributionId: 'influencerCampaignDesiredAmountDistributionId',
  from: 'from',
  to: 'to',
  count: 'count',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.InfluencerCampaignDesiredAmountDistributionScalarFieldEnum = {
  id: 'id',
  mean: 'mean',
  standardDeviation: 'standardDeviation',
  influencerFollowersDistributionRangeId: 'influencerFollowersDistributionRangeId',
  postType: 'postType',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.InfluencerDiseaseAreaScalarFieldEnum = {
  id: 'id',
  influencerId: 'influencerId',
  diseaseAreaId: 'diseaseAreaId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.InfluencerFollowerScalarFieldEnum = {
  id: 'id',
  influencerId: 'influencerId',
  stakeholderId: 'stakeholderId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.InfluencerFollowersDistributionInfluencerScalarFieldEnum = {
  id: 'id',
  influencerFollowersDistributionRangeId: 'influencerFollowersDistributionRangeId',
  influencerId: 'influencerId',
  createdAt: 'createdAt'
};

exports.Prisma.InfluencerFollowersDistributionRangeScalarFieldEnum = {
  id: 'id',
  influencerFollowersDistributionId: 'influencerFollowersDistributionId',
  from: 'from',
  to: 'to',
  count: 'count',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.InfluencerFollowersDistributionScalarFieldEnum = {
  id: 'id',
  mean: 'mean',
  standardDeviation: 'standardDeviation',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.InfluencerScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  invitendByUserId: 'invitendByUserId',
  stakeholderId: 'stakeholderId',
  affiliateCode: 'affiliateCode',
  gender: 'gender',
  dateOfBirth: 'dateOfBirth',
  ethnicityId: 'ethnicityId',
  type: 'type',
  instagramUsername: 'instagramUsername',
  status: 'status',
  verifiedSince: 'verifiedSince',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.InfluencerSurveyAmountChangelogScalarFieldEnum = {
  id: 'id',
  influencerSurveyAmountId: 'influencerSurveyAmountId',
  desiredAmount: 'desiredAmount',
  createdAt: 'createdAt'
};

exports.Prisma.InfluencerSurveyAmountScalarFieldEnum = {
  id: 'id',
  influencerId: 'influencerId',
  surveyType: 'surveyType',
  desiredAmount: 'desiredAmount',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.InfluencerSurveyDesiredAmountDistributionRangeScalarFieldEnum = {
  id: 'id',
  influencerSurveyDesiredAmountDistributionId: 'influencerSurveyDesiredAmountDistributionId',
  from: 'from',
  to: 'to',
  count: 'count',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.InfluencerSurveyDesiredAmountDistributionScalarFieldEnum = {
  id: 'id',
  mean: 'mean',
  standardDeviation: 'standardDeviation',
  surveyType: 'surveyType',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.InfluencersSizeScalarFieldEnum = {
  id: 'id',
  name: 'name',
  from: 'from',
  to: 'to',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.InterestScalarFieldEnum = {
  id: 'id',
  identifier: 'identifier',
  name: 'name',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.LabelScalarFieldEnum = {
  id: 'id',
  name: 'name',
  assigneeType: 'assigneeType',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.LegalScalarFieldEnum = {
  id: 'id',
  text: 'text',
  type: 'type',
  language: 'language',
  version: 'version',
  createdAt: 'createdAt'
};

exports.Prisma.LocationScalarFieldEnum = {
  id: 'id',
  name: 'name',
  isCommon: 'isCommon',
  countryId: 'countryId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MessageReadScalarFieldEnum = {
  id: 'id',
  messageId: 'messageId',
  userId: 'userId',
  isRead: 'isRead',
  readAt: 'readAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.NotificationPayloadScalarFieldEnum = {
  id: 'id',
  notificationId: 'notificationId',
  userId: 'userId',
  adminId: 'adminId',
  influencerId: 'influencerId',
  ambassadorId: 'ambassadorId',
  clientId: 'clientId',
  campaignId: 'campaignId',
  campaignReportId: 'campaignReportId',
  socialMediaListeningId: 'socialMediaListeningId',
  surveyId: 'surveyId',
  calendarEventId: 'calendarEventId',
  transactionId: 'transactionId',
  transactionFlowId: 'transactionFlowId',
  platformProductOrderId: 'platformProductOrderId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.NotificationScalarFieldEnum = {
  id: 'id',
  type: 'type',
  title: 'title',
  description: 'description',
  link: 'link',
  variant: 'variant',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.NotificationUserScalarFieldEnum = {
  id: 'id',
  notificationId: 'notificationId',
  userId: 'userId',
  seen: 'seen',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PatientCaregiverDiseaseAreaScalarFieldEnum = {
  id: 'id',
  stakeholderId: 'stakeholderId',
  diseaseAreaId: 'diseaseAreaId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PermissionScalarFieldEnum = {
  id: 'id',
  permission: 'permission',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PlatformProductOrderChatMessageScalarFieldEnum = {
  id: 'id',
  chatRoomId: 'chatRoomId',
  authorId: 'authorId',
  message: 'message',
  isDeleted: 'isDeleted',
  deleteForAll: 'deleteForAll',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PlatformProductOrderChatRoomScalarFieldEnum = {
  id: 'id',
  productOrderId: 'productOrderId',
  isGroupRoom: 'isGroupRoom',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PlatformProductOrderCommentScalarFieldEnum = {
  id: 'id',
  comment: 'comment',
  userId: 'userId',
  productOrderId: 'productOrderId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PlatformProductOrderDiseaseAreaScalarFieldEnum = {
  id: 'id',
  productOrderId: 'productOrderId',
  diseaseAreaId: 'diseaseAreaId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PlatformProductOrderEthnicityScalarFieldEnum = {
  id: 'id',
  productOrderId: 'productOrderId',
  ethnicityId: 'ethnicityId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PlatformProductOrderGenderScalarFieldEnum = {
  id: 'id',
  productOrderId: 'productOrderId',
  gender: 'gender',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PlatformProductOrderInfluencerScalarFieldEnum = {
  id: 'id',
  productOrderId: 'productOrderId',
  influencerId: 'influencerId',
  agreedAmount: 'agreedAmount',
  currency: 'currency',
  status: 'status',
  signedAt: 'signedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PlatformProductOrderInterestScalarFieldEnum = {
  id: 'id',
  productOrderId: 'productOrderId',
  interestId: 'interestId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PlatformProductOrderLabelScalarFieldEnum = {
  id: 'id',
  labelId: 'labelId',
  assignerId: 'assignerId',
  platformProductOrderId: 'platformProductOrderId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PlatformProductOrderLanguageScalarFieldEnum = {
  id: 'id',
  productOrderId: 'productOrderId',
  language: 'language',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PlatformProductOrderLocationScalarFieldEnum = {
  id: 'id',
  productOrderId: 'productOrderId',
  locationId: 'locationId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PlatformProductOrderScalarFieldEnum = {
  id: 'id',
  clientId: 'clientId',
  platformProduct: 'platformProduct',
  ambassadorCommission: 'ambassadorCommission',
  budget: 'budget',
  currencyId: 'currencyId',
  status: 'status',
  financeStatus: 'financeStatus',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PlatformProductOrderStatusChangelogScalarFieldEnum = {
  id: 'id',
  platformProductOrderId: 'platformProductOrderId',
  status: 'status',
  createdAt: 'createdAt'
};

exports.Prisma.PlatformProductOrderStruggleScalarFieldEnum = {
  id: 'id',
  productOrderId: 'productOrderId',
  struggleId: 'struggleId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PlatformProductOrderSymptomScalarFieldEnum = {
  id: 'id',
  productOrderId: 'productOrderId',
  symptomId: 'symptomId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PlatformRoleScalarFieldEnum = {
  id: 'id',
  role: 'role',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PostBrandScalarFieldEnum = {
  id: 'id',
  stakeholderPostId: 'stakeholderPostId',
  brandId: 'brandId',
  brandSentiment: 'brandSentiment',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PostContentTokenOccurenceScalarFieldEnum = {
  id: 'id',
  postId: 'postId',
  tokenId: 'tokenId',
  occurences: 'occurences',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PostContentTokenScalarFieldEnum = {
  id: 'id',
  token: 'token',
  tokenType: 'tokenType',
  occurences: 'occurences',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PostDiseaseAreaScalarFieldEnum = {
  id: 'id',
  stakeholderPostId: 'stakeholderPostId',
  diseaseAreaId: 'diseaseAreaId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PostInterestScalarFieldEnum = {
  id: 'id',
  stakeholderPostId: 'stakeholderPostId',
  interestId: 'interestId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PostProductScalarFieldEnum = {
  id: 'id',
  stakeholderPostId: 'stakeholderPostId',
  productId: 'productId',
  productSentiment: 'productSentiment',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PostStruggleScalarFieldEnum = {
  id: 'id',
  stakeholderPostId: 'stakeholderPostId',
  struggleId: 'struggleId',
  struggleSentiment: 'struggleSentiment',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PostSymptomScalarFieldEnum = {
  id: 'id',
  stakeholderPostId: 'stakeholderPostId',
  symptomId: 'symptomId',
  symptomSentiment: 'symptomSentiment',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PostThemeScalarFieldEnum = {
  id: 'id',
  stakeholderPostId: 'stakeholderPostId',
  themeId: 'themeId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProductOrderChatRoomMemberScalarFieldEnum = {
  id: 'id',
  productOrderChatRoomId: 'productOrderChatRoomId',
  userId: 'userId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProductScalarFieldEnum = {
  id: 'id',
  name: 'name',
  genericName: 'genericName',
  createdByClientId: 'createdByClientId',
  isApproved: 'isApproved',
  isBranded: 'isBranded',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.RolePermissionScalarFieldEnum = {
  id: 'id',
  roleId: 'roleId',
  permissionId: 'permissionId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SMLPlatformScalarFieldEnum = {
  id: 'id',
  smlId: 'smlId',
  socialPlatformId: 'socialPlatformId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SocialMediaListeningScalarFieldEnum = {
  id: 'id',
  platformProductOrderId: 'platformProductOrderId',
  subscriptionLength: 'subscriptionLength',
  monthlyTokens: 'monthlyTokens',
  smlDescription: 'smlDescription',
  startedAt: 'startedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SocialPlatformScalarFieldEnum = {
  id: 'id',
  name: 'name',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.StakeholderInterestScalarFieldEnum = {
  id: 'id',
  interestId: 'interestId',
  stakeholderId: 'stakeholderId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.StakeholderPostScalarFieldEnum = {
  id: 'id',
  stakeholderId: 'stakeholderId',
  content: 'content',
  language: 'language',
  overallSentiment: 'overallSentiment',
  comments: 'comments',
  likes: 'likes',
  isReported: 'isReported',
  reportComment: 'reportComment',
  preprocessedContent: 'preprocessedContent',
  isContentProcessed: 'isContentProcessed',
  isDeleted: 'isDeleted',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.StakeholderScalarFieldEnum = {
  id: 'id',
  socialPlatformId: 'socialPlatformId',
  socialPlatformUserId: 'socialPlatformUserId',
  socialPlatformUsername: 'socialPlatformUsername',
  iv: 'iv',
  bio: 'bio',
  type: 'type',
  isRegistered: 'isRegistered',
  isSML: 'isSML',
  isQA: 'isQA',
  isPrivate: 'isPrivate',
  followersCount: 'followersCount',
  likesCount: 'likesCount',
  commentsCount: 'commentsCount',
  postCount: 'postCount',
  influencerId: 'influencerId',
  locationId: 'locationId',
  ethnicityId: 'ethnicityId',
  gender: 'gender',
  age: 'age',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.StruggleScalarFieldEnum = {
  id: 'id',
  name: 'name',
  identifier: 'identifier',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SurveyExampleImageScalarFieldEnum = {
  id: 'id',
  surveyId: 'surveyId',
  imageUrl: 'imageUrl',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SurveyOptionScalarFieldEnum = {
  id: 'id',
  surveyQuestionId: 'surveyQuestionId',
  optionText: 'optionText',
  order: 'order',
  isOther: 'isOther',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SurveyProductScalarFieldEnum = {
  id: 'id',
  surveyId: 'surveyId',
  productId: 'productId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SurveyQuestionScalarFieldEnum = {
  id: 'id',
  surveyId: 'surveyId',
  questionText: 'questionText',
  questionType: 'questionType',
  order: 'order',
  questionCredit: 'questionCredit',
  isOptional: 'isOptional',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SurveyResponseScalarFieldEnum = {
  id: 'id',
  surveyId: 'surveyId',
  userId: 'userId',
  surveyQuestionId: 'surveyQuestionId',
  surveyOptionId: 'surveyOptionId',
  surveyResponseText: 'surveyResponseText',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SurveyScalarFieldEnum = {
  id: 'id',
  name: 'name',
  platformProductOrderId: 'platformProductOrderId',
  dateStart: 'dateStart',
  dateEnd: 'dateEnd',
  language: 'language',
  surveyDescription: 'surveyDescription',
  participantCount: 'participantCount',
  questionCount: 'questionCount',
  ageMin: 'ageMin',
  ageMax: 'ageMax',
  participantsDescription: 'participantsDescription',
  surveyType: 'surveyType',
  fileUploadUrl: 'fileUploadUrl',
  instructionsDescription: 'instructionsDescription',
  questionCredits: 'questionCredits',
  link: 'link',
  contract: 'contract',
  isContractApproved: 'isContractApproved',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SurveyStakeholderTypeScalarFieldEnum = {
  id: 'id',
  surveyId: 'surveyId',
  stakeholderType: 'stakeholderType',
  createdAt: 'createdAt'
};

exports.Prisma.SymptomScalarFieldEnum = {
  id: 'id',
  name: 'name',
  identifier: 'identifier',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ThemeScalarFieldEnum = {
  id: 'id',
  name: 'name',
  identifier: 'identifier',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TransactionFlowScalarFieldEnum = {
  id: 'id',
  name: 'name',
  userId: 'userId',
  type: 'type',
  productOrderId: 'productOrderId',
  amount: 'amount',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.TransactionScalarFieldEnum = {
  id: 'id',
  transactionFlowId: 'transactionFlowId',
  status: 'status',
  availableAmounts: 'availableAmounts',
  unavailableAmounts: 'unavailableAmounts',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UserCommentScalarFieldEnum = {
  id: 'id',
  text: 'text',
  userId: 'userId',
  targetId: 'targetId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UserLabelScalarFieldEnum = {
  id: 'id',
  labelId: 'labelId',
  assignerId: 'assignerId',
  assigneeId: 'assigneeId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UserLegalConsentsScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  legalId: 'legalId',
  createdAt: 'createdAt'
};

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  firstName: 'firstName',
  lastName: 'lastName',
  email: 'email',
  emailResendTokens: 'emailResendTokens',
  password: 'password',
  locationId: 'locationId',
  role: 'role',
  status: 'status',
  isDeleted: 'isDeleted',
  currency: 'currency',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UserStatusChangelogScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  status: 'status',
  createdAt: 'createdAt'
};


exports.Prisma.ModelName = {
  User: 'User',
  UserStatusChangelog: 'UserStatusChangelog',
  UserLabel: 'UserLabel',
  Label: 'Label',
  UserComment: 'UserComment',
  Location: 'Location',
  DiseaseArea: 'DiseaseArea',
  Influencer: 'Influencer',
  InfluencerSurveyAmount: 'InfluencerSurveyAmount',
  InfluencerSurveyAmountChangelog: 'InfluencerSurveyAmountChangelog',
  InfluencerCampaignAmount: 'InfluencerCampaignAmount',
  InfluencerCampaignAmountChangelog: 'InfluencerCampaignAmountChangelog',
  InfluencerFollower: 'InfluencerFollower',
  InfluencerDiseaseArea: 'InfluencerDiseaseArea',
  Admin: 'Admin',
  AdminRole: 'AdminRole',
  PlatformRole: 'PlatformRole',
  AdminPermission: 'AdminPermission',
  Permission: 'Permission',
  RolePermission: 'RolePermission',
  CompanyTitle: 'CompanyTitle',
  Company: 'Company',
  CompanyProduct: 'CompanyProduct',
  CampaignProduct: 'CampaignProduct',
  SurveyProduct: 'SurveyProduct',
  Product: 'Product',
  Client: 'Client',
  ClientProduct: 'ClientProduct',
  Industry: 'Industry',
  DiscoverClientMarket: 'DiscoverClientMarket',
  DiscoverClientDiseaseArea: 'DiscoverClientDiseaseArea',
  DiscoverClient: 'DiscoverClient',
  DiscoverClientProduct: 'DiscoverClientProduct',
  ClientDiseaseArea: 'ClientDiseaseArea',
  ClientMarket: 'ClientMarket',
  Stakeholder: 'Stakeholder',
  StakeholderPost: 'StakeholderPost',
  PostContentTokenOccurence: 'PostContentTokenOccurence',
  PostContentToken: 'PostContentToken',
  PostSymptom: 'PostSymptom',
  PostDiseaseArea: 'PostDiseaseArea',
  PostBrand: 'PostBrand',
  PostProduct: 'PostProduct',
  PostStruggle: 'PostStruggle',
  PostInterest: 'PostInterest',
  PostTheme: 'PostTheme',
  Theme: 'Theme',
  PatientCaregiverDiseaseArea: 'PatientCaregiverDiseaseArea',
  StakeholderInterest: 'StakeholderInterest',
  Interest: 'Interest',
  Ethnicity: 'Ethnicity',
  Struggle: 'Struggle',
  Symptom: 'Symptom',
  Campaign: 'Campaign',
  CampaignExampleImage: 'CampaignExampleImage',
  CampaignStakeholderType: 'CampaignStakeholderType',
  CampaignInfluencersSize: 'CampaignInfluencersSize',
  InfluencersSize: 'InfluencersSize',
  CampaignReport: 'CampaignReport',
  CampaignInfluencerPerformance: 'CampaignInfluencerPerformance',
  CampaignInfluencerLiker: 'CampaignInfluencerLiker',
  Ambassador: 'Ambassador',
  SocialMediaListening: 'SocialMediaListening',
  ClientSMLTokenBalance: 'ClientSMLTokenBalance',
  SMLPlatform: 'SMLPlatform',
  SocialPlatform: 'SocialPlatform',
  Survey: 'Survey',
  SurveyStakeholderType: 'SurveyStakeholderType',
  SurveyExampleImage: 'SurveyExampleImage',
  ClientSurveyTokenBalance: 'ClientSurveyTokenBalance',
  SurveyQuestion: 'SurveyQuestion',
  SurveyResponse: 'SurveyResponse',
  SurveyOption: 'SurveyOption',
  Benefit: 'Benefit',
  BenefitSuggestion: 'BenefitSuggestion',
  BenefitLocation: 'BenefitLocation',
  BenefitUpvoteCount: 'BenefitUpvoteCount',
  BenefitPartnership: 'BenefitPartnership',
  BenefitCategory: 'BenefitCategory',
  Transaction: 'Transaction',
  TransactionFlow: 'TransactionFlow',
  InfluencerAmbassadorWithdraw: 'InfluencerAmbassadorWithdraw',
  CustomFinanceStatement: 'CustomFinanceStatement',
  PlatformProductOrderLabel: 'PlatformProductOrderLabel',
  PlatformProductOrder: 'PlatformProductOrder',
  PlatformProductOrderStatusChangelog: 'PlatformProductOrderStatusChangelog',
  PlatformProductOrderGender: 'PlatformProductOrderGender',
  PlatformProductOrderLanguage: 'PlatformProductOrderLanguage',
  PlatformProductOrderLocation: 'PlatformProductOrderLocation',
  PlatformProductOrderDiseaseArea: 'PlatformProductOrderDiseaseArea',
  PlatformProductOrderInterest: 'PlatformProductOrderInterest',
  PlatformProductOrderEthnicity: 'PlatformProductOrderEthnicity',
  PlatformProductOrderStruggle: 'PlatformProductOrderStruggle',
  PlatformProductOrderSymptom: 'PlatformProductOrderSymptom',
  PlatformProductOrderChatMessage: 'PlatformProductOrderChatMessage',
  MessageRead: 'MessageRead',
  ProductOrderChatRoomMember: 'ProductOrderChatRoomMember',
  PlatformProductOrderChatRoom: 'PlatformProductOrderChatRoom',
  PlatformProductOrderComment: 'PlatformProductOrderComment',
  PlatformProductOrderInfluencer: 'PlatformProductOrderInfluencer',
  Currency: 'Currency',
  File: 'File',
  CalendarEvent: 'CalendarEvent',
  CalendarEventAttendee: 'CalendarEventAttendee',
  Notification: 'Notification',
  NotificationUser: 'NotificationUser',
  NotificationPayload: 'NotificationPayload',
  InfluencerFollowersDistribution: 'InfluencerFollowersDistribution',
  InfluencerFollowersDistributionRange: 'InfluencerFollowersDistributionRange',
  InfluencerFollowersDistributionInfluencer: 'InfluencerFollowersDistributionInfluencer',
  InfluencerCampaignDesiredAmountDistribution: 'InfluencerCampaignDesiredAmountDistribution',
  InfluencerCampaignDesiredAmountDistributionRange: 'InfluencerCampaignDesiredAmountDistributionRange',
  InfluencerSurveyDesiredAmountDistribution: 'InfluencerSurveyDesiredAmountDistribution',
  InfluencerSurveyDesiredAmountDistributionRange: 'InfluencerSurveyDesiredAmountDistributionRange',
  Legal: 'Legal',
  UserLegalConsents: 'UserLegalConsents'
};

/**
 * Create the Client
 */
class PrismaClient {
  constructor() {
    throw new Error(
      `PrismaClient is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
    )
  }
}
exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
