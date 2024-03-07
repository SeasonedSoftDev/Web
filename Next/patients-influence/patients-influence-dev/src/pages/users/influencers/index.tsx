import React, { useEffect } from 'react';
import { Title } from 'components/core';
import { useAppContext } from 'context';
import { AdminInfluencersPage } from 'features';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Influencers = () => {
  const { role, setRouteName } = useAppContext();

  useEffect(() => {
    setRouteName('Influencers');
  }, []);

  return (
    <>
      <Title>Influencers</Title>
      {role === 'ADMIN' && <AdminInfluencersPage />}
      {role === 'SUPERADMIN' && <AdminInfluencersPage />}
    </>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'users-influencers',
        'common',
      ])),
    },
  };
}

export default Influencers;
