import './App.css';
import { useState, useEffect } from "react";
import "milligram";
import MovieForm from "./MovieForm";
import MoviesList from "./MoviesList";
import ActorsPanel from "./ActorsPanel";

function App() {
  const [movies, setMovies] = useState([]);
  const [actors, setActors] = useState([]);
  const [addingMovie, setAddingMovie] = useState(false);

  async function refreshMovies() {
    const response = await fetch('/movies');
    if (response.ok) {
      setMovies(await response.json());
    } else {
      console.error('GET /movies failed:', response.status, await response.text().catch(() => ''));
    }
  }

  async function refreshActors() {
    const response = await fetch('/actors');
    if (response.ok) {
      setActors(await response.json());
    } else {
      console.error('GET /actors failed:', response.status, await response.text().catch(() => ''));
    }
  }

  useEffect(() => {
    refreshMovies();
    refreshActors();
  }, []);

  // POST /movies (legacy: backend nadal wymaga actors: str w payload)
  async function handleAddMovie(movie) {
    const payload = {
      title: movie.title ?? '',
      year: String(movie.year ?? ''),
      // tu zostawiamy legacy string, ale UI i tak korzysta z relacji movie_actors
      actors: movie.director ?? '',
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

    await refreshMovies();
    setAddingMovie(false);
  }

  async function handleDeleteMovie(movie) {
    const response = await fetch(`/movies/${movie.id}`, { method: 'DELETE' });
    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      console.error('DELETE /movies failed:', response.status, errText);
      alert(`Nie udało się usunąć filmu (HTTP ${response.status})`);
      return;
    }
    await refreshMovies();
  }

  // ACTORS CRUD
  async function handleAddActor(name) {
    const response = await fetch('/actors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) {
      alert(`Nie udało się dodać aktora (HTTP ${response.status})`);
      return;
    }
    await refreshActors();
  }

  async function handleDeleteActor(actorId) {
    const response = await fetch(`/actors/${actorId}`, { method: 'DELETE' });
    if (!response.ok) {
      alert(`Nie udało się usunąć aktora (HTTP ${response.status})`);
      return;
    }
    await refreshActors();
    await refreshMovies(); // bo CASCADE usuwa relacje
  }

  // ASSIGN / UNASSIGN
  async function handleAssignActor(movieId, actorId) {
    const response = await fetch(`/movies/${movieId}/actors/${actorId}`, { method: 'POST' });
    if (!response.ok) {
      alert(`Nie udało się przypisać aktora (HTTP ${response.status})`);
      return;
    }
    await refreshMovies();
  }

  async function handleUnassignActor(movieId, actorId) {
    const response = await fetch(`/movies/${movieId}/actors/${actorId}`, { method: 'DELETE' });
    if (!response.ok) {
      alert(`Nie udało się odpiąć aktora (HTTP ${response.status})`);
      return;
    }
    await refreshMovies();
  }

  return (
    <div className="container">
      <h1>My favourite movies to watch</h1>

      {movies.length === 0
        ? <p>No movies yet. Maybe add something?</p>
        : <MoviesList
            movies={movies}
            actors={actors}
            onDeleteMovie={handleDeleteMovie}
            onAssignActor={handleAssignActor}
            onUnassignActor={handleUnassignActor}
          />
      }

      {addingMovie
        ? <MovieForm
            onMovieSubmit={handleAddMovie}
            buttonLabel="Add a movie"
          />
        : <button onClick={() => setAddingMovie(true)}>Add a movie</button>
      }

      <ActorsPanel
        actors={actors}
        onAddActor={handleAddActor}
        onDeleteActor={handleDeleteActor}
      />
    </div>
  );
}

export default App;


