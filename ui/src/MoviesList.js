import MovieListItem from "./MovieListItem";

export default function MoviesList(props) {
  return (
    <div className="movie-list">
      {props.movies.map((movie) => (
        <MovieListItem
          key={movie.id}
          movie={movie}
          actors={props.actors}
          busy={props.busy}
          onDelete={() => props.onDeleteMovie(movie)}
          onAssignActor={props.onAssignActor}
          onUnassignActor={props.onUnassignActor}
          onUpdateMovie={props.onUpdateMovie}
        />
      ))}
    </div>
  );
}
