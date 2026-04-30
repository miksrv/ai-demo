import { useState, useEffect, useCallback } from 'react';

function useLocalStorage<T>(key: string, defaultValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? (JSON.parse(item) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const next = value instanceof Function ? value(prev) : value;
        if (typeof window !== 'undefined') {
          try {
            window.localStorage.setItem(key, JSON.stringify(next));
          } catch {
            // ignore write errors (e.g. storage quota exceeded)
          }
        }
        return next;
      });
    },
    [key]
  );

  useEffect(() => {
    const handler = (event: StorageEvent) => {
      if (event.key !== key || event.storageArea !== window.localStorage) return;
      try {
        setStoredValue(event.newValue !== null ? (JSON.parse(event.newValue) as T) : defaultValue);
      } catch {
        setStoredValue(defaultValue);
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [key, defaultValue]);

  return [storedValue, setValue];
}

export default useLocalStorage;
