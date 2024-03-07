import { useAppContext } from 'context';
import { useRouter } from 'next/router';
import { Title } from 'components/core';
import React, { useEffect } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { CampaignAdminInfluencersPage } from 'features';
import { NextApiResponse } from 'next';

const CampaignInfluencersProfile = ({ id }: { id: string }) => {
  const { role, setRouteName } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    setRouteName('Campaign Profile');
  }, []);

  useEffect(() => {
    if (!id) {
      router.push('/services/campaigns');
    }
  }, [id]);

  return (
    <>
      <Title>Campaign Profile</Title>
      {role === 'ADMIN' && <CampaignAdminInfluencersPage id={id} />}
      {role === 'SUPERADMIN' && <CampaignAdminInfluencersPage id={id} />}
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
    res.writeHead(302, { Location: '/services/campaigns' });
    res.end();
    return { props: {} };
  }
  return {
    props: {
      id,
      ...(await serverSideTranslations(locale, [
        'campaigns-ongoing',
        'common',
      ])),
    },
  };
}

export default CampaignInfluencersProfile;
