# GPASS

> Webes GPS/navigációs alkalmazás — szakmai vizsgaprojekt

**Oktatási és demonstrációs célra készült, nem éles forgalomra.**

---

## Készítők

- Szebeledi Zoltán
- Miskolczi Levente
- Kiss Dominik

---

## A projektről

A GPASS egy modern, full-stack GPS alkalmazás prototípus. Célunk bemutatni egy valós navigációs rendszer alapjait: pozíció alapú térképes megjelenítés, útvonaltervezés, közösségi funkciók (barátok, klánok), AI asszisztens, valamint marker- és trip-kezelés.

---

## Főbb funkciók

- Bejelentkezés, regisztráció, kijelentkezés (cookie alapú auth)
- Térkép oldal Leaflet alapon, valós pozícióval
- Útvonaltervezés (OSRM), alternatív útvonalak, turn-by-turn navigáció
- Barátok és klánok valós idejű követése a térképen (Socket.io)
- Globális markerek lerakása (rendőr, baleset, útlezárás stb.)
- Trip rögzítés és kezelés
- **AI asszisztens** — menetközben kérdezheted az útvonalról, forgalomról
- Profil beállítások (név, email, jelszó, státusz, térkép preferenciák)
- Dark/light téma, mobil + desktop reszponzív UI
- Admin panel (WPF) felhasználók és tartalmak kezeléséhez

---

## AI asszisztens

A GPASS beépített AI asszisztenssel rendelkezik, amely a térkép oldalon érhető el.

**Mire képes:**
- Útvonallal kapcsolatos kérdések megválaszolása menetközben
- Forgalmi helyzet értékelése
- Navigációs tanácsok adása

**Bekapcsolás / kikapcsolás:**  
Profil → Beállítások → Térkép → *AI asszisztens engedélyezése* kapcsoló

**Fejlesztő:** Kiss Dominik

---

## Tech stack

| Réteg | Technológia |
|---|---|
| Frontend | React 19 + TypeScript, Vite, TanStack Router/Query, Tailwind CSS 4, shadcn/ui, Leaflet |
| Backend | Node.js + Express, Sequelize + MySQL, JWT + cookie auth, Socket.io |
| Admin | WPF (.NET) |
| API docs | Swagger — `/api-docs`, `/api/openapi.json` |
| Tesztek | Jest + Supertest |

---

## Struktúra

```
gpass-app/
├── gpass-app-frontend/
├── gpass-app-backend/
├── gpass-app-wpf/
├── docker-compose.yml
├── start.bat
└── README.md
```

---

## Setup & futtatás

### Előfeltételek

- [XAMPP](https://www.apachefriends.org/) telepítve (Apache + MySQL)
- [Node.js](https://nodejs.org/) telepítve
- `gpass_db` adatbázis létrehozva phpMyAdmin-ban vagy MySQL CLI-ben:

```sql
CREATE DATABASE gpass_db;
```

---

### Gyors indítás (ajánlott)

A repo gyökerében lévő `start.bat` egyszerre elindítja az Apache-ot, MySQL-t, a backendet és a frontendet:

```
start.bat
```

> Ha valami nem indul el, kézzel is futtatható az alábbiak szerint.

---

### Backend (kézi)

```bash
cd gpass-app-backend
npm install
npm start
```

Szükséges: XAMPP fusson (Apache + MySQL), `gpass_db` adatbázis létezzen.  
Backend alapértelmezett portja: **8000**

Környezeti változók (`.env` fájl a backend mappában):

```
PORT=
DB_HOST=
DB_NAME=gpass_db
DB_USER=
DB_PASSWORD=
DB_DIALECT=mysql
JWT_SECRET=
MAIL_USER=
MAIL_PASS=
NODE_ENV=
```

---

### Frontend (kézi)

```bash
cd gpass-app-frontend
npm install
npm run dev          # fejlesztői szerver
```

```bash
npm run build        # production build
npm run preview      # build előnézet
```

Frontend dev szerver: **http://localhost:3000**

---

### Admin panel (WPF)

**1. lehetőség — Visual Studio:**  
Nyisd meg a `.sln` fájlt a `gpass-app-wpf` mappából, majd futtasd.

**2. lehetőség — Telepítő:**
```
gpass-app-wpf/setup.exe
```
Telepítés után az alkalmazás közvetlenül futtatható.

---

## Tesztek

### Backend

```bash
cd gpass-app-backend
npm test
npm run test:coverage
```

---

## API dokumentáció

A backend futása közben elérhető:

- Swagger UI: `http://localhost:8000/api-docs`
- OpenAPI JSON: `http://localhost:8000/api/openapi.json`

---

> Ez a repository iskolai/szakmai vizsgaprojekt célra készült. A hangsúly a fejlesztési folyamaton, architektúrán és a funkcionális prototípuson van.
