import styled from '@emotion/styled';
import { Pagination } from '@mui/material';
import { TPaginationAlign } from 'components/ui/pagination/types';

const aligns = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
};

export const PaginationMain = styled(Pagination)<{ align: TPaginationAlign }>`
  ${({ align }) => `
    display: flex;
    justify-content: ${aligns[align]};
    padding-top: 60px; 
    @media screen and (max-width: 600px) {
    padding-top: 25px;
    }
    
    @media screen and (min-width: 1535px) {
      padding-top: 110px;
    }
    
    @media screen and (min-width: 601px) and (max-width: 1024px) {
      padding-top: 55px;
    }
    
  `}
`;
