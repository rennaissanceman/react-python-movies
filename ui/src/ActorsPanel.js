import { useState } from "react";

export default function ActorsPanel({ actors, onAddActor, onDeleteActor }) {
  const [name, setName] = useState("");

  return (
    <div style={{ marginTop: 30 }}>
      <h2>Actors</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const trimmed = name.trim();
          if (!trimmed) return;
          onAddActor(trimmed);
          setName("");
        }}
      >
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Sigourney Weaver"
        />
        <button type="submit">Add actor</button>
      </form>

      {actors.length === 0 ? (
        <p>No actors yet.</p>
      ) : (
        <ul>
          {actors.map((a) => (
            <li key={a.id}>
              {a.name}{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onDeleteActor(a.id);
                }}
              >
                Delete
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
