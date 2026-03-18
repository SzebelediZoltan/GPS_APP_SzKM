import { useMemo } from "react"
import type { MapMarker } from "@/hooks/map/useMarkers"

const NEARBY_THRESHOLD_M = 50

// Haversine távolság méterben
function distanceMeters(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371000
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function useNearbyMarker(
  position: { lat: number; lng: number } | null,
  markers: MapMarker[]
): MapMarker | null {
  return useMemo(() => {
    if (!position || markers.length === 0) return null

    let closest: MapMarker | null = null
    let minDist = Infinity

    for (const m of markers) {
      // Optimistic markereket (negatív id) kihagyjuk
      if (m.id < 0) continue

      const d = distanceMeters(
        position.lat, position.lng,
        Number(m.lat), Number(m.lng)
      )
      if (d < NEARBY_THRESHOLD_M && d < minDist) {
        minDist = d
        closest = m
      }
    }

    return closest
  }, [position, markers])
}
