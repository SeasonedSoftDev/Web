import React from 'react';

import { BadgeMain } from 'components/ui/badge/style';
import { TBadgeProps } from 'components/ui/badge/types';

const Badge = ({ ...props }: TBadgeProps) => <BadgeMain {...props} />;

export default Badge;
