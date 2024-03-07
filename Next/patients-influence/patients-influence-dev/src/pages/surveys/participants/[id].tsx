import React, { useEffect } from 'react';
import { Title } from 'components/core';
import { useAppContext } from 'context';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { NextApiResponse } from 'next';
import { SurveyInfluencersPage } from 'features/survey-influencers';

const ManageSurvey = ({ id }: { id: string }) => {
  const { role, setRouteName } = useAppContext();

  useEffect(() => {
    setRouteName('Manage Survey');
  }, []);

  return (
    <>
      <Title>Manage Survey</Title>
      {role === 'CLIENT' && <SurveyInfluencersPage id={id} />}
    </>
  );
};

export async function getServerSideProps({
  params,
  locale,
  res,
}: {
  params: { id: string };
  locale: string;
  res: NextApiResponse;
}) {
  const { id } = params;

  if (!id) {
    res.writeHead(302, { Location: '/surveys' });
    res.end();
    return { props: {} };
  }

  return {
    props: {
      id,
      ...(await serverSideTranslations(locale, ['reports-finished', 'common'])),
    },
  };
}

export default ManageSurvey;
