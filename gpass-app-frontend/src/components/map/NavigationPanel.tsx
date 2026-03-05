import { useState, useEffect, useRef } from "react"
import { MapPin, Route, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useNavigation } from "@/context/NavigationContext"
import { useRouting } from "@/hooks/useRouting"

// ─── Types ───────────────────────────────────────────────────────────────────

type NominatimResult = {
  place_id: number
  display_name: string
  lat: string
  lon: string
}

// ─── Nominatim search ────────────────────────────────────────────────────────

async function searchPlaces(query: string): Promise<NominatimResult[]> {
  if (query.length < 2) return []
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=0`,
      { headers: { "Accept-Language": "hu" } }
    )
    return await res.json()
  } catch {
    return []
  }
}

// ─── Shared search logic hook ────────────────────────────────────────────────

function useLocationSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<NominatimResult[]>([])
  const [searching, setSearching] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (query.trim().length < 2) {
      setResults([])
      return
    }

    setSearching(true)
    debounceRef.current = setTimeout(async () => {
      const res = await searchPlaces(query)
      setResults(res)
      setSearching(false)
    }, 500)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query])

  const reset = () => {
    setQuery("")
    setResults([])
    setSearching(false)
  }

  return { query, setQuery, results, searching, reset }
}

// ─── Result list component ───────────────────────────────────────────────────

function ResultList({
  results,
  searching,
  query,
  onSelect,
}: {
  results: NominatimResult[]
  searching: boolean
  query: string
  onSelect: (r: NominatimResult) => void
}) {
  if (query.trim().length < 2) return null

  return (
    <div className="rounded-xl border border-border bg-background/95 backdrop-blur overflow-hidden">
      {searching && (
        <div className="flex items-center gap-2 px-3 py-2.5 text-sm text-muted-foreground">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          Keresés...
        </div>
      )}

      {!searching && results.length === 0 && (
        <div className="px-3 py-2.5 text-sm text-muted-foreground">
          Nem található ilyen hely.
        </div>
      )}

      {!searching && results.map((r) => (
        <button
          key={r.place_id}
          onClick={() => onSelect(r)}
          className="
            w-full flex items-start gap-2 px-3 py-2.5 text-left text-sm
            hover:bg-muted transition border-b border-border/50 last:border-0
          "
        >
          <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary" />
          <span className="line-clamp-2 leading-snug">{r.display_name}</span>
        </button>
      ))}
    </div>
  )
}

// ─── Desktop panel (Leaflet-en belül) ────────────────────────────────────────

type PanelProps = {
  currentPosition: { lat: number; lng: number }
  onOpenMobile: () => void
}

export default function NavigationPanel({ currentPosition, onOpenMobile }: PanelProps) {
  const { mode, setPreview } = useNavigation()
  const { planRoute, loading } = useRouting()
  const [isDesktopOpen, setIsDesktopOpen] = useState(false)
  const { query, setQuery, results, searching, reset } = useLocationSearch()

  if (mode !== "idle") return null

  const handleSelect = async (r: NominatimResult) => {
    const destination = { lat: parseFloat(r.lat), lng: parseFloat(r.lon) }
    const routes = await planRoute(currentPosition, destination)
    if (routes.length > 0) {
      setPreview(routes)
      setIsDesktopOpen(false)
      reset()
    }
  }

  return (
    <>
      {/* Desktop */}
      <div className="absolute top-4 left-4 z-[1000] hidden md:block">
        {!isDesktopOpen && (
          <Button
            onClick={() => setIsDesktopOpen(true)}
            className="
              w-11 h-11 rounded-xl
              bg-card text-foreground
              border border-border shadow-md
              flex items-center justify-center
              hover:bg-muted active:scale-95 transition cursor-pointer
            "
          >
            <Route className="w-4 h-4 text-primary" />
          </Button>
        )}

        {isDesktopOpen && (
          <div className="
            w-[min(20rem,calc(100vw-2rem))]
            rounded-xl border border-border
            bg-background/95 backdrop-blur shadow-xl
            p-4 space-y-3
            animate-in fade-in-0 zoom-in-95 duration-200
          ">
            {/* Input */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                autoFocus
                className="pl-9 pr-8"
                placeholder="Hova szeretnél menni?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button
                  onClick={reset}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Results */}
            <ResultList
              results={results}
              searching={searching}
              query={query}
              onSelect={handleSelect}
            />

            {loading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Útvonal tervezése...
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobil trigger gomb */}
      <div className="absolute top-5 left-1/2 z-[1000] -translate-x-1/2 md:hidden">
        <Button
          onClick={onOpenMobile}
          className="rounded-full border border-border bg-card/95 px-4 text-foreground shadow-lg backdrop-blur hover:bg-muted"
        >
          <Route className="mr-2 h-4 w-4 text-primary" />
          Útvonaltervezés
        </Button>
      </div>
    </>
  )
}

// ─── Mobile Sheet (MapContainer-en kívül) ────────────────────────────────────

type MobileSheetProps = {
  open: boolean
  onOpenChange: (v: boolean) => void
  currentPosition: { lat: number; lng: number }
}

export function NavigationMobileSheet({ open, onOpenChange, currentPosition }: MobileSheetProps) {
  const { mode, setPreview } = useNavigation()
  const { planRoute, loading } = useRouting()
  const { query, setQuery, results, searching, reset } = useLocationSearch()

  if (mode !== "idle") return null

  const handleSelect = async (r: NominatimResult) => {
    const destination = { lat: parseFloat(r.lat), lng: parseFloat(r.lon) }
    const routes = await planRoute(currentPosition, destination)
    if (routes.length > 0) {
      setPreview(routes)
      onOpenChange(false)
      reset()
    }
  }

  return (
    <Sheet open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) reset() }}>
      <SheetContent
        side="bottom"
        className="z-[1200] rounded-t-2xl border-t border-border/80 bg-background/95 px-0 backdrop-blur"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 1rem)" }}
      >
        <SheetHeader className="pb-3 px-4">
          <SheetTitle>Útvonaltervezés</SheetTitle>
          <SheetDescription>Adj meg egy célt a keresőbe.</SheetDescription>
        </SheetHeader>

        <div className="space-y-3 px-4">
          {/* Input */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              autoFocus
              className="pl-9 pr-8"
              placeholder="Hova szeretnél menni?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button
                onClick={reset}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Results */}
          <ResultList
            results={results}
            searching={searching}
            query={query}
            onSelect={handleSelect}
          />

          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Útvonal tervezése...
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
