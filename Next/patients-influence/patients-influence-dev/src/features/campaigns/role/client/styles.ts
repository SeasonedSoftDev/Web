import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import Link from 'next/link';

export const ProductOrderInfluencers = styled(Link)`
  text-decoration: none;
  button {
    padding: 0 !important;
    font-size: 18px;
  }
`;

export const CardWrapper = styled.div<{
  theme?: Theme;
}>`
  ${({ theme }) => `
      width: 316px;
    `}
`;