// import './App.css';
// import { useState, useEffect } from "react";
// import "milligram";
// import MovieForm from "./MovieForm";
// import MoviesList from "./MoviesList";
// import ActorsPanel from "./ActorsPanel";
//
// function App() {
//   const [movies, setMovies] = useState([]);
//   const [actors, setActors] = useState([]);
//   const [addingMovie, setAddingMovie] = useState(false);
//
//   async function refreshMovies() {
//     const response = await fetch('/movies');
//     if (response.ok) {
//       setMovies(await response.json());
//     } else {
//       console.error('GET /movies failed:', response.status, await response.text().catch(() => ''));
//     }
//   }
//
//   async function refreshActors() {
//     const response = await fetch('/actors');
//     if (response.ok) {
//       setActors(await response.json());
//     } else {
//       console.error('GET /actors failed:', response.status, await response.text().catch(() => ''));
//     }
//   }
//
//   useEffect(() => {
//     refreshMovies();
//     refreshActors();
//   }, []);
//
//   // POST /movies (legacy: backend nadal wymaga actors: str w payload)
//   async function handleAddMovie(movie) {
//     const payload = {
//       title: movie.title ?? '',
//       year: String(movie.year ?? ''),
//       // tu zostawiamy legacy string, ale UI i tak korzysta z relacji movie_actors
//       actors: movie.director ?? '',
//     };
//
//     const response = await fetch('/movies', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(payload),
//     });
//
//     if (!response.ok) {
//       const errText = await response.text().catch(() => '');
//       console.error('POST /movies failed:', response.status, errText);
//       alert(`Nie udało się dodać filmu (HTTP ${response.status})`);
//       return;
//     }
//
//     await refreshMovies();
//     setAddingMovie(false);
//   }
//
//   async function handleDeleteMovie(movie) {
//     const response = await fetch(`/movies/${movie.id}`, { method: 'DELETE' });
//     if (!response.ok) {
//       const errText = await response.text().catch(() => '');
//       console.error('DELETE /movies failed:', response.status, errText);
//       alert(`Nie udało się usunąć filmu (HTTP ${response.status})`);
//       return;
//     }
//     await refreshMovies();
//   }
//
//   // ACTORS CRUD
//   async function handleAddActor(name) {
//     const response = await fetch('/actors', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ name }),
//     });
//     if (!response.ok) {
//       alert(`Nie udało się dodać aktora (HTTP ${response.status})`);
//       return;
//     }
//     await refreshActors();
//   }
//
//   async function handleDeleteActor(actorId) {
//     const response = await fetch(`/actors/${actorId}`, { method: 'DELETE' });
//     if (!response.ok) {
//       alert(`Nie udało się usunąć aktora (HTTP ${response.status})`);
//       return;
//     }
//     await refreshActors();
//     await refreshMovies(); // bo CASCADE usuwa relacje
//   }
//
//   // ASSIGN / UNASSIGN
//   async function handleAssignActor(movieId, actorId) {
//     const response = await fetch(`/movies/${movieId}/actors/${actorId}`, { method: 'POST' });
//     if (!response.ok) {
//       alert(`Nie udało się przypisać aktora (HTTP ${response.status})`);
//       return;
//     }
//     await refreshMovies();
//   }
//
//   async function handleUnassignActor(movieId, actorId) {
//     const response = await fetch(`/movies/${movieId}/actors/${actorId}`, { method: 'DELETE' });
//     if (!response.ok) {
//       alert(`Nie udało się odpiąć aktora (HTTP ${response.status})`);
//       return;
//     }
//     await refreshMovies();
//   }
//
//   return (
//     <div className="container">
//       <h1>My favourite movies to watch</h1>
//
//       {movies.length === 0
//         ? <p>No movies yet. Maybe add something?</p>
//         : <MoviesList
//             movies={movies}
//             actors={actors}
//             onDeleteMovie={handleDeleteMovie}
//             onAssignActor={handleAssignActor}
//             onUnassignActor={handleUnassignActor}
//           />
//       }
//
//       {addingMovie
//         ? <MovieForm
//             onMovieSubmit={handleAddMovie}
//             buttonLabel="Add a movie"
//           />
//         : <button onClick={() => setAddingMovie(true)}>Add a movie</button>
//       }
//
//       <ActorsPanel
//         actors={actors}
//         onAddActor={handleAddActor}
//         onDeleteActor={handleDeleteActor}
//       />
//     </div>
//   );
// }
//
// export default App;
