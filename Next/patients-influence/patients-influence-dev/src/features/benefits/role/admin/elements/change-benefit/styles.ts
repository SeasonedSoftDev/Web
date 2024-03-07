import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import { Grid } from 'components/system';

export const ChangeBenefitModalMain = styled(Grid)<{ theme?: Theme }>`
  ${({ theme }) => `
width: 100%;


${theme.breakpoints.down('xl')} {
grid-template-columns: 1fr 1fr;
}

${theme.breakpoints.down('sm')} {
display: flex;
flex-direction: column;
}
`}
`;
