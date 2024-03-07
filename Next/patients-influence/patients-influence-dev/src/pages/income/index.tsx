import React, { useEffect, useState } from 'react';
import { Title } from 'components/core';
import { useAppContext } from 'context';
import {
  InfluencerIncomePage,
  AmbasadorIncomePage,
  LoadingPage,
} from 'features';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';

const Income = () => {
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
    setRouteName('Income');
  }, []);

  return (
    <>
      <Title>Income</Title>
      {role === 'INFLUENCER' && !isLoading && <InfluencerIncomePage />}
      {role === 'INFLUENCER' && isLoading && <LoadingPage />}
      {role === 'AMBASSADOR' && <AmbasadorIncomePage />}
    </>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['income', 'common'])),
    },
  };
}

export default Income;
