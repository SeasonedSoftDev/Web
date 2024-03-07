import styled from '@emotion/styled';
import { Theme } from '@mui/material';

export const CardWrapper = styled.div<{
  theme?: Theme;
}>`
  ${({ theme }) => `
    width: 316px;
  
    @media screen and (max-width: 1560px) {
      width: 276px;
    }
  
    
    ${theme.breakpoints.down('xl')} {
      width: 276px;
    }
    ${theme.breakpoints.down('lg')} {
      width: 276px;
    }
      `}
`;
