import { Polyline, useMap } from "react-leaflet"
import { useEffect, useRef } from "react"
import { useNavigation } from "@/context/NavigationContext"
import L from "leaflet"

export default function RouteLayer() {
  const { mode, routes, selectedRouteIndex, selectRoute, currentStepIndex } = useNavigation()
  const map = useMap()
  const prevMode = useRef(mode)

  useEffect(() => {
    if (mode === "preview" && routes.length > 0) {
      const route = routes[selectedRouteIndex] ?? routes[0]
      const bounds = L.latLngBounds(route.geometry.map(([lat, lng]) => L.latLng(lat, lng)))
      const isMobile = map.getSize().x < 768
      map.fitBounds(bounds, {
        paddingTopLeft: isMobile ? [20, 110] : [60, 60],
        paddingBottomRight: isMobile ? [20, 300] : [60, 60],
        animate: true,
        duration: 0.8,
      })
    }
  }, [mode, routes, selectedRouteIndex, map])

  useEffect(() => {
    if (prevMode.current === "preview" && mode === "idle") {
      setTimeout(() => map.flyTo(map.getCenter(), 15, { duration: 1.0 }), 100)
    }
    prevMode.current = mode
  }, [mode, map])

  if (mode === "idle" || routes.length === 0) return null

  const activeRoute = routes[selectedRouteIndex]
  const visibleRoutes = mode === "navigating" ? [activeRoute] : routes

  const getRemainingGeometry = (): [number, number][] => {
    const geom = activeRoute.geometry as [number, number][]
    if (mode !== "navigating" || !activeRoute.steps?.length) return geom

    const currentStep = activeRoute.steps[currentStepIndex]
    if (!currentStep) return geom

    const [targetLng, targetLat] = currentStep.maneuver.location
    let closestIdx = 0
    let minDist = Infinity

    for (let i = 0; i < geom.length; i++) {
      const [lat, lng] = geom[i]
      const d = Math.abs(lat - targetLat) + Math.abs(lng - targetLng)
      if (d < minDist) { minDist = d; closestIdx = i }
    }

    return geom.slice(closestIdx)
  }

  return (
    <>
      {visibleRoutes.map((route, index) => {
        const routeIndex = mode === "navigating" ? selectedRouteIndex : index
        const isActive = routeIndex === selectedRouteIndex
        const geom = isActive && mode === "navigating"
          ? getRemainingGeometry()
          : route.geometry as [number, number][]

        return (
          <Polyline
            key={routeIndex}
            positions={geom.map(([lat, lng]) => L.latLng(lat, lng))}
            eventHandlers={{ click: () => selectRoute(routeIndex) }}
            pathOptions={{
              color: isActive ? "#3b82f6" : "#64748b",
              weight: isActive ? 6 : 4,
              opacity: isActive ? 1 : 0.6,
            }}
          />
        )
      })}
    </>
  )
}
