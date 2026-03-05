import { useState, useRef } from "react"
import { MapPin, Route, Search, X, Navigation, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useNavigation } from "@/context/NavigationContext"
import { useRouting } from "@/hooks/useRouting"

type Props = {
  currentPosition: { lat: number; lng: number }
}

type Suggestion = {
  place_id: number
  display_name: string
  lat: string
  lon: string
}

type SearchFormProps = {
  autoFocus?: boolean
  query: string
  setQuery: (v: string) => void
  suggestions: Suggestion[]
  selected: Suggestion | null
  searching: boolean
  loading: boolean
  handleInput: (v: string) => void
  handleSelect: (s: Suggestion) => void
  handlePlan: () => void
  clear: () => void
}

function SearchForm({
  autoFocus = false,
  query,
  suggestions,
  selected,
  searching,
  loading,
  handleInput,
  handleSelect,
  handlePlan,
  clear,
}: SearchFormProps) {
  return (
    <div className="space-y-3">

      {/* SEARCH INPUT */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
          {searching ? (
            <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
          ) : (
            <Search className="w-4 h-4 text-muted-foreground" />
          )}
        </div>

        <Input
          autoFocus={autoFocus}
          className="pl-9 pr-9 rounded-xl bg-background/60 border-border/60 focus-visible:ring-primary/40"
          placeholder="Keresés: utca, város, hely..."
          value={query}
          onChange={(e) => handleInput(e.target.value)}
        />

        {query && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={clear}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* SUGGESTIONS */}
      {suggestions.length > 0 && (
        <div className="rounded-xl border border-border/60 bg-card/95 backdrop-blur shadow-xl overflow-hidden">
          {suggestions.map((s, i) => (
            <button
              key={s.place_id}
              onClick={() => handleSelect(s)}
              className={`w-full text-left px-3 py-2.5 flex items-start gap-2.5 hover:bg-accent/60 transition-colors text-sm ${
                i !== suggestions.length - 1 ? "border-b border-border/40" : ""
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
              <span className="text-foreground leading-snug line-clamp-2">
                {s.display_name}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* SELECTED */}
      {selected && (
        <div className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-3 py-2">
          <Navigation className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="text-xs text-primary font-medium leading-snug line-clamp-1 flex-1">
            {selected.display_name}
          </span>
        </div>
      )}

      <Button
        onClick={handlePlan}
        disabled={loading || !selected}
        className="w-full cursor-pointer rounded-xl font-semibold shadow-lg shadow-primary/20"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Tervezés...
          </>
        ) : (
          <>
            <Route className="w-4 h-4 mr-2" />
            Útvonal tervezése
          </>
        )}
      </Button>
    </div>
  )
}

export default function NavigationPanel({ currentPosition }: Props) {
  const { mode, setPreview } = useNavigation()
  const { planRoute, loading } = useRouting()

  const [isDesktopOpen, setIsDesktopOpen] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [selected, setSelected] = useState<Suggestion | null>(null)
  const [searching, setSearching] = useState(false)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const searchAddress = async (q: string) => {
    if (q.trim().length < 3) {
      setSuggestions([])
      return
    }

    setSearching(true)

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          q
        )}&limit=5&accept-language=hu`,
        { headers: { "Accept-Language": "hu" } }
      )

      const data: Suggestion[] = await res.json()
      setSuggestions(data)
    } catch {
      setSuggestions([])
    } finally {
      setSearching(false)
    }
  }

  const handleInput = (value: string) => {
    setQuery(value)
    setSelected(null)

    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(() => {
      searchAddress(value)
    }, 400)
  }

  const handleSelect = (s: Suggestion) => {
    setSelected(s)
    setQuery(s.display_name)
    setSuggestions([])
  }

  const handlePlan = async () => {
    if (!selected) return

    const destination = {
      lat: parseFloat(selected.lat),
      lng: parseFloat(selected.lon),
    }

    const routes = await planRoute(currentPosition, destination)

    if (routes.length > 0) {
      setPreview(routes)
      setIsDesktopOpen(false)
      setIsMobileOpen(false)
      setQuery("")
      setSelected(null)
    }
  }

  const clear = () => {
    setQuery("")
    setSelected(null)
    setSuggestions([])
  }

  const handleClose = () => {
    setIsDesktopOpen(false)
    clear()
  }

  return (
    <>
      {mode === "idle" && (
        <>
          {/* DESKTOP */}
          <div className="absolute top-4 left-4 z-1000 hidden md:block">
            {!isDesktopOpen ? (
              <button
                onClick={() => setIsDesktopOpen(true)}
                className="cursor-pointer group w-11 h-11 rounded-xl bg-card/95 backdrop-blur border border-border/60 shadow-lg shadow-black/20 flex items-center justify-center hover:bg-accent hover:border-primary/30 transition-all"
              >
                <Route className="w-4 h-4 text-primary" />
              </button>
            ) : (
              <div className="w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-border/60 bg-card/95 backdrop-blur shadow-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">Útvonaltervezés</span>

                  <button onClick={handleClose}>
                    <X className="cursor-pointer w-4 h-4" />
                  </button>
                </div>

                <SearchForm
                  query={query}
                  setQuery={setQuery}
                  suggestions={suggestions}
                  selected={selected}
                  searching={searching}
                  loading={loading}
                  handleInput={handleInput}
                  handleSelect={handleSelect}
                  handlePlan={handlePlan}
                  clear={clear}
                />
              </div>
            )}
          </div>

          {/* MOBILE */}
          <div className="absolute top-4 left-1/2 z-1000 -translate-x-1/2 md:hidden">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="flex items-center gap-2 rounded-full border border-border/60 bg-card/95 px-4 py-2.5 text-sm font-semibold shadow-lg"
            >
              <Route className="h-4 w-4 text-primary" />
              Útvonaltervezés
            </button>
          </div>

          <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <SheetContent side="bottom" className="md:hidden">
              <SheetHeader>
                <SheetTitle>Útvonaltervezés</SheetTitle>
              </SheetHeader>

              <SearchForm
                autoFocus
                query={query}
                setQuery={setQuery}
                suggestions={suggestions}
                selected={selected}
                searching={searching}
                loading={loading}
                handleInput={handleInput}
                handleSelect={handleSelect}
                handlePlan={handlePlan}
                clear={clear}
              />
            </SheetContent>
          </Sheet>
        </>
      )}
    </>
  )
}