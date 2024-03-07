import React, { useEffect } from 'react';
import { Title } from 'components/core';
import { useAppContext } from 'context';
import { ResetPasswordPage } from 'features';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const ResetPassword = () => {
  const { setRouteName } = useAppContext();

  useEffect(() => {
    setRouteName('Reset Password');
  }, []);

  return (
    <>
      <Title>Reset Password</Title>
      <ResetPasswordPage />
    </>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['reset-password', 'common'])),
    },
  };
}

export default ResetPassword;
