import { keyframes } from '@emotion/css';
import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import { TCardAnimation } from 'components/ui/card/types';

const zoomIn = keyframes`
  0% { transform: scale(0.5); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
`;

const slideLeft = keyframes`
  0% { transform: translateX(200px); opacity: 0; }
  100% { transform: translateX(0%); opacity: 1; }
`;

const slideRight = keyframes`
  0% { transform: translateX(-200px); opacity: 0; }
  100% { transform: translateX(0%); opacity: 1; }
`;

const slideUp = keyframes`
  0% { transform: translateY(200px); opacity: 0; }
  100% { transform: translateY(0%); opacity: 1; }
`;

const slideDown = keyframes`
  0% { transform: translateY(-200px); opacity: 0; }
  100% { transform: translateY(0%); opacity: 1; }
`;

const animations = {
  none: 'none',
  'zoom-in': `${zoomIn} 500ms ease-in-out forwards`,
  'slide-left': `${slideLeft} 500ms ease-in-out forwards`,
  'slide-right': `${slideRight} 500ms ease-in-out forwards`,
  'slide-up': `${slideUp} 500ms ease-in-out forwards`,
  'slide-down': `${slideDown} 500ms ease-in-out forwards`,
};

export const CardMain = styled.div<{
  theme?: Theme;
  animation: TCardAnimation;
}>`
  ${({ theme, animation }) => `
        background-color: ${theme.palette.common.white};
        border-radius: 8px;
        padding: ${theme.spacing(5)}; 
        box-shadow: 0px 2px 5px ${theme.palette.common.black}10;
        // animation: ${animations[animation as keyof typeof animations]};
    `}
`;
