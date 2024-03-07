import React, { useEffect } from 'react';
import { Title } from 'components/core';
import { useAppContext } from 'context';
import {
  ClientAccountPage,
  AmbasadorAccountPage,
  InfluencerAccountPage,
} from 'features';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Account = () => {
  const { role, setRouteName } = useAppContext();

  useEffect(() => {
    setRouteName('Account');
  }, []);

  return (
    <>
      <Title>Account</Title>
      {role === 'CLIENT' && <ClientAccountPage />}
      {role === 'AMBASSADOR' && <AmbasadorAccountPage />}
      {role === 'INFLUENCER' && <InfluencerAccountPage />}
    </>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['account', 'common'])),
    },
  };
}

export default Account;
