# 🚗📍 GPS_APP_SzKM

Egy **modern, webalapú GPS alkalmazás**, amelynek célja egy valós életben is elképzelhető navigációs rendszer működésének bemutatása.  
A projekt **tanulmányi / vizsgafeladat** keretében készült, elsősorban oktatási és demonstrációs céllal.

---

## 👥 Készítők

- **Szebeledi Zoltán**
- **Miskolczi Levente**
- **Kiss Dominik**

---

## 🎯 A projekt célja

A GPS_APP_SzKM célja egy olyan alkalmazás megvalósítása, amely:
- bemutatja egy **GPS-alapú navigációs rendszer** alapvető működését,
- modern frontend és backend technológiákat használ,
- jól strukturált, átlátható kódbázissal rendelkezik,
- megfelel egy **informatikai vizsga** szakmai elvárásainak.

A projekt **nem éles használatra** készült, hanem tanulási és értékelési célokat szolgál.

---

## 🧭 Fő funkciók

- 📍 **Felhasználó azonosítása (login / logout)**
- 🔐 **Session-alapú hitelesítés cookie segítségével**
- 🗺️ **Navigációs felület (térkép alapú megjelenítés – fejlesztés alatt)**
- 👤 **Felhasználói állapot globális kezelése**
- 🌙 **Világos / sötét téma váltás**
- 📱 **Reszponzív megjelenés (mobil + desktop)**
- ⚡ **Betöltési állapotok, animációk**
- 🧩 **Komponens-alapú felépítés**

---

## 🛠️ Felhasznált technológiák

### Frontend
- ⚛️ **React + TypeScript**
- ⚡ **Vite**
- 🧭 **TanStack Router (file-based routing)**
- 🔄 **TanStack Query (React Query)**
- 🎨 **Tailwind CSS**
- 🧩 **shadcn/ui**
- 🌗 Saját **ThemeProvider** (dark / light mode)

### Backend
- 🟢 **Node.js**
- 🚀 **Express**
- 🔐 **Cookie-alapú autentikáció**
- 🧾 REST API

---

## 🧠 Architektúra – röviden

- A frontend és backend **elkülönülten** működik
- A felhasználói állapot (`User`) globálisan elérhető **React Query cache-en keresztül**
- A bejelentkezési állapotot a backend egy **HTTP-only cookie-ban** tárolja
- Oldalak védelme **route-szinten** történik
- A témakezelés **globális React Context** segítségével valósul meg

---

## 🔐 Hitelesítés logikája

- Bejelentkezés után a backend cookie-t állít be
- Az alkalmazás indulásakor az API `/auth/status` végpontja visszaadja:
  - a felhasználó adatait (ha be van jelentkezve)
  - vagy `null`-t (ha nincs aktív session)
- Kijelentkezéskor:
  - a cookie törlésre kerül
  - a kliens oldalon a cache azonnal frissül
