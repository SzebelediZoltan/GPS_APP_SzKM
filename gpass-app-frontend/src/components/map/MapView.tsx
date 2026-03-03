import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import { User, MapPin } from "lucide-react"
import { Link } from "@tanstack/react-router"
import { useAuth } from "@/hooks/useAuth"
import { useEffect, useState } from "react"
import LocateButton from "./LocateButton"

type Props = {
  position: { lat: number; lng: number }
}

const userIcon = L.divIcon({
  className: "",
  html: `
    <div class="relative w-6 h-6 flex items-center justify-center">

      <span class="
        absolute w-6 h-6
        bg-blue-400/20
        rounded-full
        animate-ping
      "></span>

      <span class="
        absolute w-4 h-4
        bg-blue-500/30
        rounded-full
      "></span>

      <span class="
        relative w-3 h-3
        bg-blue-600 dark:bg-blue-400
        border-2 border-white
        rounded-full
        shadow-lg
      "></span>

    </div>
    `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
})

// Fix Leaflet ikon hiba
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

export default function MapView({ position }: Props) {

  const { user } = useAuth()
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  )

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
        key={isDark ? "dark" : "light"} // EZ FONTOS
        attribution="&copy; OpenStreetMap contributors"
        url={
          isDark
            ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        }
      />

      <Marker
        position={[position.lat, position.lng]}
        icon={userIcon}
      >
        <Popup
          closeButton={false}
          className="custom-popup"
        >
          <div
            className="
              w-60
              rounded-xl
              border border-border
              bg-card
              text-card-foreground
              shadow-md
              p-4
              space-y-4
            "
          >
            {/* Header */}
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">
                Itt vagy te
              </span>
            </div>

            {/* Username */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              {user?.username}
            </div>

            {/* GOMB */}
            <Link
              to="/profile/$userID"
              params={{ userID: String(user?.userID) }}
              className="
                inline-flex items-center justify-center
                w-full
                rounded-lg
                border border-border
                bg-muted
                hover:bg-accent
                text-sm font-medium
                py-2
                transition-colors
              "
            >
              Profil megnyitása →
            </Link>
          </div>
        </Popup>
      </Marker>
      <LocateButton position={position} />
    </MapContainer>
  )
}