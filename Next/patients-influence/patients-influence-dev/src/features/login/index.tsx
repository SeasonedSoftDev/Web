import React, { useEffect, useState } from 'react';
import {
  LoginTitle,
  LoginSubtitle,
  LoginSpan,
  LoginAction,
  LoginLocalization,
} from 'features/login/styles';
import { Button, Checkbox, Input } from 'components/ui';
import { Stack } from 'components/system';
import { useModal, useSnackbar } from 'hooks';
import {
  LostPasswordModal,
  ConfirmRegistrationModal,
} from 'features/login/elements';
import { useRouter } from 'next/router';
import { useAppContext } from 'context';
import { useTranslation } from 'next-i18next';
import { TLoginParams } from 'api/authorization/types';
import { AxiosError } from 'axios';

const Login = () => {
  const [state, setState] = useState<TLoginParams>({
    email: '',
    password: '',
  });

  const [resendCount, setResendCount] = useState<any>(null);

  const { t } = useTranslation('login');

  const [lpModal, openLpModal, closeLpModal] = useModal(false);
  const [crModal, openCrModal, closeCrModal] = useModal(false);

  const router = useRouter();
  const { push: pushSnackbar } = useSnackbar();

  const { login } = useAppContext();

  const handleLogin = async () => {
    try {
      await login(state);

      router.push('/');
    } catch (e) {
      if (e instanceof AxiosError && e.response) {
        if (
          e.response.data.message ===
          'Please confirm your e-mail address in order to complete the sign-up process.'
        ) {
          setResendCount(JSON.parse(e.response.data.error));
          openCrModal();
        } else {
          if (router.locale === 'de-DE') {
            if (
              e.response.data.message ===
              'The email address and password combination you entered is incorrect. Please try again or reset your password.'
            ) {
              pushSnackbar(
                'Die eingegebene Kombination aus E-Mail-Adresse und Passwort ist falsch. Bitte versuchen Sie es erneut oder setzen Sie Ihr Passwort zurück.',
                { variant: 'error' }
              );
            }
            if (e.response.data.message === 'Too many requests') {
              pushSnackbar('Zu viele Anfragen', { variant: 'error' });
            }
          }
          if (router.locale === 'en-US') {
            pushSnackbar(e.response.data.message, { variant: 'error' });
          }
        }
      }
    }
  };

  const isDisabled = !state.email.trim() || !state.password.trim();

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter' && !isDisabled) {
      handleLogin();
    }
  };

  return (
    <Stack onKeyDown={handleKeyDown}>
      <LoginTitle>{t('Login Now')}</LoginTitle>
      <LoginSubtitle>
        {t(
          'Access updates, new opportunities, and messages all in one place by logging in below.'
        )}
      </LoginSubtitle>
      <Input
        type="text"
        label={t('Email') as string}
        placeholder={t('Please Enter your Email') as string}
        value={state.email}
        onValue={(email) => setState({ ...state, email })}
      />
      <Input
        type="password"
        label={t('Password') as string}
        placeholder={t('Please Enter your Password') as string}
        value={state.password}
        onValue={(password) => setState({ ...state, password })}
      />
      <LoginAction direction="horizontal">
        {/* <Checkbox label={t('Remember Me') as string} /> */}
        <LoginSpan onClick={openLpModal}>{t('Lost your password?')}</LoginSpan>
      </LoginAction>
      <Button
        variant="contained"
        size="large"
        color="secondary"
        onClick={handleLogin}
        disabled={isDisabled}
      >
        {t('LOGIN NOW')}
      </Button>
      <LoginLocalization />
      {lpModal && <LostPasswordModal onClose={closeLpModal} />}
      {crModal && (
        <ConfirmRegistrationModal
          count={resendCount.emailResendTokens}
          email={state.email}
          onClose={closeCrModal}
        />
      )}
    </Stack>
  );
};

export default Login;
