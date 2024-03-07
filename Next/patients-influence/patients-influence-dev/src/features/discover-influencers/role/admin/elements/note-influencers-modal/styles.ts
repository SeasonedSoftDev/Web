import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import { Stack } from 'components/system';

export const NoteInfluencersModalMain = styled(Stack)`
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

export const LabelSectionContainer = styled.div`
  width: 100%;
  display: inline-flex;
  gap: 5px;
`;

export const LabelSection = styled.span<{ theme?: Theme }>`
  ${({ theme }) => `
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  `}
`;

export const LabelLabel = styled.span`
  color: #448dc9;
`;
