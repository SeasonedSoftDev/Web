import { Theme } from '@mui/material';
import styled from '@emotion/styled';

export const ProfilePictureMain = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
        width: 100%;    
        height: 600px;
        overflow-y: scroll;
        padding-right: 20px;
    `}
`;

export const ProfileUpload = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: ${theme.spacing(2.5)};
        margin: 0 0 ${theme.spacing(5)};
    `}
`;

export const ProfilePicture = styled.img<{ theme?: Theme }>`
  ${({ theme }) => `
        width: 100%;
        border-radius: ${theme.spacing(2)};
    `}
`;

export const ProfileZoom = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
        margin: ${theme.spacing(5)} 0;
        padding: 0 ${theme.spacing(2.5)};
    `}
`;

export const ProfileInfo = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(5)};
  `}
`;

export const ProfileActions = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    display: flex;
    align-items: center;
    justify-content: space-between;
`}
`;

export const ProfileSpan = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    color: ${theme.palette.secondary.main};
    text-align: right;
    cursor: pointer;
    font-size: 12px;
 `}
`;
