import React, { useState, useEffect } from 'react';
import { Modal, Tabs } from 'components/custom';
import { TAddToInfluencersModalProps } from 'features/influencers/role/admin/elements/add-to-influencer-modal/types';
import {
  AddToInfluencersModalMain,
  AddToInfluencerText,
} from 'features/influencers/role/admin/elements/add-to-influencer-modal/style';
import { Button, Input } from 'components/ui';
import { Stack } from 'components/system';
import { CampaignAPI, SurveyAPI } from 'api';
import { useDebounce, useSnackbar } from 'hooks';
import { TCampaign } from 'api/campaign/types';
import { AxiosError } from 'axios';
import { ISingleSurveyResponse } from 'api/survey/types';
import FinanceAPI from 'api/finance';

const AddToInfluencerModal = ({
  onClose,
  checkedInfluencers,
  setCheckedInfluencers,
  ...props
}: TAddToInfluencersModalProps) => {
  const [state, setState] = useState<any>({
    campaign: null,
    survey: null,
  });

  const [tabs, setTabs] = useState(0);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [surveys, setSurveys] = useState<any[]>([]);
  const [selectCampaign, setSelectCampaign] = useState<TCampaign>();
  const [selectSurvey, setSelectSurvey] = useState<ISingleSurveyResponse>();

  const { push } = useSnackbar();

  const getCampaigns = async (s: string = '') => {
    const { result } = await CampaignAPI.getCampaigns({
      skip: 0,
      limit: 10,
      search: s.length ? s : undefined,
      status: [0, 1],
    });

    setCampaigns(
      result.map((data: any) => ({
        value: data.id,
        label: `${data.name} (${data.influencersCount || 'Size not given'})`,
      }))
    );
  };

  const getSurveys = async (s: string = '') => {
    const { result } = await SurveyAPI.getSurveys({
      skip: 0,
      limit: 10,
      search: s.length ? s : undefined,
      status: [0, 1],
    });

    setSurveys(
      result.map((data: any) => ({
        value: data.id,
        label: `${data.name} (${data.participantCount || 'Size not given'})`,
      }))
    );
  };

  const getSingleCampaign = async (campaignId: number) => {
    const campaign = await CampaignAPI.getSingleCampaign(campaignId);

    setSelectCampaign(campaign);
  };

  const getSingleSurvey = async (surveyId: number) => {
    const survey = await SurveyAPI.getSurvey(surveyId);

    setSelectSurvey(survey);
  };

  const debounceCampaigns = useDebounce(getCampaigns, 300);
  const debounceSurveys = useDebounce(getSurveys, 300);

  const createCampaign = async (campaignId: number) => {
    if (!selectCampaign || !selectCampaign.id) {
      push(`You need to select a campaign.`, {
        variant: 'error',
      });
      return;
    }

    const campaingInfluencers = selectCampaign.platformProductOrder
      ? selectCampaign.platformProductOrder.platformProductOrderInfluencers
      : [];

    const campaingInfluencersIds = campaingInfluencers?.map(
      (campaingInfluencer) => campaingInfluencer.influencer.user.id
    );

    const reinvitableInfluencers = campaingInfluencers?.filter(
      (campaingInfluencer) => {
        const userStatus = campaingInfluencer.status;

        return (
          [0, 1].includes(userStatus) &&
          checkedInfluencers.includes(campaingInfluencer.influencer.user.id)
        );
      }
    );

    const reinvitableInfluencersIds = reinvitableInfluencers
      ? reinvitableInfluencers?.map(
          (reinvitableInfluencer) => reinvitableInfluencer.influencer.user.id
        )
      : [];

    const influencerThatCantBeReinvited = campaingInfluencers?.filter(
      (campaingInfluencer) => {
        const userStatus = campaingInfluencer.status;

        return (
          ![0, 1].includes(userStatus) &&
          checkedInfluencers.includes(campaingInfluencer.influencer.user.id)
        );
      }
    );

    const checkedInfluencersNotInCampaign = checkedInfluencers.filter(
      (influencerId) => !campaingInfluencersIds?.includes(influencerId)
    );

    const influencersToBeInvited = [
      ...reinvitableInfluencersIds,
      ...checkedInfluencersNotInCampaign,
    ];

    if (
      selectCampaign.influencersCount &&
      influencersToBeInvited.length > selectCampaign?.influencersCount
    ) {
      push(`Please select the exact or less number of influencers`, {
        variant: 'error',
      });
      return;
    }

    if (influencerThatCantBeReinvited && influencerThatCantBeReinvited.length) {
      const influencersNames = influencerThatCantBeReinvited
        .map(
          (influencer) =>
            `${influencer.influencer.user.firstName} ${influencer.influencer.user.lastName}`
        )
        .join(',');

      push(`${influencersNames} can't be reinvited (Status).`, {
        variant: 'warning',
      });
    }

    await CampaignAPI.addInfluencerToCampaign(
      campaignId,
      influencersToBeInvited
    )
      .then(() => {
        setCheckedInfluencers([]);
        push(
          `Influencers successfully added to ${selectCampaign.name} (campaign)`,
          {
            variant: 'success',
          }
        );
        onClose();
      })
      .catch((err) => {
        const error = err as AxiosError<any>;
        if (error.isAxiosError && error.response?.data.message) {
          push(error.response?.data.message, {
            variant: 'error',
          });
        } else {
          push('Influers are not adequate for this campaign!', {
            variant: 'error',
          });
        }
      });
  };

  const createSurvey = async (surveyId: number) => {
    if (!selectSurvey || !selectSurvey.id) {
      push(`You need to select a survey.`, {
        variant: 'error',
      });
      return;
    }

    // if (
    //   selectSurvey.participantCount !== null &&
    //   selectSurvey.participantCount !== checkedInfluencers.length
    // ) {
    //   push(
    //     `You need to select ${selectSurvey.participantCount} influencers. You selected ${checkedInfluencers.length}.`,
    //     {
    //       variant: 'error',
    //     }
    //   );
    //   return;
    // }

    const surveyInfluencers = selectSurvey.platformProductOrder
      ? selectSurvey.platformProductOrder.platformProductOrderInfluencers
      : [];

    const surveyInfluencersIds = surveyInfluencers?.map(
      (surveyInfluencer) => surveyInfluencer.influencer.user.id
    );

    const reinvitableInfluencers = surveyInfluencers?.filter(
      (surveyInfluencer) => {
        const userStatus = surveyInfluencer.status;

        return (
          [0, 1].includes(userStatus) &&
          checkedInfluencers.includes(surveyInfluencer.influencer.user.id)
        );
      }
    );

    const reinvitableInfluencersIds = reinvitableInfluencers
      ? reinvitableInfluencers?.map(
          (reinvitableInfluencer) => reinvitableInfluencer.influencer.user.id
        )
      : [];

    const influencerThatCantBeReinvited = surveyInfluencers?.filter(
      (surveyInfluencer) => {
        const userStatus = surveyInfluencer.status;

        return (
          ![0, 1].includes(userStatus) &&
          checkedInfluencers.includes(surveyInfluencer.influencer.user.id)
        );
      }
    );

    const checkedInfluencersNotInCampaign = checkedInfluencers.filter(
      (influencerId) => !surveyInfluencersIds?.includes(influencerId)
    );

    const influencersToBeInvited = [
      ...reinvitableInfluencersIds,
      ...checkedInfluencersNotInCampaign,
    ];

    if (
      selectSurvey.participantCount &&
      influencersToBeInvited.length > selectSurvey?.participantCount
    ) {
      push(`Please select the exact or less number of influencers`, {
        variant: 'error',
      });
      return;
    }

    if (influencerThatCantBeReinvited && influencerThatCantBeReinvited.length) {
      const influencersNames = influencerThatCantBeReinvited
        .map(
          (influencer) =>
            `${influencer.influencer.user.firstName} ${influencer.influencer.user.lastName}`
        )
        .join(',');

      push(`${influencersNames} can't be reinvited (Status).`, {
        variant: 'warning',
      });
    }

    await SurveyAPI.addInfluencersToSurvey(surveyId, checkedInfluencers)
      .then(() => {
        setCheckedInfluencers([]);
        push(
          `Influencers successfully added to ${selectSurvey.name} (survey)`,
          {
            variant: 'success',
          }
        );
        onClose();
      })
      .catch((err) => {
        const error = err as AxiosError<any>;
        if (error.isAxiosError && error.response?.data.message) {
          push(error.response?.data.message, {
            variant: 'error',
          });
        } else {
          push('Influers are not adequate for this campaign!', {
            variant: 'error',
          });
        }
      });
  };

  useEffect(() => {
    getCampaigns();
    getSurveys();
  }, []);

  useEffect(() => {
    if (state.campaign && state.campaign.value) {
      getSingleCampaign(state.campaign.value);
    }

    if (!state.campaign) {
      setSelectCampaign(undefined);
    }
  }, [state.campaign]);

  const [takenCampaingSpace, setTakenCampaignSpace] = useState<number>(0);

  useEffect(() => {
    if (selectCampaign) {
      const campaingInfluencers = selectCampaign.platformProductOrder
        ? selectCampaign.platformProductOrder.platformProductOrderInfluencers
        : [];

      const reinvitableInfluencers = campaingInfluencers?.filter(
        (campaingInfluencer) => {
          const userStatus = campaingInfluencer.status;

          return [0, 1].includes(userStatus);
        }
      );

      const reinvitableInfluencersIds = reinvitableInfluencers
        ? reinvitableInfluencers?.map(
            (reinvitableInfluencer) => reinvitableInfluencer.influencer.user.id
          )
        : [];
      setTakenCampaignSpace(reinvitableInfluencersIds.length);
    }
  }, [selectCampaign]);

  useEffect(() => {
    if (state.survey && state.survey.value) {
      getSingleSurvey(state.survey.value);
    }

    if (!state.survey) {
      setSelectSurvey(undefined);
    }
  }, [state.survey]);

  return (
    <Modal
      size="small"
      title="Add To"
      actions={[
        <Button
          color="default"
          variant="contained"
          size="large"
          onClick={onClose}
        >
          No
        </Button>,
        <Button
          color="primary"
          variant="contained"
          size="large"
          onClick={() => {
            if (tabs === 0) {
              if (selectCampaign && selectCampaign.id) {
                createCampaign(selectCampaign.id);
              } else {
                push(`You need to select a campaign.`, {
                  variant: 'error',
                });
              }
            }

            if (tabs === 1) {
              if (selectSurvey && selectSurvey.id) {
                createSurvey(selectSurvey.id);
              } else {
                push(`You need to select a survey.`, {
                  variant: 'error',
                });
              }
            }
          }}
        >
          Yes
        </Button>,
      ]}
      onClose={onClose}
      {...props}
    >
      <AddToInfluencersModalMain>
        <Tabs tabs={['Campaign', 'Survey']} value={tabs} onValue={setTabs} />
        {tabs === 0 && (
          <AddToInfluencerText>
            <Stack>
              <p>
                Are you sure you want to add selected
                <span>
                  {' '}
                  {state.campaign && selectCampaign ? (
                    <>
                      {checkedInfluencers.length}/
                      {selectCampaign?.influencersCount || 'Size Not Given'}{' '}
                    </>
                  ) : (
                    // eslint-disable-next-line react/jsx-no-useless-fragment
                    <>{checkedInfluencers?.length}</>
                  )}
                </span>{' '}
                {checkedInfluencers.length === 1 ? 'Influencer' : 'Influencers'}{' '}
                to a <span>campaign</span>?
              </p>
              <Input
                type="select"
                label="Campaign"
                placeholder="Please Select"
                value={state.campaign}
                options={campaigns}
                onSearch={debounceCampaigns}
                onValue={(campaign) => setState({ ...state, campaign })}
              />
            </Stack>
          </AddToInfluencerText>
        )}
        {tabs === 1 && (
          <AddToInfluencerText>
            <Stack>
              <p>
                Are you sure you want to add selected
                <span>
                  {' '}
                  {state.survey && selectSurvey ? (
                    <>
                      {checkedInfluencers.length}/
                      {selectSurvey?.participantCount || 'Size Not Given'}{' '}
                    </>
                  ) : (
                    // eslint-disable-next-line react/jsx-no-useless-fragment
                    <>{checkedInfluencers?.length}</>
                  )}
                </span>{' '}
                {checkedInfluencers.length === 1 ? 'Influencer' : 'Influencers'}{' '}
                to a <span>survey</span>?
              </p>
              <Input
                type="select"
                label="Survey"
                placeholder="Please Select"
                value={state.survey}
                options={surveys}
                onSearch={debounceSurveys}
                onValue={(survey) => setState({ ...state, survey })}
              />
            </Stack>
          </AddToInfluencerText>
        )}
      </AddToInfluencersModalMain>
    </Modal>
  );
};

export default AddToInfluencerModal;
