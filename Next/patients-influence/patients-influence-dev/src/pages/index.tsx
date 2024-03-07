import React, { useEffect, useState } from 'react';
import { Title } from 'components/core';
import { useAppContext } from 'context';
import {
  AdminHomePage,
  ClientHomePage,
  AmbasadorHomePage,
  InfluencerHomePage,
  LoadingPage,
} from 'features';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';

const Home = () => {
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
    setRouteName('Home');
  }, []);

  return (
    <>
      <Title>Home</Title>
      {role === 'ADMIN' && <AdminHomePage />}
      {role === 'SUPERADMIN' && <AdminHomePage />}
      {role === 'CLIENT' && <ClientHomePage />}
      {role === 'INFLUENCER' && isLoading && <LoadingPage />}
      {role === 'INFLUENCER' && !isLoading && <InfluencerHomePage />}
      {role === 'AMBASSADOR' && <AmbasadorHomePage />}
    </>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['home', 'common'])),
    },
  };
}

export default Home;
