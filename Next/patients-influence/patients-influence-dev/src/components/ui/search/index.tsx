import React, { useRef } from 'react';
import {
  SearchMain,
  SearchIcon,
  SearchInput,
} from 'components/ui/search/styles';
import { TSearchProps } from 'components/ui/search/types';
import { SearchIcon as SearchSvg } from 'components/svg';

const Search = ({
  placeholder,
  onClick,
  value,
  onValue,
  onEnter,
  ...props
}: TSearchProps) => {
  const searchRef = useRef<null | HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onValue) onValue(e.target.value);
  };

  const handleFocus = (e: React.MouseEvent<HTMLDivElement>) => {
    if (searchRef.current && e.target !== searchRef.current) {
      searchRef.current.focus();
    }
    if (onClick) onClick(e);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onEnter) {
      onEnter();
    }
  };

  return (
    <SearchMain onClick={handleFocus} {...props}>
      <SearchIcon>
        <SearchSvg />
      </SearchIcon>
      <SearchInput
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        ref={searchRef}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKey}
      />
    </SearchMain>
  );
};

export default Search;
