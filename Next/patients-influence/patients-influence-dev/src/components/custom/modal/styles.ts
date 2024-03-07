import styled from '@emotion/styled';
import { IconButton, Theme } from '@mui/material';
import { Card } from 'components/ui';
import { TModalSize } from 'components/custom/modal/types';

const sizes = {
  small: 500,
  medium: 800,
  large: 1200,
};

export const ModalWrapper = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    position: fixed;
    z-index: ${theme.zIndex.modal};
    width: 100%;
    height: 100%;
    background-color: ${theme.palette.common.black}80;
    backdrop-filter: blur(5px);
    left: 0px;
    top: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: ${theme.spacing(5)};
  `}
`;

export const ModalMain = styled(Card)<{ theme?: Theme; size: TModalSize }>`
  ${({ theme, size }) => `
    width: 100%;
    max-width: ${sizes[size as keyof typeof sizes]}px;
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(2)};
    max-height: 80vh;
    // min-height: 45vh;
    overflow: hidden;

    ${theme.breakpoints.down('sm')} {
      max-width: unset;
    }
  `}
`;

export const ModalHead = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${theme.spacing(5)};
  `}
`;

export const ModalBody = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    font-size: 14px;
    color: ${theme.palette.common.gray[6]};
    overflow: auto;
  `}
`;

export const ModalActions = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    width: 100%;
    display: flex;
    gap: ${theme.spacing(2)};
    & > * {
        width: 100%;
    }
  `}
`;

export const ModalTitle = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    font-size: 24px;
    font-weight: 600;
    color: ${theme.palette.primary.main};
    text-overflow: ellipsis;
    overflow: hidden;
  `}
`;

export const ModalClose = styled(IconButton)<{ theme?: Theme }>`
  ${({ theme }) => `
    color: ${theme.palette.common.black};
    svg {
        width: 16px;
        height: 16px;
    }
  `}
`;
