import { useRef } from 'react';
import { useKeyDown } from '../hooks/useKeyDown';

export default function SearchBox({ query, setQuery }) {
  const inputEl = useRef(null);

  useKeyDown('Enter', () => {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    setQuery('');
  });

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      ref={inputEl}
      value={query}
      onChange={e => setQuery(e.target.value)}
    />
  );
}
