from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Any
from fastapi.responses import FileResponse, RedirectResponse, PlainTextResponse
from pathlib import Path

import sqlite3

# =========================
# MODELE Pydantic
# =========================

class Movie(BaseModel):
    title: str
    year: str
    actors: str   # legacy field (nieużywane w etapie 08, ale zostawiamy)

class MovieUpdate(BaseModel):
    title: str
    year: str
    actors: str


class ActorIn(BaseModel):
    name: str


# =========================
# APP
# =========================

app = FastAPI()

app.mount(
    "/static",
    StaticFiles(directory="../ui/build/static", check_dir=False),
    name="static"
)

DB_PATH = "movies.db"


# =========================
# DB HELPERS
# =========================

def get_db():
    db = sqlite3.connect(DB_PATH)
    db.row_factory = sqlite3.Row
    db.execute("PRAGMA foreign_keys = ON")
    return db


def init_db():
    db = get_db()
    cursor = db.cursor()

    # tabela movies MUSI już istnieć (Twój projekt)
    # Dodajemy tabele dla etapu "Aktorzy"

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS actors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS movie_actors (
        movie_id INTEGER NOT NULL,
        actor_id INTEGER NOT NULL,
        PRIMARY KEY (movie_id, actor_id),
        FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
        FOREIGN KEY (actor_id) REFERENCES actors(id) ON DELETE CASCADE
    )
    """)

    db.commit()
    db.close()


@app.on_event("startup")
def on_startup():
    init_db()


# =========================
# FRONTEND (React build)
# =========================

UI_INDEX = (Path(__file__).resolve().parent / "../ui/build/index.html").resolve()

@app.get("/")
def serve_react_app():
    # Produkcja / po buildzie Reacta
    if UI_INDEX.exists():
        return FileResponse(str(UI_INDEX))

    # DEV: nie ma builda, więc nie wywalaj 500
    # Możesz też dać RedirectResponse("/docs") jeśli wolisz
    return PlainTextResponse(
        "UI build not found. Run React dev server at http://localhost:3000 "
        "or create build: cd ../ui && npm run build",
        status_code=200
    )


# @app.get("/")
# def serve_react_app():
#     return FileResponse("../ui/build/index.html")


# =========================
# MOVIES
# =========================

@app.get("/movies")
def get_movies():
    db = get_db()
    cursor = db.cursor()
    movies = cursor.execute("SELECT * FROM movies").fetchall()

    output = []

    for m in movies:
        movie_id = m["id"]

        actor_rows = cursor.execute("""
            SELECT a.id, a.name
            FROM actors a
            JOIN movie_actors ma ON ma.actor_id = a.id
            WHERE ma.movie_id = ?
            ORDER BY a.name
        """, (movie_id,)).fetchall()

        output.append({
            "id": m["id"],
            "title": m["title"],
            "year": m["year"],
            "actors": [{"id": a["id"], "name": a["name"]} for a in actor_rows]
        })

    db.close()
    return output


@app.get("/movies/{movie_id}")
def get_single_movie(movie_id: int):
    db = get_db()
    cursor = db.cursor()
    movie = cursor.execute(
        "SELECT * FROM movies WHERE id = ?",
        (movie_id,)
    ).fetchone()

    if movie is None:
        db.close()
        return {"message": "Movie not found"}

    actors = cursor.execute("""
        SELECT a.id, a.name
        FROM actors a
        JOIN movie_actors ma ON ma.actor_id = a.id
        WHERE ma.movie_id = ?
        ORDER BY a.name
    """, (movie_id,)).fetchall()

    db.close()
    return {
        "id": movie["id"],
        "title": movie["title"],
        "year": movie["year"],
        "actors": [{"id": a["id"], "name": a["name"]} for a in actors]
    }


@app.post("/movies")
def add_movie(movie: Movie):
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO movies (title, year, actors) VALUES (?, ?, ?)",
        (movie.title, movie.year, movie.actors)
    )
    db.commit()
    movie_id = cursor.lastrowid
    db.close()
    return {"message": f"Movie with id = {movie_id} added successfully"}

@app.put("/movies/{movie_id}")
def update_movie(movie_id: int, params: MovieUpdate):
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "UPDATE movies SET title = ?, year = ?, actors = ? WHERE id = ?",
        (params.title, params.year, params.actors, movie_id)
    )
    db.commit()
    updated = cursor.rowcount
    db.close()

    if updated == 0:
        return {"message": f"Movie with id = {movie_id} not found"}

    return {"message": f"Movie with id = {movie_id} updated successfully"}



# @app.put("/movies/{movie_id}")
# def update_movie(movie_id: int, params: dict[str, Any]):
#     db = get_db()
#     cursor = db.cursor()
#     cursor.execute(
#         "UPDATE movies SET title = ?, year = ?, actors = ? WHERE id = ?",
#         (params["title"], params["year"], params["actors"], movie_id)
#     )
#     db.commit()
#     updated = cursor.rowcount
#     db.close()
#
#     if updated == 0:
#         return {"message": f"Movie with id = {movie_id} not found"}
#
#     return {"message": f"Movie with id = {movie_id} updated successfully"}


@app.delete("/movies/{movie_id}")
def delete_movie(movie_id: int):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("DELETE FROM movies WHERE id = ?", (movie_id,))
    db.commit()
    deleted = cursor.rowcount
    db.close()

    if deleted == 0:
        return {"message": f"Movie with id = {movie_id} not found"}

    return {"message": f"Movie with id = {movie_id} deleted successfully"}


@app.delete("/movies")
def delete_movies():
    db = get_db()
    cursor = db.cursor()
    cursor.execute("DELETE FROM movies")
    db.commit()
    deleted = cursor.rowcount
    db.close()
    return {"message": f"Deleted {deleted} movies"}


# =========================
# ACTORS
# =========================

@app.get("/actors")
def get_actors():
    db = get_db()
    cursor = db.cursor()
    rows = cursor.execute(
        "SELECT id, name FROM actors ORDER BY name"
    ).fetchall()
    db.close()
    return [{"id": r["id"], "name": r["name"]} for r in rows]


@app.post("/actors")
def add_actor(actor: ActorIn):
    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute(
            "INSERT INTO actors (name) VALUES (?)",
            (actor.name,)
        )
        db.commit()
        actor_id = cursor.lastrowid
    except sqlite3.IntegrityError:
        db.close()
        return {"message": "Actor already exists"}

    db.close()
    return {"id": actor_id, "name": actor.name}


@app.delete("/actors/{actor_id}")
def delete_actor(actor_id: int):
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "DELETE FROM actors WHERE id = ?",
        (actor_id,)
    )
    db.commit()
    deleted = cursor.rowcount
    db.close()

    if deleted == 0:
        return {"message": f"Actor with id = {actor_id} not found"}

    return {"message": f"Actor with id = {actor_id} deleted successfully"}



# =========================
# ASSIGN / UNASSIGN ACTORS
# =========================

@app.post("/movies/{movie_id}/actors/{actor_id}")
def assign_actor_to_movie(movie_id: int, actor_id: int):
    db = get_db()
    cursor = db.cursor()

    try:
        cursor.execute(
            "INSERT OR IGNORE INTO movie_actors (movie_id, actor_id) VALUES (?, ?)",
            (movie_id, actor_id)
        )
        db.commit()
    except sqlite3.IntegrityError:
        db.close()
        raise HTTPException(status_code=404, detail="Movie or Actor not found")

    db.close()
    return {"message": "Actor assigned to movie"}


# @app.post("/movies/{movie_id}/actors/{actor_id}")
# def assign_actor_to_movie(movie_id: int, actor_id: int):
#     db = get_db()
#     cursor = db.cursor()
#
#     cursor.execute(
#         "INSERT OR IGNORE INTO movie_actors (movie_id, actor_id) VALUES (?, ?)",
#         (movie_id, actor_id)
#     )
#     db.commit()
#     db.close()
#     return {"message": "Actor assigned to movie"}


@app.delete("/movies/{movie_id}/actors/{actor_id}")
def unassign_actor_from_movie(movie_id: int, actor_id: int):
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "DELETE FROM movie_actors WHERE movie_id = ? AND actor_id = ?",
        (movie_id, actor_id)
    )
    db.commit()
    deleted = cursor.rowcount
    db.close()

    if deleted == 0:
        return {"message": "Relation not found"}

    return {"message": "Actor unassigned from movie"}
