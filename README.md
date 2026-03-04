# GPASS

Webes GPS/Navigacios alkalmazas szakmai vizsgaprojektkent.

A projekt oktatasi es demonstracios celra keszult, nem eles forgalomra.
Fokusz: terkepes navigacio, felhasznaloi rendszer, kozossegi funkciok (baratok, klanok), valamint marker/trip alapok.

## Keszitok

- Szebeledi Zoltan
- Miskolczi Levente
- Kiss Dominik

## Projekt cel

A GPASS celja, hogy egy modern, jol strukturalt full-stack alkalmazasban mutassa be egy GPS app alapjait:

- pozicio alapu terkepes megjelenites
- utvonaltervezes es utvonal-elozet
- hitelesites es session kezeles
- kozossegi funkciok (baratok, klanok)
- marker/trip API-k alapjai

## Fobb funkciok (jelenlegi allapot)

- bejelentkezes, regisztracio, kijelentkezes
- cookie alapu auth status kezeles
- profil, baratok, klan oldalak
- map oldal Leaflet alapon
- utvonaltervezes (OSRM), alternativ utvonalak kezelese
- dark/light tema
- mobil + desktop reszponziv UI
- komponens alapu frontend shadcn/ui + Tailwind stilussal

## Tervben levo funkciok

- live baratok megjelenitese a terkepen
- Waze-szeru marker lerakas (veszely, ellenorzes, stb.)
- valos ideju terkepes interakciok tovabbi bovitese

## Technologiai stack

### Frontend (`gpass-app-frontend`)

- React 19 + TypeScript
- Vite
- TanStack Router (file-based routing)
- TanStack Query
- Tailwind CSS 4
- shadcn/ui
- Leaflet + React Leaflet

### Backend (`gpass-app-backend`)

- Node.js + Express
- Sequelize + MySQL
- JWT + cookie alapu hitelesites
- Swagger/OpenAPI (`/api-docs`, `/api/openapi.json`)
- Jest + Supertest tesztek

### Egyeb

- `gpass-app-wpf`: kulon WPF kliens/prototipus mappa
- Docker Compose konfiguracio deploy celra

## Monorepo struktura

```text
gpass-app/
|- gpass-app-frontend/
|- gpass-app-backend/
|- gpass-app-wpf/
|- docker-compose.yml
|- start.bat
`- README.md
```

## Lokal futtatas (ajanlott dev)

### 1) Backend

```bash
cd gpass-app-backend
npm install
npm start
```

Alapertelmezett port a kod alapjan: `8000` (ha a `.env` maskent nem allitja).

### 2) Frontend

```bash
cd gpass-app-frontend
npm install
npm run dev
```

Frontend dev szerver: `http://localhost:3000`

## Tesztek es build

### Frontend

```bash
cd gpass-app-frontend
npm run test
npm run build
```

### Backend

```bash
cd gpass-app-backend
npm test
npm run test:coverage
```

## Kornyezeti valtozok (backend)

A backend `.env` fajlbol olvas. A kod alapjan ezek kulcsfontossaguak:

- `PORT`
- `DB_HOST`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `DB_DIALECT`
- `JWT_SECRET`
- `MAIL_USER`
- `MAIL_PASS`
- `NODE_ENV`

## Megjegyzes a projektrol

Ez a repository iskolai/szakmai vizsgaprojekt celra keszult. A hangsuly a fejlesztesi folyamaton, architekturan es a funkcionalis prototipuson van.
