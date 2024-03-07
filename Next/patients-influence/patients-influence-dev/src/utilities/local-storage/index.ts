// Define a default expiration time (24 hours)
const DEFAULT_EXPIRATION_TIME = 3 * 60 * 1000;
// const DEFAULT_EXPIRATION_TIME = 24 * 60 * 60 * 1000;

export async function fetchAndCacheData<T>(
  fetchFunction: () => Promise<T>,
  key: string,
  forceUpdate: boolean = false,
  expirationTime: number = DEFAULT_EXPIRATION_TIME
): Promise<T | null> {
  // Check the timestamp of the last successful fetch from local storage
  const cachedData = localStorage.getItem(key);
  const timestamp = localStorage.getItem(`${key}Timestamp`);
  const currentTime = new Date().getTime();

  if (
    cachedData &&
    timestamp &&
    currentTime - parseInt(timestamp, 10) < expirationTime &&
    !forceUpdate
  ) {
    // Use cached data if it's not expired
    if (cachedData) {
      return JSON.parse(cachedData);
    }
  }
  // Fetch fresh data from the server
  try {
    const freshData = await fetchFunction();

    // Update local storage with the new data and timestamp
    localStorage.setItem(key, JSON.stringify(freshData));
    if (!forceUpdate) {
      localStorage.setItem(`${key}Timestamp`, currentTime.toString());
    }

    // Return the fetched data
    return freshData;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}
