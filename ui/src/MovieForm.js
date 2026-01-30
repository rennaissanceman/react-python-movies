import { useState } from "react";

export default function MovieForm(props) {
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [director, setDirector] = useState(""); // możesz zostawić jako legacy
  const [description, setDescription] = useState("");

  function validate() {
    const t = title.trim();
    const y = String(year).trim();
    const d = description.trim();

    if (t.length < 2) {
      return "Tytuł jest za krótki (min. 2 znaki)";
    }

    if (!/^\d{4}$/.test(y)) {
      return "Rok musi mieć format 4 cyfr (np. 1999)";
    }

    const yNum = Number(y);
    if (yNum < 1888 || yNum > 2100) {
      return "Rok musi być w zakresie 1888–2100";
    }

    if (d.length > 2000) {
      return "Opis jest za długi (max 2000 znaków)";
    }

    return null;
  }

  function addMovie(event) {
    event.preventDefault();

    const err = validate();
    if (err) {
      alert(err);
      return;
    }

    props.onMovieSubmit({
      title: title.trim(),
      year: year.trim(),
      director: director.trim(),
      description: description.trim(),
    });

    setTitle("");
    setYear("");
    setDirector("");
    setDescription("");
  }

  return (
    <form onSubmit={addMovie}>
      <h2>Add movie</h2>

      <div>
        <label>Tytuł</label>
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>

      <div>
        <label>Year</label>
        <input
          type="text"
          value={year}
          onChange={(event) => setYear(event.target.value)}
          placeholder="np. 1999"
        />
      </div>

      <div>
        <label>Director (legacy)</label>
        <input
          type="text"
          value={director}
          onChange={(event) => setDirector(event.target.value)}
        />
      </div>

      <div>
        <label>Description</label>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>

      <button>{props.buttonLabel || "Submit"}</button>
    </form>
  );
}


// import {useState} from "react";
//
// export default function MovieForm(props) {
//     const [title, setTitle] = useState('');
//     const [year, setYear] = useState('');
//     const [director, setDirector] = useState('');
//     const [description, setDescription] = useState('');
//
//     function addMovie(event) {
//         event.preventDefault();
//         if (title.length < 5) {
//             return alert('Tytuł jest za krótki');
//         }
//         props.onMovieSubmit({title, year, director, description});
//         setTitle('');
//         setYear('');
//         setDirector('');
//         setDescription('');
//     }
//
//     return <form onSubmit={addMovie}>
//         <h2>Add movie</h2>
//         <div>
//             <label>Tytuł</label>
//             <input type="text" value={title} onChange={(event) => setTitle(event.target.value)}/>
//         </div>
//         <div>
//             <label>Year</label>
//             <input type="text" value={year} onChange={(event) => setYear(event.target.value)}/>
//         </div>
//         <div>
//             <label>Director</label>
//             <input type="text" value={director} onChange={(event) => setDirector(event.target.value)}/>
//         </div>
//         <div>
//             <label>Description</label>
//             <textarea value={description} onChange={(event) => setDescription(event.target.value)}/>
//         </div>
//         <button>{props.buttonLabel || 'Submit'}</button>
//     </form>;
// }
