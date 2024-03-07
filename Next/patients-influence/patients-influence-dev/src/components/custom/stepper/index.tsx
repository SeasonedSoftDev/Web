/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { Button } from 'components/ui';
import React, { useState, FormEvent, useEffect } from 'react';

import {
  StepperMain,
  StepperContainer,
  StepHelper,
  StepContainer,
  ButtonsMain,
  StepperConnector,
  StepFinal,
} from 'components/custom/stepper/styles';
import { Step, StepLabel } from 'components/custom/stepper/elements';
import {
  Step1,
  Step2,
  Step3,
  Step4,
  StepV,
} from 'components/custom/stepper/stepper-steps';
import { VerifiedIcon } from 'components/svg';
import { useAppContext } from 'context';
import { EnumsApi, InfluencerAPI } from 'api';
// eslint-disable-next-line import/no-named-as-default, import/no-named-as-default-member
import Project from 'constants/project';
import { useModal, useSnackbar } from 'hooks';
import { TSelectFieldType } from 'features/discover-influencers/role/admin/elements/influencer-profile/types';
import PromptFormSubmitModal from './elements/form-submit-modal';

const steps = [
  'Login Info',
  'Influencer Info',
  'Social Media',
  'Desired Income',
  'Verified',
];

const StepIconComponent = (userStatus: number) => (
  <StepFinal status={userStatus}>
    <VerifiedIcon />
  </StepFinal>
);
export type FormData = {
  firstName: string;
  lastName: string;
  company: string;
  role: string;
  type: any;
  markets: string;
  email: string;
  password: any;
  invitedBy: string;
  affiliateFriends: any | null;
  socialPlatforms: any[];
  affiliateLink: string;
  birthDate: string;
  location: any;
  gender: any;
  diseaseAreas: any[];
  experienceAs: any;
  ethnicity: any;
  instaP: string;
  instaR: string;
  instaS: string;
  yVideoS: any;
  yVideoM: any;
  yVideoL: any;
  ttPost: any;
  currency: number;
  questionCredit: string;
  averageQuestionSurvey: string;
  interviewShort: string;
  interviewLong: string;
  status: number;
  instagramUsername: string;
};

