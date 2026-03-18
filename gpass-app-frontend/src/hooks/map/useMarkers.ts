import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

// ── Típusok ──

export type MarkerType =
  | "danger" | "police" | "accident"
  | "traffic" | "roadblock" | "speedtrap" | "other"

export type MapMarker = {
  id: number
  creator_id: number
  marker_type: MarkerType
  score: number
  lat: number
  lng: number
  created_at: string
}

export type BBox = {
  minLat: number; maxLat: number
  minLng: number; maxLng: number
}

// ── API ──

const fetchMarkersInBox = async (bbox: BBox): Promise<MapMarker[]> => {
  const { data } = await axios.get("/api/markers/box", { params: bbox })
  return data
}

const createMarker = async (payload: {
  creator_id: string
  marker_type: MarkerType
  lat: number
  lng: number
}): Promise<MapMarker> => {
  const { data } = await axios.post("/api/markers", payload)
  return data
}

// ── Fő hook ──

export function useMarkers(
  enabled: boolean,
  bbox: BBox | null,
) {
  const queryClient = useQueryClient()

  const markersQuery = useQuery({
    queryKey: ["markers", bbox?.minLat, bbox?.maxLat, bbox?.minLng, bbox?.maxLng],
    queryFn: () => fetchMarkersInBox(bbox!),
    enabled: enabled && !!bbox,
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 60,
  })

  const { mutate: placeMarker, isPending: isPlacing } = useMutation({
    mutationFn: createMarker,
    // Optimistic update — azonnal megjelenik a marker, nem vár a backendre
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ["markers", bbox] })
      const previous = queryClient.getQueryData<MapMarker[]>(["markers", bbox])

      const optimistic: MapMarker = {
        id: -Date.now(), // ideiglenes negatív id
        creator_id: Number(payload.creator_id),
        marker_type: payload.marker_type,
        score: 0,
        lat: payload.lat,
        lng: payload.lng,
        created_at: new Date().toISOString(),
      }

      queryClient.setQueryData<MapMarker[]>(["markers", bbox], (old) => [
        ...(old ?? []),
        optimistic,
      ])

      return { previous }
    },
    onError: (_err, _vars, context) => {
      // Visszaállítjuk az előző állapotot hiba esetén
      if (context?.previous) {
        queryClient.setQueryData(["markers", bbox], context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["markers", bbox] })
    },
  })

  return {
    markers: markersQuery.data ?? [],
    isLoading: markersQuery.isLoading,
    placeMarker,
    isPlacing,
  }
}
