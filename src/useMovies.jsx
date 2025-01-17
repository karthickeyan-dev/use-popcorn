import { useState, useEffect } from 'react';

const KEY = 'e35a74cd';

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (query.length < 3) {
      setError('');
      setMovies([]);
      return;
    }

    const controller = new AbortController();
    async function fetchMovies() {
      try {
        setError('');
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: controller.signal }
        );
        if (!res.ok) {
          throw new Error('Something went wrong with fetching movies');
        }
        const data = await res.json();
        if (data.Response === 'False') {
          throw new Error(`Cannot find any results`);
        }
        setMovies(data.Search);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
          // console.error(`🚫${err}🚫`);
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchMovies();

    return function () {
      controller.abort();
    };
  }, [query]);

  return { movies, isLoading, error };
}
