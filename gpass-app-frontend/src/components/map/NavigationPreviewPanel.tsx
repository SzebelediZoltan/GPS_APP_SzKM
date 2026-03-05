import {
  Route,
  Clock,
  MapPin,
  ChevronDown,
  X,
  Navigation,
  Zap,
  ArrowRight,
} from "lucide-react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useNavigation } from "@/context/NavigationContext"

type Props = {
  centerOnUser: () => void
}

export default function NavigationPreviewPanel({ centerOnUser }: Props) {
  const {
    mode,
    routes,
    selectedRouteIndex,
    selectRoute,
    startNavigation,
    cancelPreview,
  } = useNavigation()

  const [altOpen, setAltOpen] = useState(false)

  if (mode !== "preview" || routes.length === 0) return null

  const route = routes[selectedRouteIndex]
  const km = (route.distance / 1000).toFixed(1)
  const minutes = Math.round(route.duration / 60)
  const fastest = Math.min(...routes.map((r) => r.duration))

  return (
    <div
      className="
        pointer-events-none
        absolute inset-x-0 bottom-0
        flex justify-center
        px-3
        pb-[calc(4rem+0.9rem)]
        z-1000
      "
    >
      <div
        className="
          pointer-events-auto
          w-full md:w-105
          rounded-2xl
          border border-border/60
          bg-card backdrop-blur-xl
          shadow-2xl shadow-black/40
          overflow-hidden
          animate-in fade-in slide-in-from-bottom-4 duration-300
        "
      >
        {/* ── TOP ACCENT BAR ── */}
        <div className="h-1 bg-linear-to-r from-primary/60 via-primary to-primary/60" />

        <div className="p-4 space-y-3">

          {/* ── HEADER ── */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center">
                <Route className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold leading-none text-foreground">Útvonal előnézet</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {routes.length} útvonal találva
                </p>
              </div>
            </div>
            <button
              onClick={() => { cancelPreview(); centerOnUser() }}
              className="w-7 h-7 cursor-pointer rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* ── STATS ROW ── */}
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-border/50 bg-muted/40 px-3 py-2.5 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-500/15 flex items-center justify-center shrink-0">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">Távolság</p>
                <p className="text-base font-black leading-none text-foreground">
                  {km} <span className="text-xs font-semibold text-muted-foreground">km</span>
                </p>
              </div>
            </div>
            <div className="rounded-xl border border-border/50 bg-muted/40 px-3 py-2.5 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center shrink-0">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">Idő</p>
                <p className="text-base font-black leading-none text-foreground">
                  {minutes} <span className="text-xs font-semibold text-muted-foreground">perc</span>
                </p>
              </div>
            </div>
          </div>

          {/* ── ALTERNATIVE ROUTES ── */}
          {routes.length > 1 && (
            <div>
              <button
                onClick={() => setAltOpen(!altOpen)}
                className="
                  w-full flex items-center justify-between
                  rounded-xl border border-border/50
                  bg-muted/30 hover:bg-accent/50
                  px-3 py-2
                  transition-colors
                  cursor-pointer
                "
              >
                <span className="text-muted-foreground text-xs">
                  Alternatív útvonalak ({routes.length - 1})
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${altOpen ? "rotate-180" : ""}`}
                />
              </button>

              {altOpen && (
                <div className="mt-2 space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
                  {routes.map((r, index) => {
                    const rKm = (r.distance / 1000).toFixed(1)
                    const rMin = Math.round(r.duration / 60)
                    const isFastest = r.duration === fastest
                    const isActive = index === selectedRouteIndex

                    return (
                      <button
                        key={index}
                        onClick={() => selectRoute(index)}
                        className={`
                          w-full text-left rounded-xl border px-3 py-2.5
                          flex items-center justify-between
                          transition-all duration-150
                          cursor-pointer
                          ${isActive
                            ? "border-primary/50 bg-primary/10"
                            : "border-border/40 bg-muted/20 hover:bg-accent/40 hover:border-border/60"
                          }
                        `}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full shrink-0 ${isActive ? "bg-primary" : "bg-muted-foreground/40"}`} />
                          <span className={`text-sm font-semibold ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                            {index + 1}. útvonal
                          </span>
                          {isFastest && (
                            <Badge className="text-[10px] px-1.5 py-0.5 gap-1 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                              <Zap className="w-2.5 h-2.5" />
                              Leggyorsabb
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{rKm} km</span>
                          <span>{rMin} perc</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── ACTION BUTTONS ── */}
          <div className="flex gap-2 pt-1">
            <Button
              variant="outline"
              className="flex-1 rounded-xl border-border/60 font-semibold cursor-pointer"
              onClick={() => { cancelPreview(); centerOnUser() }}
            >
              Mégse
            </Button>
            <Button
              className="flex-1 rounded-xl cursor-pointer font-semibold shadow-lg shadow-primary/20"
              onClick={startNavigation}
            >
              <Navigation className="w-4 h-4 mr-2" />
              Indulás
              <ArrowRight className="w-3.5 h-3.5 ml-1.5 opacity-70" />
            </Button>
          </div>

        </div>
      </div>
    </div>
  )
}
