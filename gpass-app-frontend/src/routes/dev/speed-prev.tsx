import { createFileRoute, redirect, Link } from "@tanstack/react-router"
import { useState, useEffect, useRef } from "react"
import { Gauge, Map, Play, Pause } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export const Route = createFileRoute("/dev/speed-prev")({
  beforeLoad: () => {
    if (import.meta.env.PROD) throw redirect({ to: "/" })
  },
  component: SpeedPreviewPage,
})

// ── SpeedDisplay mock — nem hívja az Overpass API-t ──
function SpeedDisplayMock({ kmh, speedLimit }: { kmh: number; speedLimit: number | null }) {
  const isSpeeding = speedLimit !== null && kmh > speedLimit

  return (
    <div className="relative flex flex-col items-center justify-center w-16 h-16 rounded-2xl border-2 shadow-lg shadow-black/30 transition-colors duration-300"
      style={{
        background: isSpeeding ? "rgb(239 68 68)" : "var(--card, #1e1e2e)",
        borderColor: isSpeeding ? "rgb(248 113 113)" : "var(--border, #333)",
      }}
    >
      <span className={`text-2xl font-black leading-none tabular-nums ${isSpeeding ? "text-white" : "text-foreground"}`}>
        {kmh}
      </span>
      <span className={`text-[10px] font-semibold leading-none mt-0.5 ${isSpeeding ? "text-white/80" : "text-muted-foreground"}`}>
        km/h
      </span>
      {speedLimit !== null && (
        <div className={`absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full border-2 flex items-center justify-center text-[9px] font-black ${
          isSpeeding ? "bg-white border-red-400 text-red-500" : "bg-card border-border text-foreground"
        }`}>
          {speedLimit}
        </div>
      )}
    </div>
  )
}

// ── Állapot kártyák ──
const SCENARIOS = [
  { label: "Normál haladás",     kmh: 48,  limit: 50,   desc: "Városi sebességhatár, nem gyorsít" },
  { label: "Gyorshajtás",        kmh: 67,  limit: 50,   desc: "Átlépi a 50-es határt — piros jelzés" },
  { label: "Autópálya",          kmh: 124, limit: 130,  desc: "Autópályán, határ alatt" },
  { label: "Autópályán túl",     kmh: 142, limit: 130,  desc: "Autópályán gyorsít — piros jelzés" },
  { label: "Nincs sebességhatár",kmh: 55,  limit: null,  desc: "Nincs ismert határ az útszakaszon" },
  { label: "Álló",               kmh: 0,   limit: 30,   desc: "Megállt, nulla km/h" },
]

function SpeedPreviewPage() {
  const [selectedScenario, setSelectedScenario] = useState(0)
  const [simulating, setSimulating] = useState(false)
  const [simKmh, setSimKmh] = useState(0)
  const [simLimit] = useState(50)
  const rafRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const scenario = SCENARIOS[selectedScenario]

  // ── Szimuláció: fokozatosan gyorsít 0→80 km/h, majd visszaesik ──
  useEffect(() => {
    if (!simulating) {
      if (rafRef.current) clearInterval(rafRef.current)
      setSimKmh(0)
      return
    }
    let v = 0
    let dir = 1
    rafRef.current = setInterval(() => {
      v += dir * 2
      if (v >= 80) dir = -1
      if (v <= 0) dir = 1
      setSimKmh(v)
    }, 80)
    return () => { if (rafRef.current) clearInterval(rafRef.current) }
  }, [simulating])

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background text-foreground">
      <div className="mx-auto max-w-2xl px-4 py-8 space-y-8">

        {/* Fejléc */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-3 py-1 text-xs text-muted-foreground mb-3">
            <Map className="h-3.5 w-3.5" />
            Dev Preview
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Speed Display</h1>
              <p className="mt-1 text-muted-foreground text-sm">Sebesség kijelző állapotai és szimulációja</p>
            </div>
            <Link to="/dev" className="text-xs text-muted-foreground hover:text-foreground transition">← Vissza</Link>
          </div>
        </div>

        {/* ── 1. szekció: Forgatókönyvek ── */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Forgatókönyvek</h2>

          <div className="grid gap-3">
            {SCENARIOS.map((s, i) => (
              <button key={i} onClick={() => { setSelectedScenario(i); setSimulating(false) }}
                className={`flex items-center gap-4 rounded-xl border px-4 py-3 text-left transition cursor-pointer ${
                  selectedScenario === i
                    ? "border-primary/50 bg-primary/10"
                    : "border-border/60 bg-card/60 hover:bg-accent/60"
                }`}
              >
                {/* Mini kijelző */}
                <div className="shrink-0">
                  <SpeedDisplayMock kmh={s.kmh} speedLimit={s.limit} />
                </div>
                {/* Leírás */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{s.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                </div>
                {/* Értékek */}
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-foreground tabular-nums">{s.kmh} km/h</p>
                  <p className="text-xs text-muted-foreground">{s.limit ? `max ${s.limit}` : "nincs limit"}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        <Separator />

        {/* ── 2. szekció: Nagy preview ── */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Kiválasztott állapot — nagy nézetben
          </h2>
          <div className="rounded-2xl border border-border/60 bg-card/40 p-8 flex items-center justify-center"
            style={{
              background: "repeating-linear-gradient(0deg, transparent, transparent 39px, hsl(var(--border)/0.4) 39px, hsl(var(--border)/0.4) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, hsl(var(--border)/0.4) 39px, hsl(var(--border)/0.4) 40px)",
            }}
          >
            <div className="scale-[2] origin-center">
              <SpeedDisplayMock kmh={scenario.kmh} speedLimit={scenario.limit} />
            </div>
          </div>
        </section>

        <Separator />

        {/* ── 3. szekció: Szimuláció ── */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Élő szimuláció — 50 km/h-s zóna
          </h2>
          <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">0 → 80 km/h animáció</p>
                <p className="text-xs text-muted-foreground mt-0.5">50-nél pirosra vált, lassításkor visszaáll</p>
              </div>
              <button
                onClick={() => setSimulating(!simulating)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition cursor-pointer border ${
                  simulating
                    ? "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
                    : "bg-primary/10 border-primary/30 text-primary hover:bg-primary/20"
                }`}
              >
                {simulating ? <><Pause className="w-4 h-4" /> Megállít</> : <><Play className="w-4 h-4" /> Indít</>}
              </button>
            </div>

            <div className="flex items-center justify-center py-4">
              <div className="scale-[2.5] origin-center">
                <SpeedDisplayMock kmh={simKmh} speedLimit={simLimit} />
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0 km/h</span>
                <span className={`font-semibold tabular-nums ${simKmh > simLimit ? "text-red-400" : "text-foreground"}`}>
                  {simKmh} km/h
                </span>
                <span>80 km/h</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-75"
                  style={{
                    width: `${(simKmh / 80) * 100}%`,
                    background: simKmh > simLimit ? "rgb(239 68 68)" : "var(--primary)",
                  }}
                />
              </div>
              <div
                className="h-3 w-px bg-amber-400 relative -mt-2.5"
                style={{ marginLeft: `calc(${(simLimit / 80) * 100}% - 0.5px)` }}
                title={`${simLimit} km/h limit`}
              />
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
