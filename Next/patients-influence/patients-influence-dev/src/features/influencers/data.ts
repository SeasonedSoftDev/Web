import { IMinMaxField, ISelectField } from 'utilities/converters';

export interface IInfluencerFilterProps {
  search: string;
  experienceAs: ISelectField | null;
  genders: ISelectField[];
  age: IMinMaxField;
  ethnicities: ISelectField[];
  locations: ISelectField[];
  diseaseAreas: ISelectField[];
  struggles: ISelectField[];
  interests: ISelectField[];
  keywords: string;
  languages: ISelectField[];
  followers: IMinMaxField;
  engagement: IMinMaxField;
  likes: IMinMaxField;
  comments: IMinMaxField;
  joinedFrom: Date | null;
  joinedTo: Date | null;
  stakeholders: ISelectField[];
  audienceGenderChoices: ISelectField[];
  audienceGenderCount: string;
  audienceGenderUnit: ISelectField | null;
  audienceAgeValues: IMinMaxField;
  audienceAgeCount: string;
  audienceAgeUnit: ISelectField | null;
  audienceEthnicityChoices: ISelectField[];
  audienceEthnicityCount: string;
  audienceEthnicityUnit: ISelectField | null;
  audienceLocationChoices: ISelectField[];
  audienceLocationCount: string;
  audienceLocationUnit: ISelectField | null;
  audienceDiseaseAreaChoices: ISelectField[];
  audienceDiseaseAreaCount: string;
  audienceDiseaseAreaUnit: ISelectField | null;
  audienceStruggleChoices: ISelectField[];
  audienceStruggleCount: string;
  audienceStruggleUnit: ISelectField | null;
  audienceInterestChoices: ISelectField[];
  audienceInterestCount: string;
  audienceInterestUnit: ISelectField | null;
  audienceLanguageChoices: ISelectField[];
  audienceLanguageCount: string;
  audienceLanguageUnit: ISelectField | null;
  audienceKeywords: string;
  performancePostType: ISelectField | null;
  costPerTarget: IMinMaxField;
  costPerQuestionCredit: IMinMaxField;
  costPerLike: IMinMaxField;
  costPerComment: IMinMaxField;
  costPerEngagement: IMinMaxField;
  totalEarnings: IMinMaxField;
  earningsLast30Days: IMinMaxField;
  totalProjects: IMinMaxField;
  projectsLast30Days: IMinMaxField;
  influencersNeeded: number | null;
  audienceOverlap: number | null;
  prioritizeBy: ISelectField | null;
}
export const DGenerateInfluencersFilter = (): IInfluencerFilterProps => ({
  search: '',
  experienceAs: null,
  genders: [],
  age: {
    min: '',
    max: '',
  },
  ethnicities: [],
  locations: [],
  diseaseAreas: [],
  struggles: [],
  interests: [],
  keywords: '',
  languages: [],
  followers: {
    min: '',
    max: '',
  },
  engagement: {
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
  joinedFrom: null,
  joinedTo: null,
  stakeholders: [],
  audienceGenderChoices: [],
  audienceGenderCount: '',
  audienceGenderUnit: {
    value: '1',
    label: '#',
  },
  audienceAgeValues: {
    min: '',
    max: '',
  },
  audienceAgeCount: '',
  audienceAgeUnit: {
    value: '1',
    label: '#',
  },
  audienceEthnicityChoices: [],
  audienceEthnicityCount: '',
  audienceEthnicityUnit: {
    value: '1',
    label: '#',
  },
  audienceLocationChoices: [],
  audienceLocationCount: '',
  audienceLocationUnit: {
    value: '1',
    label: '#',
  },
  audienceDiseaseAreaChoices: [],
  audienceDiseaseAreaCount: '',
  audienceDiseaseAreaUnit: {
    value: '1',
    label: '#',
  },
  audienceStruggleChoices: [],
  audienceStruggleCount: '',
  audienceStruggleUnit: {
    value: '1',
    label: '#',
  },
  audienceInterestChoices: [],
  audienceInterestCount: '',
  audienceInterestUnit: {
    value: '1',
    label: '#',
  },
  audienceLanguageChoices: [],
  audienceLanguageCount: '',
  audienceLanguageUnit: {
    value: '1',
    label: '#',
  },
  audienceKeywords: '',
  performancePostType: null,
  costPerTarget: {
    min: '',
    max: '',
  },
  costPerQuestionCredit: {
    min: '',
    max: '',
  },
  costPerLike: {
    min: '',
    max: '',
  },
  costPerComment: {
    min: '',
    max: '',
  },
  costPerEngagement: {
    min: '',
    max: '',
  },
  totalEarnings: {
    min: '',
    max: '',
  },
  earningsLast30Days: {
    min: '',
    max: '',
  },
  totalProjects: {
    min: '',
    max: '',
  },
  projectsLast30Days: {
    min: '',
    max: '',
  },

  influencersNeeded: null,
  audienceOverlap: null,
  prioritizeBy: null,
});

export const DInfluencersHead = [
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
    reference: 'experienceAs',
    label: 'Experience As',
    visible: false,
  },
  {
    reference: 'email',
    label: 'Email',
    visible: false,
  },
  {
    reference: 'socialMedia',
    label: 'Social Media',
    visible: false,
  },
  {
    reference: 'username',
    label: 'Username',
    visible: false,
  },
  {
    reference: 'diseaseArea',
    label: 'Disease Area',
    visible: true,
  },
  {
    reference: 'location',
    label: 'Location',
    visible: true,
  },
  {
    reference: 'age',
    label: 'Age',
    visible: true,
  },
  {
    reference: 'gender',
    label: 'Gender',
    visible: true,
  },
  {
    reference: 'invitedBy',
    label: 'Invited By',
    visible: false,
  },
  {
    reference: 'invited',
    label: 'Invited',
    visible: false,
  },
  {
    reference: 'ethnicity',
    label: 'Ethnicity',
    visible: false,
  },
  {
    reference: 'brands',
    label: 'Brands',
    visible: false,
  },
  {
    reference: 'products',
    label: 'Products',
    visible: false,
  },
  {
    reference: 'interests',
    label: 'Interests',
    visible: false,
  },
  {
    reference: 'struggles',
    label: 'Struggles',
    visible: false,
  },
  {
    reference: 'language',
    label: 'Language',
    visible: false,
  },
  {
    reference: 'followers',
    label: 'Followers',
    visible: true,
  },
  {
    reference: 'averageLikes',
    label: 'Average Likes',
    visible: false,
  },
  {
    reference: 'averageComments',
    label: 'Average Comments',
    visible: false,
  },
  {
    reference: 'engagement',
    label: 'Engagement',
    visible: false,
  },
  {
    reference: 'label',
    label: 'Label',
    visible: false,
  },
  {
    reference: 'registeredAt',
    label: 'Registered At',
    visible: false,
  },
  {
    reference: 'postAmount',
    label: 'Post Amount',
    visible: false,
  },
  {
    reference: 'reelAmount',
    label: 'Reel Amount',
    visible: false,
  },
  {
    reference: 'storyAmount',
    label: 'Story Amount',
    visible: false,
  },
  {
    reference: 'shortInterviewAmount',
    label: 'Short Interview Amount',
    visible: false,
  },
  {
    reference: 'longInterviewAmount',
    label: 'Long Interview Amount',
    visible: false,
  },
  {
    reference: 'questionCreditAmount',
    label: 'Questionnaire Credit Amount',
    visible: false,
  },
  {
    reference: 'costPerClick',
    label: 'Cost per Click',
    visible: false,
  },
  {
    reference: 'costPerTarget',
    label: 'Cost per Target',
    visible: false,
  },
  {
    reference: 'reachMultiplier',
    label: 'Reach Multiplier',
    visible: false,
  },
  {
    reference: 'costPerComment',
    label: 'Cost per Comment',
    visible: false,
  },
  {
    reference: 'costPerLike',
    label: 'Cost per Like',
    visible: false,
  },
  {
    reference: 'costPerEngagement',
    label: 'Cost per Engagement',
    visible: false,
  },
  {
    reference: 'costPerEngagedTarget',
    label: 'Cost Per Engaged Target',
    visible: false,
  },
  {
    reference: 'totalEarnings',
    label: 'Total Earnings',
    visible: false,
  },
  {
    reference: 'earningsLast30Days',
    label: 'Earnings Last 30 Days',
    visible: false,
  },
  {
    reference: 'totalProjects',
    label: 'Total Projects',
    visible: false,
  },
  {
    reference: 'projectsLast30days',
    label: 'Projects Last 30 Days',
    visible: false,
  },
  {
    reference: 'totalCampaigns',
    label: 'Total Campaigns',
    visible: false,
  },
  {
    reference: 'campaignsLast30Days',
    label: 'Campaigns Last 30 Days',
    visible: false,
  },
  {
    reference: 'totalSurveys',
    label: 'Total Surveys',
    visible: false,
  },
  {
    reference: 'surveysLast30Days',
    label: 'Surveys Last 30 Days',
    visible: false,
  },

  {
    reference: 'audienceOverlap',
    label: 'Audience Overlap',
    visible: false,
  },
  {
    reference: 'stakeholderRatio',
    label: 'Stakeholder Ratio %',
    visible: false,
  },
  {
    reference: 'patientsRatio',
    label: 'Patients and Caregivers Ratio %',
    visible: false,
  },
  // {
  //   reference: 'caregiversRatio',
  //   label: 'Caregivers Ratio %',
  //   visible: false,
  // },
  {
    reference: 'doctorsRatio',
    label: 'Doctors Ratio %',
    visible: false,
  },
  {
    reference: 'nursesRatio',
    label: 'Nurses Ratio %',
    visible: false,
  },
  {
    reference: 'targetedGender',
    label: 'Targeted Gender %',
    visible: false,
  },
  {
    reference: 'targetedSymptom',
    label: 'Targeted Symptoms %',
    visible: false,
  },
  {
    reference: 'targetedRatio',
    label: 'Targeted %',
    visible: false,
  },
  {
    reference: 'targetedTotal',
    label: 'Targeted Total',
    visible: false,
  },
  {
    reference: 'likes',
    label: 'Avarage Likes',
    visible: false,
  },
  {
    reference: 'comments',
    label: 'Avarage Comments',
    visible: false,
  },
  {
    reference: 'engagement',
    label: 'Engagement',
    visible: false,
  },
  // {
  //   reference: 'targetedPatientsGender',
  //   label: 'Targeted Patients Gender %',
  //   visible: false,
  // },
  // {
  //   reference: 'targetedCaregiversGender',
  //   label: 'Targeted Caregivers Gender %',
  //   visible: false,
  // },
  // {
  //   reference: 'targetedDoctorsGender',
  //   label: 'Targeted Doctors Gender %',
  //   visible: false,
  // },
  // {
  //   reference: 'targetedNurseGender',
  //   label: 'Targeted Nurse Gender %',
  //   visible: false,
  // },
  {
    reference: 'targetedStakeholdersAge',
    label: 'Targeted Age %',
    visible: false,
  },
  // {
  //   reference: 'targetedCaregiversAge',
  //   label: 'Targeted Caregivers Age %',
  //   visible: false,
  // },
  // {
  //   reference: 'targetedDoctorsAge',
  //   label: 'Targeted Doctors Age %',
  //   visible: false,
  // },
  // {
  //   reference: 'targetedNursesAge',
  //   label: 'Targeted Nurses Age %',
  //   visible: false,
  // },
  {
    reference: 'targetedStakeholdersEthnicity',
    label: 'Targeted Ethnicity %',
    visible: false,
  },
  // {
  //   reference: 'targetedCaregiversEthnicity',
  //   label: 'Targeted Caregivers Ethnicity %',
  //   visible: false,
  // },
  // {
  //   reference: 'targetedDoctorsEthnicity',
  //   label: 'Targeted Doctors Ethnicity %',
  //   visible: false,
  // },
  // {
  //   reference: 'targetedNursesEthnicity',
  //   label: 'Targeted Nurses Ethnicity %',
  //   visible: false,
  // },
  {
    reference: 'targetedStakeholdersLocation',
    label: 'Targeted Location %',
    visible: false,
  },
  // {
  //   reference: 'targetedCaregiversLocation',
  //   label: 'Targeted Caregivers Location %',
  //   visible: false,
  // },
  // {
  //   reference: 'targetedDoctorsLocation',
  //   label: 'Targeted Doctors Location %',
  //   visible: false,
  // },
  // {
  //   reference: 'targetedNursesLocation',
  //   label: 'Targeted Nurses Location %',
  //   visible: false,
  // },
  {
    reference: 'targetedDiseaseArea',
    label: 'Targeted Disease Area %',
    visible: false,
  },
  // {
  //   reference: 'targetedCaregiversDiseaseArea',
  //   label: 'Targeted Caregivers Disease Area %',
  //   visible: false,
  // },
  // {
  //   reference: 'targetedDoctorsDiseaseArea',
  //   label: 'Targeted Doctors Disease Area %',
  //   visible: false,
  // },
  // {
  //   reference: 'targetedNursesDiseaseArea',
  //   label: 'Targeted Nurses Disease Area %',
  //   visible: false,
  // },
  // {
  //   reference: 'targetedPatientsStruggles',
  //   label: 'Targeted Patients Struggles %',
  //   visible: false,
  // },
  // {
  //   reference: 'targetedCaregiversStruggles',
  //   label: 'Targeted Caregivers Struggles %',
  //   visible: false,
  // },
  // {
  //   reference: 'targetedDoctorsStruggles',
  //   label: 'Targeted Doctors Struggles %',
  //   visible: false,
  // },
  // {
  //   reference: 'targetedNursesStruggles',
  //   label: 'Targeted Nurses Struggles %',
  //   visible: false,
  // },
  // {
  //   reference: 'targetedPatientsInterests',
  //   label: 'Targeted Patients Interests %',
  //   visible: false,
  // },
  // {
  //   reference: 'targetedCaregiversInterests',
  //   label: 'Targeted Caregivers Interests %',
  //   visible: false,
  // },
  // {
  //   reference: 'targetedDoctorsInterests',
  //   label: 'Targeted Doctors Interests %',
  //   visible: false,
  // },
  // {
  //   reference: 'targetedNursesInterests',
  //   label: 'Targeted Nurses Interests %',
  //   visible: false,
  // },
  // {
  //   reference: 'targetedPatientsBrand',
  //   label: 'Targeted Patients Brand %',
  //   visible: false,
  // },
  // {
  //   reference: 'targetedCaregiversBrand',
  //   label: 'Targeted Caregivers Brand %',
  //   visible: false,
  // },
  // {
  //   reference: 'targetedDoctorsBrand',
  //   label: 'Targeted Doctors Brand %',
  //   visible: false,
  // },
  // {
  //   reference: 'targetedNursesBrand',
  //   label: 'Targeted Nurses Brand %',
  //   visible: false,
  // },
  // {
  //   reference: 'targetedPatientsProduct',
  //   label: 'Targeted Patients Product %',
  //   visible: false,
  // },
  // {
  //   reference: 'targetedCaregiversProduct',
  //   label: 'Targeted Caregivers Product %',
  //   visible: false,
  // },
  // {
  //   reference: 'targetedDoctorsProduct',
  //   label: 'Targeted Doctors Product %',
  //   visible: false,
  // },
  // {
  //   reference: 'targetedNursesProduct',
  //   label: 'Targeted Nurses Product %',
  //   visible: false,
  // },
  // {
  //   reference: 'targetedPatientsLanguage',
  //   label: 'Targeted Patients Language %',
  //   visible: false,
  // },
  // {
  //   reference: 'targetedCaregiversLanguage',
  //   label: 'Targeted Caregivers Language %',
  //   visible: false,
  // },
  // {
  //   reference: 'targetedDoctorsLanguage',
  //   label: 'Targeted Doctors Language %',
  //   visible: false,
  // },
  // {
  //   reference: 'targetedNursesLanguage',
  //   label: 'Targeted Nurses Language %',
  //   visible: false,
  // },
  // {
  //   reference: 'targetedPatientsKeywords',
  //   label: 'Targeted Patients Keywords %',
  //   visible: false,
  // },
  // {
  //   reference: 'targetedCaregiversKeywords',
  //   label: 'Targeted Caregivers Keywords %',
  //   visible: false,
  // },
  // {
  //   reference: 'targetedDoctorsKeywords',
  //   label: 'Targeted Doctors Keywords %',
  //   visible: false,
  // },
  // {
  //   reference: 'targetedNursesKeywords',
  //   label: 'Targeted Nurses Keywords %',
  //   visible: false,
  // },
  {
    reference: 'actions',
    label: '',
    visible: true,
  },
];
