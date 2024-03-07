import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import { TNotificationStatus } from 'components/custom/notifications-card/types';

export const NotificationMain = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
        padding: ${theme.spacing(2.5)};
        border-radius: 4px;
        border: 1px solid ${theme.palette.common.black}10;  
        background-color: ${theme.palette.common.white};
    `}
`;

export const NotificationContent = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    display: block;
    margin-bottom: ${theme.spacing(2.5)};
`}
`;

export const NotificationStatus = styled.div<{
  theme?: Theme;
  status: TNotificationStatus;
}>`
  ${({ theme, status }) => `
    width: 8px;
    height: 8px;
    border-radius: 50%;
    float: left;
    margin: 7.5px 5px 0 0;
    background-color: ${
      status === 'seen'
        ? theme.palette.success.light
        : theme.palette.secondary.main
    };
`}
`;

export const NotificationText = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
font-size: 14px;
color: ${theme.palette.common.black};
`}
`;

export const NotificationDate = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
font-size: 12px;
color: ${theme.palette.common.gray[6]};
`}
`;
