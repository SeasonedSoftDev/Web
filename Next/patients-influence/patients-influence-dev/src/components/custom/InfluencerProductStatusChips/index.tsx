import { ProductOrderInfluencerStatus } from 'api/platformProduct/enums';
import Chip from 'components/ui/chip';
import React, { useState, useEffect } from 'react';

interface IInfluencerProductStatusChip {
  status: number | any;
}

interface ChipConfigItem {
  type: 'primary' | 'secondary' | 'success' | 'danger' | 'neutral' | 'default';
  label: string;
}

const InfluencerProductStatusChips = ({
  status,
}: // eslint-disable-next-line no-undef
IInfluencerProductStatusChip): JSX.Element => {
  const [type, setType] = useState<
    'primary' | 'secondary' | 'success' | 'danger' | 'neutral' | 'default'
  >('default');
  const chipConfig: Record<ProductOrderInfluencerStatus, ChipConfigItem> = {
    [ProductOrderInfluencerStatus.Added]: {
      type: 'neutral',
      label: 'Added',
    },
    [ProductOrderInfluencerStatus.Invited]: {
      type: 'secondary',
      label: 'Invited',
    },
    [ProductOrderInfluencerStatus.Matching]: {
      type: 'primary',
      label: 'Matching',
    },
    [ProductOrderInfluencerStatus.NotSelected]: {
      type: 'danger',
      label: 'Not Selected',
    },
    [ProductOrderInfluencerStatus.Declined]: {
      type: 'danger',
      label: 'Declined',
    },
    [ProductOrderInfluencerStatus.ToBeSubmitted]: {
      type: 'default',
      label: 'To Be Submitted',
    },
    [ProductOrderInfluencerStatus.ToBeApproved]: {
      type: 'primary',
      label: 'Submitted',
    },
    [ProductOrderInfluencerStatus.Approved]: {
      type: 'success',
      label: 'Approved',
    },
    [ProductOrderInfluencerStatus.NotApproved]: {
      type: 'danger',
      label: 'Not Approved',
    },
    [ProductOrderInfluencerStatus.Removed]: {
      type: 'danger',
      label: 'Removed',
    },
    [ProductOrderInfluencerStatus.Withdrawn]: {
      type: 'danger',
      label: 'Left',
    },
    [ProductOrderInfluencerStatus.ToBePaid]: {
      type: 'neutral',
      label: 'To Be Paid',
    },
    [ProductOrderInfluencerStatus.Paid]: {
      type: 'neutral',
      label: 'Paid',
    },
    [ProductOrderInfluencerStatus.ToBeAnswered]: {
      type: 'primary',
      label: 'To Be Answered',
    },
  };

  const narrowedStatus = status as ProductOrderInfluencerStatus;

  const statusConfig = chipConfig[narrowedStatus] || {
    type: 'default',
    label: 'Unknown',
  };

  useEffect(() => {
    setType(statusConfig.type);
  }, []);

  return type ? (
    <Chip type={statusConfig.type} size="small" label={statusConfig.label} />
  ) : (
    <Chip type="default" size="small" label="Unknown Status" />
  );
};

export default InfluencerProductStatusChips;
