import React, { useEffect } from 'react';
import { Title } from 'components/core';
import { useAppContext } from 'context';
import { ManageSurveyPage } from 'features';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const ManageSurvey = () => {
  const { role, setRouteName } = useAppContext();

  useEffect(() => {
    setRouteName('Manage Survey');
  }, []);

  return (
    <>
      <Title>Manage Survey</Title>
      {role === 'ADMIN' && <ManageSurveyPage />}
      {role === 'SUPERADMIN' && <ManageSurveyPage />}
    </>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['reports-finished', 'common'])),
    },
  };
}

export default ManageSurvey;
