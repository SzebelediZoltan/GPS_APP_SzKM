import { useCallback, useEffect, useRef, useState } from "react"
import { Marker, Popup, useMap, useMapEvents } from "react-leaflet"
import L from "leaflet"
import { renderToStaticMarkup } from "react-dom/server"
import {
  ShieldAlert, Car, AlertTriangle, Construction,
  Camera, CircleAlert, HelpCircle, ThumbsUp
} from "lucide-react"
import { toast } from "sonner"
import axios from "axios"
import { useQueryClient } from "@tanstack/react-query"
import type { MapMarker, MarkerType, BBox } from "@/hooks/map/useMarkers"

// ── Marker konfiguráció ──

type MarkerConfig = {
  label: string
  color: string
  bg: string
  Icon: React.ComponentType<{ size?: number; color?: string }>
}

const MARKER_CONFIG: Record<MarkerType, MarkerConfig> = {
  police:    { label: "Rendőri ellenőrzés", color: "#3b82f6", bg: "#1e3a5f", Icon: ShieldAlert },
  accident:  { label: "Baleset",            color: "#ef4444", bg: "#5f1e1e", Icon: Car },
  danger:    { label: "Veszély",            color: "#f97316", bg: "#5f3a1e", Icon: AlertTriangle },
  roadblock: { label: "Útlezárás",          color: "#eab308", bg: "#5f4e1e", Icon: Construction },
  speedtrap: { label: "Sebességmérő",       color: "#8b5cf6", bg: "#3a1e5f", Icon: Camera },
  traffic:   { label: "Forgalom",           color: "#f59e0b", bg: "#5f4a1e", Icon: CircleAlert },
  other:     { label: "Egyéb",              color: "#64748b", bg: "#2a3040", Icon: HelpCircle },
}

// ── Marker ikon — SVG string renderToStaticMarkup-pal ──

function createMarkerIcon(type: MarkerType): L.DivIcon {
  const cfg = MARKER_CONFIG[type]
  const { Icon } = cfg

  const svgString = renderToStaticMarkup(
    <div style={{
      width: 32, height: 32, borderRadius: "50%",
      background: cfg.bg,
      border: `2px solid ${cfg.color}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: `0 2px 6px rgba(0,0,0,0.4)`,
    }}>
      <Icon size={14} color={cfg.color} />
    </div>
  )

  return L.divIcon({
    className: "",
    html: svgString,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -22],
  })
}

// ── BBox figyelő ──

export function BBoxWatcher({ onBBoxChange }: { onBBoxChange: (b: BBox) => void }) {
  const map = useMap()
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cbRef = useRef(onBBoxChange)
  useEffect(() => { cbRef.current = onBBoxChange }, [onBBoxChange])

  const update = useCallback((m: L.Map) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      const b = m.getBounds()
      cbRef.current({ minLat: b.getSouth(), maxLat: b.getNorth(), minLng: b.getWest(), maxLng: b.getEast() })
    }, 300)
  }, [])

  useEffect(() => {
    update(map)
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }
  }, [map, update])

  useMapEvents({
    moveend: (e) => update(e.target),
    zoomend: (e) => update(e.target),
  })

  return null
}

// ── Popup tartalom ──

function MarkerPopupContent({
  marker, userID
}: {
  marker: MapMarker
  userID: string | undefined
  bbox: BBox | null
}) {
  const queryClient = useQueryClient()
  const cfg = MARKER_CONFIG[marker.marker_type]
  const { Icon } = cfg
  const [upvoted, setUpvoted] = useState(false)

  const timeSince = (d: string) => {
    const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000)
    if (m < 1) return "Most"
    if (m < 60) return `${m} perce`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h} órája`
    return `${Math.floor(h / 24)} napja`
  }

  const handleUpvote = async () => {
    if (upvoted || !userID) return
    try {
      await axios.put(`/api/markers/${marker.id}`, {
        marker_type: marker.marker_type,
        score: marker.score + 1,
        lat: Number(marker.lat),
        lng: Number(marker.lng),
        creator_id: Number(marker.creator_id),
      })
      setUpvoted(true)
      queryClient.invalidateQueries({ queryKey: ["markers"] })
      toast.success("Megerősítve!")
    } catch {
      toast.error("Nem sikerült megerősíteni.")
    }
  }

  return (
    <div style={{ width: 200 }}>
      {/* Fejléc — ikon + szöveg egy sorban */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <div style={{
          width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
          background: cfg.bg, border: `2px solid ${cfg.color}`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon size={15} color={cfg.color} />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground" style={{ margin: 0, lineHeight: 1.2 }}>{cfg.label}</p>
          <p className="text-muted-foreground" style={{ margin: 0, fontSize: 11, lineHeight: 1.3 }}>{timeSince(marker.created_at)}</p>
        </div>
      </div>

      {/* Score + megerősítés */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{marker.score} megerősítés</span>
        {userID && (
          <button
            onClick={handleUpvote}
            disabled={upvoted}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${
              upvoted
                ? "border-green-500/40 bg-green-500/10 text-green-400"
                : "border-border hover:border-primary/40 hover:bg-primary/10 hover:text-primary text-muted-foreground"
            }`}
          >
            <ThumbsUp className="w-3 h-3" />
            {upvoted ? "Megerősítve" : "Megerősítés"}
          </button>
        )}
      </div>
    </div>
  )
}

// ── Zoom figyelő ──

function useZoom() {
  const map = useMap()
  const [zoom, setZoom] = useState(map.getZoom())
  useMapEvents({ zoomend: (e) => setZoom(e.target.getZoom()) })
  return zoom
}

// ── Fő komponens ──

const MIN_ZOOM = 14

export default function MarkerLayer({ markers, userID, bbox }: {
  markers: MapMarker[]
  userID: string | undefined
  bbox: BBox | null
}) {
  const zoom = useZoom()

  const icons = useRef(
    Object.fromEntries(
      Object.keys(MARKER_CONFIG).map((t) => [t, createMarkerIcon(t as MarkerType)])
    ) as Record<MarkerType, L.DivIcon>
  ).current

  // 14-es zoom alatt ne jelenjenek meg
  if (zoom < MIN_ZOOM) return null

  return (
    <>
      {markers.map((m) => (
        <Marker
          key={m.id}
          position={[Number(m.lat), Number(m.lng)]}
          icon={icons[m.marker_type]}
        >
          <Popup
            closeButton={false}
            className="custom-popup"
            minWidth={208}
          >
            <div className="rounded-xl bg-card border border-border p-3.5 shadow-xl">
              <MarkerPopupContent marker={m} userID={userID} bbox={bbox} />
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  )
}

export { MARKER_CONFIG }
