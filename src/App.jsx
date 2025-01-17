import { useState } from 'react';
import { useMovies } from './hooks/useMovies';
import { UseLocalStorage } from './hooks/useLocalStorage';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage';
import MoviesList from './components/MoviesList';
import WatchedSummary from './components/WatchedSummary';
import WatchedMoviesList from './components/WatchedMoviesList';
import Logo from './components/Logo';
import SearchBox from './components/SearchBox';
import NumResults from './components/NumResults';
import MovieDetails from './components/MovieDetails';
import Pagination from './components/Pagination';

export default function App() {
  const [query, setQuery] = useState('');
  const [currentPage, SetCurrentPage] = useState(1);
  const [selectedId, setSelectedId] = useState(null);
  const [watched, setWatched] = UseLocalStorage([], 'watched');
  const { movies, isLoading, error, totalResults } = useMovies(
    query,
    currentPage,
    resetCurrentPage
  );

  const totalPages = Math.ceil(totalResults / 10);

  function handleSelectMovie(id) {
    setSelectedId(selectedId => (selectedId === id ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(newMovie) {
    setWatched(watched => [...watched, newMovie]);
  }

  function handleDeleteWatched(id) {
    setWatched(watched => watched.filter(movie => movie.imdbID !== id));
  }

  function handlePreviousPage() {
    if (currentPage > 1) {
      SetCurrentPage(currentPage => currentPage - 1);
    }
  }

  function handleNextPage() {
    if (currentPage < totalPages) {
      SetCurrentPage(currentPage => currentPage + 1);
    }
  }

  function resetCurrentPage() {
    SetCurrentPage(1);
  }

  return (
    <>
      <NavBar>
        <Logo />
        <SearchBox query={query} setQuery={setQuery} />
        <NumResults totalResults={totalResults} />
      </NavBar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && Boolean(movies.length) && (
            <>
              <MoviesList movies={movies} onSelectMovie={handleSelectMovie} />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPreviousPage={handlePreviousPage}
                onNextPage={handleNextPage}
              />
            </>
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              watched={watched}
              onAddWatched={handleAddWatched}
              onCloseMovie={handleCloseMovie}
              key={selectedId}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen(open => !open)}>
        {isOpen ? '–' : '+'}
      </button>
      {isOpen && children}
    </div>
  );
}
