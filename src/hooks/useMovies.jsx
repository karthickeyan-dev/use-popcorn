import { useState, useEffect, useRef } from 'react';

const KEY = 'e35a74cd';

export function useMovies(query, currentPage = 1, resetCurrentPage) {
  const [movies, setMovies] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const prevQuery = useRef(query);

  useEffect(() => {
    if (prevQuery.current !== query && resetCurrentPage) {
      resetCurrentPage();
      // console.log(prevQuery.current, query);
    }
    prevQuery.current = query;
  }, [query, resetCurrentPage]);

  useEffect(() => {
    if (query.length < 3) {
      setError('');
      setMovies([]);
      setTotalResults(0);
      return;
    }

    const controller = new AbortController();
    async function fetchMovies() {
      try {
        setError('');
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}&page=${currentPage}`,
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
        setTotalResults(data.totalResults);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
          setTotalResults(0);
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
  }, [query, currentPage]);

  return { movies, isLoading, error, totalResults };
}
