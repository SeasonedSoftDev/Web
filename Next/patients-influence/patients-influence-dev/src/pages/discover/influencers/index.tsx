import React, { useEffect } from 'react';
import { Title } from 'components/core';
import { useAppContext } from 'context';
import { AdminDiscoverInfluencersPage } from 'features';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const DiscoverInfluencers = () => {
  const { role, setRouteName } = useAppContext();

  useEffect(() => {
    setRouteName('Discover Influencers');
  }, []);

  return (
    <>
      <Title>Discover Influencers</Title>
      {role === 'ADMIN' && <AdminDiscoverInfluencersPage />}
      {role === 'SUPERADMIN' && <AdminDiscoverInfluencersPage />}
    </>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'discover-influencers',
        'common',
      ])),
    },
  };
}

export default DiscoverInfluencers;
