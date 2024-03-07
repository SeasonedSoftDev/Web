export const DGenerateClientsFilter = () => ({
  search: '',
  industry: [],
  company: [],
  role: [],
  product: [],
  ambassador: [],
  diseaseArea: [],
  location: [],
  market: [],
  projectStatus: null,
  joinedStart: null,
  joinedEnd: null,
  label: [],
  schedule: [],
  project: [],
  totalProject: {
    min: '',
    max: '',
  },
  projectLast30Days: {
    min: '',
    max: '',
  },
  budget: {
    min: '',
    max: '',
  },
});

export const DClientsHead = [
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
    visible: false,
  },
  {
    reference: 'registeredAt',
    label: 'Registered At',
    visible: false,
  },
  {
    reference: 'updatedAt',
    label: 'Updated At',
    visible: false,
  },
  // Saving for future reference
  // {
  //   reference: 'label',
  //   label: 'label',
  //   visible: false,
  // },
  {
    reference: 'ambassador',
    label: 'Ambassador',
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
    visible: true,
  },
  {
    reference: 'location',
    label: 'Location',
    visible: false,
  },
  {
    reference: 'market',
    label: 'Market',
    visible: true,
  },
  {
    reference: 'diseaseArea',
    label: 'Disease Area',
    visible: true,
  },
  {
    reference: 'role',
    label: 'Role',
    visible: false,
  },
  // {
  //   reference: 'contactedAt',
  //   label: 'Contacted At',
  //   visible: false,
  // },
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
    visible: true,
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
