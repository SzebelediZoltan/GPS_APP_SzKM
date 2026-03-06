import { useEffect, useRef } from "react"
import { useNavigation } from "@/context/NavigationContext"
import { getDistanceToRoute, getManeuverLabel } from "@/utils/routeUtils"
import type { RouteStep } from "@/hooks/map/useRouting"

const OFF_ROUTE_THRESHOLD = 30
const STEP_ADVANCE_THRESHOLD = 20
const OFF_ROUTE_CHECK_INTERVAL = 4000
const OFF_ROUTE_COOLDOWN = 15000

type Options = {
  position: { lat: number; lng: number } | null
  onOffRoute?: () => void
  speak?: (text: string) => void
}

function buildAnnouncement(step: RouteStep, distanceHint: "200" | "50"): string {
  const action = getManeuverLabel(step.maneuver.type, step.maneuver.modifier)
  const street = step.name ? ` – ${step.name}` : ""

  if (step.maneuver.type === "arrive") return "Megérkeztél a célállomásra."
  if (distanceHint === "200") return `${distanceHint} méter múlva ${action}${street}.`
  return `Most ${action}${street}.`
}

export function useNavigationSteps({ position, onOffRoute, speak }: Options) {
  const { mode, routes, selectedRouteIndex, currentStepIndex, advanceStep } = useNavigation()

  const offRouteCooldown = useRef(false)
  const positionRef = useRef(position)
  const announced200 = useRef<number>(-1)  // melyik step indexnél hangzott el a 200m-es jelzés
  const announced50 = useRef<number>(-1)   // melyik step indexnél hangzott el az 50m-es jelzés

  useEffect(() => { positionRef.current = position }, [position])

  const activeRoute = routes[selectedRouteIndex]
  const steps = activeRoute?.steps ?? []
  const currentStep = steps[currentStepIndex] ?? null
  const nextStep = steps[currentStepIndex + 1] ?? null

  // Step advance + hang triggerek pozíció változáskor
  useEffect(() => {
    if (mode !== "navigating" || !position || !currentStep) return

    const [mLng, mLat] = currentStep.maneuver.location
    const latDiff = (position.lat - mLat) * 111320
    const lngDiff = (position.lng - mLng) * 111320 * Math.cos((position.lat * Math.PI) / 180)
    const dist = Math.sqrt(latDiff ** 2 + lngDiff ** 2)

    // 200m-es jelzés – csak egyszer per step
    if (dist <= 200 && dist > 60 && announced200.current !== currentStepIndex) {
      announced200.current = currentStepIndex
      speak?.(buildAnnouncement(currentStep, "200"))
    }

    // 50m-es jelzés – csak egyszer per step
    if (dist <= 60 && announced50.current !== currentStepIndex) {
      announced50.current = currentStepIndex
      speak?.(buildAnnouncement(currentStep, "50"))
    }

    // Step advance
    if (dist < STEP_ADVANCE_THRESHOLD) {
      // Megérkezés – az utolsó step
      if (currentStepIndex === steps.length - 1 && currentStep.maneuver.type === "arrive") {
        speak?.("Megérkeztél a célállomásra.")
      }
      advanceStep()
    }
  }, [position, mode, currentStep, currentStepIndex, steps.length, advanceStep, speak])

  // Jelzések resetelése step váltáskor
  useEffect(() => {
    // Ha új step-re lépünk, az announced ref-ek már a currentStepIndex alapján működnek,
    // szóval külön reset nem kell – az index-alapú guard intézi
  }, [currentStepIndex])

  // Off-route detektálás 4 másodpercenként
  useEffect(() => {
    if (mode !== "navigating" || !activeRoute) return

    const interval = setInterval(() => {
      const pos = positionRef.current
      if (!pos || offRouteCooldown.current) return

      const dist = getDistanceToRoute(pos, activeRoute.geometry as [number, number][])
      if (dist > OFF_ROUTE_THRESHOLD) {
        offRouteCooldown.current = true
        speak?.("Letért az útról. Újratervezés.")
        onOffRoute?.()
        setTimeout(() => { offRouteCooldown.current = false }, OFF_ROUTE_COOLDOWN)
      }
    }, OFF_ROUTE_CHECK_INTERVAL)

    return () => clearInterval(interval)
  }, [mode, activeRoute, onOffRoute, speak])

  const remainingDistance = steps.slice(currentStepIndex).reduce((sum, s) => sum + s.distance, 0)
  const remainingDuration = steps.slice(currentStepIndex).reduce((sum, s) => sum + s.duration, 0)

  return { currentStep, nextStep, currentStepIndex, totalSteps: steps.length, remainingDistance, remainingDuration }
}
