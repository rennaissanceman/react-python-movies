import { useMemo, useState, useEffect } from "react";

export default function MovieListItem(props) {
  const movie = props.movie;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  const allActors = props.actors ?? [];
  const busy = !!props.busy;

  const assignedIds = useMemo(
    () => new Set((movie.actors ?? []).map((a) => a.id)),
    [movie.actors]
  );

  const availableToAssign = useMemo(
    () => allActors.filter((a) => !assignedIds.has(a.id)),
    [allActors, assignedIds]
  );

  const [selectedActorId, setSelectedActorId] = useState(availableToAssign[0]?.id ?? "");

  useEffect(() => {
    setSelectedActorId(availableToAssign[0]?.id ?? "");
  }, [availableToAssign]);

  // ===== EDIT MODE =====
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(movie.title ?? "");
  const [editYear, setEditYear] = useState(String(movie.year ?? ""));
  const [editDescription, setEditDescription] = useState(movie.description ?? "");

  useEffect(() => {
    // gdy odświeżysz listę z backendu, zsynchronizuj pola
    setEditTitle(movie.title ?? "");
    setEditYear(String(movie.year ?? ""));
    setEditDescription(movie.description ?? "");
  }, [movie.id, movie.title, movie.year, movie.description]);

  const hasCast = (movie.actors ?? []).length > 0;
  const canAssign = availableToAssign.length > 0;

  return (
    <article className="card movie-card">
      <div className="movie-card__top">
        <div className="movie-card__heading">
          <h3 className="movie-title">{movie.title}</h3>
          <span className="badge">{movie.year}</span>
        </div>

        <div className="movie-card__controls" style={{ display: "flex", gap: 8 }}>
          <button
            className="btn btn--ghost btn--sm"
            type="button"
            disabled={busy}
            onClick={() => setEditing((v) => !v)}
            title="Edit movie"
          >
            {editing ? "Close" : "Edit"}
          </button>

          <button
            className="btn btn--danger btn--ghost btn--sm"
            type="button"
            disabled={busy}
            onClick={() => props.onDelete()}
            title="Delete movie"
          >
            Delete
          </button>
        </div>
      </div>

      {/* DESCRIPTION (read mode) */}
      {!editing && (
        <div className="movie-card__meta" style={{ alignItems: "flex-start" }}>
          <span className="meta-label">Opis</span>
          <div style={{ paddingTop: 4, color: "var(--text)", opacity: 0.92 }}>
            {(movie.description ?? "").trim() ? movie.description : <span className="meta-empty">—</span>}
          </div>
        </div>
      )}

      {/* EDIT FORM */}
      {editing && (
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
          <div className="field">
            <label className="label">Title</label>
            <input
              className="input"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              disabled={busy}
            />
          </div>

          <div className="field">
            <label className="label">Year</label>
            <input
              className="input"
              value={editYear}
              onChange={(e) => setEditYear(e.target.value)}
              disabled={busy}
            />
          </div>

          <div className="field">
            <label className="label">Description</label>
            <textarea
              className="input"
              style={{ height: 110, paddingTop: 10, resize: "vertical" }}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              disabled={busy}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button
              className="btn btn--ghost"
              type="button"
              disabled={busy}
              onClick={() => {
                setEditTitle(movie.title ?? "");
                setEditYear(String(movie.year ?? ""));
                setEditDescription(movie.description ?? "");
              }}
            >
              Reset
            </button>

            <button
              className="btn btn--primary"
              type="button"
              disabled={busy || editTitle.trim().length < 1}
              onClick={() => {
                props.onUpdateMovie(movie.id, {
                  title: editTitle,
                  year: String(editYear),
                  description: editDescription,
                  actors: "" // legacy, zostawiamy puste
                });
              }}
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Cast */}
      <div className="movie-card__meta">
        <span className="meta-label">Cast</span>

        {!hasCast ? (
          <span className="meta-empty">—</span>
        ) : (
          <div className="chips">
            {movie.actors.map((a) => (
              <span className="chip" key={a.id}>
                {a.name}
                <button
                  className="chip__x"
                  type="button"
                  disabled={busy}
                  onClick={() => props.onUnassignActor(movie.id, a.id)}
                  title="Remove actor from movie"
                  aria-label={`Remove ${a.name}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Assign */}
      <div className="movie-card__actions">
        <div className="field">
          <label className="label">Assign actor</label>

          {canAssign ? (
            <select
              className="input"
              value={selectedActorId}
              onChange={(e) => setSelectedActorId(e.target.value)}
              disabled={busy}
            >
              {availableToAssign.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          ) : (
            <div className="muted">All actors already assigned.</div>
          )}
        </div>

        <button
          className="btn btn--primary"
          type="button"
          disabled={busy || !canAssign}
          onClick={() => {
            const id = Number(selectedActorId || availableToAssign[0].id);
            props.onAssignActor(movie.id, id);
          }}
        >
          Assign
        </button>
      </div>
    </article>
  );
}
