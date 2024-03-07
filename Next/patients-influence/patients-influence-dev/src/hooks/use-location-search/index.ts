import { useState } from 'react';
import { LocationAPI } from 'api';
import { TLocation, TLocationsResults } from './types';

const useLocationSearch = (initialData = []) => {
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState<TLocation[]>(initialData);

  const getLocations = async (searchTerm = '') => {
    setLoading(true);
    const { result }: { result: TLocationsResults[] } =
      await LocationAPI.getAll(searchTerm);

    setLocations(
      result.map((data: any) => {
        const checkNotInitial = data.countryId
          ? `${data.name}, ${data.country.name}`
          : data.name;
        const label = !searchTerm.length
          ? `${data.name}, ${data.country.name}`
          : checkNotInitial;

        return {
          value: data.id,
          label,
        };
      })
    );
    setLoading(false);
  };

  return { loading, locations, getLocations };
};

export default useLocationSearch;
