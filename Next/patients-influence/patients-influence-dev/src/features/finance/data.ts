import { Dayjs } from 'dayjs';
import { IMinMaxField, ISelectField } from 'utilities/converters';

export const DGenerateFinanceFilter = () => ({
  company: null,
  client: null,
  location: null,
  diseaseArea: null,
  industry: null,
  platform: null,
  promotionType: null,
  dataRange: null,
  influencerSize: '',
  influencers: {
    min: '',
    max: '',
  },
  budget: {
    min: '',
    max: '',
  },
  label: [],
});

export interface IAdminFinanceFilterData {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  budget: IMinMaxField;
  types: ISelectField[];
  status: ISelectField[];
  company: ISelectField[];
  client: ISelectField[];
  influencer: ISelectField[];
  ambassador: ISelectField[];
  campaign: ISelectField[];
  survey: ISelectField[];
}

export const DGenerateFinanceAdminFilter = (): IAdminFinanceFilterData => ({
  startDate: null,
  endDate: null,
  budget: {
    min: '',
    max: '',
  },
  types: [],
  status: [],
  company: [],
  client: [],
  influencer: [],
  ambassador: [],
  campaign: [],
  survey: [],
});

export const DFinanceHead = [
  {
    reference: 'name',
    label: 'Name',
    visible: true,
  },
  {
    reference: 'amount',
    label: 'Amount',
    visible: true,
  },
  {
    reference: 'date',
    label: 'Date',
    visible: true,
  },
  {
    reference: 'status',
    label: 'Status',
    visible: true,
  },
  {
    reference: 'subject',
    label: 'Subject',
    visible: true,
  },
  {
    reference: 'actions',
    label: '',
    visible: true,
  },
];

export const DFinanceHeadC1 = [
  {
    reference: 'name',
    label: 'Name',
    visible: true,
  },
  {
    reference: 'amount',
    label: 'Amount',
    visible: true,
  },
  {
    reference: 'subject',
    label: 'Subject',
    visible: true,
  },
  {
    reference: 'project',
    label: 'Project',
    visible: true,
  },
  {
    reference: 'balance_change',
    label: 'Balance Change',
    visible: true,
  },
  {
    reference: 'type',
    label: 'Type',
    visible: true,
  },
  {
    reference: 'status',
    label: 'Status',
    visible: true,
  },
  {
    reference: 'vendor',
    label: 'Vendor',
    visible: true,
  },
  {
    reference: 'email',
    label: 'Email',
    visible: true,
  },
  {
    reference: 'date',
    label: 'Date',
    visible: true,
  },
  {
    reference: 'actions',
    label: '',
    visible: true,
  },
];

export const DFinanceHead2 = [
  {
    reference: 'subject',
    label: 'Subject',
    visible: true,
  },
  {
    reference: 'date',
    label: 'Date',
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

export const DFinanceHead3 = [
  {
    reference: 'project',
    label: 'Project',
    visible: true,
  },
  {
    reference: 'date',
    label: 'Date',
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
