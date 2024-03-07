import React, { useState, useEffect } from 'react';
import { Modal } from 'components/custom';
import { DeleteInfluencerModalMain } from 'features/discover-influencers/role/admin/elements/delete-influencer-modal/styles';
import { Button } from 'components/ui';
import { LegalsAPI } from 'api';
import { useSnackbar } from 'hooks';
import { ApproveInfluencerModalMain, LegalBody, LegalCheckbox } from './styles';
import { TPromptInfluencerModalProps } from './types';

const AcceptCampaign = ({
  onClose,
  handleAction,
  type = 'Apply',
  ...props
}: TPromptInfluencerModalProps) => {
  const [isChecked, setIsChecked] = useState(false);
  const [legal, setLegal] = useState<{
    legalId: number | undefined;
    legalText: string;
  }>({
    legalId: undefined,
    legalText: '',
  });

  const getLegals = async (lang: string) => {
    const data = await LegalsAPI.getLegals(lang);

    setLegal({
      legalId: data.influencerCampaignLegal.id,
      legalText: data.influencerCampaignLegal.text,
    });
  };

  useEffect(() => {
    getLegals('en');
  }, []);

  return (
    <Modal
      size="small"
      title="Campaign Application"
      actions={[
        <Button
          color="primary"
          variant="contained"
          size="large"
          onClick={() => (isChecked ? handleAction() : onClose())}
        >
          {isChecked ? 'Apply' : 'Close'}
        </Button>,
      ]}
      onClose={onClose}
      {...props}
    >
      <ApproveInfluencerModalMain>
        <LegalCheckbox
          size="small"
          color="primary"
          value={isChecked}
          onValue={(v) => setIsChecked(v)}
        />
        <LegalBody>{legal.legalText}</LegalBody>
      </ApproveInfluencerModalMain>
    </Modal>
  );
};

export default AcceptCampaign;
