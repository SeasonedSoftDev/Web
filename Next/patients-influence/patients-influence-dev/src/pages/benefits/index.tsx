import React, { useEffect, useState } from 'react';
import { Title } from 'components/core';
import { useAppContext } from 'context';
import { InfluencerBenefitsPage, LoadingPage } from 'features';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';

const Benefits = () => {
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
    setRouteName('Benefits');
  }, []);

  return (
    <>
      <Title>Benefits</Title>
      {role === 'INFLUENCER' && !isLoading && <InfluencerBenefitsPage />}
      {role === 'INFLUENCER' && isLoading && <LoadingPage />}
    </>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['benefits', 'common'])),
    },
  };
}

export default Benefits;
