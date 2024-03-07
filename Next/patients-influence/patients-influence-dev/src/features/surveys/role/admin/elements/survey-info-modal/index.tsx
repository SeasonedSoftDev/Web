import React, { useState } from 'react';
import { Chat, Modal, Tabs } from 'components/custom';
import { TSurveyInfoModalProps } from 'features/surveys/role/admin/elements/survey-info-modal/types';
import {
  SurveyInfoModalMain,
  SurveyTitle,
} from 'features/surveys/role/admin/elements/survey-info-modal/styles';
import { Button, Input, InputGroup } from 'components/ui';
import { GridCell, Stack } from 'components/system';
import { InputLabel } from 'components/ui/input/styles';
import { useSnackbar } from 'hooks';
import { CopyIcon, EditIcon } from 'components/svg';

const SurveyInfoModal = ({ onClose, ...props }: TSurveyInfoModalProps) => {
  const [state, setState] = useState({
    surveyName: '',
    client: null,
    product: null,
    participants: null,
    startDate: null,
    endDate: null,
    budgetValue: null,
    budgetCurrency: null,
    tokens: null,
    surveyInfo: '',

    location: null,
    language: null,
    diseaseArea: null,
    gender: null,
    age: {
      min: '',
      max: '',
    },
    ethnicity: null,
    struggles: null,
    interests: null,
    targetAudienceInfo: '',

    materials: null,
    website: '',
    instructions: '',

    comments: [],
    labels: [],
    meetings: [],
    reminders: [],
    tasks: [],
    verifiedSince: null,

    chat: null,
    submission: 'dsadas',
  });

  const [tab, setTab] = useState(0);

  const [disabled, setDisabled] = useState(true);
  const handleDisabled = () => {
    setDisabled(!disabled);
  };

  const handleFile = async () => {};

  const { push } = useSnackbar();
  const [link, setLink] = useState('dsadsadsada');
  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(link);
      push(`Successfully copied!`, {
        variant: 'success',
      });
    } catch {
      push('Something failed!', {
        variant: 'error',
      });
    }
  };

  return (
    <Modal
      size="medium"
      title={
        <SurveyTitle>
          Survey Name
          <EditIcon
            style={
              disabled
                ? { cursor: 'pointer', color: '#7E839F' }
                : { cursor: 'pointer', color: '#448DC9' }
            }
            onClick={handleDisabled}
          />
        </SurveyTitle>
      }
      actions={[
        <Button
          color="primary"
          variant="contained"
          size="large"
          onClick={onClose}
        >
          Create
        </Button>,
      ]}
      onClose={onClose}
      {...props}
    >
      <Stack
        style={{ height: '500px', overflowY: 'scroll', paddingRight: '20px' }}
      >
        <Tabs
          tabs={['Info', 'Target', 'Instructions', 'Management', 'Chat']}
          value={tab}
          onValue={setTab}
        />
        {tab === 0 && (
          <SurveyInfoModalMain columns={2}>
            <Input
              type="text"
              label="Survey name"
              disabled={disabled}
              placeholder="Please Enter"
              value={state.surveyName}
              onValue={(surveyName) => setState({ ...state, surveyName })}
            />
            <Input
              type="select"
              label="Client"
              disabled={disabled}
              placeholder="Please Select"
              value={state.client}
              onValue={(client) => setState({ ...state, client })}
            />
            <Input
              type="select"
              label="Product"
              disabled={disabled}
              placeholder="Please Select"
              value={state.product}
              onValue={(product) => setState({ ...state, product })}
            />
            <Input
              type="number"
              label="Participants"
              disabled={disabled}
              placeholder="Please Enter"
              value={state.participants}
              onValue={(participants) => setState({ ...state, participants })}
            />
            <Input
              type="date"
              label="Start Date"
              disabled={disabled}
              value={state.startDate}
              onValue={(startDate) => setState({ ...state, startDate })}
            />
            <Input
              type="date"
              label="End Date"
              disabled={disabled}
              value={state.endDate}
              onValue={(endDate) => setState({ ...state, endDate })}
            />
            <Input
              type="select"
              label="Tokens"
              placeholder="Please Select"
              value={state.tokens}
              onValue={(tokens) => setState({ ...state, tokens })}
            />
            <InputGroup
              label="Budget"
              inputRatio="100px 1fr"
              disabled={disabled}
              elements={[
                {
                  value: state.budgetCurrency,
                  onValue: (budgetCurrency) =>
                    setState({ ...state, budgetCurrency }),
                  type: 'select',
                  placeholder: 'CHF',
                  options: [
                    {
                      value: 'chf',
                      label: 'CHF',
                    },
                  ],
                },
                {
                  value: state.budgetValue,
                  onValue: (budgetValue) => setState({ ...state, budgetValue }),
                  type: 'number',
                },
              ]}
            />
            <GridCell columnSpan={2}>
              <Input
                multiline
                rows={5}
                type="text"
                disabled={disabled}
                label="Survey Info"
                placeholder="Please Enter"
                value={state.surveyInfo}
                onValue={(surveyInfo) => setState({ ...state, surveyInfo })}
              />
            </GridCell>
          </SurveyInfoModalMain>
        )}
        {tab === 1 && (
          <SurveyInfoModalMain columns={2}>
            <Input
              type="select"
              label="Location"
              disabled={disabled}
              placeholder="Please Select"
              value={state.location}
              onValue={(location) => setState({ ...state, location })}
            />
            <Input
              type="select"
              label="Language"
              disabled={disabled}
              placeholder="Please Select"
              value={state.language}
              onValue={(language) => setState({ ...state, language })}
            />
            <Input
              type="select"
              label="Disease Area"
              disabled={disabled}
              placeholder="Please Select"
              value={state.diseaseArea}
              onValue={(diseaseArea) => setState({ ...state, diseaseArea })}
              isFilterActive
            />
            <Input
              type="select"
              label="Gender"
              disabled={disabled}
              placeholder="Please Select"
              value={state.gender}
              onValue={(gender) => setState({ ...state, gender })}
              options={[
                {
                  value: 0,
                  label: 'Male',
                },
                {
                  value: 1,
                  label: 'Female',
                },
                {
                  value: 2,
                  label: 'Other',
                },
              ]}
            />
            <Input
              type="min-max"
              label="Age"
              disabled={disabled}
              value={state.age}
              onValue={(age) => setState({ ...state, age })}
            />
            <Input
              type="select"
              label="Ethnicity"
              disabled={disabled}
              placeholder="Please Select"
              value={state.ethnicity}
              onValue={(ethnicity) => setState({ ...state, ethnicity })}
            />
            <Input
              type="select"
              label="Struggles"
              disabled={disabled}
              placeholder="Please Select"
              value={state.struggles}
              onValue={(struggles) => setState({ ...state, struggles })}
            />
            <Input
              type="select"
              label="Interests"
              disabled={disabled}
              placeholder="Please Select"
              value={state.interests}
              onValue={(interests) => setState({ ...state, interests })}
            />
            <GridCell columnSpan={2}>
              <Input
                multiline
                rows={5}
                type="text"
                disabled={disabled}
                label="Target Audience Info"
                placeholder="Please Enter"
                value={state.targetAudienceInfo}
                onValue={(targetAudienceInfo) =>
                  setState({ ...state, targetAudienceInfo })
                }
              />
            </GridCell>
          </SurveyInfoModalMain>
        )}
        {tab === 2 && (
          <SurveyInfoModalMain columns={1}>
            <Input
              type="text"
              label="Materials"
              placeholder="Please Enter"
              value={state.materials}
              onValue={(materials) => setState({ ...state, materials })}
            />
            <GridCell columnSpan={1}>
              <InputLabel>Materials</InputLabel>
              <Button color="default" variant="contained" onClick={handleFile}>
                Upload
              </Button>
            </GridCell>
            <Input
              multiline
              rows={5}
              type="text"
              label="Instructions"
              placeholder="Please Enter"
              value={state.instructions}
              onValue={(instructions) => setState({ ...state, instructions })}
            />
          </SurveyInfoModalMain>
        )}
        {tab === 3 && (
          <SurveyInfoModalMain columns={1}>
            <Stack direction="horizontal">
              <Input
                type="multiselect"
                label="Comments"
                placeholder="Please Enter"
                value={state.comments}
                disabled={disabled}
                onValue={(comments) => setState({ ...state, comments })}
              />
              <Input
                type="multiselect"
                label="Labels"
                placeholder="Please Enter"
                value={state.labels}
                disabled={disabled}
                onValue={(labels) => setState({ ...state, labels })}
              />
            </Stack>
            <Stack direction="horizontal">
              <Input
                type="multiselect"
                label="Meetings"
                placeholder="Please Enter"
                value={state.meetings}
                disabled={disabled}
                onValue={(meetings) => setState({ ...state, meetings })}
              />
              <Input
                type="multiselect"
                label="Reminders"
                placeholder="Please Enter"
                value={state.reminders}
                disabled={disabled}
                onValue={(reminders) => setState({ ...state, reminders })}
              />
            </Stack>
            <Stack direction="horizontal">
              <Input
                type="multiselect"
                label="Tasks"
                placeholder="Please Enter"
                value={state.tasks}
                disabled={disabled}
                onValue={(tasks) => setState({ ...state, tasks })}
              />
              <Input
                type="date"
                label="Verified Since"
                placeholder="Please Enter"
                value={state.verifiedSince}
                disabled={disabled}
                onValue={(verifiedSince) =>
                  setState({ ...state, verifiedSince })
                }
              />
            </Stack>
          </SurveyInfoModalMain>
        )}
        {tab === 4 && (
          <SurveyInfoModalMain columns={1}>
            <Stack direction="horizontal">
              <Input
                type="select"
                label="Project"
                placeholder="Please Select"
                value={state.chat}
                onValue={(chat) => setState({ ...state, chat })}
              />
              <Input
                type="text"
                label="Submission"
                placeholder="Please Select"
                value={link}
                disabled
                endAdornment={<CopyIcon />}
                onClick={handleCopyToClipboard}
                onValue={(submission) => setState({ ...state, submission })}
              />
            </Stack>
            {/* <Chat /> */}
          </SurveyInfoModalMain>
        )}
      </Stack>
    </Modal>
  );
};

export default SurveyInfoModal;
