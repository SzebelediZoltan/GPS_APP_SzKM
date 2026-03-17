import axios from "axios"
import { useMutation } from "@tanstack/react-query"

export type ManeuverType =
  | "depart" | "arrive" | "turn" | "new name" | "merge"
  | "on ramp" | "off ramp" | "fork" | "end of road" | "continue"
  | "roundabout" | "rotary" | "roundabout turn" | "notification"
  | "exit roundabout" | "exit rotary"

export type ManeuverModifier =
  | "uturn" | "sharp right" | "right" | "slight right"
  | "straight" | "slight left" | "left" | "sharp left"

export type RouteStep = {
  distance: number
  duration: number
  name: string
  maneuver: {
    type: ManeuverType
    modifier?: ManeuverModifier
    location: [number, number] // [lng, lat]
  }
}

export type RouteData = {
  geometry: [number, number][]
  distance: number
  duration: number
  steps: RouteStep[]
}

type PlanRouteParams = {
  start: { lat: number; lng: number }
  end: { lat: number; lng: number }
}

/* -------------------- AXIOS -------------------- */

const fetchOSRMRoute = async ({ start, end }: PlanRouteParams): Promise<RouteData[]> => {
  const { data } = await axios.get(
    `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}`,
    { params: { overview: "full", geometries: "geojson", alternatives: 3, steps: true } }
  )

  if (!data.routes?.length) return []

  return data.routes.map((route: any) => ({
    geometry: route.geometry.coordinates.map(([lng, lat]: [number, number]) => [lat, lng]),
    distance: route.distance,
    duration: route.duration,
    steps: route.legs.flatMap((leg: any) =>
      leg.steps.map((step: any) => ({
        distance: step.distance,
        duration: step.duration,
        name: step.name ?? "",
        maneuver: {
          type: step.maneuver.type,
          modifier: step.maneuver.modifier,
          location: step.maneuver.location,
        },
      }))
    ),
  }))
}

const fetchNominatim = async (query: string) => {
  const { data } = await axios.get("https://nominatim.openstreetmap.org/search", {
    params: { format: "json", q: query, limit: 5, addressdetails: 0 },
    headers: { "Accept-Language": "hu" },
  })
  return data as NominatimResult[]
}

export type NominatimResult = {
  place_id: number
  display_name: string
  lat: string
  lon: string
}

/* -------------------- HOOKS -------------------- */

export function useRouting() {
  const { mutateAsync: planRoute, isPending: loading, error } = useMutation({
    mutationFn: fetchOSRMRoute,
  })

  return { planRoute, loading, error }
}

export function useNominatimSearch() {
  const { mutateAsync: search, isPending: searching } = useMutation({
    mutationFn: fetchNominatim,
  })

  return { search, searching }
}
