import styled from '@emotion/styled';
import { Theme } from '@mui/material';

export const CardWrapper = styled.div<{
  theme?: Theme;
}>`
  ${({ theme }) => `
        width: 316px;
      `}
`;
