import { createFileRoute, redirect, Link } from "@tanstack/react-router"
import { useState } from "react"
import {
  Navigation, Clock, MapPin, ChevronDown, X,
  Zap, ArrowRight, CornerUpRight, ArrowLeft, RotateCcw,
  Volume2, VolumeX, Map, ChevronRight, RouteIcon
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export const Route = createFileRoute("/dev/navigation-prev")({
  beforeLoad: () => {
    if (import.meta.env.PROD) throw redirect({ to: "/" })
  },
  component: NavigationPreviewPage,
})

// ── Mock útvonal adatok ──
const MOCK_ROUTES = [
  { distance: 12400, duration: 1140 },
  { distance: 14200, duration: 960  },
  { distance: 11800, duration: 1380 },
]

const MOCK_STEPS = [
  { type: "turn",       modifier: "left",         name: "Andrássy út",       distance: 320,  duration: 85  },
  { type: "turn",       modifier: "right",        name: "Erzsébet körút",    distance: 870,  duration: 190 },
  { type: "roundabout", modifier: "straight",     name: "Blaha Lujza tér",   distance: 150,  duration: 40  },
  { type: "turn",       modifier: "slight right", name: "Rákóczi út",        distance: 1200, duration: 260 },
  { type: "arrive",     modifier: "left",         name: "Keleti pályaudvar", distance: 0,    duration: 0   },
]

function formatDistance(m: number) {
  if (m >= 1000) return `${(m / 1000).toFixed(1)} km`
  return `${m} m`
}

// Nem type alias — string union inline-olva ahol kell
function ManeuverIcon({ maneuver, size = 20 }: {
  maneuver: "turn-left" | "turn-right" | "slight-right" | "roundabout" | "arrive" | "straight"
  size?: number
}) {
  if (maneuver === "turn-left")    return <ArrowLeft size={size} />
  if (maneuver === "turn-right")   return <CornerUpRight size={size} />
  if (maneuver === "slight-right") return <ArrowRight size={size} className="-rotate-45" />
  if (maneuver === "roundabout")   return <RotateCcw size={size} />
  if (maneuver === "arrive")       return <MapPin size={size} />
  return <ArrowRight size={size} />
}

function getManeuverKey(step: (typeof MOCK_STEPS)[0]) {
  if (step.type === "roundabout")           return "roundabout" as const
  if (step.type === "arrive")               return "arrive"     as const
  if (step.modifier === "left")             return "turn-left"  as const
  if (step.modifier === "right")            return "turn-right" as const
  if (step.modifier === "slight right")     return "slight-right" as const
  return "straight" as const
}

function getManeuverLabel(step: (typeof MOCK_STEPS)[0]) {
  const k = getManeuverKey(step)
  const labels: Record<string, string> = {
    "turn-left":    "Fordulj balra",
    "turn-right":   "Fordulj jobbra",
    "slight-right": "Enyhén jobbra",
    "roundabout":   "Körforgalom",
    "arrive":       "Megérkeztél",
    "straight":     "Haladj egyenesen",
  }
  return labels[k] ?? "Haladj egyenesen"
}

// ── TurnByTurn panel mock ──
function TurnByTurnMock({ stepIdx, muted, onToggleMute, onStop }: {
  stepIdx: number
  muted: boolean
  onToggleMute: () => void
  onStop: () => void
}) {
  const currentStep = MOCK_STEPS[stepIdx]
  const nextStep    = MOCK_STEPS[stepIdx + 1] ?? null
  const remaining   = MOCK_STEPS.slice(stepIdx).reduce((s, st) => s + st.distance, 0)
  const remainTime  = MOCK_STEPS.slice(stepIdx).reduce((s, st) => s + st.duration, 0)
  const maneuver    = getManeuverKey(currentStep)

  return (
    <div className="w-full rounded-2xl border border-border/60 bg-card shadow-2xl shadow-black/30 overflow-hidden">
      {/* Felső sáv */}
      <div className="flex items-center gap-3 bg-primary/10 border-b border-border/60 px-4 py-3">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shrink-0">
          <ManeuverIcon maneuver={maneuver} size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
            {getManeuverLabel(currentStep)}
          </p>
          <p className="text-base font-bold text-foreground truncate">{currentStep.name}</p>
        </div>
        <p className="text-lg font-black text-foreground tabular-nums shrink-0">
          {formatDistance(currentStep.distance)}
        </p>
      </div>

      {/* Következő lépés */}
      {nextStep && (
        <div className="flex items-center gap-2 px-4 py-2 bg-muted/30 border-b border-border/40">
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span className="text-xs text-muted-foreground">Utána:</span>
          <div className="w-5 h-5 flex items-center justify-center text-muted-foreground">
            <ManeuverIcon maneuver={getManeuverKey(nextStep)} size={13} />
          </div>
          <span className="text-xs font-medium text-foreground truncate flex-1">{nextStep.name}</span>
          <span className="text-xs text-muted-foreground tabular-nums shrink-0">
            {formatDistance(nextStep.distance)}
          </span>
        </div>
      )}

      {/* Alsó info sáv */}
      <div className="flex items-center gap-4 px-4 py-2.5 bg-card">
        <div className="flex items-center gap-1.5">
          <RouteIcon className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-sm font-semibold tabular-nums">{formatDistance(remaining)}</span>
          <span className="text-xs text-muted-foreground">hátra</span>
        </div>
        <div className="w-px h-4 bg-border" />
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-sm font-semibold tabular-nums">{Math.round(remainTime / 60)}</span>
          <span className="text-xs text-muted-foreground">perc</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={onToggleMute}
            className="w-8 h-8 rounded-lg border border-border bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition cursor-pointer">
            {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
          <button onClick={onStop}
            className="w-8 h-8 rounded-lg border border-red-500/30 bg-red-500/10 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ── NavigationPreview panel mock ──
function NavigationPreviewMock({ selectedIdx, onSelect, onStart, onCancel }: {
  selectedIdx: number
  onSelect: (i: number) => void
  onStart: () => void
  onCancel: () => void
}) {
  const [altOpen, setAltOpen] = useState(false)
  const route = MOCK_ROUTES[selectedIdx]
  const km    = (route.distance / 1000).toFixed(1)
  const mins  = Math.round(route.duration / 60)
  const fastestDuration = Math.min(...MOCK_ROUTES.map((r) => r.duration))

  return (
    <div className="w-full rounded-2xl border border-border/60 bg-card shadow-2xl shadow-black/40 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="h-1 bg-gradient-to-r from-primary/60 via-primary to-primary/60" />

      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center">
              <RouteIcon className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Útvonal előnézet</p>
              <p className="text-[11px] text-muted-foreground">{MOCK_ROUTES.length} útvonal találva</p>
            </div>
          </div>
          <button onClick={onCancel}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-border/50 bg-muted/40 px-3 py-2.5 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-500/15 flex items-center justify-center shrink-0">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">Távolság</p>
              <p className="text-base font-black text-foreground">{km} <span className="text-xs font-semibold text-muted-foreground">km</span></p>
            </div>
          </div>
          <div className="rounded-xl border border-border/50 bg-muted/40 px-3 py-2.5 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center shrink-0">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">Idő</p>
              <p className="text-base font-black text-foreground">{mins} <span className="text-xs font-semibold text-muted-foreground">perc</span></p>
            </div>
          </div>
        </div>

        {/* Alternatívák */}
        <div>
          <button onClick={() => setAltOpen(!altOpen)}
            className="w-full flex items-center justify-between rounded-xl border border-border/50 bg-muted/30 hover:bg-accent/50 px-3 py-2 transition cursor-pointer">
            <span className="text-muted-foreground text-xs">Alternatív útvonalak ({MOCK_ROUTES.length - 1})</span>
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${altOpen ? "rotate-180" : ""}`} />
          </button>
          {altOpen && (
            <div className="mt-2 space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
              {MOCK_ROUTES.map((r, i) => {
                const isActive   = i === selectedIdx
                const isFastest  = r.duration === fastestDuration
                return (
                  <button key={i} onClick={() => onSelect(i)}
                    className={`w-full text-left rounded-xl border px-3 py-2.5 flex items-center justify-between transition cursor-pointer ${
                      isActive ? "border-primary/50 bg-primary/10" : "border-border/40 bg-muted/20 hover:bg-accent/40"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${isActive ? "bg-primary" : "bg-muted-foreground/40"}`} />
                      <span className={`text-sm font-semibold ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                        {i + 1}. útvonal
                      </span>
                      {isFastest && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 text-green-400 border-green-500/30 bg-green-500/10">
                          <Zap className="w-2.5 h-2.5 mr-0.5" /> Leggyorsabb
                        </Badge>
                      )}
                    </div>
                    <span className={`text-xs font-bold ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                      {(r.distance / 1000).toFixed(1)} km · {Math.round(r.duration / 60)} perc
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Gombok */}
        <div className="flex gap-2 pt-1">
          <button onClick={onStart}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90 active:scale-95 transition cursor-pointer">
            <Navigation className="w-4 h-4" /> Indítás
          </button>
          <button className="w-10 h-10 rounded-xl border border-border bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-accent transition cursor-pointer">
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Fő oldal ──
function NavigationPreviewPage() {
  const [mode, setMode]           = useState<"preview" | "navigating">("preview")
  const [selectedRoute, setSelectedRoute] = useState(1)
  const [stepIdx, setStepIdx]     = useState(0)
  const [muted, setMuted]         = useState(false)

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background text-foreground">
      <div className="mx-auto max-w-2xl px-4 py-8 space-y-8">

        {/* Fejléc */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-3 py-1 text-xs text-muted-foreground mb-3">
            <Map className="h-3.5 w-3.5" /> Dev Preview
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Navigation Panels</h1>
              <p className="mt-1 text-muted-foreground text-sm">Mock navigációs adatokkal</p>
            </div>
            <Link to="/dev" className="text-xs text-muted-foreground hover:text-foreground transition">← Vissza</Link>
          </div>
        </div>

        {/* Mód váltó */}
        <div className="flex rounded-xl border border-border/60 bg-card/40 p-1 gap-1">
          {(["preview", "navigating"] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold transition cursor-pointer ${
                mode === m ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {m === "preview" ? "🗺 Útvonal előnézet" : "🧭 Navigálás közben"}
            </button>
          ))}
        </div>

        {/* Panel */}
        {mode === "preview" && (
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">NavigationPreviewPanel</h2>
            <NavigationPreviewMock
              selectedIdx={selectedRoute}
              onSelect={setSelectedRoute}
              onStart={() => setMode("navigating")}
              onCancel={() => {}}
            />
          </section>
        )}

        {mode === "navigating" && (
          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">TurnByTurnPanel</h2>
            <TurnByTurnMock
              stepIdx={stepIdx}
              muted={muted}
              onToggleMute={() => setMuted(!muted)}
              onStop={() => setMode("preview")}
            />

            {/* Lépés szimulátor */}
            <div className="rounded-xl border border-border/60 bg-card/40 p-4 space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Lépés szimulátor</p>
              <div className="flex flex-wrap gap-2">
                {MOCK_STEPS.map((step, i) => (
                  <button key={i} onClick={() => setStepIdx(i)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer border ${
                      stepIdx === i
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted/50 text-muted-foreground border-border hover:text-foreground"
                    }`}
                  >
                    {i + 1}. {step.name.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        <Separator />

        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-amber-400 space-y-1">
          <p className="font-semibold">Megjegyzés</p>
          <p className="text-xs leading-relaxed opacity-80">
            Ez mock adatokkal dolgozik — az éles verzióban a NavigationContext adja az útvonalat és a lépéseket, a TurnByTurnPanel GPS pozíció alapján vált lépést.
          </p>
        </div>

      </div>
    </div>
  )
}
