import React from 'react';
import { Modal } from 'components/custom';
import { TMaintenanceModalProps } from 'features/login/elements/coming-soon-influencer/types';
import {
  MaintenanceMain,
  MaintenanceTitle,
  AffiliateLink,
} from 'features/login/elements/coming-soon-influencer/style';
import { Button } from 'components/ui';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'hooks';

const ConfirmRegistrationModal = ({
  onClose,
  affiliateLink,
  ...props
}: TMaintenanceModalProps) => {
  const { t } = useTranslation('login');

  const { push } = useSnackbar();

  const handleCopyToClipboard = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      push('Successfully copied to clipboard.', { variant: 'success' });
    } catch {
      push('Something went wrong!', { variant: 'error' });
    }
  };

  return (
    <Modal size="medium" onClose={onClose} {...props}>
      <MaintenanceMain>
        <MaintenanceTitle>
          {t('Welcome to Patients Influence!')}
        </MaintenanceTitle>
        <p>
          <span>
            {t(
              'Thank you for logging in to your account. We are thrilled to announce that our platform is in its final stages of development. We appreciate your patience and look forward to bringing you a community-driven, revolutionary patient influencer platform. In the meantime, you can start earning additional income by sharing your unique affiliate link'
            )}
          </span>
          <AffiliateLink
            onClick={() => {
              handleCopyToClipboard(affiliateLink);
            }}
          >
            {affiliateLink}
          </AffiliateLink>
          <span>
            {t(
              "with others. We can't wait for you to be a part of the movement and see the positive impact you will make in the healthcare industry. We will send you an email as soon as we are live, so stay tuned for updates!"
            )}
          </span>
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
