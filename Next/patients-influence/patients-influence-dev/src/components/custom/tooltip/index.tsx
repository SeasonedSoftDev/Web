import React from 'react';

import { TooltipMain } from 'components/custom/tooltip/style';

import { TTooltipProps } from 'components/custom/tooltip/types';

const Tooltip = ({ title, ...props }: TTooltipProps) => (
  <TooltipMain title={title} {...props} />
);

export default Tooltip;
