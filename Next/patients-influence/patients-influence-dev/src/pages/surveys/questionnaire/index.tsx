import React, { useEffect } from 'react';
import { useAppContext } from 'context';
import { useRouter } from 'next/router';

const QuestionnaireSlug = () => {
  const { role } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    // Redirect to /surveys
    if (role !== 'INFLUENCER') {
      router.push('/surveys');
    }
  }, []);

  return null;
};

export default QuestionnaireSlug;
