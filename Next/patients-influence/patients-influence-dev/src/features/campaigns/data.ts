export const DGenerateCampaignsFilter = () => ({
  search: '',
  budget: {
    min: '',
    max: '',
  },
  startDate: null,
  endDate: null,
  influencers: {
    min: '',
    max: '',
  },
  influencerSize: null,
  socialMedia: null,
  postType: null,
  report: null,
  labels: null,
  schedule: null,
  industry: null,
  company: null,
  client: null,
  ambassador: null,
  product: null,

  diseaseArea: null,
  struggles: null,
  location: null,
  ethnicity: null,
  interests: null,
  age: {
    min: '',
    max: '',
  },
  gender: null,
  language: null,
});

export const DCampaignsAdminHead = [
  {
    reference: 'labels',
    label: 'Labels',
    visible: false,
  },
  {
    reference: 'campaignName',
    label: 'Campaign Name',
    visible: true,
  },
  {
    reference: 'client',
    label: 'Client',
    visible: true,
  },
  {
    reference: 'ambassador',
    label: 'Ambassador',
    visible: false,
  },
  {
    reference: 'budget',
    label: 'Budget',
    visible: true,
  },
  {
    reference: 'originalBudget',
    label: 'Original budget / Currency',
    visible: false,
  },
  {
    reference: 'diseaseArea',
    label: 'Disease Area',
    visible: true,
  },
  {
    reference: 'struggles',
    label: 'Struggles',
    visible: false,
  },
  {
    reference: 'location',
    label: 'Location',
    visible: true,
  },
  {
    reference: 'company',
    label: 'Company',
    visible: false,
  },
  {
    reference: 'ethnicity',
    label: 'Ethnicity',
    visible: false,
  },
  {
    reference: 'interests',
    label: 'Interests',
    visible: false,
  },
  {
    reference: 'product',
    label: 'Product',
    visible: true,
  },
  {
    reference: 'startDate',
    label: 'Start Date',
    visible: false,
  },
  {
    reference: 'endDate',
    label: 'End Date',
    visible: false,
  },
  {
    reference: 'influencersNumber',
    label: 'Influencers',
    visible: true,
  },
  {
    reference: 'influencerSize',
    label: 'Influencer Size',
    visible: false,
  },
  {
    reference: 'ageMin',
    label: 'Age min',
    visible: false,
  },
  {
    reference: 'ageMax',
    label: 'Age max',
    visible: false,
  },
  {
    reference: 'gender',
    label: 'Gender',
    visible: false,
  },
  {
    reference: 'socialMediaPlatform',
    label: 'Social Media Platform',
    visible: false,
  },
  {
    reference: 'postType',
    label: 'Post Type',
    visible: false,
  },
  {
    reference: 'website',
    label: 'Website',
    visible: false,
  },
  {
    reference: 'report',
    label: 'Report',
    visible: false,
  },
  {
    reference: 'language',
    label: 'Language',
    visible: false,
  },
  {
    reference: 'actions',
    label: '',
    visible: true,
  },
];

export const DCampaignsHead = [
  {
    reference: 'campaignName',
    label: 'Campaign name',
    visible: true,
  },
  {
    reference: 'platform',
    label: 'Platform',
    visible: true,
  },
  {
    reference: 'postType',
    label: 'Post Type',
    visible: true,
  },
  {
    reference: 'startAndFinish',
    label: 'Start & Finish',
    visible: true,
  },
  {
    reference: 'amount',
    label: 'Amount',
    visible: true,
  },
  {
    reference: 'actions',
    label: '',
    visible: true,
  },
];

export const DCampaignsHead2 = [
  {
    reference: 'accepted',
    label: 'Accepted',
    visible: true,
  },
  {
    reference: 'infoReceived',
    label: 'Info Received',
    visible: true,
  },
  {
    reference: 'toBePosted',
    label: 'To Be Posted',
    visible: true,
  },
  {
    reference: 'approved',
    label: 'Approved',
    visible: true,
  },
];

