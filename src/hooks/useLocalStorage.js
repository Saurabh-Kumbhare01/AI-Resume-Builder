import { useEffect, useState } from "react";

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const cached = window.localStorage.getItem(key);
      return cached ? JSON.parse(cached) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage can fail in private browsing. The app still works in memory.
    }
  }, [key, value]);

  return [value, setValue];
}
