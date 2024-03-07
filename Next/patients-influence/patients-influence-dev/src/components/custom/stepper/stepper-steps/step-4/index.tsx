/* eslint-disable no-shadow */
import { Tooltip } from '@mui/material';
import { InfoIcon } from 'components/svg';
import { Stack } from 'components/system';
import {
  StepContainer,
  StepStack,
  StepLeft,
  StepRight,
  StepFMiddle,
  StepSMiddle,
  InputGroup,
  ConversionAmountWrapper,
  ConversionIconWrapper,
  LabelTooltip,
  TooltipTitle,
  TooltipParagraph,
} from 'components/custom/stepper/stepper-steps/step-4/style';
import { Input } from 'components/ui';
import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';
import {
  instagramPostSchema,
  instagramReelSchema,
  instagramStorySchema,
  lastNameSchema,
} from 'utilities/validators';
import { useAppContext } from 'context';
import { FormData } from '../..';
import { StepText } from '../step-2/style';

type Step4FormProps = {
  formData: FormData;
  setFormData: any;
  handleErrors: (index: number) => (value: boolean) => void;
};

const handleCurrencyCalculation = (
  amount: number,
  currency: 'EUR' | 'USD' | 'CHF' = 'CHF'
): number => {
  let formattedAmount = 0;

  if (currency === 'EUR') {
    formattedAmount = amount * 1.03;
  }
  if (currency === 'USD') {
    formattedAmount = amount * 1.11;
  }

  if (currency === 'CHF') {
    formattedAmount = amount; // Assumes the amount is already in euros for other currencies
  }

  return +formattedAmount.toFixed(2);
};

