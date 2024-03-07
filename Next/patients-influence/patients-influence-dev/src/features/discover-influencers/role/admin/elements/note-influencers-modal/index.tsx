import React, { useEffect, useState } from 'react';
import { Modal, Tabs } from 'components/custom';
import { TNoteInfluencersModalProps } from 'features/discover-influencers/role/admin/elements/note-influencers-modal/types';
import {
  NoteInfluencersModalMain,
  CommentSection,
  LabelSectionContainer,
  LabelSection,
  LabelLabel,
} from 'features/discover-influencers/role/admin/elements/note-influencers-modal/styles';
import { Button, Input } from 'components/ui';
import { InputLabel } from 'components/ui/input/styles';
import { SingleComment } from 'features/discover-influencers/role/admin/elements/note-influencers-modal/elements';
import LabelsAPI from 'api/labels';
import { useSnackbar } from 'hooks';

const NoteInfluencersModal = ({
  onClose,
  ...props
}: TNoteInfluencersModalProps) => {
  const [label, setLabel] = useState<any>([]);
  const [comments, setComments] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [tabs, setTabs] = useState(0);

  const { push } = useSnackbar();

  const [options, setOptions] = useState([
    {
      label: 'Label',
      value: 'label',
    },
  ]);

  const handleLabel = (v: any) => {
    setLabel(v);
  };

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setComments((prev) => [...prev, input]);
      setInput('');
    }
  };

  const edit = (index: number, value: string) => {
    setComments((prev) => prev.map((x, id) => (id === index ? value : x)));
  };

  const remove = (index: number) => {
    setComments((prev) => prev.filter((x, id) => id !== index));
  };

  const postLabels = async (x: any) => {
    await LabelsAPI.postLabel(x);
  };

  const handleNewTag = (v: any) => {
    setOptions((x) => [...x, v]);
    // setLabel((x: any) => [...x, v]);

    // try {
    //   postLabels({ name: v.label, assigneeType: 0 });
    //   push('Label added', { variant: 'success' });
    // } catch {
    //   push('Something failed. Label not added.', { variant: 'error' });
    // }
  };

  const getAssigneeType = async () => {
    const { result } = await LabelsAPI.getAssigneeType();
  };

  const getLabels = async () => {
    const { result } = await LabelsAPI.getLabels();
  };

  useEffect(() => {
    getAssigneeType();
    getLabels();
  }, []);

  return (
    <Modal
      size="small"
      title="Note"
      actions={[
        <Button
          color="primary"
          variant="contained"
          size="large"
          onClick={onClose}
        >
          Close
        </Button>,
      ]}
      onClose={onClose}
      {...props}
    >
      <NoteInfluencersModalMain style={{ height: '450px' }}>
        <Tabs tabs={['Comment', 'Label']} value={tabs} onValue={setTabs} />
        {tabs === 0 && (
          <>
            <Input
              type="text"
              label="Comment"
              multiline
              rows={3}
              placeholder="Write Comment"
              value={input}
              onValue={setInput}
              onKeyDown={handleKeyDown}
            />
            <InputLabel>Previous Comments</InputLabel>
            <CommentSection>
              {comments.map((x, index) => (
                <SingleComment
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  index={index}
                  onEdit={edit}
                  onDelete={remove}
                  value={x}
                />
              ))}
            </CommentSection>
          </>
        )}

        {tabs === 1 && (
          <>
            <Input
              type="multiselect"
              label="Label"
              multiline
              rows={3}
              placeholder="Please Select"
              value={label}
              onValue={handleLabel}
              onNewTag={handleNewTag}
              options={options}
            />
            <LabelSectionContainer>
              Existing labels:
              <LabelSection>
                {options.map((x: any, index: number) =>
                  index < options.length - 1 ? (
                    <LabelLabel key={x.label}>{x.label}, </LabelLabel>
                  ) : (
                    <LabelLabel key={x.label}> {x.label}</LabelLabel>
                  )
                )}
              </LabelSection>
            </LabelSectionContainer>
          </>
        )}
      </NoteInfluencersModalMain>
    </Modal>
  );
};

export default NoteInfluencersModal;
