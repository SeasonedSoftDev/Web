import React, { useEffect } from 'react';
import { Title } from 'components/core';
import { useAppContext } from 'context';
import { CampaignAdminInfluencersPage } from 'features';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { NextApiResponse } from 'next';

const ManageCampaign = ({ id }: { id: string }) => {
  const { role, setRouteName } = useAppContext();

  useEffect(() => {
    setRouteName('Manage Campaign');
  }, []);

  return (
    <>
      <Title>Manage Campaign</Title>
      {role === 'CLIENT' && <CampaignAdminInfluencersPage id={id} />}
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
    res.writeHead(302, { Location: '/campaigns' });
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

export default ManageCampaign;
