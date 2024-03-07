import React from 'react';
import { Modal } from 'components/custom';
import { TApproveReportsModalProps } from 'features/reports/role/admin/elements/approve-reports-modal/types';
import {
  ApproveReportsModalMain,
  ApproveReportsText,
} from 'features/reports/role/admin/elements/approve-reports-modal/styles';
import { Button } from 'components/ui';
import { useRouter } from 'next/router';

const ExportReportsModal = ({
  onClose,
  ...props
}: TApproveReportsModalProps) => {
  const router = useRouter();

  return (
    <Modal
      size="small"
      title="Are you sure?"
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
          onClick={() => router.push('/services/reports/finished')}
        >
          Yes
        </Button>,
      ]}
      onClose={onClose}
      {...props}
    >
      <ApproveReportsModalMain columns={1}>
        <ApproveReportsText>
          Are you sure you want to create a report from &lt;Campaign&gt;? <br />
          Operation cannot be undone.
        </ApproveReportsText>
      </ApproveReportsModalMain>
    </Modal>
  );
};

export default ExportReportsModal;
