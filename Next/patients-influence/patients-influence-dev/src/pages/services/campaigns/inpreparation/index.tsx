import React, { useEffect } from 'react';
import { Title } from 'components/core';
import { useAppContext } from 'context';
import { InpreparationCampaignsPage } from 'features';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const InpreparationCampaigns = () => {
  const { role, setRouteName } = useAppContext();

  useEffect(() => {
    setRouteName('Inpreparation Campaign');
  }, []);

  return (
    <>
      <Title>Inpreparation Campaigns</Title>
      {role === 'ADMIN' && <InpreparationCampaignsPage />}
      {role === 'SUPERADMIN' && <InpreparationCampaignsPage />}
    </>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'campaigns-inpreparation',
        'common',
      ])),
    },
  };
}

export default InpreparationCampaigns;
