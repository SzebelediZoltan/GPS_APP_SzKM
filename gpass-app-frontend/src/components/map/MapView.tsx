import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from "react-leaflet"
import L from "leaflet"
import { User, MapPin } from "lucide-react"
import { Link } from "@tanstack/react-router"
import { useAuth } from "@/hooks/useAuth"
import { useEffect, useState } from "react"
import LocateButton from "./LocateButton"
import NavigationPanel from "./NavigationPanel"
import RouteLayer from "./RouteLayer"
import NavigationPreviewPanel from "./NavigationPreviewPanel"

type Props = {
  position: { lat: number; lng: number }
}

const userIcon = L.divIcon({
  className: "",
  html: `
  <div class="relative flex items-center justify-center">

    <span class="
      absolute w-10 h-10
      bg-blue-500/20
      rounded-full
      animate-ping
    "></span>

    <span class="
      absolute w-6 h-6
      bg-blue-500/40
      rounded-full
    "></span>

    <span class="
      relative w-4 h-4
      bg-blue-600 dark:bg-blue-400
      border-2 border-white
      rounded-full
      shadow-lg
    "></span>

  </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
})

export default function MapView({ position }: Props) {
  const { user } = useAuth()
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  )


  const [centerOnUser, setCenterOnUser] =
    useState<() => void>(() => () => { })

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(
        document.documentElement.classList.contains("dark")
      )
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => observer.disconnect()
  }, [])

  const bounds = L.latLngBounds(
    L.latLng(-85, -180),
    L.latLng(85, 180)
  )

  return (
    <>
      <MapContainer
        center={[position.lat, position.lng]}
        zoom={15}
        minZoom={5}
        maxZoom={18}
        maxBounds={bounds}
        maxBoundsViscosity={1.0}
        worldCopyJump={false}
        zoomControl={false}
        style={{ height: "100vh", width: "100%" }}
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

        <CenterController
          position={position}
          setCenterFn={setCenterOnUser}
        />

        <Marker icon={userIcon} position={[position.lat, position.lng]}>
          <Popup closeButton={false} className="custom-popup">
            <div className="w-60 rounded-xl border border-border bg-card p-4 space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">
                  Itt vagy te
                </span>
              </div>

              {!!user ?
                <>
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <User className="w-4 h-4" />
                    <span className="text-muted-foreground">{user?.username}</span>
                  </div>

                  <Link
                    to="/profile/$userID"
                    params={{ userID: String(user?.userID) }}
                    className="w-full inline-flex justify-center rounded-lg border border-border bg-muted hover:bg-accent py-2 text-sm font-medium"
                  >
                    Profil megnyitása →
                  </Link>
                </> :
                <>
                </>
              }
            </div>
          </Popup>
        </Marker>

        <NavigationPanel currentPosition={position} />
        <RouteLayer />
        <LocateButton position={position} />
      </MapContainer>

      {/* FONTOS: EZ KÍVÜL VAN */}
      <NavigationPreviewPanel
        centerOnUser={centerOnUser}
      />
    </>
  )
}

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
      map.flyTo([position.lat, position.lng], 15, {
        duration: 0.8,
      })
    })
  }, [map, position, setCenterFn])

  return null
}