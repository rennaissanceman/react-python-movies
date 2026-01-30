# 🎬 React Python Movies Fullstack App

Fullstackowa aplikacja webowa do zarządzania filmami i aktorami  
(React + FastAPI + SQLite), wdrożona w chmurze za pomocą Dockera i Render

---

## ▶️ Uruchomienie lokalne (opcjonalnie)
### Backend (FastAPI – tryb developerski)

cd api
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
fastapi dev main.py

### Frontend (React – dev server)
cd ui
npm install
npm start


## 🚀 Live demo

👉 https://react-python-movies-1zhm.onrender.com

---

## ✨ Funkcjonalności

### 🎥 Filmy
- dodawanie filmów (tytuł, rok, opis)
- usuwanie filmów
- edycja danych filmu
- wyszukiwanie filmów po tytule / roku

### 🎭 Aktorzy (Many-to-Many)
- dodawanie i usuwanie aktorów
- przypisywanie wielu aktorów do jednego filmu
- usuwanie aktora z obsady filmu
- relacja wiele-do-wielu (movies ↔ actors)

### 🧑‍💻 UX / UI
- powiadomienia toast (sukces / błąd)
- potwierdzenie przed usunięciem danych
- animacje ładowania (spinner)
- animacje UI (fade-in)
- responsywny panel administracyjny

---

## 🛠️ Technologie

### Backend
- Python 3.9
- FastAPI
- SQLite
- Pydantic
- Uvicorn

### Frontend
- React
- JavaScript (Hooks)
- CSS (custom dashboard UI)

### DevOps / Deploy
- Docker (multi-stage build)
- Render (Web Service)
- GitHub

---

## 🔌 API (przykłady)

- `GET /movies` – lista filmów
- `POST /movies` – dodanie filmu
- `PUT /movies/{id}` – edycja filmu
- `DELETE /movies/{id}` – usunięcie filmu

- `GET /actors` – lista aktorów
- `POST /actors` – dodanie aktora
- `DELETE /actors/{id}` – usunięcie aktora

- `POST /movies/{movie_id}/actors/{actor_id}` – przypisanie aktora
- `DELETE /movies/{movie_id}/actors/{actor_id}` – odpięcie aktora




[//]: # (----------------------------------------------------------------------------------------------------------)

[//]: # (old version)

[//]: # (# Getting Started with Create React App)

[//]: # ()
[//]: # (This project was bootstrapped with [Create React App]&#40;https://github.com/facebook/create-react-app&#41;.)

[//]: # ()
[//]: # (## Available Scripts)

[//]: # ()
[//]: # (In the project directory, you can run:)

[//]: # ()
[//]: # (### `npm start`)

[//]: # ()
[//]: # (Runs the app in the development mode.\)

[//]: # (Open [http://localhost:3000]&#40;http://localhost:3000&#41; to view it in your browser.)

[//]: # ()
[//]: # (The page will reload when you make changes.\)

[//]: # (You may also see any lint errors in the console.)

[//]: # ()
[//]: # (### `npm test`)

[//]: # ()
[//]: # (Launches the test runner in the interactive watch mode.\)

[//]: # (See the section about [running tests]&#40;https://facebook.github.io/create-react-app/docs/running-tests&#41; for more information.)

[//]: # ()
[//]: # (### `npm run build`)

[//]: # ()
[//]: # (Builds the app for production to the `build` folder.\)

[//]: # (It correctly bundles React in production mode and optimizes the build for the best performance.)

[//]: # ()
[//]: # (The build is minified and the filenames include the hashes.\)

[//]: # (Your app is ready to be deployed!)

[//]: # ()
[//]: # (See the section about [deployment]&#40;https://facebook.github.io/create-react-app/docs/deployment&#41; for more information.)

[//]: # ()
[//]: # (### `npm run eject`)

[//]: # ()
[//]: # (**Note: this is a one-way operation. Once you `eject`, you can't go back!**)

[//]: # ()
[//]: # (If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.)

[//]: # ()
[//]: # (Instead, it will copy all the configuration files and the transitive dependencies &#40;webpack, Babel, ESLint, etc.&#41; right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.)

[//]: # ()
[//]: # (You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.)

[//]: # ()
[//]: # (## Learn More)

[//]: # ()
[//]: # (You can learn more in the [Create React App documentation]&#40;https://facebook.github.io/create-react-app/docs/getting-started&#41;.)

[//]: # ()
[//]: # (To learn React, check out the [React documentation]&#40;https://reactjs.org/&#41;.)

[//]: # ()
[//]: # (### Code Splitting)

[//]: # ()
[//]: # (This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting]&#40;https://facebook.github.io/create-react-app/docs/code-splitting&#41;)

[//]: # ()
[//]: # (### Analyzing the Bundle Size)

[//]: # ()
[//]: # (This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size]&#40;https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size&#41;)

[//]: # ()
[//]: # (### Making a Progressive Web App)

[//]: # ()
[//]: # (This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app]&#40;https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app&#41;)

[//]: # ()
[//]: # (### Advanced Configuration)

[//]: # ()
[//]: # (This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration]&#40;https://facebook.github.io/create-react-app/docs/advanced-configuration&#41;)

[//]: # ()
[//]: # (### Deployment)

[//]: # ()
[//]: # (This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment]&#40;https://facebook.github.io/create-react-app/docs/deployment&#41;)

[//]: # ()
[//]: # (### `npm run build` fails to minify)

[//]: # ()
[//]: # (This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify]&#40;https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify&#41;)
