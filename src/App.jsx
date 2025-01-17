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
import Button from './components/Button';

export default function App() {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [watched, setWatched] = UseLocalStorage([], 'watched');
  const { movies, isLoading, error } = useMovies(query);

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

  return (
    <>
      <NavBar>
        <Logo />
        <SearchBox query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MoviesList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          <div className="pagination">
            <Button>Previous</Button>
            <Button>Next</Button>
          </div>
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
