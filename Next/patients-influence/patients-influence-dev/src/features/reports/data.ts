export const DGenerateReportsFilter = () => ({
  search: '',
  type: null,
  budget: {
    min: '',
    max: '',
  },
  dateStart: null,
  dateEnd: null,
  influencers: {
    min: '',
    max: '',
  },
  reach: {
    min: '',
    max: '',
  },
  likes: {
    min: '',
    max: '',
  },
  comments: {
    min: '',
    max: '',
  },
  websiteClicks: {
    min: '',
    max: '',
  },
  engagement: {
    min: '',
    max: '',
  },
  costPerClick: {
    min: '',
    max: '',
  },
  costPerTarget: {
    min: '',
    max: '',
  },
  labels: null,

  industry: null,
  company: null,
  client: null,
  ambassador: null,
  product: null,
});

export const DGenerateReportsClientsFilter = () => ({
  search: '',
  product: [],
  type: [],
  budget: {
    min: '',
    max: '',
  },
  dateStart: null,
  dateEnd: null,
  influencers: {
    min: '',
    max: '',
  },
  reach: {
    min: '',
    max: '',
  },
  likes: {
    min: '',
    max: '',
  },
  comments: {
    min: '',
    max: '',
  },
  websiteClicks: {
    min: '',
    max: '',
  },
  engagement: {
    min: '',
    max: '',
  },
  costPerClick: {
    min: '',
    max: '',
  },
  costPerTarget: {
    min: '',
    max: '',
  },
});

export const DReportsClientHead = [
  {
    reference: 'campaign',
    label: 'Campaign',
    visible: true,
  },
  {
    reference: 'type',
    label: 'Type',
    visible: true,
  },
  {
    reference: 'budget',
    label: 'Budget',
    visible: true,
  },
  {
    reference: 'date',
    label: 'Date',
    visible: false,
  },
  {
    reference: 'influencers',
    label: 'Influencers (Number)',
    visible: false,
  },
  {
    reference: 'reach',
    label: 'Reach',
    visible: false,
  },
  {
    reference: 'likes',
    label: 'Likes',
    visible: false,
  },
  {
    reference: 'comments',
    label: 'Comments',
    visible: false,
  },
  {
    reference: 'websiteClicks',
    label: 'Website Clicks',
    visible: false,
  },
  {
    reference: 'engagement',
    label: 'Engagement',
    visible: false,
  },
  {
    reference: 'costPerClick',
    label: 'Cost Per Click',
    visible: false,
  },
  {
    reference: 'costPerTarget',
    label: 'Cost Per Target',
    visible: false,
  },
  {
    reference: 'costPerEngagement',
    label: 'Cost Per Engagement',
    visible: false,
  },
  {
    reference: 'product',
    label: 'Product',
    visible: false,
  },
  {
    reference: 'additionalInformation',
    label: 'Additional Information',
    visible: true,
  },
  {
    reference: 'actions',
    label: '',
    visible: true,
  },
];

export const DReportsHead = [
  {
    reference: 'client',
    label: 'Client',
    visible: true,
  },
  {
    reference: 'campaign',
    label: 'Campaign',
    visible: true,
  },
  {
    reference: 'type',
    label: 'Type',
    visible: true,
  },
  {
    reference: 'budget',
    label: 'Budget',
    visible: true,
  },
  {
    reference: 'date',
    label: 'Date',
    visible: false,
  },
  {
    reference: 'influencers',
    label: 'Influencers',
    visible: false,
  },
  {
    reference: 'reach',
    label: 'Reach',
    visible: false,
  },
  {
    reference: 'likes',
    label: 'Likes',
    visible: false,
  },
  {
    reference: 'comments',
    label: 'Comments',
    visible: false,
  },
  {
    reference: 'websiteClicks',
    label: 'Website Clicks',
    visible: false,
  },
  {
    reference: 'engagement',
    label: 'Engagement',
    visible: false,
  },
  {
    reference: 'costPerClick',
    label: 'Cost per Click',
    visible: true,
  },
  {
    reference: 'costPerTarget',
    label: 'Cost per Target',
    visible: true,
  },
  {
    reference: 'costPerEngagement',
    label: 'Cost per Engagement',
    visible: false,
  },
  {
    reference: 'labels',
    label: 'Labels',
    visible: false,
  },
  {
    reference: 'industry',
    label: 'Industry',
    visible: false,
  },
  {
    reference: 'company',
    label: 'Company',
    visible: false,
  },
  {
    reference: 'ambassador',
    label: 'Ambassador',
    visible: false,
  },
  {
    reference: 'product',
    label: 'Product',
    visible: false,
  },
  {
    reference: 'actions',
    label: '',
    visible: false,
  },
];

export const DReportsWithoutReport = [
  {
    reference: 'campaign',
    label: 'Campaign',
    visible: true,
  },
  {
    reference: 'type',
    label: 'Type',
    visible: true,
  },
  {
    reference: 'budget',
    label: 'Budget',
    visible: true,
  },
  {
    reference: 'actions',
    label: '',
    visible: true,
  },
];
