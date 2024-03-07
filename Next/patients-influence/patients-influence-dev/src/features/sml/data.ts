export const DGenerateSmlFilter = () => ({
  company: null,
  client: null,
  stakeholder: null,
  language: null,
  diseaseArea: null,
  platform: null,
  startDate: null,
  endDate: null,
  budget: {
    min: '',
    max: '',
  },
  lable: [],

  report: '',
});

export const DGenerateAdminSmlFilter = () => ({
  search: '',
  diseaseArea: null,
  socialMediaPlatform: null,
  budget: {
    min: '',
    max: '',
  },
  startDateStart: null,
  startDateEnd: null,
  endDateStart: null,
  endDateEnd: null,
  subscription: {
    min: '',
    max: '',
  },
  tokens: {
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
});