export const DCampaignsInfluencerHead = [
  {
    reference: 'name',
    label: 'Name',
    visible: true,
  },
  {
    reference: 'company',
    label: 'Company',
    visible: true,
  },
  {
    reference: 'product',
    label: 'Product',
    visible: true,
  },
  {
    reference: 'platform',
    label: 'Platform',
    visible: true,
  },
  {
    reference: 'postType',
    label: 'Post type',
    visible: true,
  },
  {
    reference: 'status',
    label: 'Status',
    visible: true,
  },
  {
    reference: 'amount',
    label: 'Amount',
    visible: true,
  },
  {
    reference: 'actions',
    label: '',
    visible: true,
  },
];
export const DCampaignsInfluencerHead2 = [
  {
    reference: 'name',
    label: 'Name',
    visible: true,
  },
  {
    reference: 'company',
    label: 'Company',
    visible: true,
  },
  {
    reference: 'product',
    label: 'Product',
    visible: true,
  },
  {
    reference: 'platform',
    label: 'Platform',
    visible: true,
  },
  {
    reference: 'postType',
    label: 'Post Type',
    visible: true,
  },
  {
    reference: 'status',
    label: 'Status',
    visible: true,
  },
  {
    reference: 'amount',
    label: 'Amount',
    visible: true,
  },
  {
    reference: 'actions',
    label: '',
    visible: true,
  },
];

export const DGenerateCampaignsClientFilter = () => ({
  search: '',
  product: [],
  budget: {
    min: '',
    max: '',
  },
  startDateStart: null,
  startDateEnd: null,
  endDateStart: null,
  endDateEnd: null,
  influencers: {
    min: '',
    max: '',
  },
  influencerSize: [],
  socialMediaPlatform: [],
  postType: [],
  report: [],

  diseaseArea: [],
  struggles: [],
  location: [],
  ethnicity: [],
  interests: [],
  age: {
    min: '',
    max: '',
  },
  gender: [],
  language: [],
});

export const DCampaignsClientHead = [
  {
    reference: 'campaignName',
    label: 'Campaign Name',
    visible: true,
  },
  {
    reference: 'ambassador',
    label: 'Ambassador',
    visible: false,
  },
  {
    reference: 'budget',
    label: 'Budget',
    visible: true,
  },
  {
    reference: 'diseaseArea',
    label: 'Disease Area',
    visible: true,
  },
  {
    reference: 'struggles',
    label: 'Struggles',
    visible: false,
  },
  {
    reference: 'location',
    label: 'Location',
    visible: true,
  },
  {
    reference: 'ethnicity',
    label: 'Ethnicity',
    visible: false,
  },
  {
    reference: 'interests',
    label: 'Interests',
    visible: false,
  },
  {
    reference: 'product',
    label: 'Product',
    visible: false,
  },
  {
    reference: 'startDate',
    label: 'Start Date',
    visible: false,
  },
  {
    reference: 'endDate',
    label: 'End Date',
    visible: false,
  },
  {
    reference: 'influencers',
    label: 'Influencers',
    visible: true,
  },
  {
    reference: 'influencerSize',
    label: 'Influencer Size',
    visible: false,
  },
  {
    reference: 'ageMin',
    label: 'Age Min',
    visible: false,
  },
  {
    reference: 'ageMax',
    label: 'Age Max',
    visible: false,
  },
  {
    reference: 'gender',
    label: 'Gender',
    visible: false,
  },
  {
    reference: 'socialMediaPlatform',
    label: 'Social Media Platform',
    visible: false,
  },
  {
    reference: 'postType',
    label: 'Post Type',
    visible: false,
  },
  {
    reference: 'report',
    label: 'Report',
    visible: true,
  },
  {
    reference: 'language',
    label: 'Language',
    visible: false,
  },
  {
    reference: 'actions',
    label: '',
    visible: true,
  },
];
