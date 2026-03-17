import axios from "axios"
import { useQuery } from "@tanstack/react-query"

const SEARCH_RADIUS_M = 25

const fetchSpeedLimit = async (lat: number, lng: number): Promise<number | null> => {
  const query = `
    [out:json][timeout:5];
    way(around:${SEARCH_RADIUS_M},${lat},${lng})["maxspeed"];
    out tags;
  `
  const { data } = await axios.post(
    "https://overpass-api.de/api/interpreter",
    `data=${encodeURIComponent(query)}`,
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  )

  if (!data.elements?.length) return null
  const raw: string = data.elements[0].tags?.maxspeed ?? ""
  const parsed = parseInt(raw, 10)
  return isNaN(parsed) ? null : parsed
}

export function useSpeedLimit(position: { lat: number; lng: number } | null) {
  const { data: speedLimit = null } = useQuery({
    queryKey: ["speedLimit", position?.lat.toFixed(4), position?.lng.toFixed(4)],
    queryFn: () => fetchSpeedLimit(position!.lat, position!.lng),
    enabled: !!position,
    staleTime: 30_000,    // 30 mp-ig friss, nem kérdezi le újra
    refetchInterval: 15_000,
    retry: false,
  })

  return speedLimit
}
