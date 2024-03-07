import React, { useEffect } from 'react';
import { Title } from 'components/core';
import { useAppContext } from 'context';
import { CreateSurveyPage } from 'features';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { NextApiResponse } from 'next';
import { SurveyInfluencersQuestionsPage } from 'features/survey-questionnaire';

const CreateSurvey = ({
  query,
}: {
  query: {
    id: string[];
  };
}) => {
  const { role, setRouteName } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    setRouteName('Manage Survey');
  }, []);

  useEffect(() => {
    if (!query.id[0]) {
      router.push('/services/surveys');
    }
  }, []);

  return (
    <>
      <Title>Create Survey</Title>
      {role === 'SUPERADMIN' && query.id.length === 1 && (
        <CreateSurveyPage id={query.id[0]} />
      )}
      {role === 'SUPERADMIN' && query.id.length === 2 && (
        <SurveyInfluencersQuestionsPage
          id={query.id[0]}
          influencerId={query.id[1]}
        />
      )}
    </>
  );
};

export async function getServerSideProps({
  query,
  locale,
  res,
}: {
  query: { id: string[] };
  locale: string;
  res: NextApiResponse;
}) {
  if (!query.id.length) {
    res.writeHead(302, { Location: '/services/surveys' });
    res.end();
    return { props: {} };
  }

  return {
    props: {
      query,
      ...(await serverSideTranslations(locale, ['surveys-create', 'common'])),
    },
  };
}

export default CreateSurvey;
