import React from 'react';
import {
  NumberIndicatorMain,
  NumberIndicatorValue,
} from 'components/custom/card-with-chart-benefits/elements/number-indicator/styles';
import { TNumberIndicatorProps } from 'components/custom/card-with-chart-benefits/elements/number-indicator/types';
import { Tooltip } from '@mui/material';

const NumberIndicator = ({ number, ...props }: TNumberIndicatorProps) => (
  <NumberIndicatorMain number={number} {...props}>
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.0655 4.18461C7.0945 4.21286 7.2185 4.31953 7.3205 4.4189C7.962 5.00146 9.012 6.52119 9.3325 7.31661C9.384 7.43741 9.493 7.74282 9.5 7.90599C9.5 8.06235 9.464 8.2114 9.391 8.35363C9.289 8.53093 9.1285 8.67316 8.939 8.7511C8.8075 8.80127 8.414 8.8792 8.407 8.8792C7.9765 8.95714 7.277 9 6.504 9C5.7675 9 5.0965 8.95714 4.6595 8.89333C4.6525 8.88602 4.1635 8.80809 3.996 8.72284C3.69 8.56649 3.5 8.26108 3.5 7.93424V7.90599C3.5075 7.69313 3.6975 7.24549 3.7045 7.24549C4.0255 6.49294 5.024 5.00828 5.6875 4.41159C5.6875 4.41159 5.858 4.24355 5.9645 4.17048C6.1175 4.0565 6.307 4 6.4965 4C6.708 4 6.905 4.06381 7.0655 4.18461Z"
        fill="#2FD1C6"
      />
    </svg>
    <Tooltip title="Since last month">
      <NumberIndicatorValue>{`${number}`}</NumberIndicatorValue>
    </Tooltip>
  </NumberIndicatorMain>
);

export default NumberIndicator;
