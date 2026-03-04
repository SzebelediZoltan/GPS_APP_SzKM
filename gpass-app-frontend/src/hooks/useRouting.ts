import { useState } from "react"

export type RouteData = {
  geometry: [number, number][]
  distance: number
  duration: number
}

export function useRouting() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const planRoute = async (
    start: { lat: number; lng: number },
    end: { lat: number; lng: number }
  ): Promise<RouteData[]> => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson&alternatives=true`
      )

      const data = await res.json()

      if (!data.routes || data.routes.length === 0) {
        return []
      }

      return data.routes.map((route: any) => ({
        geometry: route.geometry.coordinates.map(
          ([lng, lat]: [number, number]) => [lat, lng]
        ),
        distance: route.distance,
        duration: route.duration,
      }))
    } catch (err) {
      setError("Nem sikerült útvonalat tervezni.")
      return []
    } finally {
      setLoading(false)
    }
  }

  return {
    planRoute,
    loading,
    error,
  }
}