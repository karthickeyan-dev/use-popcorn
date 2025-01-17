import { useEffect } from 'react';

export function useKeyDown(key, action) {
  useEffect(() => {
    function callback(e) {
      if (e.code.toLowerCase() === key.toLowerCase()) {
        action();
        console.log(`PERFORMING KEYDOWN ACTION FOR ${key}`);
      }
    }
    document.addEventListener('keydown', callback);

    return () => document.removeEventListener('keydown', callback);
  }, [key, action]);
}
