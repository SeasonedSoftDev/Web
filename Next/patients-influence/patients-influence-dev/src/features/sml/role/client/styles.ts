import { Theme } from '@emotion/react';
import styled from '@emotion/styled';

export const CardWrapper = styled.div<{
  theme?: Theme;
}>`
  ${({ theme }) => `
          width: 316px;
        `}
`;
