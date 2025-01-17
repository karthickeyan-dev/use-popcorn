import { useState, useEffect } from 'react';

export function UseLocalStorage(initialValue, key) {
  const [value, setValue] = useState(
    () => JSON.parse(localStorage.getItem(key)) || initialValue
  );

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
}
