import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet"
import L from "leaflet"
import { User, MapPin, LocateFixed } from "lucide-react"
import { Link } from "@tanstack/react-router"
import { useAuth } from "@/hooks/useAuth"
import { useEffect, useState } from "react"
import NavigationPanel from "./NavigationPanel"
import RouteLayer from "./RouteLayer"
import NavigationPreviewPanel from "./NavigationPreviewPanel"

type Props = {
  position: { lat: number; lng: number }
}

/* ── User location dot ── */
const userIcon = L.divIcon({
  className: "",
  html: `
    <div style="position:relative;width:40px;height:40px;display:flex;align-items:center;justify-content:center;">
      <span style="
        position:absolute;width:36px;height:36px;
        background:rgba(59,130,246,0.15);
        border-radius:50%;
        animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;
      "></span>
      <span style="
        position:absolute;width:20px;height:20px;
        background:rgba(59,130,246,0.3);
        border-radius:50%;
      "></span>
      <span style="
        position:relative;width:13px;height:13px;
        background:#3b82f6;
        border:2.5px solid white;
        border-radius:50%;
        box-shadow:0 2px 8px rgba(59,130,246,0.6);
      "></span>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
})

/* ── Map center controller ── */
function CenterController({
  position,
  setCenterFn,
}: {
  position: { lat: number; lng: number }
  setCenterFn: (fn: () => void) => void
}) {
  const map = useMap()

  useEffect(() => {
    setCenterFn(() => () => {
      map.flyTo([position.lat, position.lng], 15, { duration: 0.8 })
    })
  }, [map, position, setCenterFn])

  return null
}

/* ── Locate button (inside MapContainer) ── */
function LocateButton({ position }: { position: { lat: number; lng: number } }) {
  const map = useMap()

  return (
    <div className="leaflet-top leaflet-right pointer-events-none">
      <div className="m-3 mt-4 pointer-events-auto">
        <button
          onClick={() => map.flyTo([position.lat, position.lng], 17, { duration: 0.8 })}
          className="
            group w-11 h-11 rounded-xl
            bg-card/95 backdrop-blur
            border border-border/60
            shadow-lg shadow-black/20
            flex items-center justify-center
            hover:bg-accent hover:border-primary/30
            hover:shadow-primary/10
            active:scale-95
            transition-all duration-200
            cursor-pointer
          "
          title="Saját pozíció"
        >
          <LocateFixed className="w-4.5 h-4.5 text-primary group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  )
}

/* ── Main component ── */
export default function MapView({ position }: Props) {
  const { user } = useAuth()
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  )
  const [centerOnUser, setCenterOnUser] = useState<() => void>(() => () => {})

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"))
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })
    return () => observer.disconnect()
  }, [])

  const bounds = L.latLngBounds(L.latLng(-85, -180), L.latLng(85, 180))

  return (
    <div className="relative" style={{ height: "100vh", width: "100%" }}>
      <MapContainer
        center={[position.lat, position.lng]}
        zoom={15}
        minZoom={5}
        maxZoom={18}
        maxBounds={bounds}
        maxBoundsViscosity={1.0}
        worldCopyJump={false}
        zoomControl={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          key={isDark ? "dark" : "light"}
          attribution="&copy; OpenStreetMap contributors"
          url={
            isDark
              ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          }
        />

        <CenterController position={position} setCenterFn={setCenterOnUser} />

        {/* User marker */}
        <Marker icon={userIcon} position={[position.lat, position.lng]}>
          <Popup closeButton={false} className="custom-popup">
            <div className="w-56 rounded-xl border border-border bg-card p-3.5 space-y-2.5 shadow-xl">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-500/15 flex items-center justify-center">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <span className="text-sm font-semibold">Jelenlegi pozíció</span>
              </div>

              {user ? (
                <>
                  <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-background/50 px-2.5 py-1.5">
                    <User className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{user.username}</span>
                  </div>
                  <Link
                    to="/profile/$userID"
                    params={{ userID: String(user.userID) }}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-border/60 bg-muted hover:bg-accent py-1.5 text-xs font-semibold transition-colors"
                  >
                    Profil megnyitása
                  </Link>
                </>
              ) : null}
            </div>
          </Popup>
        </Marker>

        <NavigationPanel currentPosition={position} />
        <RouteLayer />
        <LocateButton position={position} />
      </MapContainer>

      {/* Navigation preview — outside MapContainer, covers the map */}
      <NavigationPreviewPanel centerOnUser={centerOnUser} />
    </div>
  )
}
