import { IPlatformSurveyInfluencers } from 'api/platformProduct/types';
import React from 'react';

export type TDiscoverActionsMenuProps = React.HTMLAttributes<HTMLDivElement> & {
  surveyId: number;
  data: IPlatformSurveyInfluencers;
  reload: () => Promise<void>;
};
