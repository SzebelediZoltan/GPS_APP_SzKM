import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet"
import L from "leaflet"
import "leaflet-rotate"
import { User, MapPin } from "lucide-react"
import { Link } from "@tanstack/react-router"
import { useAuth } from "@/hooks/useAuth"
import { useEffect, useState, useRef } from "react"
import LocateButton from "./LocateButton"
import NavigationPanel, { NavigationMobileSheet } from "./NavigationPanel"
import RouteLayer from "./RouteLayer"
import NavigationPreviewPanel from "./NavigationPreviewPanel"

type Props = {
  position: { lat: number; lng: number }
  heading: number | null
}

// Kúp: 40×40px ikon, iconAnchor [20,20].
// A kúp aljának közepe = forgáspont → transform-origin: 7px 20px
// heading lock esetén a térkép forog, a kúpnak 0 fokot adunk (mindig "fel" néz az ikonon)
function createUserIcon(heading: number | null, headingLock: boolean): L.DivIcon {
  // Ha heading lock be van kapcsolva, a térkép maga forog → a kúp mindig "fel" néz
  // Ha nincs lock, a kúp forog a heading szerint a statikus térképen
  const coneAngle = headingLock ? 0 : heading

  return L.divIcon({
    className: "",
    html: `
      <div style="position:relative;width:40px;height:40px;display:flex;align-items:center;justify-content:center;">

        ${coneAngle !== null ? `
          <div style="
            position: absolute;
            width: 0; height: 0;
            border-left: 7px solid transparent;
            border-right: 7px solid transparent;
            border-bottom: 20px solid rgba(59,130,246,0.65);
            left: 13px;
            bottom: 20px;
            transform-origin: 7px 20px;
            transform: rotate(${coneAngle}deg);
          "></div>
        ` : ""}

        <span style="
          position:absolute;width:40px;height:40px;
          background:rgba(59,130,246,0.15);border-radius:50%;
          animation:gps-ping 1.5s cubic-bezier(0,0,0.2,1) infinite;
        "></span>

        <span style="
          position:absolute;width:24px;height:24px;
          background:rgba(59,130,246,0.3);border-radius:50%;
        "></span>

        <span style="
          position:relative;width:14px;height:14px;
          background:#2563eb;border:2.5px solid white;
          border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.35);
        "></span>
      </div>

      <style>
        @keyframes gps-ping {
          75%,100%{transform:scale(1.7);opacity:0;}
        }
      </style>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  })
}

export default function MapView({ position, heading }: Props) {
  const { user } = useAuth()
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  )
  const [headingLock, setHeadingLock] = useState(false)
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false)
  const [centerOnUser, setCenterOnUser] = useState<() => void>(() => () => { })

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
  const userIcon = createUserIcon(heading, headingLock)

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
        rotateControl={false}
        rotate={true}
        bearing={0}
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

        <MapController
          position={position}
          heading={heading}
          headingLock={headingLock}
          onDrag={() => setHeadingLock(false)}
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
              {!!user && (
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
                </>
              )}
            </div>
          </Popup>
        </Marker>

        <NavigationPanel
          currentPosition={position}
          onOpenMobile={() => setMobileSheetOpen(true)}
        />
        <RouteLayer />
        <LocateButton
          position={position}
          heading={heading}
          headingLock={headingLock}
          onToggleHeadingLock={() => setHeadingLock(prev => !prev)}
        />
      </MapContainer>

      <NavigationPreviewPanel centerOnUser={centerOnUser} />
      <NavigationMobileSheet
        open={mobileSheetOpen}
        onOpenChange={setMobileSheetOpen}
        currentPosition={position}
      />
    </>
  )
}

// ─── Belső controller – heading lock + drag figyelés ────────────────────────
function MapController({
  position,
  heading,
  headingLock,
  onDrag,
  setCenterFn,
}: {
  position: { lat: number; lng: number }
  heading: number | null
  headingLock: boolean
  onDrag: () => void
  setCenterFn: (fn: () => void) => void
}) {
  const map = useMap()
  const headingRef = useRef(heading)
  const lockRef = useRef(headingLock)
  const positionRef = useRef(position)

  useEffect(() => { headingRef.current = heading }, [heading])
  useEffect(() => { lockRef.current = headingLock }, [headingLock])
  useEffect(() => { positionRef.current = position }, [position])

  // Recenter függvény kiajánlása felfelé
  useEffect(() => {
    setCenterFn(() => () => {
      map.flyTo([position.lat, position.lng], map.getZoom(), { duration: 0.8 })
    })
  }, [map, position, setCenterFn])

  // Drag → lock ki
  useMapEvents({
    dragstart: () => {
      if (lockRef.current) onDrag()
    },
  })

  // Heading lock: térkép forgatása + követés
  useEffect(() => {
    if (!headingLock || heading === null) {
      // Lock kikapcs → bearing visszaállítás észak felé
      if (!headingLock) {
        map.setBearing(0)
      }
      return
    }

    // Azonnal beállít
    map.setBearing(heading)
    map.panTo([positionRef.current.lat, positionRef.current.lng], {
      animate: true,
      duration: 0.3,
    })

    // Folyamatos frissítés heading változásra
    const interval = setInterval(() => {
      if (!lockRef.current) return
      if (headingRef.current !== null) {
        map.setBearing(headingRef.current)
      }
      map.panTo([positionRef.current.lat, positionRef.current.lng], {
        animate: true,
        duration: 0.4,
      })
    }, 500)

    return () => clearInterval(interval)
  }, [headingLock, map])

  return null
}
