import React, { useState } from 'react';
import { Loader, Modal } from 'components/custom';
import { TWelcomeModalProps } from 'features/login/elements/welcome-modal/types';
import {
  SWelcomeModalMain,
  SWelcomeModalTitle,
  SWelcomeModalText,
} from 'features/login/elements/welcome-modal/styles';
import { Button } from 'components/ui';
import { useTranslation } from 'react-i18next';

const WelcomeModal = ({
  role,
  error,
  onClose,
  ...props
}: TWelcomeModalProps) => {
  const { t } = useTranslation('login');

  return error ? (
    <Modal size="medium" onClose={onClose} {...props}>
      <SWelcomeModalMain columns={1}>
        <SWelcomeModalTitle>
          {t('Unable to Confirm Your Account')}
        </SWelcomeModalTitle>
        <SWelcomeModalText>
          {t(
            "We're sorry, but we were unable to confirm your account with the link you clicked. Please check your email for a new confirmation link, as the old one may have expired. If you continue to experience issues, our team at support@patientsinfluence.com is always here to assist you and ensure your account is fully activated."
          )}
        </SWelcomeModalText>
      </SWelcomeModalMain>
    </Modal>
  ) : (
    <Modal size="large" onClose={onClose} {...props}>
      <SWelcomeModalMain columns={1}>
        <SWelcomeModalTitle>
          {t(!role ? 'Please Wait' : 'Welcome to Patients Influence!')}
        </SWelcomeModalTitle>
        {role === 'INFLUENCER' && (
          <SWelcomeModalText>
            {t(
              "Congratulations on confirming your email and activating your account! You are now one step closer to earning additional income as a patient influencer. We are excited to have you on board and can't wait to see the positive impact you will make in the healthcare industry. Let's get started!"
            )}
          </SWelcomeModalText>
        )}
        {role === 'CLIENT' && (
          <SWelcomeModalText>
            {t(
              "Congratulations on confirming your email and activating your account! You are now one step closer to discovering the power of patient influencer marketing and how it can benefit your healthcare organization. We are excited to have you on board and look forward to working with you to make a difference in the industry. Let's get started!"
            )}
          </SWelcomeModalText>
        )}
        {!role && <Loader />}
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={onClose}
          disabled={!role}
        >
          {t('CLOSE')}
        </Button>
      </SWelcomeModalMain>
    </Modal>
  );
};

export default WelcomeModal;
