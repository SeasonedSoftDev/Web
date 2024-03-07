import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import { Stack } from 'components/system';

export const NoteCampaignModalMain = styled(Stack)`
  width: 100%;
`;

export const CommentSection = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(2.5)};
    overflow-y: scroll;
  `}
`;
