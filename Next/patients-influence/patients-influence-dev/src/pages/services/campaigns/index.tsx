import React, { useEffect } from 'react';
import { Title } from 'components/core';
import { useAppContext } from 'context';
import {
  AdminCampaignsPage,
  ClientCampaignsPage,
  InfluencerCampaignsPage,
} from 'features';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Campaigns = () => {
  const { role, setRouteName } = useAppContext();

  useEffect(() => {
    setRouteName('Campaigns');
  }, []);

  return (
    <>
      <Title>Campaigns</Title>
      {role === 'ADMIN' && <AdminCampaignsPage />}
      {role === 'SUPERADMIN' && <AdminCampaignsPage />}
    </>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['campaigns', 'common'])),
    },
  };
}

export default Campaigns;
