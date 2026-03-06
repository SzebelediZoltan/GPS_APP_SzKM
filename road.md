# GPASS – Fejlesztési Roadmap

## Technikai kontextus amit tudni kell
- **Frontend:** React + TypeScript, TanStack Router, Tailwind + shadcn/ui, Leaflet + `leaflet-rotate`, react-leaflet v5
- **Backend:** Express.js + Sequelize, Socket.io (még nincs implementálva)
- **Térkép:** `MapView.tsx` a fő komponens, `MapController` belső komponens kezeli a bearing/lock logikát
- **Navigáció state:** `NavigationContext` – módok: `idle | preview | navigating`
- **Geocoding:** Nominatim (OpenStreetMap), routing: OSRM
- **Heading lock logika:** `bearing = 359 - heading` → térkép forog, kúp fix 0 fokon. Lock ki → bearing=0, kúp forog heading szerint
- **Mobile detektálás:** `useIsMobile.ts` hook – `navigator.maxTouchPoints > 0`

---

## 1. Turn-by-Turn Navigáció
**Mi kell hozzá:**
- `NavigationContext` bővítés: aktuális step index, következő manőver tárolása
- `useNavigation` hook bővítés: `currentStep`, `nextManeuver`, `distanceToNext`
- OSRM már visszaadja a step-eket és manőver típusokat a route response-ban (pl. `turn-left`, `turn-right`, `roundabout`) – ezeket csak fel kell dolgozni
- **Új komponens:** `TurnByTurnPanel.tsx` – navigáció közbeni HUD (felső sáv): következő manőver ikonja + utca neve + távolság, alul: összes hátralévő idő/km
- **Hang:** Web Speech API (`speechSynthesis`) – magyarul felolvas pl. "200 méter múlva fordulj balra"
- **Útvonalról lelépés detektálás:** pozíció vs. legközelebbi route pont távolság > 30m → újratervezés Nominatim+OSRM-mel
- Navigáció közben **headingLock automatikusan be van kapcsolva**, nem lehet kikapcsolni

**Új fájlok:**
- `src/components/map/TurnByTurnPanel.tsx`
- `src/hooks/useNavigationSteps.ts`
- `src/utils/routeUtils.ts` (legközelebbi pont számítás, manőver ikon mapping)

---

## 2. Live WebSocket – Barátok a térképen
**Mi kell hozzá:**
- **Backend:** Socket.io room (`map-room`), user pozíció broadcast minden watchPosition updatere
- **Új hook:** `useMapSocket.ts` – csatlakozik a sockethez, küldi a saját pozíciót, fogadja a barátokét
- **Új komponens:** `FriendMarkers.tsx` – barátok markereit rendereli a térképen, egyedi avatar-szerű ikonnal
- **Lista panel:** egy gomb ami kinyit egy listát (Sheet) – ki hol van épp, mellé "Útvonaltervezés ide" gomb
- Socket autentikáció: JWT token a handshake-ben (már van auth rendszer)

**Új fájlok:**
- `src/hooks/useMapSocket.ts`
- `src/components/map/FriendMarkers.tsx`
- `src/components/map/FriendsListPanel.tsx`
- Backend: `socket/mapSocket.js`

---

## 3. Klán tagok a térképen
**A 2-es feladattal együtt csinálandó** – ugyanaz az infrastruktúra.

**Extra logika:**
- Deduplikáció: `Set<userID>` – ha valaki barát ÉS klán tag, csak egyszer jelenik meg a térképen
- Popup-ban mindkét kapcsolat feltüntetve: "Barátod · Kovács Klán tagja"
- Ha valaki csak klán tag (nem barát), más színű/stílusú marker
- "Útvonaltervezés ide" gomb a popupban mindkét típusú markernél

---

## 4. Globális Markerek
**Már megvan backenden:** `getMarkersInBox(minLat, maxLat, minLng, maxLng)` a `MarkerRepository`-ban és `MarkerService`-ben – csak frontend kell.

**Mi kell hozzá:**
- **Új hook:** `useMapBounds.ts` – figyeli a térkép mozgását (`moveend` event), debounce-al lekéri a látható területen lévő markereket
- **Új komponens:** `MarkerLayer.tsx` – markereket rendereli típus szerint (rendőr, útlezárás, veszély stb.)
- **Közel lévő marker popup:** ha a user közelebb kerül mint ~50m egy markerhez, automatikus toast/popup jelenik meg megerősítésre
- **"Nem vagyok sofőr" toggle:** a mapPage-en egy gomb, ami letiltja a marker lerakást – állapot localStorage-ban tárolva, session között megmarad
- Marker lerakás: hosszú érintés (longpress) a térképen → típus választó sheet → backend POST

**Új fájlok:**
- `src/hooks/useMapBounds.ts`
- `src/hooks/useNearbyMarkers.ts`
- `src/components/map/MarkerLayer.tsx`
- `src/components/map/MarkerPlacementSheet.tsx`

---

## Sorrend javaslat
1. **Markerek** (4) – backend már kész, gyors win
2. **Turn-by-turn** (1) – legnagyobb érték mobilon
3. **WebSocket barátok + klánok** (2+3) – egyszerre, ugyanaz az infrastruktúra

---

## Jelenlegi fájlstruktúra (map komponensek)
```
src/
  components/map/
    MapView.tsx          – fő térkép komponens + MapController
    LocateButton.tsx     – recenter + heading lock gomb
    NavigationPanel.tsx  – útvonaltervezés panel (desktop + mobile sheet)
    NavigationPreviewPanel.tsx – útvonal előnézet + indulás/mentés
    RouteLayer.tsx       – útvonal polyline + fitBounds
  hooks/
    useGeolocation.ts    – GPS pozíció + DeviceOrientation heading
    useIsMobile.ts       – touch device detektálás
    useRouting.ts        – OSRM route planning
  context/
    NavigationContext.tsx – idle | preview | navigating state
```