import React, { useEffect } from 'react';
import { Title } from 'components/core';
import { useAppContext } from 'context';
import {
  AdminCampaignsPage,
  ClientCampaignsPage,
  InfluencerCampaignsPage,
} from 'features';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Services = () => {
  const { role, setRouteName } = useAppContext();

  useEffect(() => {
    setRouteName('Services');
  }, []);

  return (
    <>
      <Title>Services</Title>
      {role === 'ADMIN' && <AdminCampaignsPage />}
      {role === 'SUPERADMIN' && <AdminCampaignsPage />}
      {role === 'CLIENT' && <ClientCampaignsPage />}
      {role === 'INFLUENCER' && <InfluencerCampaignsPage />}
    </>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['services', 'common'])),
    },
  };
}

export default Services;