const Step = ({ formData, setFormData, handleErrors }: Step4FormProps) => {
  const {
    instaP,
    instaR,
    instaS,
    yVideoS,
    yVideoM,
    yVideoL,
    ttPost,
    questionCredit,
    averageQuestionSurvey,
    interviewShort,
    interviewLong,
  } = formData;

  const { t } = useTranslation('register');

  const { currency, user } = useAppContext();

  const [errors, setErrors] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  return (
    <StepStack>
      <StepContainer>
        <StepLeft>
          <Stack>
            <div
              style={{
                height: '25px',
                width: '100%',
                color: '#2D3779',
                font: 'inter',
                fontWeight: '600',
                display: 'grid',
                justifyContent: 'space-between',
              }}
            >
              <p>Campaigns</p>
            </div>

            <p style={{ color: '#7E839F', font: 'inter', fontWeight: '600' }}>
              Instagram
            </p>
            <InputGroup>
              <Input
                type="number"
                label="Post"
                placeholder="Please Enter Amount"
                value={instaP}
                // onValue={(instaP) => setFilter({ ...filter, instaP })}
                onValue={(instaP) => setFormData({ ...formData, instaP })}
                errorCallback={handleErrors(10)}
                endAdornment={
                  <span style={{ font: 'inter', color: '#7e839f' }}>CHF</span>
                }
                // validators={[
                //   {
                //     message: t('Post amount is required'),
                //     validator: (instaP) => {
                //       const v = instaP as string;
                //       if (v.trim()) return true;
                //       return false;
                //     },
                //   },
                //   {
                //     message: t('Please enter post amount!'),
                //     validator: (instaP) => {
                //       try {
                //         instagramPostSchema.validateSync({ instaP });
                //         return true;
                //       } catch {
                //         return false;
                //       }
                //     },
                //   },
                // ]}
                style={{ color: 'red', font: 'inter', fontWeight: '500' }}
              />
              {currency !== 'CHF' && +instaP !== 0 ? (
                <div
                  style={{
                    display: 'flex',
                    font: 'IBM Plex Sans',
                    color: '#7E839F',
                    fontSize: '11px',
                  }}
                >
                  <div
                    style={{
                      width: '13px',
                      height: '13px',
                      alignContent: 'center',
                      justifyContent: 'center',
                      paddingTop: '2px',
                    }}
                  >
                    <InfoIcon />
                  </div>
                  <p style={{ paddingLeft: '3px' }}>Approximately</p>
                  <p
                    style={{
                      paddingLeft: '3px',
                      color: '#448DC9',
                      fontWeight: '600',
                    }}
                  >
                    {handleCurrencyCalculation(
                      +instaP,
                      currency as 'CHF' | 'EUR' | 'USD'
                    )}{' '}
                    {currency}.
                  </p>
                </div>
              ) : undefined}
            </InputGroup>

            <InputGroup>
              <Input
                type="number"
                label="Story"
                placeholder="Please Enter Amount"
                value={instaS}
                // onValue={(instaP) => setFilter({ ...filter, instaP })}
                onValue={(instaS) => setFormData({ ...formData, instaS })}
                errorCallback={handleErrors(11)}
                endAdornment={
                  <span style={{ font: 'inter', color: '#7e839f' }}>CHF</span>
                }

                // validators={[
                //   {
                //     message: t('Story amount is required'),
                //     validator: (instaS) => {
                //       const v = instaS as string;
                //       if (v.trim()) return true;
                //       return false;
                //     },
                //   },
                //   {
                //     message: t('Please enter story amount!'),
                //     validator: (instaS) => {
                //       try {
                //         instagramStorySchema.validateSync({ instaS });
                //         return true;
                //       } catch {
                //         return false;
                //       }
                //     },
                //   },
                // ]}
              />
              {currency !== 'CHF' && +instaS !== 0 ? (
                <div
                  style={{
                    display: 'flex',
                    font: 'IBM Plex Sans',
                    color: '#7E839F',
                    fontSize: '11px',
                  }}
                >
                  <div
                    style={{
                      width: '13px',
                      height: '13px',
                      alignContent: 'center',
                      justifyContent: 'center',
                      paddingTop: '2px',
                    }}
                  >
                    <InfoIcon />
                  </div>
                  <p style={{ paddingLeft: '3px' }}>Approximately</p>
                  <p
                    style={{
                      paddingLeft: '3px',
                      color: '#448DC9',
                      fontWeight: '600',
                    }}
                  >
                    {handleCurrencyCalculation(
                      +instaS,
                      currency as 'CHF' | 'EUR' | 'USD'
                    )}{' '}
                    {currency}.
                  </p>
                </div>
              ) : undefined}
            </InputGroup>
            <InputGroup>
              <Input
                type="number"
                label="Reel"
                placeholder="Please Enter Amount"
                value={instaR}
                // onValue={(instaP) => setFilter({ ...filter, instaP })}
                onValue={(instaR) => setFormData({ ...formData, instaR })}
                errorCallback={handleErrors(12)}
                endAdornment={
                  <span style={{ font: 'inter', color: '#7e839f' }}>CHF</span>
                }
                // validators={[
                //   {
                //     message: t('Reel amount is required'),
                //     validator: (instaR) => {
                //       const v = instaR as string;
                //       if (v.trim()) return true;
                //       return false;
                //     },
                //   },
                //   {
                //     message: t('Please enter reel amount!'),
                //     validator: (instaR) => {
                //       try {
                //         instagramReelSchema.validateSync({ instaR });
                //         return true;
                //       } catch {
                //         return false;
                //       }
                //     },
                //   },
                // ]}
              />
              {currency !== 'CHF' && +instaR !== 0 ? (
                <div
                  style={{
                    display: 'flex',
                    font: 'IBM Plex Sans',
                    color: '#7E839F',
                    fontSize: '11px',
                  }}
                >
                  <div
                    style={{
                      width: '13px',
                      height: '13px',
                      alignContent: 'center',
                      justifyContent: 'center',
                      paddingTop: '2px',
                    }}
                  >
                    <InfoIcon />
                  </div>
                  <p style={{ paddingLeft: '3px' }}>Approximately</p>
                  <p
                    style={{
                      paddingLeft: '3px',
                      color: '#448DC9',
                      fontWeight: '600',
                    }}
                  >
                    {handleCurrencyCalculation(
                      +instaR,
                      currency as 'CHF' | 'EUR' | 'USD'
                    )}{' '}
                    {currency}.
                  </p>
                </div>
              ) : undefined}
            </InputGroup>
          </Stack>
        </StepLeft>
        {/* <StepFMiddle>
          <Stack>
            <p style={{ color: '#7E839F', font: 'inter', fontWeight: '600' }}>
              Youtube
            </p>
            <Input
              type="number"
              label="Video - 10sec"
              placeholder="Please Enter Amount"
              value={yVideoS}
              onValue={(yVideoS) => setFormData({ ...formData, yVideoS })}
            />
            <Input
              type="number"
              label="Video - 30sec"
              placeholder="Please Enter Amount"
              value={yVideoM}
              onValue={(yVideoM) => setFormData({ ...formData, yVideoM })}
            />
            <Input
              type="number"
              label="Video - 60sec"
              placeholder="Please Enter Amount"
              value={yVideoL}
              onValue={(yVideoL) => setFormData({ ...formData, yVideoL })}
            />
          </Stack>
        </StepFMiddle>
        <StepSMiddle>
          <Stack>
            <p style={{ color: '#7E839F', font: 'inter', fontWeight: '600' }}>
              TikTok
            </p>
            <Input
              type="number"
              label="Post"
              placeholder="Please Enter Amount"
              value={ttPost}
              onValue={(ttPost) => setFormData({ ...formData, ttPost })}
            />
          </Stack>
        </StepSMiddle> */}
        <StepRight>
          <Stack>
            <div
              style={{
                height: '25px',
                width: '100%',
                color: '#2D3779',
                font: 'inter',
                fontWeight: '600',
                display: 'grid',
                // gridTemplateColumns: 'repeat(8, 1fr)',
                justifyContent: 'space-between',
              }}
            >
              <p>Surveys</p>
            </div>
            <p style={{ color: '#7E839F', font: 'inter', fontWeight: '600' }}>
              Questionnaire
            </p>
            <InputGroup>
              <p
                style={{
                  color: '#6f6f6f',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '14px',
                  marginBottom: '17px',
                }}
              >
                <p style={{ font: 'inter', fontWeight: '500' }}>
                  Question Credit
                </p>

                <Tooltip
                  title={
                    <LabelTooltip>
                      <TooltipTitle>Question Credit</TooltipTitle>
                      <TooltipParagraph>
                        Question Credit is determined by the complexity of the
                        question. If the question is taking more time for
                        participant to answer it will be worth more credits.
                      </TooltipParagraph>
                      <TooltipParagraph>
                        <p>Example:</p>
                        <p>Yes or No = 1 credit</p>
                        <p>Multiple Choice = 1 credit</p>
                        <p>Open-ended Question = 2 credits</p>
                      </TooltipParagraph>
                      <TooltipParagraph>
                        Additional credits will be assigned to the questions
                        that require more time e.g. watching a short video.
                      </TooltipParagraph>
                    </LabelTooltip>
                  }
                  style={{
                    width: '20px',
                    height: '20px',
                    marginLeft: '10px',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  <span>
                    <InfoIcon />
                  </span>
                </Tooltip>
              </p>

              <Input
                type="number"
                placeholder="Please Enter Amount"
                value={questionCredit}
                onValue={(questionCredit) =>
                  setFormData({ ...formData, questionCredit })
                }
                style={{ marginTop: '-15px' }}
                errorCallback={handleErrors(13)}
                endAdornment={
                  <span style={{ font: 'inter', color: '#7e839f' }}>CHF</span>
                }
                // validators={[
                //   {
                //     message: t('Question credit amount is required'),
                //     validator: (questionCredit) => {
                //       const v = questionCredit as string;
                //       if (v.trim()) return true;
                //       return false;
                //     },
                //   },
                //   {
                //     message: t('Please enter question credit amount!'),
                //     validator: (questionCredit) => {
                //       try {
                //         lastNameSchema.validateSync({ questionCredit });
                //         return true;
                //       } catch {
                //         return false;
                //       }
                //     },
                //   },
                // ]}
              />
              {currency !== 'CHF' && +questionCredit !== 0 ? (
                <div
                  style={{
                    display: 'flex',
                    font: 'IBM Plex Sans',
                    color: '#7E839F',
                    fontSize: '11px',
                  }}
                >
                  <div
                    style={{
                      width: '13px',
                      height: '13px',
                      alignContent: 'center',
                      justifyContent: 'center',
                      paddingTop: '2px',
                    }}
                  >
                    <InfoIcon />
                  </div>
                  <p style={{ paddingLeft: '3px' }}>Approximately</p>
                  <p
                    style={{
                      paddingLeft: '3px',
                      color: '#448DC9',
                      fontWeight: '600',
                    }}
                  >
                    {handleCurrencyCalculation(
                      +questionCredit,
                      currency as 'CHF' | 'EUR' | 'USD'
                    )}{' '}
                    {currency}.
                  </p>
                </div>
              ) : undefined}
            </InputGroup>

            <InputGroup>
              <Input
                type="number"
                label="Average 20 Question Survey"
                placeholder="Calculation"
                value={(+formData.questionCredit * 20).toFixed(2)}
                disabled
                onValue={(averageQuestionSurvey) =>
                  setFormData({ ...formData, averageQuestionSurvey })
                }
                endAdornment={
                  <span style={{ font: 'inter', color: '#7e839f' }}>CHF</span>
                }
              />
              {currency !== 'CHF' && +formData.questionCredit !== 0 ? (
                <div
                  style={{
                    display: 'flex',
                    font: 'IBM Plex Sans',
                    color: '#7E839F',
                    fontSize: '11px',
                  }}
                >
                  <div
                    style={{
                      width: '13px',
                      height: '13px',
                      alignContent: 'center',
                      justifyContent: 'center',
                      paddingTop: '2px',
                    }}
                  >
                    <InfoIcon />
                  </div>
                  <p style={{ paddingLeft: '3px' }}>Approximately</p>
                  <p
                    style={{
                      paddingLeft: '3px',
                      color: '#448DC9',
                      fontWeight: '600',
                    }}
                  >
                    {handleCurrencyCalculation(
                      +formData.questionCredit * 40,
                      currency as 'CHF' | 'EUR' | 'USD'
                    )}{' '}
                    {currency}.
                  </p>
                </div>
              ) : undefined}
            </InputGroup>
            <p style={{ color: '#7E839F', fontWeight: '600', font: 'inter' }}>
              Interview
            </p>
            <InputGroup>
              <Input
                type="number"
                label="30min"
                placeholder="Please Enter Amount"
                value={interviewShort}
                onValue={(interviewShort) =>
                  setFormData({ ...formData, interviewShort })
                }
                errorCallback={handleErrors(14)}
                endAdornment={
                  <span style={{ font: 'inter', color: '#7e839f' }}>CHF</span>
                }
                // validators={[
                //   {
                //     message: t('Interview amount is required'),
                //     validator: (lastName) => {
                //       const v = lastName as string;
                //       if (v.trim()) return true;
                //       return false;
                //     },
                //   },
                //   {
                //     message: t('Please enter interview amount!'),
                //     validator: (lastName) => {
                //       try {
                //         lastNameSchema.validateSync({ lastName });
                //         return true;
                //       } catch {
                //         return false;
                //       }
                //     },
                //   },
                // ]}
              />
              {currency !== 'CHF' && +interviewShort !== 0 ? (
                <div
                  style={{
                    display: 'flex',
                    font: 'IBM Plex Sans',
                    color: '#7E839F',
                    fontSize: '11px',
                  }}
                >
                  <div
                    style={{
                      width: '13px',
                      height: '13px',
                      alignContent: 'center',
                      justifyContent: 'center',
                      paddingTop: '2px',
                    }}
                  >
                    <InfoIcon />
                  </div>
                  <p style={{ paddingLeft: '3px' }}>Approximately</p>
                  <p
                    style={{
                      paddingLeft: '3px',
                      color: '#448DC9',
                      fontWeight: '600',
                    }}
                  >
                    {handleCurrencyCalculation(
                      +interviewShort,
                      currency as 'CHF' | 'EUR' | 'USD'
                    )}{' '}
                    {currency}.
                  </p>
                </div>
              ) : undefined}
            </InputGroup>
            <InputGroup>
              <Input
                type="number"
                label="60min"
                placeholder="Please Enter Amount"
                value={interviewLong}
                onValue={(interviewLong) =>
                  setFormData({ ...formData, interviewLong })
                }
                errorCallback={handleErrors(15)}
                endAdornment={
                  <span style={{ font: 'inter', color: '#7e839f' }}>CHF</span>
                }
                // validators={[
                //   {
                //     message: t('Interview amount is required'),
                //     validator: (lastName) => {
                //       const v = lastName as string;
                //       if (v.trim()) return true;
                //       return false;
                //     },
                //   },
                //   {
                //     message: t('Please enter interview amount!'),
                //     validator: (lastName) => {
                //       try {
                //         lastNameSchema.validateSync({ lastName });
                //         return true;
                //       } catch {
                //         return false;
                //       }
                //     },
                //   },
                // ]}
              />
              {currency !== 'CHF' && +interviewLong !== 0 ? (
                <ConversionAmountWrapper>
                  <ConversionIconWrapper>
                    <InfoIcon />
                  </ConversionIconWrapper>
                  <span style={{ paddingLeft: '3px' }}>Approximately</span>
                  <span
                    style={{
                      paddingLeft: '3px',
                      color: '#448DC9',
                      fontWeight: '600',
                    }}
                  >
                    {handleCurrencyCalculation(
                      +interviewLong,
                      currency as 'CHF' | 'EUR' | 'USD'
                    )}{' '}
                    {currency}.
                  </span>
                </ConversionAmountWrapper>
              ) : undefined}
            </InputGroup>
          </Stack>
        </StepRight>
      </StepContainer>
      <StepText>
        *Please fill out at least one field to complete your submission.
      </StepText>
    </StepStack>
  );
};

export default Step;
