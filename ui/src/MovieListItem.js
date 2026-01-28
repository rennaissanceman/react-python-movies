import { useMemo, useState } from "react";

export default function MovieListItem(props) {
  const movie = props.movie;
  const allActors = props.actors ?? [];

  const assignedIds = useMemo(
    () => new Set((movie.actors ?? []).map(a => a.id)),
    [movie.actors]
  );

  const availableToAssign = useMemo(
    () => allActors.filter(a => !assignedIds.has(a.id)),
    [allActors, assignedIds]
  );

  const [selectedActorId, setSelectedActorId] = useState(
    availableToAssign[0]?.id ?? ""
  );

  return (
    <div>
      <div>
        <strong>{movie.title}</strong>{" "}
        <span>({movie.year})</span>{" "}
        <a href="#" onClick={(e) => { e.preventDefault(); props.onDelete(); }}>
          Delete
        </a>
      </div>

      <div style={{ marginTop: 6 }}>
        <em>Cast:</em>{" "}
        {(movie.actors ?? []).length === 0 ? (
          <span>—</span>
        ) : (
          movie.actors.map(a => (
            <span key={a.id} style={{ marginRight: 10 }}>
              {a.name}{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  props.onUnassignActor(movie.id, a.id);
                }}
                title="Remove actor from movie"
              >
                ×
              </a>
            </span>
          ))
        )}
      </div>

      <div style={{ marginTop: 10 }}>
        {availableToAssign.length === 0 ? (
          <small>All actors already assigned.</small>
        ) : (
          <>
            <select
              value={selectedActorId}
              onChange={(e) => setSelectedActorId(e.target.value)}
            >
              {availableToAssign.map(a => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
            <button
              style={{ marginLeft: 8 }}
              onClick={() => {
                const id = Number(selectedActorId || availableToAssign[0].id);
                props.onAssignActor(movie.id, id);
              }}
            >
              Assign
            </button>
          </>
        )}
      </div>
    </div>
  );
}


// export default function MovieListItem(props) {
//     return (
//         <div>
//             <div>
//                 <strong>{props.movie.title}</strong>
//                 {' '}
//                 <span>({props.movie.year})</span>
//                 {' '}
//                 directed by {props.movie.director}
//                 {' '}
//                 <a onClick={props.onDelete}>Delete</a>
//             </div>
//             {props.movie.description}
//         </div>
//     );
// }
