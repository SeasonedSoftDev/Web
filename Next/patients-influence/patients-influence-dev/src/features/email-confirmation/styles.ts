import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import { LocalizationSelect } from 'components/custom';
import { Stack } from 'components/system';
import Link from 'next/link';

export const EmailConfirmationMain = styled(Stack)<{ theme?: Theme }>`
  ${({ theme }) => `
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(5)};
  `}
`;

export const EmailConfirmationTitle = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    font-size: 32px;
    font-weight: 700;
    color: ${theme.palette.primary.main};
`}
`;

export const EmailButton = styled(Link)<{ theme?: Theme }>`
  ${({ theme }) => `
  max-width: 200px;
  min-height: 45px;
  width: 100%;
  height: 100%;
  background: ${theme.palette.primary.main};
  color: #fff;
  font-size: 14px;
  border-radius: 10px;
  text-decoration: none;
  text-transform: uppercase;
  display: grid;
  place-items: center;
  `}
`;

export const EmailConfirmationLocalization = styled(LocalizationSelect)`
  margin: 0 auto;
`;
