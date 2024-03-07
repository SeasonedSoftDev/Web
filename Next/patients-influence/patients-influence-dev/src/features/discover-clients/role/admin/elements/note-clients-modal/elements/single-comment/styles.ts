import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import { Menu } from 'components/custom';

export const SingleCommentMain = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
  display: block;
  padding: ${theme.spacing(5)};
  background: ${theme.palette.secondary.main}10;
  position: relative;
  .MuiInputBase-root {
    .MuiOutlinedInput-notchedOutline {
      border: none;
    }
    &:hover {
      .MuiOutlinedInput-notchedOutline {
          border: none;
      }
    }
  }
`}
`;
export const CommentText = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    font-size: 14px;
    color: ${theme.palette.common.gray[9]};
  `}
`;
export const NoteDropdown = styled(Menu)`
  position: absolute;
  right: 0px;
  top: 50%;
  z-index: 200;
  width: 100px;
`;
