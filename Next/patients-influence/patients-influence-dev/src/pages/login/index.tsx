import React, { useEffect } from 'react';
import { Title } from 'components/core';
import { useAppContext } from 'context';
import { LoginPage } from 'features';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

const Login = () => {
  const { setRouteName } = useAppContext();

  const { t } = useTranslation('login');

  useEffect(() => {
    setRouteName('Login');
  }, []);

  return (
    <>
      <Title>{t('Login Now')}</Title>
      <LoginPage />
    </>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['login', 'common'])),
    },
  };
}

export default Login;
