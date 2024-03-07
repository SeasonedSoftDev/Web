import { useState, useEffect } from 'react';

interface CacheOptions<T> {
  key: string;
  expirationTime?: number;
}

const DEFAULT_EXPIRATION_TIME = 24 * 60 * 60 * 1000;

function useCachedDataFetcher<T>(
  fetchFunction: () => Promise<T>,
  options?: CacheOptions<T>
): T | null {
  const fetchData = async (
    key: string,
    expirationTime: number = DEFAULT_EXPIRATION_TIME
  ): Promise<T | null> => {
    const cachedData = localStorage.getItem(key);
    const timestamp = localStorage.getItem(`${key}Timestamp`);
    const currentTime = new Date().getTime();

    if (
      cachedData &&
      timestamp &&
      currentTime - parseInt(timestamp, 10) < expirationTime
    ) {
      return JSON.parse(cachedData);
    }
    try {
      const freshData = await fetchFunction();

      localStorage.setItem(key, JSON.stringify(freshData));
      localStorage.setItem(`${key}Timestamp`, currentTime.toString());

      return freshData;
    } catch (error) {
      return null;
    }
  };

  const { key, expirationTime = DEFAULT_EXPIRATION_TIME } = options || {};
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    fetchData(key!, expirationTime).then((result) => setData(result));
  }, [key, expirationTime]);

  return data;
}

export default useCachedDataFetcher;
