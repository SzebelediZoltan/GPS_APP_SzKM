import { useRef, useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Circle, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import {
  useAIPOISearch,
  type POIMainCategory, type POISubCategory, type POIResult,
} from '@/hooks/map/useAIPOISearch'
import { useNominatimSearch, useRouting, type NominatimResult } from '@/hooks/map/useRouting'
import { useNavigation } from '@/context/NavigationContext'
import { Input } from '@/components/ui/input'
import {
  Sparkles, AlertCircle, X, ChevronRight, Loader2,
  MapPin, Route, Clock, Phone, Fuel, CreditCard,
  Pill, UtensilsCrossed, ShoppingCart, Music2, Landmark,
  Hotel, Mail, ChevronDown, ChevronUp, Navigation,
} from 'lucide-react'
import { toast } from 'sonner'

// ─── Kategória definíciók ─────────────────────────────────────────────────

type SubDef = { id: POISubCategory; label: string }
type CatDef = { id: POIMainCategory; label: string; icon: typeof Fuel; subs?: SubDef[] }

const CATEGORIES: CatDef[] = [
  { id: 'fuel', label: 'Benzinkút', icon: Fuel,
    subs: [{ id: 'fuel_station', label: 'Benzinkút' }, { id: 'ev_charger', label: 'Töltőállomás' }] },
  { id: 'atm', label: 'ATM / Bank', icon: CreditCard,
    subs: [{ id: 'atm_otp', label: 'OTP' }, { id: 'atm_kh', label: 'K&H' }, { id: null, label: 'Egyéb' }] },
  { id: 'pharmacy', label: 'Gyógyszertár', icon: Pill },
  { id: 'restaurant', label: 'Étterem', icon: UtensilsCrossed,
    subs: [{ id: 'fast_food', label: 'Gyorsétterem' }, { id: 'confectionery', label: 'Cukrászda' }, { id: 'sit_down', label: 'Rendes étterem' }] },
  { id: 'shop', label: 'Bolt', icon: ShoppingCart,
    subs: [{ id: 'grocery', label: 'Élelmiszer' }, { id: 'drugstore', label: 'Drogéria' }, { id: 'home_garden', label: 'Otthon & kert' }, { id: null, label: 'Egyéb' }] },
  { id: 'entertainment', label: 'Szórakozás', icon: Music2 },
  { id: 'attraction', label: 'Látnivaló', icon: Landmark },
  { id: 'accommodation', label: 'Szállás', icon: Hotel },
  { id: 'post', label: 'Posta', icon: Mail },
]

// ─── Autocomplete ─────────────────────────────────────────────────────────

function useAutocomplete() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([])
  const { search, searching } = useNominatimSearch()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (query.trim().length < 2) { setSuggestions([]); return }
    debounceRef.current = setTimeout(async () => setSuggestions(await search(query)), 400)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query, search])

  return { query, setQuery, suggestions, searching, reset: () => { setQuery(''); setSuggestions([]) } }
}

// ─── Keresési kör a térképen (react-leaflet) ──────────────────────────────

export function SearchRadiusCircle({ center, radiusKm }: {
  center: { lat: number; lng: number }
  radiusKm: number
}) {
  const map = useMap()
  useEffect(() => {
    // Igazítjuk a nézetet hogy a teljes kör látható legyen
    const radiusM = radiusKm * 1000
    const bounds = L.latLng(center.lat, center.lng).toBounds(radiusM * 2.4)
    // Extra bottom padding a menü felett: mobil ~420px panel magasság
    const isMobile = window.innerWidth < 768
    map.flyToBounds(bounds, { duration: 0.8, paddingTopLeft: [20, 20], paddingBottomRight: [20, isMobile ? 440 : 20] })
  }, [center.lat, center.lng, radiusKm])

  return (
    <Circle
      center={[center.lat, center.lng]}
      radius={radiusKm * 1000}
      pathOptions={{
        color: 'var(--color-primary, #3b82f6)',
        fillColor: 'var(--color-primary, #3b82f6)',
        fillOpacity: 0.08,
        weight: 2,
        dashArray: '6 4',
      }}
    />
  )
}

// ─── Csúszka ──────────────────────────────────────────────────────────────

