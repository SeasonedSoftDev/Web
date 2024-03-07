import React, { useEffect, useState } from 'react';
import { Title } from 'components/core';
import { useAppContext } from 'context';
import {
  AdminCampaignsPage,
  ClientCampaignsPage,
  InfluencerCampaignsPage,
  LoadingPage,
} from 'features';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';

const Campaigns = () => {
  const { user, role, setRouteName } = useAppContext();

  const [isLoading, setIsLoading] = useState(true);

  const routes = useRouter();

  useEffect(() => {
    const checkAuthorization = async () => {
      if (
        role === 'INFLUENCER' &&
        user.status < 5 &&
        !['/account', '/help'].includes(routes.pathname)
      ) {
        setIsLoading(true);
        await routes.replace('/account');
      } else {
        setIsLoading(false);
      }
    };

    checkAuthorization();

    return () => {
      setIsLoading(false);
    };
  }, [role, user, routes]);

  useEffect(() => {
    setRouteName('Campaigns');
  }, []);

  return (
    <>
      <Title>Campaigns</Title>
      {role === 'ADMIN' && <AdminCampaignsPage />}
      {role === 'SUPERADMIN' && <AdminCampaignsPage />}
      {role === 'CLIENT' && <ClientCampaignsPage />}
      {role === 'INFLUENCER' && !isLoading && <InfluencerCampaignsPage />}
      {role === 'INFLUENCER' && isLoading && <LoadingPage />}
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
