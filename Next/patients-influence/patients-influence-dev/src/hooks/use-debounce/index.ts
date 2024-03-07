import { useEffect, useState } from 'react';

const useDebounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): T => {
  // eslint-disable-next-line no-undef
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);

  useEffect(
    () => () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    },
    []
  );

  const debouncedFunc = (...args: Parameters<T>) => {
    if (timerId) {
      clearTimeout(timerId);
    }

    const newTimerId = setTimeout(() => {
      func(...args);
    }, delay);

    setTimerId(newTimerId);
  };

  return debouncedFunc as T;
};

export default useDebounce;
