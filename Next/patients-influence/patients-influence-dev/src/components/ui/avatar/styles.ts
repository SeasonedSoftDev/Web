import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import { Image } from 'components/ui';

export const AvatarMain = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    background-color: ${theme.palette.primary.main};
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    position: relative;

    ${theme.breakpoints.down('sm')} {
      width: 32px;
      height: 32px;
    }
  `}
`;

export const AvatarText = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    font-size: 18px;
    line-height: 1.3;
    color: ${theme.palette.common.white};
  `}
`;

export const AvatarImage = styled(Image)`
  position: absolute;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;
