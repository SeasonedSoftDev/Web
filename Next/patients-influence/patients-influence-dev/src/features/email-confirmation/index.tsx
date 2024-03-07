import React, { useState, useEffect } from 'react';
import {
  EmailConfirmationMain,
  EmailConfirmationTitle,
  EmailButton,
} from 'features/email-confirmation/styles';
import { useSnackbar } from 'hooks';
import { AuthorizationAPI } from 'api';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

const EmailConfirmation = () => {
  const { t } = useTranslation('email-confirmation');
  const { push } = useSnackbar();
  const [message, setMessage] = useState('');

  const { query, locale } = useRouter();

  const handleChange = async () => {
    try {
      await AuthorizationAPI.emailConfirmation({ token: query.token as any });
      if (locale === 'de-DE') {
        push('Willkommen bei Patients Influence!', { variant: 'success' });
        setMessage('Willkommen bei Patients Influence!');
      } else {
        push('Welcome to Patients Influence!', { variant: 'success' });
        setMessage('Welcome to Patients Influence!');
      }
    } catch (e: any) {
      if (locale === 'de-DE') {
        push(
          'Ihr Konto ist bereits aktiv. Bitte loggen Sie sich in Ihr Konto ein.',
          {
            variant: 'error',
          }
        );
        setMessage(
          'Ihr Konto ist bereits aktiv. Bitte loggen Sie sich in Ihr Konto ein.'
        );
      } else {
        push('You account is already active. Please login to your account.', {
          variant: 'error',
        });
        setMessage(
          'You account is already active. Please login to your account.'
        );
      }
    }
  };

  useEffect(() => {
    if (query.token) {
      handleChange();
    }
  }, [query]);

  return (
    <EmailConfirmationMain>
      <EmailConfirmationTitle>{message}</EmailConfirmationTitle>
      <EmailButton href="/login">
        {locale !== 'de-DE' ? 'Back' : 'Zurück'}
      </EmailButton>
    </EmailConfirmationMain>
  );
};

export default EmailConfirmation;
