import React, { useState } from 'react';
import {
  ChangePasswordMain,
  ChangePasswordTitle,
  ChangePasswordLocalization,
} from 'features/reset-password/styles';
import { Button, Input } from 'components/ui';
import { passwordSchema } from 'utilities/validators';
import { useSnackbar } from 'hooks';
import { AuthorizationAPI } from 'api';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

const ChangePassword = () => {
  const [state, setState] = useState({
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState([false, false]);

  const handleErrors = (index: number) => (value: boolean) => {
    setErrors((x) => x.map((a, b) => (b === index ? value : a)));
  };

  const { t } = useTranslation('reset-password');

  const { push } = useSnackbar();

  const { query } = useRouter();
  const { locale } = useRouter();
  const router = useRouter();

  const handleChange = async () => {
    try {
      if (query.token && state.password === state.confirmPassword) {
        await AuthorizationAPI.confirmResetPassword(
          {
            password: state.password,
            token: query.token as string,
          }
          // locale
        );
        push('Password successfully reseted.', { variant: 'success' });
        router.push('/login');
      }
    } catch (e: any) {
      push('Password reset was unsuccessful.', { variant: 'error' });
    }
  };

  const isDisabled =
    !state.confirmPassword.trim() ||
    !state.password.trim() ||
    !!errors.find((x) => !x);

  return (
    <ChangePasswordMain>
      <ChangePasswordTitle>{t('Change your password.')}</ChangePasswordTitle>
      <Input
        type="password"
        label={t('New Password') as string}
        placeholder={t('Please Enter your New Password') as string}
        value={state.password}
        onValue={(password) => setState({ ...state, password })}
        errorCallback={handleErrors(0)}
        validators={[
          {
            message: t('Password is required'),
            validator: (password) => {
              const v = password as string;
              if (v.trim()) return true;
              return false;
            },
          },
          {
            message: t(
              'Password must have at least one uppercase, lowercase letter, number and symbol'
            ),
            validator: (password) => {
              try {
                passwordSchema.validateSync({ password });
                return true;
              } catch {
                return false;
              }
            },
          },
        ]}
      />
      <Input
        type="password"
        label={t('Confirm Password') as string}
        placeholder={t('Please Confirm your New Password') as string}
        value={state.confirmPassword}
        onValue={(confirmPassword) => setState({ ...state, confirmPassword })}
        errorCallback={handleErrors(1)}
        validators={[
          {
            message: t('Password is required'),
            validator: (confirmPassword) => {
              const v = confirmPassword as string;
              if (v.trim()) return true;
              return false;
            },
          },
          {
            message: t('Password must match'),
            validator: (confirmPassword) => {
              if (confirmPassword === state.password) {
                return true;
              }
              return false;
            },
          },
        ]}
      />
      <Button
        variant="contained"
        size="large"
        color="secondary"
        onClick={() => handleChange()}
        disabled={isDisabled}
      >
        {t('Change Password')}
      </Button>
      <ChangePasswordLocalization />
    </ChangePasswordMain>
  );
};

export default ChangePassword;
