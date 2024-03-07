import { useEffect } from 'react';
import { useRouter } from 'next/router';

const CampaignSlug = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to /services/campaigns when accessing /services/campaigns/slug
    router.push('/services/campaigns');
  }, []);

  return null; // Return null to avoid rendering anything on this page
};

export default CampaignSlug;
