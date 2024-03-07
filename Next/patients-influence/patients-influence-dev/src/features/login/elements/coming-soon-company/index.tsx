import React from 'react';
import { Modal } from 'components/custom';
import { TMaintenanceModalProps } from 'features/login/elements/coming-soon-company/types';
import {
  MaintenanceMain,
  MaintenanceTitle,
} from 'features/login/elements/coming-soon-company/style';
import { Button } from 'components/ui';
import { useTranslation } from 'react-i18next';

const ConfirmRegistrationModal = ({
  onClose,
  ...props
}: TMaintenanceModalProps) => {
  const { t } = useTranslation('login');

  return (
    <Modal size="medium" onClose={onClose} {...props}>
      <MaintenanceMain>
        <MaintenanceTitle>
          {t('Welcome to Patients Influence!')}
        </MaintenanceTitle>
        <p>
          {t(
            "Thank you for logging in to your account. We are excited to announce that our platform is in its final stages of development. We are creating a cutting-edge, industry-leading platform that will transform the way healthcare companies connect with patient influencers, and create a real impact in the healthcare industry. We appreciate your support as we bring this platform to life. Please don't hesitate to reach out if you have any questions or concerns. We look forward to revolutionizing the healthcare industry together and making a difference."
          )}
        </p>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={onClose}
        >
          {t('CLOSE')}
        </Button>
      </MaintenanceMain>
    </Modal>
  );
};

export default ConfirmRegistrationModal;
