import './App.css';
import {useState, useEffect} from "react";
// import "milligram";
import MovieForm from "./MovieForm";
import MoviesList from "./MoviesList";
import ActorsPanel from "./ActorsPanel";

import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
    const [movies, setMovies] = useState([]);
    const [actors, setActors] = useState([]);

    const [addingMovie, setAddingMovie] = useState(false);

    // Loading states (listy)
    const [loadingMovies, setLoadingMovies] = useState(false);
    const [loadingActors, setLoadingActors] = useState(false);

    // Loading states (akcje)
    const [busy, setBusy] = useState(false);

    // ===== Helpers: notify + read error text =====
    function notifySuccess(msg) {
        toast.success(msg);
    }

    function notifyError(msg) {
        toast.error(msg);
    }

    function notifyInfo(msg) {
        toast.info(msg);
    }

    async function readErrorText(response) {
        try {
            return await response.text();
        } catch {
            return "";
        }
    }

    // ===== Fetch: Movies =====
    async function refreshMovies() {
        setLoadingMovies(true);
        try {
            const response = await fetch('/movies');
            if (response.ok) {
                const data = await response.json();
                setMovies(data);
            } else {
                const errText = await readErrorText(response);
                console.error('GET /movies failed:', response.status, errText);
                notifyError(`Nie udało się pobrać filmów (HTTP ${response.status})`);
            }
        } finally {
            setLoadingMovies(false);
        }
    }

    // ===== Fetch: Actors =====
    async function refreshActors() {
        setLoadingActors(true);
        try {
            const response = await fetch('/actors');
            if (response.ok) {
                const data = await response.json();
                setActors(data);
            } else {
                const errText = await readErrorText(response);
                console.error('GET /actors failed:', response.status, errText);
                notifyError(`Nie udało się pobrać aktorów (HTTP ${response.status})`);
            }
        } finally {
            setLoadingActors(false);
        }
    }

    useEffect(() => {
        refreshMovies();
        refreshActors();
    }, []);

    // ===== POST /movies =====
    async function handleAddMovie(movie) {
        setBusy(true);
        try {
            // backend oczekuje: title(str), year(str), actors(str legacy)
            const payload = {
                title: movie.title ?? '',
                year: String(movie.year ?? ''),
                description: movie.description ?? '',
                actors: movie.actors ?? ''
            };

            const response = await fetch('/movies', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errText = await readErrorText(response);
                console.error('POST /movies failed:', response.status, errText);
                notifyError(`Nie udało się dodać filmu (HTTP ${response.status})`);
                return;
            }

            notifySuccess("Film dodany");
            await refreshMovies();
            setAddingMovie(false);
        } finally {
            setBusy(false);
        }
    }

    // ===== DELETE /movies/{id} + confirm =====
    async function handleDeleteMovie(movie) {
        if (!window.confirm(`Usunąć film: "${movie.title}"?`)) return;

        setBusy(true);
        try {
            const response = await fetch(`/movies/${movie.id}`, {method: 'DELETE'});

            if (!response.ok) {
                const errText = await readErrorText(response);
                console.error('DELETE /movies failed:', response.status, errText);
                notifyError(`Nie udało się usunąć filmu (HTTP ${response.status})`);
                return;
            }

            notifySuccess("Film usunięty");
            await refreshMovies();
        } finally {
            setBusy(false);
        }
    }

    // ===== ACTORS CRUD =====
    async function handleAddActor(name) {
        setBusy(true);
        try {
            const response = await fetch('/actors', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({name}),
            });

            if (!response.ok) {
                const errText = await readErrorText(response);
                console.error('POST /actors failed:', response.status, errText);
                notifyError(`Nie udało się dodać aktora (HTTP ${response.status})`);
                return;
            }

            notifySuccess("Aktor dodany");
            await refreshActors();
        } finally {
            setBusy(false);
        }
    }

    async function handleDeleteActor(actorId, actorName = "") {
        if (!window.confirm(`Usunąć aktora: "${actorName || actorId}"?`)) return;

        setBusy(true);
        try {
            const response = await fetch(`/actors/${actorId}`, {method: 'DELETE'});

            if (!response.ok) {
                const errText = await readErrorText(response);
                console.error('DELETE /actors failed:', response.status, errText);
                notifyError(`Nie udało się usunąć aktora (HTTP ${response.status})`);
                return;
            }

            notifySuccess("Aktor usunięty");
            await refreshActors();
            await refreshMovies(); // CASCADE relacje + UI odświeżone
        } finally {
            setBusy(false);
        }
    }

    // ===== ASSIGN / UNASSIGN =====
    async function handleAssignActor(movieId, actorId) {
        setBusy(true);
        try {
            const response = await fetch(`/movies/${movieId}/actors/${actorId}`, {method: 'POST'});

            if (!response.ok) {
                const errText = await readErrorText(response);
                console.error('POST assign failed:', response.status, errText);
                notifyError(`Nie udało się przypisać aktora (HTTP ${response.status})`);
                return;
            }

            notifyInfo("Aktor przypisany");
            await refreshMovies();
        } finally {
            setBusy(false);
        }
    }

    async function handleUnassignActor(movieId, actorId) {
        setBusy(true);
        try {
            const response = await fetch(`/movies/${movieId}/actors/${actorId}`, {method: 'DELETE'});

            if (!response.ok) {
                const errText = await readErrorText(response);
                console.error('DELETE unassign failed:', response.status, errText);
                notifyError(`Nie udało się odpiąć aktora (HTTP ${response.status})`);
                return;
            }

            notifyInfo("Aktor odpięty");
            await refreshMovies();
        } finally {
            setBusy(false);
        }
    }

    async function handleUpdateMovie(movieId, payload) {
        setBusy(true);
        try {
            const response = await fetch(`/movies/${movieId}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errText = await readErrorText(response);
                console.error("PUT /movies failed:", response.status, errText);
                notifyError(`Nie udało się zaktualizować filmu (HTTP ${response.status})`);
                return;
            }

            notifySuccess("Film zaktualizowany");
            await refreshMovies();
        } finally {
            setBusy(false);
        }
    }


    // ===== Search (bonus z listy slajdu) — opcjonalne, zostawiam bo małe i użyteczne =====
    const [query, setQuery] = useState("");
    const filteredMovies = movies.filter(m => {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return (m.title ?? "").toLowerCase().includes(q) || String(m.year ?? "").toLowerCase().includes(q);
    });

    return (
        <div className="admin-shell">
            {/* Toasts */}
            <ToastContainer position="top-right" autoClose={2500}/>

            {/* Topbar */}
            <header className="topbar">
                <div className="topbar__brand">
                    <div className="brand__title">Movies Admin</div>
                    <div className="brand__subtitle">Manage movies, actors and cast assignments</div>
                </div>

                <div className="topbar__actions">
                    <div className="search">
                        <input
                            className="input input--search"
                            type="text"
                            placeholder="Search movies…"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            disabled={busy}
                        />
                    </div>

                    <button
                        className="btn btn--primary"
                        onClick={() => setAddingMovie(true)}
                        disabled={busy || addingMovie}
                        title="Add a movie"
                    >
                        + Add a movie
                    </button>
                </div>
            </header>

            {/* Main grid */}
            <main className="grid">
                {/* Movies panel */}
                <section className="panel">
                    <div className="panel__header">
                        <h2 className="panel__title">Movies</h2>
                        <p className="panel__hint">Assign actors, manage cast, delete entries.</p>
                    </div>

                    {/* Loading movies */}
                    {loadingMovies && (
                        <div className="state">
                            <span className="spinner"/> <span>Loading movies…</span>
                        </div>
                    )}

                    {/* Movies list */}
                    {!loadingMovies && (
                        filteredMovies.length === 0 ? (
                            <div className="state state--empty">No movies yet. Add your first one.</div>
                        ) : (
                            <div className="movie-list">
                                <MoviesList
                                    movies={filteredMovies}
                                    actors={actors}
                                    onDeleteMovie={handleDeleteMovie}
                                    onAssignActor={handleAssignActor}
                                    onUnassignActor={handleUnassignActor}
                                    onUpdateMovie={handleUpdateMovie}
                                    busy={busy}
                                />
                            </div>
                        )
                    )}

                    {/* Add movie form */}
                    <div className="panel__footer">
                        {addingMovie ? (
                            <div className="card card--form">
                                <div className="card__title">New movie</div>
                                <MovieForm
                                    onMovieSubmit={handleAddMovie}
                                    buttonLabel={busy ? "Working…" : "Add a movie"}
                                />
                                <div className="form-actions">
                                    <button
                                        className="btn btn--ghost"
                                        type="button"
                                        onClick={() => setAddingMovie(false)}
                                        disabled={busy}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="hint-row">
                                <span
                                    className="hint-row__text">Tip: add a movie, then assign actors from the card.</span>
                            </div>
                        )}
                    </div>
                </section>

                {/* Actors panel */}
                <aside className="panel panel--side">
                    <ActorsPanel
                        actors={actors}
                        loading={loadingActors}
                        busy={busy}
                        onAddActor={handleAddActor}
                        onDeleteActor={handleDeleteActor}
                    />
                </aside>
            </main>

            <footer className="footer">
                <span className="footer__text">Movies Admin • React + REST • Cast management</span>
            </footer>
        </div>
    );
}

export default App;
