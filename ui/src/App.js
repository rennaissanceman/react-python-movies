import './App.css';
import { useState, useEffect } from "react";
import "milligram";
import MovieForm from "./MovieForm";
import MoviesList from "./MoviesList";

function App() {
  const [movies, setMovies] = useState([]);
  const [addingMovie, setAddingMovie] = useState(false);

  async function refreshMovies() {
    const response = await fetch('/movies');
    if (response.ok) {
      const movies = await response.json();
      setMovies(movies);
    } else {
      console.error('GET /movies failed:', response.status, await response.text().catch(() => ''));
    }
  }

  // GET /movies przy starcie
  useEffect(() => {
    refreshMovies();
  }, []);

  // POST /movies (dopasowane do backendu: title, year, actors)
  async function handleAddMovie(movie) {
    // Backend oczekuje: title (str), year (str), actors (str)
    // Twoj formularz ma director/description, więc mapujemy to do actors
    const payload = {
      title: movie.title ?? '',
      year: String(movie.year ?? ''),               // backend ma year: str
      actors: movie.actors ?? movie.director ?? '', // mapowanie z Twojego formularza
    };

    const response = await fetch('/movies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      console.error('POST /movies failed:', response.status, errText);
      alert(`Nie udało się dodać filmu (HTTP ${response.status})`);
      return;
    }

    // Backend zwraca {"message": "..."} a nie film z id,
    // więc po sukcesie odświeżamy listę z GET /movies:
    await refreshMovies();
    setAddingMovie(false);
  }

  // DELETE /movies/{id}
  async function handleDeleteMovie(movie) {
    const response = await fetch(`/movies/${movie.id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      console.error('DELETE failed:', response.status, errText);
      alert(`Nie udało się usunąć filmu (HTTP ${response.status})`);
      return;
    }

    // po delete też odśwież (bezpieczne)
    await refreshMovies();
  }

  return (
    <div className="container">
      <h1>My favourite movies to watch</h1>

      {movies.length === 0
        ? <p>No movies yet. Maybe add something?</p>
        : <MoviesList
            movies={movies}
            onDeleteMovie={handleDeleteMovie}
          />
      }

      {addingMovie
        ? <MovieForm
            onMovieSubmit={handleAddMovie}
            buttonLabel="Add a movie"
          />
        : <button onClick={() => setAddingMovie(true)}>Add a movie</button>
      }
    </div>
  );
}

export default App;
