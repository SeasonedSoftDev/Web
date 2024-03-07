export const DGenerateSurveyFilter = () => ({
  search: '',
  language: null,
  budget: {
    min: '',
    max: '',
  },
  startDateStart: null,
  startDateEnd: null,
  endDateStart: null,
  endDateEnd: null,
  participants: {
    min: '',
    max: '',
  },
  questions: {
    min: '',
    max: '',
  },
  questionCredits: {
    min: '',
    max: '',
  },
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
});

export const DSurveysHead = [
  {
    reference: 'labels',
    label: 'Labels',
    visible: 'false',
  },
  {
    reference: 'surveyName',
    label: 'Survey Name',
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
    visible: false,
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
    reference: 'participants',
    label: 'Participants',
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
    reference: 'language',
    label: 'Language',
    visible: true,
  },
  {
    reference: 'questions',
    label: 'Questions',
    visible: true,
  },
  {
    reference: 'questionCredits',
    label: 'Question Credits',
    visible: false,
  },
  {
    reference: 'actions',
    label: '',
    visible: false,
  },
];

export const DSurveysHead2 = [
  {
    reference: 'accepted',
    label: 'Accepted',
  },
  {
    reference: 'infoReceived',
    label: 'Info Received',
  },
  {
    reference: 'toBePosted',
    label: 'To Be Posted',
  },
  {
    reference: 'approved',
    label: 'Approved',
  },
];

export const DSurveysInfluencerHead = [
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
    reference: 'language',
    label: 'Language',
    visible: true,
  },
  {
    reference: 'status',
    label: 'Status',
    visible: true,
  },
  {
    reference: 'link',
    label: 'Link',
    visible: true,
  },
  {
    reference: 'questions',
    label: 'Questions',
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
export const DSurveysInfluencerHead2 = [
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
    reference: 'language',
    label: 'Language',
    visible: true,
  },
  {
    reference: 'status',
    label: 'Status',
    visible: true,
  },
  {
    reference: 'questions',
    label: 'Questions',
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

export const DGenerateSurveyClientFilter = () => ({
  search: '',
  language: [],
  budget: {
    min: '',
    max: '',
  },
  startDateStart: null,
  startDateEnd: null,
  endDateStart: null,
  endDateEnd: null,
  participants: {
    min: '',
    max: '',
  },
  questions: {
    min: '',
    max: '',
  },
  questionCredits: {
    min: '',
    max: '',
  },
  product: [],

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
  symptoms: [],
});
