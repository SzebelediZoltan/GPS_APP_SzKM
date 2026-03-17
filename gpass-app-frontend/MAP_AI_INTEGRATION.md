# 🗺️ AI POI Search - Térkép Integráció

## Áttekintés

Az AI POI Search egy teljes megoldás helykereséshez a térképen:

1. **Város kiválasztása** - Nominatim geocoding
2. **AI ajánlások** - Gemini POI suggesrions
3. **Geolokalizálás** - Nominatim geocoding az eredményekhez
4. **Megjelenítés** - Marker és popup az eredményekhez

---

## 🏗️ Komponensek

### Hook: `useAIPOISearch`

```typescript
const {
  step,              // 'idle' | 'city-search' | 'ai-search' | 'location-search' | 'complete' | 'error'
  selectedCity,      // { name: string; lat: number; lng: number } | null
  selectedCategory,  // 'restaurant' | 'entertainment' | 'attraction' | null
  results,           // POIResult[]
  loading,           // boolean
  error,             // Error | null
  searchCity,        // (cityName: string) => Promise<void>
  selectCity,        // (city: { name; lat; lng }) => void
  selectCategory,    // (category: POICategory) => void
  searchPOIs,        // () => Promise<void>
  reset,             // () => void
} = useAIPOISearch()
```

### Komponens: `AIPOISearchButton`

Térkép tetejére helyezett gomb + dialog:

```tsx
<AIPOISearchButton 
  onSelectPOIs={(pois, cityName) => {
    // Handle selected POIs
  }}
  mapRef={mapRef}
/>
```

**Props:**
- `onSelectPOIs: (pois: POIResult[], city: string) => void` - Callback az eredmények kiválasztásához
- `mapRef?: React.RefObject<any>` - Opcionális térkép ref

### Komponens: `POIMarkers`

Marker és popup renderelés az eredményekhez:

```tsx
<POIMarkers 
  pois={poiResults}
  onMarkerClick={(poi) => {
    // Handle marker click
  }}
/>
```

---

## 📋 Tipos

```typescript
type POICategory = 'restaurant' | 'entertainment' | 'attraction'

type POIResult = {
  name: string
  address: string
  lat: number
  lng: number
  category: POICategory
  description?: string
}

type SearchStep = 'idle' | 'city-search' | 'ai-search' | 'location-search' | 'complete' | 'error'
```

---

## 🚀 Használati Mód

### MapView-ben (Már integrálva)

```tsx
import AIPOISearchButton, { POIMarkers } from './AIPOISearch'
import { useAIPOISearch } from '@/hooks/map/useAIPOISearch'

export default function MapView() {
  const [poiMarkers, setPOIMarkers] = useState<POIResult[]>([])

  return (
    <MapContainer>
      {/* ... other components ... */}
      
      <AIPOISearchButton 
        onSelectPOIs={(pois) => setPOIMarkers(pois)}
        mapRef={mapRef}
      />
      
      <POIMarkers pois={poiMarkers} />
    </MapContainer>
  )
}
```

---

## 🔄 Munkafolyamat

1. **User kattint** az "AI Keresés" gombra
2. **Input város nevet** (pl. Budapest)
3. **Nominatim** geocodeolja a várost
4. **User kiválassza** a kategóriát (étterem, szórakozás, látnivaló)
5. **Gemini AI** javasol 5 POI-t az adott kategóriában
6. **Nominatim** geocodeolja az összes POI-t
7. **Marker-ek** megjelennek a térképen
8. **User** kattinthat a markerekre a részletekért

---

## 🎯 Kategóriák

| Kategória | Emoji | Leírás |
|-----------|-------|--------|
| restaurant | 🍴 | Éttermi javaslatok |
| entertainment | 🎭 | Szórakoztató helyek |
| attraction | 🏛️ | Látnivalók, szobrok |

---

## 🔌 API-k Használata

### 1. Nominatim Search (Város)
```
GET https://nominatim.openstreetmap.org/search
  ?format=json
  &q={városnév}
  &limit=5
  &addressdetails=0
  &Accept-Language=hu
```

**Response:**
```json
[
  {
    "place_id": 123,
    "display_name": "Budapest, Magyarország",
    "lat": "47.4979",
    "lon": "19.0402"
  }
]
```

### 2. Gemini AI (POI Suggestions)
```
prompt: "A {város} városban keress meg 5 legjobb {kategória}. 
Válaszd meg a következő JSON formátumban..."
```

**Response:**
```json
[
  {
    "name": "Noma",
    "address": "Reykjavík 101, Izland",
    "description": "Világ legjobb étterme"
  }
]
```

### 3. Nominatim Search (POI-k)
Same as város search, de az `address` string-et keressük

---

## 🛡️ Hibakezelés

### Nincs város találata
```
"Nem találtam város: 'XYZ'"
```
→ User javíthatja a város nevet

### AI hibás JSON-t adott
```
"Nem lehetett feldolgozni az AI választ"
```
→ Automatikus retry

### Geolokalizálás sikertelen
```
"Nem sikerült a helyeket megtalálni"
```
→ Az adott POI nem található az OSM-ben

---

## ⚡ Teljesítmény

- **Város keresés**: ~200ms
- **AI ajánlások**: ~2-5s
- **Geolokalizálás**: ~1-2s per POI
- **Teljes munkafolyamat**: ~4-10s

---

## 🎨 Stílus

### Marker Színek
- 🔴 **Étterem**: `#ef4444` (red)
- 🟠 **Szórakozás**: `#f59e0b` (amber)
- 🔵 **Látnivaló**: `#3b82f6` (blue)

### UI Komponensek
- Button: `from-primary to-primary/80` gradient
- Dialog: GPASS design tokenek
- Cards: Dengan border és hover effect

---

## 🔍 Debug Tippek

### Console Logging

```typescript
const { step, selectedCity, results, loading, error } = useAIPOISearch()

useEffect(() => {
  console.log('Step:', step)
  console.log('City:', selectedCity)
  console.log('Results:', results)
  console.log('Loading:', loading)
  console.log('Error:', error)
}, [step, selectedCity, results, loading, error])
```

### Network Tab (DevTools)
- Nominatim requestek: `nominatim.openstreetmap.org`
- Gemini requestek: `api.anthropic.com`

---

## 🚀 Jövő Fejlesztések

1. **Streaming válaszok** - Valós idejű AI ajánlások
2. **Felhasználó értékelések** - OSM user reviews
3. **Nyitvatartás** - Google Places API
4. **Érkezési idő** - OSRM routing
5. **Közösségi szűrés** - User-generated categories
6. **Cached POIs** - Offline support

---

## ❓ GYIK

### Q: Miért kell a város neve az address-ben?
A: Nominatim pontosabb kereséshez.

### Q: Lehet több város?
A: Jelenleg egy város keresés egy alkalommal. Jövőben kiterjeszthető.

### Q: Offline működés?
A: Nem - API-k szükségesek. Cache implementálható.

### Q: API korlát?
A: Nominatim: 1 req/s, Gemini: rate limited

---

**Kész az integrációd! 🎉**
