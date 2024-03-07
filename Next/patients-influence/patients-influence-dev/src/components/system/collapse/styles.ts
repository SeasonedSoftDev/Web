import styled from '@emotion/styled';
import { Theme, Collapse } from '@mui/material';

export const CollapseMain = styled(Collapse)``;

export const CollapseInner = styled.div<{
  theme?: Theme;
  removeGap: boolean;
  in: boolean;
}>`
  ${({ theme, removeGap, in: collapseIn }) => `
        transition: margin 300ms ease-in-out;
        ${
          removeGap
            ? `
            margin: -${theme.spacing(collapseIn ? 0 : 2.5)} 0;
        `
            : ''
        }
    `}
`;
