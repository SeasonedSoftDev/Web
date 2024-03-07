import React, { useCallback, useState } from 'react';
import { Modal } from 'components/custom';
import { Button, Input } from 'components/ui';
import { StakeholderApi } from 'api';
import { useSnackbar } from 'hooks';
import { TMlInfluencersModalProps } from './types';
import { MlInfluencersModalMain } from './style';

const MlInfluencerModal = ({
  checkedInfluencers,
  onClose,
  ...props
}: TMlInfluencersModalProps) => {
  const [followerCount, setAmount] = useState<number>(0);
  const [postCount, setPostCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [target, setTarget] = useState<any>(null);
  const [bio, setBio] = useState<any>(null);
  const { push } = useSnackbar();

  const handleML = useCallback(async () => {
    if (
      checkedInfluencers.length > 0 &&
      followerCount >= 1 &&
      postCount >= 1 &&
      postCount <= 49
    ) {
      setLoading(true);
      push('Please wait until PI Algorithm starts', { variant: 'info' });
      if (target?.value === 0) {
        await StakeholderApi.learnInfluencers(
          checkedInfluencers,
          followerCount,
          postCount,
          bio ? bio.value : 0
        );
      }

      if (target?.value === 1) {
        await StakeholderApi.learnFollowers(
          checkedInfluencers,
          followerCount,
          postCount,
          bio ? bio.value : 0
        );
      }
      push('PI Algorithm successfully started', { variant: 'success' });
      onClose();
      setLoading(false);
    } else {
      push('No influencers selected for PI Algorithm', { variant: 'warning' });
      onClose();
      setLoading(false);
    }
  }, [checkedInfluencers, followerCount, postCount]);

  return (
    <Modal
      size="small"
      title="PI Algorithm"
      actions={[
        <Button
          color="default"
          variant="contained"
          size="large"
          disabled={loading}
          onClick={onClose}
        >
          No
        </Button>,
        <Button
          color="primary"
          variant="contained"
          size="large"
          disabled={loading}
          onClick={handleML}
        >
          Yes
        </Button>,
      ]}
      onClose={onClose}
      {...props}
    >
      <MlInfluencersModalMain>
        <Input
          type="select"
          label="Target"
          placeholder="Please Select"
          value={target}
          onValue={(option) => setTarget(option)}
          options={[
            {
              label: 'Influncer',
              value: 0,
            },
            {
              label: 'Followers',
              value: 1,
            },
          ]}
        />
        {target && target?.value === 0 ? (
          <>
            <Input
              type="select"
              label="Bio"
              placeholder="Please Select"
              value={bio}
              onValue={(option) => setBio(option)}
              options={[
                {
                  label: 'No',
                  value: 0,
                },
                {
                  label: 'Yes',
                  value: 1,
                },
              ]}
            />
            <Input
              type="number"
              label="Followers"
              placeholder="Please Enter"
              value={followerCount}
              onValue={(value) => setAmount(value)}
            />
            <Input
              type="number"
              label="Media"
              placeholder="Please Enter"
              value={postCount}
              onValue={(value) => setPostCount(value)}
            />
          </>
        ) : null}
        {target && target?.value === 1 ? (
          <>
            <Input
              type="number"
              label="Amount"
              placeholder="Please Enter"
              value={followerCount}
              onValue={(value) => setAmount(value)}
            />
            <Input
              type="select"
              label="Bio"
              placeholder="Please Select"
              value={bio}
              onValue={(option) => setBio(option)}
              options={[
                {
                  label: 'No',
                  value: 0,
                },
                {
                  label: 'Yes',
                  value: 1,
                },
              ]}
            />
            <Input
              type="number"
              label="Media"
              placeholder="Please Enter"
              value={postCount}
              onValue={(value) => setPostCount(value)}
            />
          </>
        ) : null}
      </MlInfluencersModalMain>
    </Modal>
  );
};

export default MlInfluencerModal;
