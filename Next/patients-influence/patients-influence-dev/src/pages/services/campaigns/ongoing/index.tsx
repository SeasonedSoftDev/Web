import React, { useEffect } from 'react';
import { Title } from 'components/core';
import { useAppContext } from 'context';
import { OngoingCampaignPage } from 'features';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const OngoingCampaign = () => {
  const { role, setRouteName } = useAppContext();

  useEffect(() => {
    setRouteName('Ongoing Campaign');
  }, []);

  return (
    <>
      <Title>Ongoing Campaigns</Title>
      {role === 'ADMIN' && <OngoingCampaignPage />}
      {role === 'SUPERADMIN' && <OngoingCampaignPage />}
    </>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'campaigns-ongoing',
        'common',
      ])),
    },
  };
}

export default OngoingCampaign;
