export const DGenerateAmbassadorsFilter = () => ({
  search: '',
  industry: [],
  company: [],
  role: [],
  product: [],
  diseaseArea: [],
  location: [],
  market: [],
  projectStatus: null,
  joinedStart: null,
  joinedEnd: null,
  label: [],
  schedule: [],
  project: [],
  commission: {
    min: '',
    max: '',
  },
  totalProjects: {
    min: '',
    max: '',
  },
  projectLast30Days: {
    min: '',
    max: '',
  },
  totalClients: {
    min: '',
    max: '',
  },
});

export const DAmbassadorsHead = [
  {
    reference: 'firstName',
    label: 'First Name',
    visible: true,
  },
  {
    reference: 'lastName',
    label: 'Last Name',
    visible: true,
  },
  {
    reference: 'email',
    label: 'Email',
    visible: true,
  },
  {
    reference: 'registeredAt',
    label: 'Registered At',
    visible: false,
  },
  {
    reference: 'label',
    label: 'Label',
    visible: false,
  },
  {
    reference: 'company',
    label: 'Company',
    visible: true,
  },
  {
    reference: 'industry',
    label: 'Industry',
    visible: false,
  },
  {
    reference: 'product',
    label: 'Product',
    visible: false,
  },
  {
    reference: 'location',
    label: 'Location',
    visible: false,
  },
  {
    reference: 'market',
    label: 'Market',
    visible: false,
  },
  {
    reference: 'diseaseAreas',
    label: 'Disease Areas',
    visible: false,
  },
  {
    reference: 'role',
    label: 'Role',
    visible: true,
  },
  {
    reference: 'invited',
    label: 'Invited',
    visible: true,
  },
  {
    reference: 'invitedCount',
    label: 'Invited (count)',
    visible: true,
  },
  {
    reference: 'totalRegisteredClients',
    label: 'Total Registered Clients',
    visible: false,
  },
  {
    reference: 'totalRegisteredClientsLast30Days',
    label: 'Total Registered Clients Last 30 Days',
    visible: false,
  },
  {
    reference: 'totalPayingClients',
    label: 'Total Paying Clients',
    visible: false,
  },
  {
    reference: 'totalPayingClientsLast30Days',
    label: 'Total Paying Clients Last 30 Days',
    visible: false,
  },
  {
    reference: 'totalBudget',
    label: 'Total Budget',
    visible: false,
  },
  {
    reference: 'totalBudgetLast30Days',
    label: 'Total Budget Last 30 Days',
    visible: false,
  },
  {
    reference: 'totalProjects',
    label: 'Total Projects',
    visible: false,
  },
  {
    reference: 'totalOngoingProjects',
    label: 'Total Ongoing Projects',
    visible: false,
  },
  {
    reference: 'totalProjectsLast30Days',
    label: 'Total Projects Last 30 Days',
    visible: false,
  },
  {
    reference: 'averageCampaignBudget',
    label: 'Average Campaign Budget',
    visible: false,
  },
  {
    reference: 'totalCampaignBudget',
    label: 'Total Campaign Budget',
    visible: false,
  },
  {
    reference: 'totalCampaigns',
    label: 'Total Campaigns',
    visible: false,
  },
  {
    reference: 'totalCampaignsLast30Days',
    label: 'Total Campaigns Last 30 Days',
    visible: false,
  },
  {
    reference: 'totalCampaignBudgetLast30Days',
    label: 'Total Campaign Budget Last 30 Days',
    visible: false,
  },
  {
    reference: 'averageSurveysBudget',
    label: 'Average Surveys Budget',
    visible: false,
  },
  {
    reference: 'totalSurveysBudget',
    label: 'Total Surveys Budget',
    visible: false,
  },
  {
    reference: 'totalSurveysBudgetLast30Days',
    label: 'Total Surveys Budget Last 30 Days',
    visible: false,
  },
  {
    reference: 'totalSurveys',
    label: 'Total Surveys',
    visible: false,
  },
  {
    reference: 'totalSurveysLast30Days',
    label: 'Total Surveys Last 30 Days',
    visible: false,
  },
  {
    reference: 'averageSmlBudget',
    label: 'Average SML Budget',
    visible: false,
  },
  {
    reference: 'totalSmlBudget',
    label: 'Total SML Budget',
    visible: false,
  },
  {
    reference: 'totalSmlBudgetLast30Days',
    label: 'Total SML Budget Last 30 Days',
    visible: false,
  },
  {
    reference: 'totalSml',
    label: 'Total SML',
    visible: false,
  },
  {
    reference: 'totalSmlLast30Days',
    label: 'Total SML Last 30 Days',
    visible: false,
  },
  {
    reference: 'actions',
    label: '',
    visible: true,
  },
];
