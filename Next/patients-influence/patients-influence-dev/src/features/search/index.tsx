import React, { useEffect, useState } from 'react';
import {
  SearchPageMain,
  SearchPageFilter,
  SearchPageFilterButton,
  SearchPageContent,
} from 'features/search/styles';
import {
  CardWithText,
  CheckboxTable,
  HighlightedText,
} from 'components/custom';
import { useRouter } from 'next/router';
import { Input } from 'components/ui';
import { DSearchTableHead, DSearchTableItems } from 'features/search/data';
import { TTableRenderItemObject } from 'components/custom/table/types';

const SearchPage = () => {
  const [keyword, setKeyword] = useState('');

  const [filter, setFilter] = useState({
    search: '',
    category: null,
  });

  const router = useRouter();
  useEffect(() => {
    if (router.isReady && router.query.q) {
      setKeyword(router.query.q as string);
    }
  }, [router.isReady, router.query]);

  const handleSearch = () => {
    const q = filter.search.trim();
    if (q) {
      router.push({
        pathname: `/search`,
        query: { q },
      });
    }
  };

  const renderItem = ({ headItem, cell }: TTableRenderItemObject) => {
    if (headItem.reference === 'result') {
      return (
        <HighlightedText
          dangerouslySetInnerHTML={{
            __html: cell.data.replace(keyword, `<span>${keyword}</span>`),
          }}
        />
      );
    }
    if (headItem.reference === 'category') {
      return cell.data;
    }
    return '';
  };

  const filteredItems = DSearchTableItems.filter((x) =>
    x.result.includes((router.query.q as string) || '')
  );

  return (
    <SearchPageMain>
      <CardWithText
        title="Search Results"
        description={
          keyword
            ? `${filteredItems.length} hits with "${keyword}"`
            : 'Start search by entering keywords'
        }
      >
        <SearchPageContent>
          <SearchPageFilter direction="horizontal">
            <Input
              type="text"
              label="Search for"
              placeholder="Please Enter"
              value={filter.search}
              onValue={(search) => setFilter({ ...filter, search })}
            />
            <Input
              type="select"
              label="Category"
              value={filter.category}
              onValue={(category) => setFilter({ ...filter, category })}
              placeholder="Please Select"
            />
            <SearchPageFilterButton
              color="primary"
              variant="contained"
              onClick={handleSearch}
            >
              Search
            </SearchPageFilterButton>
          </SearchPageFilter>
          <CheckboxTable
            head={DSearchTableHead}
            items={filteredItems}
            renderItem={renderItem}
          />
        </SearchPageContent>
      </CardWithText>
    </SearchPageMain>
  );
};

export default SearchPage;
