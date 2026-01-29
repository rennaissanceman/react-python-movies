import { useState } from "react";

export default function ActorsPanel({ actors, loading, busy, onAddActor, onDeleteActor }) {
  const [name, setName] = useState("");

  return (
    <div className="actors">
      <div className="panel__header">
        <h2 className="panel__title">Actors</h2>
        <p className="panel__hint">Create actors and remove unused entries.</p>
      </div>

      {loading && (
        <div className="state">
          <span className="spinner" /> <span>Loading actors…</span>
        </div>
      )}

      <form
        className="actor-form"
        onSubmit={(e) => {
          e.preventDefault();
          const trimmed = name.trim();
          if (!trimmed) return;
          onAddActor(trimmed);
          setName("");
        }}
      >
        <div className="field">
          <label className="label">Name</label>
          <input
            className="input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Sigourney Weaver"
            disabled={busy}
          />
        </div>

        <button className="btn btn--primary btn--block" type="submit" disabled={busy}>
          Add actor
        </button>
      </form>

      {actors.length === 0 ? (
        <div className="state state--empty">No actors yet.</div>
      ) : (
        <ul className="actor-list">
          {actors.map((a) => (
            <li className="actor-item" key={a.id}>
              <span className="actor-name">{a.name}</span>
              <button
                className="btn btn--danger btn--ghost btn--sm"
                type="button"
                disabled={busy}
                onClick={() => {
                  if (busy) return;
                  onDeleteActor(a.id, a.name);
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
