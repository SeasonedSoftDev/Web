import { IResult } from 'api/ambassador/types';
import React from 'react';

export type TDiscoverActionsMenuProps = React.HTMLAttributes<HTMLDivElement> & {
  data: IResult;
  reload: () => Promise<void>;
};