function DistanceSlider({ value, onChange, disabled }: {
  value: number; onChange: (v: number) => void; disabled?: boolean
}) {
  const pct = ((value - 1) / 29) * 100
  return (
    <div className="space-y-1">
      <input
        type="range" min={1} max={30} step={1}
        value={value} disabled={disabled}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer disabled:opacity-50"
        style={{ background: `linear-gradient(to right, var(--color-primary,#3b82f6) ${pct}%, var(--color-border,#e5e7eb) ${pct}%)` }}
      />
      <div className="flex justify-between text-[9px] text-muted-foreground">
        <span>1 km</span><span>30 km</span>
      </div>
    </div>
  )
}

// ─── Összecsukható szekció ─────────────────────────────────────────────────

function CollapsibleSection({ label, badge, children, defaultOpen = true }: {
  label: string
  badge?: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="space-y-0">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between py-1.5 group"
      >
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
            {label}
          </span>
          {badge && (
            <span className="text-[10px] font-semibold text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded-full leading-none">
              {badge}
            </span>
          )}
        </div>
        <span className={`transition-transform duration-200 text-muted-foreground group-hover:text-foreground ${open ? 'rotate-0' : '-rotate-90'}`}>
          <ChevronDown className="w-3.5 h-3.5" />
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ease-in-out ${
          open ? 'max-h-96 opacity-100 pt-1.5' : 'max-h-0 opacity-0'
        }`}
      >
        {children}
      </div>
    </div>
  )
}

// ─── Panel loader ─────────────────────────────────────────────────────────

function PanelLoader({ step }: { step: string }) {
  const label =
    step === 'city-search'     ? 'Város keresése...'
    : step === 'overpass-search' ? 'Helyek lekérése (OSM)...'
    : step === 'ai-rank'         ? 'AI rangsorolás...'
    : 'Keresés...'
  const sub =
    step === 'overpass-search' ? 'OpenStreetMap adatok letöltése'
    : step === 'ai-rank'       ? 'Gemini szűri és rangsorolja a helyeket'
    : ''
  return (
    <div className="flex flex-col items-center gap-3 py-7">
      <div className="relative w-11 h-11">
        <div className="absolute inset-0 rounded-full border-[3px] border-primary/20" />
        <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-primary animate-spin" />
        <div className="absolute inset-2 rounded-full bg-primary/10 flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        {sub && <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

// ─── Részlet modal ────────────────────────────────────────────────────────

function POIDetailModal({ poi, idx, onClose, onRoute }: {
  poi: POIResult; idx: number; onClose: () => void; onRoute: () => void
}) {
  return createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 99999 }}
      className="flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]"
      onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in fade-in-0 slide-in-from-bottom-4 duration-200"
        onClick={e => e.stopPropagation()}>
        <div className="p-5 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold flex-shrink-0">{idx + 1}</div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base text-foreground leading-snug">{poi.name}</h3>
              {poi.brand && poi.brand !== poi.name && <p className="text-xs text-muted-foreground">{poi.brand}</p>}
              {poi.address && <p className="text-xs text-muted-foreground mt-0.5">{poi.address}</p>}
            </div>
            <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex-shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
          {poi.description && <p className="text-sm text-foreground/80 leading-relaxed">{poi.description}</p>}
          <div className="space-y-2">
            <div className="flex items-start gap-2 rounded-lg bg-muted/40 px-3 py-2.5">
              <Clock className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-0.5">Nyitvatartás</p>
                <p className="text-sm text-foreground">
                  {poi.openingHours ? (poi.openingHours === '24/7' ? 'Éjjel-nappal nyitva' : poi.openingHours) : 'Nem tudni'}
                </p>
              </div>
            </div>
            {poi.phone && (
              <div className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2.5">
                <Phone className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-0.5">Telefon</p>
                  <p className="text-sm text-foreground">{poi.phone}</p>
                </div>
              </div>
            )}
          </div>
          <button onClick={onRoute}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground py-2.5 text-sm font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all">
            <Route className="w-4 h-4" />Útvonaltervezés
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

// ─── POI kártya a listában ────────────────────────────────────────────────

function POICard({ poi, idx, onFlyTo, onShowDetail, onRoute }: {
  poi: POIResult; idx: number
  onFlyTo: () => void; onShowDetail: () => void; onRoute: () => void
}) {
  return (
    <div className="flex items-start gap-2.5 px-3 py-2.5 hover:bg-muted/40 transition-colors border-b border-border/40 last:border-0 group">
      <button onClick={onFlyTo}
        className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-[11px] font-bold flex-shrink-0 mt-0.5 hover:scale-110 transition-transform">
        {idx + 1}
      </button>
      <button onClick={onShowDetail} className="flex-1 min-w-0 text-left">
        <p className="text-sm font-semibold text-foreground truncate hover:text-primary transition-colors">{poi.name}</p>
        {poi.brand && poi.brand !== poi.name && <p className="text-[10px] text-muted-foreground/70 truncate">{poi.brand}</p>}
        {poi.address && <p className="text-[11px] text-muted-foreground truncate">{poi.address}</p>}
        <span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground mt-0.5">
          <Clock className="w-2.5 h-2.5" />
          {poi.openingHours ? (poi.openingHours === '24/7' ? 'Éjjel-nappal' : poi.openingHours) : 'Nem tudni'}
        </span>
      </button>
      {/* Útvonal gomb – jól látható */}
      <button
        onClick={onRoute}
        title="Útvonaltervezés"
        className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary border border-primary/30 hover:border-primary text-[11px] font-semibold transition-all mt-0.5"
      >
        <Route className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Útvonal</span>
      </button>
    </div>
  )
}

// ─── Jobb alsó overlay lista ──────────────────────────────────────────────

function POIListOverlay({ pois, mapRef, userPosition, onClear }: {
  pois: POIResult[]
  mapRef?: React.RefObject<L.Map | null>
  userPosition: { lat: number; lng: number }
  onClear: () => void
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [detailPOI, setDetailPOI] = useState<{ poi: POIResult; idx: number } | null>(null)
  const { planRoute } = useRouting()
  const { setPreview } = useNavigation()

  const handleRoute = useCallback(async (poi: POIResult) => {
    setDetailPOI(null)
    try {
      const routes = await planRoute({ start: userPosition, end: { lat: poi.lat, lng: poi.lng } })
      if (routes.length > 0) { setPreview(routes); toast.success(`Útvonal: ${poi.name}`) }
      else toast.error('Nem sikerült útvonalat tervezni')
    } catch { toast.error('Útvonaltervezési hiba') }
  }, [userPosition, planRoute, setPreview])

  if (pois.length === 0) return null

  return (
    <>
      {createPortal(
        <div style={{ position: 'fixed', bottom: '5.5rem', right: '1rem', zIndex: 9990, width: 'min(20rem, calc(100vw - 2rem))' }}
          className="pointer-events-auto">
          <div className="rounded-xl border border-border bg-card/95 backdrop-blur shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-border/60 bg-muted/30">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-semibold text-foreground">{pois.length} találat</span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setCollapsed(v => !v)}
                  className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  {collapsed ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
                <button onClick={onClear}
                  className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
            {!collapsed && (
              <div className="max-h-72 overflow-y-auto">
                {pois.map((poi, idx) => (
                  <POICard key={idx} poi={poi} idx={idx}
                    onFlyTo={() => mapRef?.current?.flyTo([poi.lat, poi.lng], 17, { duration: 0.5 })}
                    onShowDetail={() => setDetailPOI({ poi, idx })}
                    onRoute={() => handleRoute(poi)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
      {detailPOI && (
        <POIDetailModal poi={detailPOI.poi} idx={detailPOI.idx}
          onClose={() => setDetailPOI(null)}
          onRoute={() => handleRoute(detailPOI.poi)} />
      )}
    </>
  )
}

// ─── Marker (térkép) ──────────────────────────────────────────────────────

function POIMarkerItem({ poi, idx, isActive, userPosition, onRoute }: {
  poi: POIResult; idx: number; isActive: boolean
  userPosition: { lat: number; lng: number }
  onRoute: (poi: POIResult) => void
}) {
  const map = useMap()
  const icon = L.divIcon({
    className: 'custom-poi-icon',
    html: `<div style="width:32px;height:32px;background:var(--color-primary,#3b82f6);border:${isActive ? '3px solid white;box-shadow:0 0 0 2px var(--color-primary,#3b82f6),0 2px 12px rgba(0,0,0,0.35)' : '2.5px solid white;box-shadow:0 2px 12px rgba(0,0,0,0.25)'};border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:white;cursor:pointer;">${idx + 1}</div>`,
    iconSize: [32, 32], iconAnchor: [16, 16],
  })

  return (
    <Marker position={[poi.lat, poi.lng]} icon={icon}
      eventHandlers={{ click: () => map.flyTo([poi.lat, poi.lng], 17, { duration: 0.5 }) }}>
      <Popup closeButton={false} className="custom-popup">
        <div className="w-64 rounded-xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-[11px] font-bold flex-shrink-0 mt-0.5">{idx + 1}</div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-foreground">{poi.name}</p>
              {poi.brand && poi.brand !== poi.name && <p className="text-[11px] text-muted-foreground">{poi.brand}</p>}
              {poi.address && <p className="text-xs text-muted-foreground mt-0.5">{poi.address}</p>}
              <div className="flex items-center gap-1 mt-1.5 text-[10px] bg-muted px-2 py-1 rounded w-fit">
                <Clock className="w-2.5 h-2.5 text-muted-foreground" />
                <span>{poi.openingHours ? (poi.openingHours === '24/7' ? 'Éjjel-nappal' : poi.openingHours) : 'Nyitvatartás: nem tudni'}</span>
              </div>
              {poi.description && <p className="text-xs text-muted-foreground/70 mt-1.5 italic line-clamp-3">{poi.description}</p>}
            </div>
          </div>
          {poi.phone && <p className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="w-3 h-3" />{poi.phone}</p>}
          {/* Útvonal gomb – jól látható, kiemelve */}
          <button onClick={() => onRoute(poi)}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground py-2.5 text-sm font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all shadow-sm">
            <Route className="w-4 h-4" />Útvonaltervezés
          </button>
        </div>
      </Popup>
    </Marker>
  )
}

export function POIMarkers({ pois, userPosition, activePOI }: {
  pois: POIResult[]
  userPosition: { lat: number; lng: number }
  activePOI?: POIResult | null
}) {
  const { planRoute } = useRouting()
  const { setPreview } = useNavigation()

  const handleRoute = useCallback(async (poi: POIResult) => {
    try {
      const routes = await planRoute({ start: userPosition, end: { lat: poi.lat, lng: poi.lng } })
      if (routes.length > 0) { setPreview(routes); toast.success(`Útvonal: ${poi.name}`) }
      else toast.error('Nem sikerült útvonalat tervezni')
    } catch { toast.error('Útvonaltervezési hiba') }
  }, [userPosition, planRoute, setPreview])

  return (
    <>
      {pois.map((poi, idx) => (
        <POIMarkerItem key={`${poi.lat}-${poi.lng}-${idx}`} poi={poi} idx={idx}
          isActive={activePOI?.lat === poi.lat && activePOI?.lng === poi.lng}
          userPosition={userPosition} onRoute={handleRoute} />
      ))}
    </>
  )
}

// ─── Főkomponens ──────────────────────────────────────────────────────────

interface AIPOISearchButtonProps {
  onSelectPOIs: (pois: POIResult[], city: string) => void
  mapRef?: React.RefObject<L.Map | null>
  userPosition: { lat: number; lng: number }
  searchCenter: { lat: number; lng: number } | null
  onSearchCenterChange: (c: { lat: number; lng: number } | null) => void
  searchRadius: number
  onSearchRadiusChange: (r: number) => void
  navigationActive?: boolean
}

export function AIPOISearchButton({
  onSelectPOIs, mapRef, userPosition,
  searchCenter, onSearchCenterChange, searchRadius, onSearchRadiusChange,
  navigationActive = false,
}: AIPOISearchButtonProps) {
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { query, setQuery, suggestions, searching: acSearching, reset: acReset } = useAutocomplete()
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [nearMe, setNearMe] = useState(false)
  const [overlayPOIs, setOverlayPOIs] = useState<POIResult[]>([])

  const {
    step, selectedCity, filters, results, loading, error,
    searchCity, selectCity, setFilters, searchPOIs, reset,
  } = useAIPOISearch()

  // Csúszka változáskor frissítjük a kör sugarát a térképen
  const handleDistanceChange = (v: number) => {
    setFilters({ maxDistance: v })
    onSearchRadiusChange(v)
  }

  const handleSuggestionSelect = (s: NominatimResult) => {
    const name = s.display_name.split(',')[0]
    const lat = parseFloat(s.lat)
    const lng = parseFloat(s.lon)
    setQuery(name)
    setShowSuggestions(false)
    setNearMe(false)
    selectCity({ name, lat, lng })
    onSearchCenterChange({ lat, lng })
    // Ugrás a városhoz + kör megjelenítése
    mapRef?.current?.flyTo([lat, lng], 12, { duration: 0.8 })
  }

  const handleNearMe = () => {
    setNearMe(true)
    acReset()
    setShowSuggestions(false)
    selectCity({ name: 'A közelemben', lat: userPosition.lat, lng: userPosition.lng })
    onSearchCenterChange({ lat: userPosition.lat, lng: userPosition.lng })
    mapRef?.current?.flyTo([userPosition.lat, userPosition.lng], 13, { duration: 0.8 })
  }

  const handleCityMode = () => {
    setNearMe(false)
    selectCity(null)
    onSearchCenterChange(null)
    acReset()
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const handleClose = () => {
    setOpen(false); reset(); acReset(); setShowSuggestions(false)
    setNearMe(false); onSearchCenterChange(null)
  }

  const [pendingSearch, setPendingSearch] = useState(false)

  const handleSearchClick = () => {
    if (!filters.mainCategory) { toast.error('Válassz kategóriát!'); return }
    if (nearMe) { searchPOIs(); return }
    if (selectedCity) { searchPOIs(); return }
    if (query.trim().length >= 2) {
      setPendingSearch(true)
      searchCity(query.trim())
      return
    }
    toast.error('Add meg a várost!')
  }

  // Ha város feloldódott és van függő keresés → POI keresés indul
  useEffect(() => {
    if (pendingSearch && selectedCity && step === 'idle' && !error) {
      setPendingSearch(false)
      searchPOIs()
    }
  }, [selectedCity, pendingSearch, step, error])

  // Overlay eltűnik ha navigáció/útvonaltervezés aktív
  useEffect(() => {
    if (navigationActive) {
      setOverlayPOIs([])
    }
  }, [navigationActive])

  // Város megtalálása után azonnal keres
  // Keresés csak a gomb lenyomására indul — nincs auto-search

  useEffect(() => {
    if (step === 'complete' && results.length > 0) {
      onSelectPOIs(results, selectedCity?.name || '')
      setOverlayPOIs(results)
      setOpen(false)
      toast.success(`${results.length} hely megtalálva!`)
    }
  }, [step, results])

  useEffect(() => {
    if (selectedCity && !nearMe && inputRef.current) setQuery(selectedCity.name)
  }, [selectedCity])

  const canSearch = !!filters.mainCategory && (nearMe || !!selectedCity || query.trim().length >= 2)
  const activeCat = CATEGORIES.find(c => c.id === filters.mainCategory)

  const panel = (
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 9998 }}
        className={`transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={handleClose} />

      {/* Mobil: alulról csúszik fel. Desktop: jobb felső sarok */}
      <div
        style={{ position: 'fixed', zIndex: 9999 }}
        className={[
          // desktop
          'md:top-[4.5rem] md:right-4 md:bottom-auto md:left-auto md:w-96',
          // mobile: full-width bottom sheet
          'max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:w-full',
          'transition-all duration-300 ease-out',
          open
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4 md:-translate-y-2 pointer-events-none',
        ].join(' ')}
      >
        <div className="md:rounded-xl rounded-t-2xl border border-border bg-card shadow-xl overflow-hidden">
          {/* Drag handle mobil nézetben */}
          <div className="md:hidden flex justify-center pt-2.5 pb-1 bg-card">
            <div className="w-9 h-1 rounded-full bg-border" />
          </div>

          {/* Loading állapot – panelben */}
          {(step === 'city-search' || step === 'overpass-search' || step === 'ai-rank') ? (
            <div className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-sm font-semibold text-foreground">AI Helykereső</span>
              </div>
              <PanelLoader step={step} />
            </div>
          ) : (
            <div className="p-4 space-y-4">

              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">AI Helykereső</span>
                </div>
                <button onClick={handleClose}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Helyszín */}
              <div className="space-y-2">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Helyszín</p>
                <div className="flex gap-2">
                  <button onClick={nearMe ? handleCityMode : handleNearMe}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition-all flex-shrink-0 ${
                      nearMe
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'bg-muted/40 border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
                    }`}>
                    <Navigation className="w-3.5 h-3.5" />
                    {nearMe ? 'Közelemben ✓' : 'Közelemben'}
                  </button>
                  <div className="relative flex-1">
                    <Input ref={inputRef}
                      value={nearMe ? '' : query}
                      onChange={e => { setNearMe(false); setQuery(e.target.value); setShowSuggestions(true); if (selectedCity) { selectCity(null); onSearchCenterChange(null) } }}
                      onFocus={() => { if (!nearMe) setShowSuggestions(true) }}
                      placeholder={nearMe ? 'Vagy írj várost...' : 'Város neve...'}
                      className="h-9 text-sm pr-7 bg-muted/40"
                    />
                    {acSearching && <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 animate-spin text-muted-foreground" />}
                    {selectedCity && !nearMe && !acSearching && <ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-primary" />}
                  </div>
                </div>
                {showSuggestions && suggestions.length > 0 && !selectedCity && !nearMe && (
                  <div className="rounded-lg border border-border bg-card shadow-lg overflow-hidden">
                    {suggestions.map(s => (
                      <button key={s.place_id} onMouseDown={() => handleSuggestionSelect(s)}
                        className="w-full flex items-start gap-2 px-3 py-2 text-left text-xs hover:bg-muted transition border-b border-border/40 last:border-0">
                        <MapPin className="w-3 h-3 mt-0.5 shrink-0 text-primary" />
                        <span className="line-clamp-1">{s.display_name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Kategóriák – összecsukható */}
              <CollapsibleSection
                label="Kategória"
                badge={activeCat ? activeCat.label : undefined}
              >
                <div className="grid grid-cols-3 gap-1.5">
                  {CATEGORIES.map(({ id, label, icon: Icon }) => (
                    <button key={id} onClick={() => {
                      if (filters.mainCategory === id) {
                        setFilters({ mainCategory: null, subCategory: null })
                      } else {
                        setFilters({ mainCategory: id, subCategory: null })
                      }
                    }}
                      className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-2 text-xs font-medium transition-all ${
                        filters.mainCategory === id
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:bg-muted text-muted-foreground hover:text-foreground'
                      }`}>
                      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{label}</span>
                    </button>
                  ))}
                </div>
              </CollapsibleSection>

              {/* Alkategóriák – összecsukható, csak ha van */}
              {activeCat?.subs && (
                <CollapsibleSection
                  label="Típus"
                  badge={activeCat.subs.find(s => s.id === filters.subCategory)?.label}
                >
                  <div className="flex flex-wrap gap-1.5">
                    {activeCat.subs.map(sub => (
                      <button key={String(sub.id)} onClick={() => setFilters({ subCategory: sub.id })}
                        className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                          filters.subCategory === sub.id
                            ? 'bg-primary border-primary text-primary-foreground'
                            : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
                        }`}>
                        {sub.label}
                      </button>
                    ))}
                  </div>
                </CollapsibleSection>
              )}

              {/* Keresési sugár – összecsukható */}
              <CollapsibleSection
                label="Keresési sugár"
                badge={`${filters.maxDistance} km`}
              >
                <DistanceSlider value={filters.maxDistance} onChange={handleDistanceChange} />
              </CollapsibleSection>

              {/* Hiba */}
              {error && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 flex gap-2 items-start">
                  <AlertCircle className="w-3.5 h-3.5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-destructive leading-snug">{error.message}</p>
                </div>
              )}

              {/* Keresés gomb */}
              <style>{`
                @keyframes sweep {
                  0%   { transform: translateX(-110%) skewX(-12deg); }
                  100% { transform: translateX(210%) skewX(-12deg); }
                }
                @keyframes glow-pulse {
                  0%, 100% { box-shadow: 0 0 16px 2px rgba(56,189,248,0.25), 0 2px 8px rgba(0,0,0,0.4); }
                  50%       { box-shadow: 0 0 28px 6px rgba(56,189,248,0.45), 0 2px 12px rgba(0,0,0,0.5); }
                }
                .srch-btn {
                  position: relative;
                  width: 100%;
                  height: 48px;
                  border-radius: 12px;
                  border: 1px solid rgba(56,189,248,0.35);
                  background: linear-gradient(135deg,
                    rgba(14,26,46,0.95) 0%,
                    rgba(15,35,60,0.95) 50%,
                    rgba(10,20,40,0.95) 100%
                  );
                  color: #e0f2fe;
                  font-size: 0.875rem;
                  font-weight: 700;
                  letter-spacing: 0.08em;
                  text-transform: uppercase;
                  cursor: pointer;
                  overflow: hidden;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  gap: 8px;
                  transition: border-color 0.2s, transform 0.15s;
                  animation: glow-pulse 3s ease-in-out infinite;
                }
                .srch-btn:disabled {
                  opacity: 0.35;
                  cursor: not-allowed;
                  animation: none;
                  border-color: rgba(100,120,140,0.2);
                  color: rgba(200,220,240,0.4);
                  background: rgba(20,30,45,0.6);
                }
                .srch-btn:not(:disabled):hover {
                  border-color: rgba(56,189,248,0.7);
                  transform: translateY(-1px);
                }
                .srch-btn:not(:disabled):active {
                  transform: scale(0.97);
                }
                /* Sweep light */
                .srch-btn::before {
                  content: '';
                  position: absolute;
                  top: 0; bottom: 0;
                  width: 40%;
                  background: linear-gradient(
                    90deg,
                    transparent 0%,
                    rgba(186,230,253,0.12) 40%,
                    rgba(255,255,255,0.18) 50%,
                    rgba(186,230,253,0.12) 60%,
                    transparent 100%
                  );
                  transform: translateX(-110%) skewX(-12deg);
                  animation: sweep 3.5s ease-in-out infinite;
                  pointer-events: none;
                }
                .srch-btn:disabled::before { display: none; }
                /* Top edge highlight */
                .srch-btn::after {
                  content: '';
                  position: absolute;
                  top: 0; left: 10%; right: 10%;
                  height: 1px;
                  background: linear-gradient(90deg,
                    transparent,
                    rgba(186,230,253,0.6) 30%,
                    rgba(255,255,255,0.9) 50%,
                    rgba(186,230,253,0.6) 70%,
                    transparent
                  );
                  pointer-events: none;
                }
                .srch-btn:disabled::after { display: none; }
              `}</style>
              <button
                onClick={handleSearchClick}
                disabled={!canSearch}
                className="srch-btn"
              >
                <Sparkles className="w-4 h-4 flex-shrink-0 relative z-10" style={{ color: canSearch ? '#7dd3fc' : 'inherit' }} />
                <span className="relative z-10">Keresés</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )

  return (
    <>
      <div className="leaflet-top leaflet-right pointer-events-none" style={{ top: 0 }}>
        <div className="m-4 mt-[4.5rem] flex flex-col gap-2 pointer-events-auto">
          <button onClick={() => {
              if (open) {
                handleClose()
              } else {
                // Alaphelyzet nyitáskor
                reset(); acReset(); setShowSuggestions(false); setNearMe(false)
                setOpen(true)
              }
            }}
            className={`w-11 h-11 rounded-xl border shadow-md flex items-center justify-center active:scale-95 transition cursor-pointer ${
              open ? 'bg-primary border-primary' : 'bg-card border-border hover:bg-muted'
            }`} title="AI Helykereső">
            <Sparkles className={`w-5 h-5 ${open ? 'text-primary-foreground' : 'text-primary'}`} />
          </button>
        </div>
      </div>

      <POIListOverlay pois={overlayPOIs} mapRef={mapRef} userPosition={userPosition}
        onClear={() => { setOverlayPOIs([]); onSelectPOIs([], '') }} />

      {createPortal(panel, document.body)}
    </>
  )
}

export default AIPOISearchButton
