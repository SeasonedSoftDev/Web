import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import { LocalizationSelect } from 'components/custom';

export const ChangePasswordMain = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(5)};
  `}
`;

export const ChangePasswordTitle = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    font-size: 48px;
    font-weight: 700;
    color: ${theme.palette.primary.main};
`}
`;

export const ChangePasswordLocalization = styled(LocalizationSelect)`
  margin: 0 auto;
`;
