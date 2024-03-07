import styled from '@emotion/styled';

export const ImageMain = styled.img<{ loaded: boolean }>`
  ${({ loaded }) => `
        opacity: ${loaded ? 1 : 0};
        transition: opacity 300ms ease-in-out;
    `}
`;