const Stepper = () => {
  const [activeStep, setActiveStep] = useState(0);

  const [errors, setErrors] = useState([false, false, false, false, false]);

  const [genderOptions, setGenderOptions] = useState();
  const [ethnicities, setEthnicities] = useState<TSelectFieldType[]>([]);
  const [stakeholders, setStakholders] = useState<TSelectFieldType[]>([]);
  const [buttonTextDynamic, setButtonTextDynamic] = useState('');

  const { user, handleInfluencer, getMeData } = useAppContext();
  const [formModal, openFormModal, closeFormModal] = useModal(false);

  const { push } = useSnackbar();

  const handleErrors = (index: number) => (value: boolean) => {
    setErrors((x) => x.map((a, b) => (b === index ? value : a)));
  };

  const generateRegisterAffiliateLink = (affiliateCode: string) => {
    const {
      environment,
      baseUrl: baseDevUrl,
      baseProdUrl,
      baseStageUrl,
    } = Project.app;
    let baseUrl;

    switch (environment) {
      case 'development':
        baseUrl = baseDevUrl;
        break;
      case 'staging':
        baseUrl = baseStageUrl;
        break;
      case 'production':
        baseUrl = baseProdUrl;
        break;
      default:
        // Handle the case where 'environment' is not one of the specified values
        console.error('Unknown environment:', environment);
        break;
    }

    return `${baseUrl}/register?as=influencer&affiliateCode=${affiliateCode}`;
  };

  const INITIAL_DATA: FormData = {
    firstName: user.firstName,
    lastName: user.lastName,
    company: '',
    role: '',
    type: undefined,
    markets: '',
    email: user.email,
    password: user.password,
    invitedBy: user.influencer.invitendByUserId,
    affiliateFriends: null,
    affiliateLink: generateRegisterAffiliateLink(user.influencer.affiliateCode),
    birthDate: user.influencer.dateOfBirth,
    location: null,
    gender: null,
    diseaseAreas: [],
    experienceAs: null,
    ethnicity: null,
    instaP: '',
    instaR: '',
    instaS: '',
    yVideoS: null,
    yVideoM: null,
    yVideoL: null,
    ttPost: null,
    questionCredit: '',
    averageQuestionSurvey: '',
    interviewShort: '',
    interviewLong: '',
    socialPlatforms: [],
    currency: 2,
    status: user.status,
    instagramUsername: '',
  };

  const addStep = () => {
    setActiveStep((prev) => prev + 1);
  };

  const decreaseStep = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleStepClick = (idx: any) => {
    setActiveStep(idx);
  };

  let currencyToSend: number;

  const setInfluencerData = async () => {
    if (user && genderOptions && ethnicities) {
      getInfluencerData(user.id)
        .then((influencerUser) => {
          // const affiliatedFriends = data.invitedInfluencers.map(
          //   (influencer: { user: any }) => {
          //     const { id, firstName, lastName } = influencer.user;
          //     const label = `${firstName} ${lastName}`;
          //     return { value: id, label };
          //   }
          // );
          // setAffiliateFriendsList(affiliatedFriends);
          setFormData((prevState) => {
            let location;

            if (influencerUser.location) {
              const label =
                influencerUser.location.countryId &&
                influencerUser.location.country
                  ? `${influencerUser.location.name}, ${influencerUser.location.country.name}`
                  : influencerUser.location.name;

              location = {
                label,
                value: influencerUser.location.id,
              };
            }

            const gender =
              influencerUser.influencer.gender === 0 ||
              influencerUser.influencer.gender
                ? genderOptions[influencerUser.influencer.gender]
                : null;

            const diseaseAreas = influencerUser.influencer
              .influencerDiseaseAreas
              ? influencerUser.influencer.influencerDiseaseAreas.map((area) => {
                  const label = area.diseaseArea.name;
                  const value = area.diseaseArea.id;
                  return {
                    label,
                    value,
                  };
                })
              : [];

            const postAmounts =
              influencerUser.influencer.influencerCampaignAmounts;
            const surveyAmounts =
              influencerUser.influencer.influencerSurveyAmounts;

            const postLabel: { [key: number]: string } = {
              0: 'post',
              1: 'reel',
              2: 'story',
            };

            const surveyLabel: { [key: number]: string } = {
              0: 'questionnaire',
              1: 'short',
              2: 'long',
            };

            const formattedPostAmounts = postAmounts.map((obj) => {
              const label = postLabel[obj.postType];
              return { type: label, amount: `${obj.desiredAmount}` };
            });

            const formattedSurveyAmounts = surveyAmounts.map((obj) => {
              const label = surveyLabel[obj.surveyType];
              return { type: label, amount: `${obj.desiredAmount}` };
            });

            const instaP = formattedPostAmounts.find(
              (postAm) => postAm.type === 'post'
            );
            const instaR = formattedPostAmounts.find(
              (postAm) => postAm.type === 'reel'
            );
            const instaS = formattedPostAmounts.find(
              (postAm) => postAm.type === 'story'
            );

            const questionCredit = formattedSurveyAmounts.find(
              (surveyAm) => surveyAm.type === 'questionnaire'
            );
            const interviewShort = formattedSurveyAmounts.find(
              (surveyAm) => surveyAm.type === 'short'
            );
            const interviewLong = formattedSurveyAmounts.find(
              (surveyAm) => surveyAm.type === 'long'
            );

            const ethnicity = influencerUser.influencer.ethnicityId
              ? ethnicities.find(
                  (ethnicityItem) =>
                    ethnicityItem.value ===
                    influencerUser.influencer.ethnicityId
                )
              : null;
            const invitedBy = influencerUser.influencer.invitedByUser
              ? `${influencerUser.influencer.invitedByUser.firstName} ${influencerUser.influencer.invitedByUser.lastName}`
              : '';

            const experience =
              influencerUser.influencer.type === 0 ||
              influencerUser.influencer.type
                ? stakeholders.find(
                    (item: TSelectFieldType) =>
                      item.value === influencerUser.influencer.type
                  )
                : null;

            const instagramUsername =
              influencerUser.influencer.instagramUsername !== null &&
              influencerUser.influencer.instagramUsername.length
                ? influencerUser.influencer.instagramUsername
                : '';

            return {
              ...prevState,
              firstName: influencerUser.firstName,
              lastName: influencerUser.lastName,
              company: '',
              role: '',
              type: influencerUser.influencer.type,
              markets: '',
              email: influencerUser.email,
              password: user.password,
              invitedBy,
              affiliateFriends: null,
              affiliateLink: generateRegisterAffiliateLink(
                user.influencer.affiliateCode
              ),
              birthDate: user.influencer.dateOfBirth,
              location,
              gender,
              diseaseAreas,
              experienceAs: experience,
              ethnicity,
              instaP: instaP?.amount || '',
              instaR: instaR?.amount || '',
              instaS: instaS?.amount || '',
              yVideoS: null,
              yVideoM: null,
              yVideoL: null,
              ttPost: null,
              questionCredit: questionCredit?.amount || '',
              averageQuestionSurvey: '',
              interviewShort: interviewShort?.amount || '',
              interviewLong: interviewLong?.amount || '',
              socialPlatforms: [],
              instagramUsername,
              currency: 2,
              status: user.status,
            };
          });
        })
        .catch(() => {
          push('Something failed!', {
            variant: 'error',
          });
        });
    }
  };

  // eslint-disable-next-line consistent-return
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const diseaseValueArray: object[] = [];

      const campaignDesiredIncome: object[] = [];

      const surveyDesiredIncome: object[] = [];

      if (activeStep === 3) {
        formData.diseaseAreas.map(async (disease: any) =>
          diseaseValueArray.push(disease.value)
        );

        if (formData.instaP) {
          campaignDesiredIncome.push({
            postType: 0,
            desiredAmount: parseFloat(formData.instaP),
          });
        }

        if (formData.instaR) {
          campaignDesiredIncome.push({
            postType: 1,
            desiredAmount: parseFloat(formData.instaR),
          });
        }

        if (formData.instaS) {
          campaignDesiredIncome.push({
            postType: 2,
            desiredAmount: parseFloat(formData.instaS),
          });
        }

        if (formData.questionCredit) {
          surveyDesiredIncome.push({
            surveyType: 0,
            desiredAmount: parseFloat(formData.questionCredit),
          });
        }

        if (formData.interviewShort) {
          surveyDesiredIncome.push({
            surveyType: 1,
            desiredAmount: parseFloat(formData.interviewShort),
          });
        }

        if (formData.interviewLong) {
          surveyDesiredIncome.push({
            surveyType: 2,
            desiredAmount: parseFloat(formData.interviewLong),
          });
        }

        const data = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          location: formData.location,
          gender: formData.gender,
          dateOfBirth: formData.birthDate,
          diseaseArea: formData.diseaseAreas,
          experienceAs: formData.experienceAs,
          ethnicity: formData.ethnicity,
          currency: formData.currency,
          instagramUsername: formData.instagramUsername,
        };

        const isFormDataValid = Object.values(data).every((value) => !!value);

        const lastStepData = {
          instaP: formData?.instaP,
          instR: formData?.instaR,
          instaS: formData?.instaS,
          interviewShort: formData?.interviewShort,
          interviewLong: formData?.interviewLong,
          questionCredit: formData?.questionCredit,
        };

        const lastStepContainsValue = Object.values(lastStepData).some(
          (value) => !!value
        );

        const lastStepContainsEveryValue = Object.values(lastStepData).every(
          (value) => !!value
        );

        // eslint-disable-next-line no-lonely-if
        if (!isFormDataValid && !lastStepContainsValue) {
          push('Unable to submit form. Please fill out all required fields!', {
            variant: 'error',
          });
        }
        if (!isFormDataValid && lastStepContainsValue) {
          push('Unable to submit form. Please fill out all required fields!', {
            variant: 'error',
          });

          return;
        }

        if (isFormDataValid && !lastStepContainsValue) {
          push(
            'Unable to submit form. Please fill out at least one of the fields in this step!',
            {
              variant: 'error',
            }
          );

          return;
        }

        if (isFormDataValid && lastStepContainsValue) {
          if (!lastStepContainsEveryValue && !formModal) {
            openFormModal();
          } else {
            const formattedFormData = {
              firstName: formData.firstName || undefined,
              lastName: formData.lastName || undefined,
              email: formData.email || undefined,
              dateOfBirth: formData.birthDate || undefined,
              ethnicityId: formData.ethnicity.value || undefined,
              currency: currencyToSend,
              diseaseAreas: diseaseValueArray || undefined,
              password: formData.password,
              // experienceAs: formData.experienceAs.value || undefined,
              affiliateLink: formData.affiliateLink || undefined,
              affiliateFriends: formData.affiliateFriends || null,
              locationId: formData.location.value || undefined,
              campaignDesiredIncome: campaignDesiredIncome || undefined,
              surveyDesiredIncome: surveyDesiredIncome || undefined,
              gender:
                formData.gender.value === 0 || formData.gender.value
                  ? formData.gender.value
                  : undefined,
              // socialPlatforms,
              type: formData.experienceAs.value || undefined,
              status: user.status > 4 ? user.status : 4,
              instagramUsername: formData.instagramUsername || undefined,
            };
            await InfluencerAPI.updateInfluencer(
              formattedFormData,
              user.id
            ).finally(() => {
              getMeData();
              setInfluencerData();
            });
            if (user.status < 4) {
              addStep();
            }
            if (user.status < 4) {
              push('Form submited!', {
                variant: 'success',
              });
            }

            if (user.status >= 4) {
              push('Form updated!', {
                variant: 'success',
              });
            }
          }

          return;
        }

        if (isFormDataValid && lastStepContainsEveryValue) {
          await InfluencerAPI.updateInfluencer(
            {
              firstName: formData.firstName || undefined,
              lastName: formData.lastName || undefined,
              email: formData.email || undefined,
              dateOfBirth: formData.birthDate || undefined,
              ethnicityId: formData.ethnicity.value || undefined,
              currency: currencyToSend,
              diseaseAreas: diseaseValueArray || undefined,
              password: formData.password,
              // experienceAs: formData.experienceAs.value || undefined,
              affiliateLink: formData.affiliateLink || undefined,
              affiliateFriends: formData.affiliateFriends || null,
              locationId: formData.location.value || undefined,
              campaignDesiredIncome: campaignDesiredIncome || undefined,
              surveyDesiredIncome: surveyDesiredIncome || undefined,
              gender:
                formData.gender.value === 0 || formData.gender.value
                  ? formData.gender.value
                  : undefined,
              // socialPlatforms,
              type: formData.experienceAs.value || undefined,
              status: 4,
            },
            user.id
          ).finally(() => {
            getMeData();
            setInfluencerData();
          });
          addStep();
          push('Form submited!', {
            variant: 'success',
          });
        }
      } else {
        addStep();
      }
    } catch (error) {
      push('Unable to submit form. Please fill out all required fields!', {
        variant: 'error',
      });
    }
  };

  const [formData, setFormData] = useState(INITIAL_DATA);

  const getInfluencerData = async (influencerId: number) => {
    const singleInfluencer = await InfluencerAPI.getSingleInfluencer(
      influencerId
    );
    handleInfluencer(singleInfluencer);
    return singleInfluencer;
  };

  const getGenderOptions = async () => {
    const result = await EnumsApi.getGenders();

    setGenderOptions(
      result.map((x: any) => ({
        value: x.value,
        label: x.name,
      }))
    );
  };

  const getEthnicity = async () => {
    const result = await EnumsApi.getEthnicities();

    setEthnicities(
      result.map((x: any) => ({
        value: x.id,
        label: x.name,
      }))
    );
  };

  const getStakeholders = async () => {
    const result = await EnumsApi.getStakeholderTypes(true);

    setStakholders(
      result.map((x: any) => ({
        value: x.value,
        label: x.name,
      }))
    );
  };

  useEffect(() => {
    getStakeholders();
    getEthnicity();
    getGenderOptions();
  }, []);

  useEffect(() => {
    setInfluencerData();
  }, [user, genderOptions, ethnicities]);

  useEffect(() => {
    let buttonText = '';
    buttonText = 'Next';

    if (activeStep === 3 && user.status <= 3) {
      buttonText = 'Submit';
    }

    if (activeStep === 4 && user.status >= 5) {
      buttonText = 'Verified';
    }

    if (activeStep === 3 && user.status >= 4) {
      buttonText = 'Save';
    }

    setButtonTextDynamic(buttonText);
  }, [activeStep, user.status]);

  return (
    <StepperMain>
      <StepHelper>
        <StepContainer>
          <StepperContainer
            activeStep={activeStep}
            alternativeLabel
            style={{ marginBottom: '50px' }}
            connector={<StepperConnector />}
          >
            {steps.map((label, index) =>
              index !== 4 ? (
                <Step key={label} onClick={() => handleStepClick(index)}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ) : (
                <Step key={label}>
                  <StepLabel
                    StepIconComponent={() => StepIconComponent(user.status)}
                  >
                    {label}
                  </StepLabel>
                </Step>
              )
            )}
          </StepperContainer>
          {activeStep === 0 && (
            <Step1
              formData={formData}
              setFormData={setFormData}
              handleErrors={handleErrors}
            />
          )}
          {activeStep === 1 && (
            <Step2
              formData={formData}
              setFormData={setFormData}
              handleErrors={handleErrors}
            />
          )}
          {activeStep === 2 && (
            <Step3
              formData={formData}
              setFormData={setFormData}
              handleErrors={handleErrors}
            />
          )}
          {activeStep === 3 && (
            <Step4
              formData={formData}
              setFormData={setFormData}
              handleErrors={handleErrors}
            />
          )}
          {activeStep === 4 && <StepV />}
          {formModal && (
            <PromptFormSubmitModal
              onClose={closeFormModal}
              onSubmit={handleSubmit}
            />
          )}
        </StepContainer>
        <ButtonsMain>
          <Button
            disabled={activeStep === 0}
            variant="outlined"
            size="large"
            color="secondary"
            onClick={decreaseStep}
          >
            Previous
          </Button>
          {activeStep !== 4 ? (
            <Button
              type="submit"
              disabled={activeStep === 4}
              variant="contained"
              size="large"
              color="primary"
              onClick={handleSubmit}
            >
              {buttonTextDynamic}
            </Button>
          ) : undefined}
        </ButtonsMain>
      </StepHelper>
    </StepperMain>
  );
};

export default Stepper;
