import React, { useEffect } from 'react';
import { Title } from 'components/core';
import { useAppContext } from 'context';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { NextApiResponse } from 'next';
import { SurveyInfluencersPage } from 'features/survey-influencers';
import { useRouter } from 'next/router';
import { SurveyInfluencersQuestionsPage } from 'features/survey-questionnaire';

const Questionnaire = ({ id }: { id: string }) => {
  const { role, setRouteName } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    setRouteName('Manage Survey');
    if (role !== 'INFLUENCER') {
      router.push('/surveys');
    }
  }, []);

  return (
    <>
      <Title>Manage Survey</Title>
      {/* {role === 'CLIENT' && <SurveyInfluencersQuestionsPage id={id} />} */}
      {role === 'INFLUENCER' && <SurveyInfluencersQuestionsPage id={id} />}
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

export default Questionnaire;
