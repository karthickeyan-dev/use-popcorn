import { useState, useEffect, useRef } from 'react';
import { useKeyDown } from '../hooks/useKeyDown';
import StarRating from './StarRating';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';

const KEY = 'e35a74cd';

export default function MovieDetails({
  selectedId,
  onCloseMovie,
  watched,
  onAddWatched,
}) {
  const [movieDetails, setMovieDetails] = useState({});
  const [userRating, SetUserRating] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const countRating = useRef(0);

  useEffect(() => {
    if (userRating) countRating.current++;
  }, [userRating]);

  const {
    Poster: poster,
    Title: title,
    Released: released,
    Runtime: runtime,
    Genre: genre,
    imdbRating,
    Plot: plot,
    Actors: actors,
    Director: director,
    Language: language,
  } = movieDetails;

  const isWatched = watched.some(movie => movie.imdbID === selectedId);
  const watchedUserRating = watched.find(
    movie => movie.imdbID === selectedId
  )?.userRating;

  const handleAddMovie = function () {
    const newMovie = {
      imdbID: selectedId,
      poster,
      title,
      runtime: Number(runtime.split(' ').at(0)),
      imdbRating: Number(imdbRating),
      userRating,
      countRating: countRating.current,
    };
    onAddWatched(newMovie);
    onCloseMovie();
  };

  useEffect(() => {
    if (!title) return;
    document.title = `Movie | ${title}`;

    return () => {
      document.title = 'usePopcorn';
    };
  }, [title]);

  useEffect(() => {
    async function fetchMovieDetails() {
      try {
        setError('');
        setIsLoading(true);
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );
        if (!res.ok) {
          throw new Error('Something went wrong with fetching movie details');
        }
        const data = await res.json();
        if (data.Response === 'False') {
          throw new Error(`Cannot find any movie details`);
        }
        setMovieDetails(data);
      } catch (err) {
        setError(err.message);
        // console.error(`🚫${err}🚫`);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMovieDetails();
  }, [selectedId]);

  useKeyDown('Escape', onCloseMovie);

  return (
    <div className="details">
      {isLoading && <Loader />}
      {!isLoading && !error && (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${title} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                <span>📅</span>
                {released}
                <span>&bull;</span>
                <span>🕓</span>
                {runtime}
              </p>
              <p>
                <span>🎭</span>
                {genre}
              </p>
              <p>
                <span>🌎</span>
                {language}
              </p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDB rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={SetUserRating}
                  />
                  {userRating && (
                    <button className="btn-add" onClick={handleAddMovie}>
                      + Add to watchlist
                    </button>
                  )}
                </>
              ) : (
                <p style={{ textAlign: 'center' }}>
                  You rated this movie {watchedUserRating} 🌟
                </p>
              )}
            </div>

            <p>
              <em>{plot}</em>
            </p>
            <p>Staring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
      {error && <ErrorMessage message={error} />}
    </div>
  );
}
