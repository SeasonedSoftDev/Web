import React from 'react';
import { TIndicatorProps } from 'components/custom/card-without-chart/elements/indicator/types';
import { Tooltip } from '@mui/material';
import {
  IndicatorIcon,
  IndicatorMain,
  IndicatorValue,
} from 'components/custom/card-without-chart/elements/indicator/styles';

const Indicator = ({ percent, ...props }: TIndicatorProps) => (
  <Tooltip title="Since last month">
    <IndicatorMain percent={percent} {...props}>
      <IndicatorIcon viewBox="0 0 6 5">
        <path d="M3.5655 0.184608C3.5945 0.212859 3.7185 0.319532 3.8205 0.418899C4.462 1.00146 5.512 2.52119 5.8325 3.31661C5.884 3.43741 5.993 3.74282 6 3.90599C6 4.06235 5.964 4.2114 5.891 4.35363C5.789 4.53093 5.6285 4.67316 5.439 4.7511C5.3075 4.80127 4.914 4.8792 4.907 4.8792C4.4765 4.95714 3.777 5 3.004 5C2.2675 5 1.5965 4.95714 1.1595 4.89333C1.1525 4.88602 0.6635 4.80809 0.496 4.72284C0.19 4.56649 0 4.26108 0 3.93424V3.90599C0.0075 3.69313 0.1975 3.24549 0.2045 3.24549C0.5255 2.49294 1.524 1.00828 2.1875 0.411593C2.1875 0.411593 2.358 0.243546 2.4645 0.170482C2.6175 0.0565027 2.807 0 2.9965 0C3.208 0 3.405 0.0638091 3.5655 0.184608Z" />
      </IndicatorIcon>
      <IndicatorValue>{`${percent}`}</IndicatorValue>
    </IndicatorMain>
  </Tooltip>
);

export default Indicator;
