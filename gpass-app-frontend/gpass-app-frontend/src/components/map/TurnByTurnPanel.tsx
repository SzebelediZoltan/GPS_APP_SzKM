import { Clock, Route, X, ChevronRight, RefreshCw, Volume2, VolumeX } from "lucide-react"
import { useRef } from "react"
import { toast } from "sonner"
import { useNavigation } from "@/context/NavigationContext"
import { useNavigationSteps } from "@/hooks/map/useNavigationSteps"
import { useRouting } from "@/hooks/map/useRouting"
import { useSpeech } from "@/hooks/ui/useSpeech"
import { getManeuverIcon, getManeuverLabel, formatDistance } from "@/utils/routeUtils"
import ManeuverIcon from "./ManeuverIcon"

type Props = {
  position: { lat: number; lng: number } | null
}

export default function TurnByTurnPanel({ position }: Props) {
  const { mode, routes, selectedRouteIndex, stopNavigation, setPreview, startNavigation } = useNavigation()
  const { planRoute, loading: rerouteLoading } = useRouting()
  const { speak, muted, toggleMute } = useSpeech()
  const isRerouting = useRef(false)

  const handleOffRoute = async () => {
    if (!position || isRerouting.current) return
    const route = routes[selectedRouteIndex]
    if (!route?.steps?.length) return

    isRerouting.current = true
    const lastStep = route.steps[route.steps.length - 1]
    const [destLng, destLat] = lastStep.maneuver.location

    toast.loading("Útvonal újratervezése...", { id: "reroute" })
    try {
      const newRoutes = await planRoute({ start: position, end: { lat: destLat, lng: destLng } })
      if (newRoutes.length > 0) {
        setPreview(newRoutes)
        startNavigation()
        toast.success("Útvonal újratervezve!", { id: "reroute" })
      } else {
        toast.error("Nem sikerült újratervezni az útvonalat.", { id: "reroute" })
        isRerouting.current = false
      }
    } catch {
      toast.error("Hiba az újratervezés során.", { id: "reroute" })
      isRerouting.current = false
    }
    setTimeout(() => { isRerouting.current = false }, 15000)
  }

  const { currentStep, nextStep, remainingDistance, remainingDuration } =
    useNavigationSteps({ position, onOffRoute: handleOffRoute, speak })

  if (mode !== "navigating" || !currentStep) return null

  const iconName = getManeuverIcon(currentStep.maneuver.type, currentStep.maneuver.modifier)
  const label = getManeuverLabel(currentStep.maneuver.type, currentStep.maneuver.modifier)
  const nextIconName = nextStep ? getManeuverIcon(nextStep.maneuver.type, nextStep.maneuver.modifier) : null
  const nextLabel = nextStep ? getManeuverLabel(nextStep.maneuver.type, nextStep.maneuver.modifier) : null

  return (
    <div
      className="absolute inset-x-0 top-0 z-1100 pointer-events-none"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="pointer-events-auto mx-0 md:mx-auto md:max-w-lg md:mt-3 md:rounded-2xl overflow-hidden shadow-2xl shadow-black/50">

        <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center gap-3">
          <div className="w-14 h-14 rounded-xl bg-primary-foreground/15 flex items-center justify-center shrink-0">
            {rerouteLoading
              ? <RefreshCw className="w-7 h-7 text-primary-foreground animate-spin" />
              : <ManeuverIcon name={iconName} className="w-8 h-8 text-primary-foreground" />
            }
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-2xl font-black leading-none tabular-nums">
              {rerouteLoading ? "Újratervezés..." : formatDistance(currentStep.distance)}
            </p>
            <p className="text-sm font-semibold mt-0.5 text-primary-foreground/80 truncate">
              {rerouteLoading ? "Kérlek várj" : `${label}${currentStep.name ? ` – ${currentStep.name}` : ""}`}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={toggleMute}
              className="w-9 h-9 rounded-xl bg-primary-foreground/15 hover:bg-primary-foreground/25 flex items-center justify-center transition-colors cursor-pointer"
              title={muted ? "Hang bekapcsolása" : "Némítás"}
            >
              {muted
                ? <VolumeX className="w-4 h-4 text-primary-foreground/60" />
                : <Volume2 className="w-4 h-4 text-primary-foreground" />
              }
            </button>
            <button
              onClick={stopNavigation}
              className="w-9 h-9 rounded-xl bg-primary-foreground/15 hover:bg-primary-foreground/25 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {nextStep && nextIconName && nextLabel && (
          <div className="bg-card border-t border-border/60 px-4 py-2 flex items-center gap-2.5">
            <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide shrink-0">Majd</span>
            <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />
            <ManeuverIcon name={nextIconName} className="w-4 h-4 text-foreground shrink-0" />
            <span className="text-sm text-foreground truncate">
              {nextLabel}{nextStep.name ? ` – ${nextStep.name}` : ""}
            </span>
            <span className="ml-auto text-xs text-muted-foreground shrink-0 tabular-nums">
              {formatDistance(nextStep.distance)}
            </span>
          </div>
        )}

        <div className="bg-card border-t border-border/60 px-4 py-2 flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Route className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-sm font-semibold tabular-nums">{formatDistance(remainingDistance)}</span>
            <span className="text-xs text-muted-foreground">hátra</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-sm font-semibold tabular-nums">{Math.round(remainingDuration / 60)}</span>
            <span className="text-xs text-muted-foreground">perc</span>
          </div>
        </div>

      </div>
    </div>
  )
}
