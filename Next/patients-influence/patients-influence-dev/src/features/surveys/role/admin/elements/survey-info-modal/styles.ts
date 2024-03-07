import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import { Grid } from 'components/system';

export const SurveyInfoModalMain = styled(Grid)`
  width: 100%;
`;

export const SurveyTitle = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    display: flex;
    align-items: center;
    gap: ${theme.spacing(2.5)};
  
  `}
`;
