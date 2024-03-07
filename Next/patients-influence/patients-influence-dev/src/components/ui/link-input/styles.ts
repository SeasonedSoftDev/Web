import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import Link from 'next/link';

export const StatusLink = styled(Link)<{
  theme?: Theme;
}>`
  ${({ theme }) => `
      user-select: none;
      cursor: pointer;
      display: block;
      text-decoration: none;
      `}
`;
export const StatusWrapper = styled.span`
  display: flex;
  flex-direction: column;
`;

export const StatusLabel = styled.span`
  color: #6f6f6f;
  font-weight: 500;
  font-size: 14px
  align-items: center;
  margin-bottom: 0.125rem;
`;

export const StatusField = styled.span`
  font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
  font-weight: 400;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.26);
  max-height: 38px;
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  color: rgba(0, 0, 0, 0.55);
  -webkit-text-fill-color: rgba(0, 0, 0, 0.55);
`;
