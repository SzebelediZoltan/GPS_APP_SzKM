import { useEffect, useRef, useState } from "react"
import { ThumbsUp, ThumbsDown, X } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"
import { useQueryClient } from "@tanstack/react-query"
import type { MapMarker, BBox } from "@/hooks/map/useMarkers"

const MARKER_LABELS: Record<string, string> = {
  police:    "Rendőri ellenőrzés",
  accident:  "Baleset",
  danger:    "Veszély",
  roadblock: "Útlezárás",
  speedtrap: "Sebességmérő kamera",
  traffic:   "Forgalomtorlódás",
  other:     "Egyéb jelzés",
}

const MARKER_COLORS: Record<string, string> = {
  police:    "#3b82f6",
  accident:  "#ef4444",
  danger:    "#f97316",
  roadblock: "#eab308",
  speedtrap: "#8b5cf6",
  traffic:   "#f59e0b",
  other:     "#64748b",
}

type Props = {
  marker: MapMarker | null
  userID: string | undefined
  bbox: BBox | null
}

export default function NearbyMarkerBanner({ marker, userID, bbox }: Props) {
  const queryClient = useQueryClient()
  const [dismissed, setDismissed] = useState<number | null>(null)
  const [voted, setVoted] = useState<number | null>(null)
  const prevMarkerIdRef = useRef<number | null>(null)

  // Új markernél reseteljük a dismissed/voted állapotot
  useEffect(() => {
    if (marker && marker.id !== prevMarkerIdRef.current) {
      prevMarkerIdRef.current = marker.id
      setDismissed(null)
      setVoted(null)
    }
  }, [marker?.id])

  if (!marker) return null
  if (dismissed === marker.id) return null
  if (voted === marker.id) return null

  const label = MARKER_LABELS[marker.marker_type] ?? "Jelzés"
  const color = MARKER_COLORS[marker.marker_type] ?? "#64748b"

  const handleConfirm = async () => {
    if (!userID) return
    try {
      await axios.put(`/api/markers/${marker.id}`, {
        marker_type: marker.marker_type,
        score: marker.score + 1,
        lat: Number(marker.lat),
        lng: Number(marker.lng),
        creator_id: Number(marker.creator_id),
      })
      setVoted(marker.id)
      queryClient.invalidateQueries({ queryKey: ["markers", bbox] })
      toast.success("Megerősítve, köszönjük!")
    } catch {
      toast.error("Nem sikerült megerősíteni.")
    }
  }

  const handleFalse = async () => {
    if (!userID) return
    try {
      const newScore = marker.score - 1
      if (newScore < -3) {
        // Túl sok téves jelzés → törlés
        await axios.delete(`/api/markers/${marker.id}`)
        queryClient.invalidateQueries({ queryKey: ["markers", bbox] })
        toast.info("Jelzés eltávolítva — köszönjük a visszajelzést!")
      } else {
        await axios.put(`/api/markers/${marker.id}`, {
          marker_type: marker.marker_type,
          score: newScore,
          lat: Number(marker.lat),
          lng: Number(marker.lng),
          creator_id: Number(marker.creator_id),
        })
        queryClient.invalidateQueries({ queryKey: ["markers", bbox] })
        toast.success("Visszajelzés rögzítve.")
      }
      setVoted(marker.id)
    } catch {
      toast.error("Nem sikerült elküldeni a visszajelzést.")
    }
  }

  return (
    <div
      className="pointer-events-auto absolute inset-x-0 bottom-0 z-1100 flex justify-center px-4 pb-[calc(4rem+1.2rem)]"
      style={{ pointerEvents: "none" }}
    >
      <div
        className="pointer-events-auto w-full max-w-sm rounded-2xl border bg-card/95 backdrop-blur shadow-2xl shadow-black/30 overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300"
        style={{ borderColor: `${color}40` }}
      >
        {/* Színes csík a tetején */}
        <div className="h-1" style={{ background: color }} />

        <div className="flex items-center gap-3 px-4 py-3">
          {/* Ikon körke */}
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold"
            style={{ background: color }}
          >
            !
          </div>

          {/* Szöveg */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground truncate">{label}</p>
            <p className="text-[11px] text-muted-foreground">A közeledben — erősítsd meg vagy jelöld tévesnek</p>
          </div>

          {/* Bezárás */}
          <button
            onClick={() => setDismissed(marker.id)}
            className="shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Gombok */}
        <div className="flex border-t border-border/40">
          <button
            onClick={handleFalse}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition cursor-pointer border-r border-border/40"
          >
            <ThumbsDown className="w-3.5 h-3.5" />
            Téves
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold hover:bg-green-500/10 transition cursor-pointer"
            style={{ color: color }}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            Megerősítés
          </button>
        </div>
      </div>
    </div>
  )
}
