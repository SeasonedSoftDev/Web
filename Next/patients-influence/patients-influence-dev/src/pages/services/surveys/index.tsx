import React, { useEffect } from 'react';
import { Title } from 'components/core';
import { useAppContext } from 'context';
import {
  AdminSurveysPage,
  ClientSurveysPage,
  InfluencerSurveysPage,
} from 'features';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Surveys = () => {
  const { role, setRouteName } = useAppContext();

  useEffect(() => {
    setRouteName('Surveys');
  }, []);

  return (
    <>
      <Title>Surveys</Title>
      {role === 'ADMIN' && <AdminSurveysPage />}
      {role === 'SUPERADMIN' && <AdminSurveysPage />}
    </>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['surveys', 'common'])),
    },
  };
}

export default Surveys;
