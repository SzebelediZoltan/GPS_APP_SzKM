import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet"
import L from "leaflet"
import "leaflet-rotate"
import { User, MapPin } from "lucide-react"
import { Link } from "@tanstack/react-router"
import { useAuth } from "@/hooks/useAuth"
import { useEffect, useState, useRef } from "react"
import { toast } from "sonner"
import LocateButton from "./LocateButton"
import NavigationPanel, { NavigationMobileSheet } from "./NavigationPanel"
import RouteLayer from "./RouteLayer"
import NavigationPreviewPanel from "./NavigationPreviewPanel"

type Props = {
  position: { lat: number; lng: number }
  heading: number | null
}

function createUserIcon(coneAngle: number | null): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `
      <div style="position:relative;width:40px;height:40px;display:flex;align-items:center;justify-content:center;">
        ${coneAngle !== null ? `
          <div style="
            position:absolute;width:0;height:0;
            border-left:7px solid transparent;
            border-right:7px solid transparent;
            border-bottom:20px solid rgba(59,130,246,0.65);
            left:13px;bottom:20px;
            transform-origin:7px 20px;
            transform:rotate(${coneAngle}deg);
          "></div>
        ` : ""}
        <span style="position:absolute;width:40px;height:40px;background:rgba(59,130,246,0.15);border-radius:50%;animation:gps-ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></span>
        <span style="position:absolute;width:24px;height:24px;background:rgba(59,130,246,0.3);border-radius:50%;"></span>
        <span style="position:relative;width:14px;height:14px;background:#2563eb;border:2.5px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.35);"></span>
      </div>
      <style>@keyframes gps-ping{75%,100%{transform:scale(1.7);opacity:0;}}</style>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  })
}

export default function MapView({ position, heading }: Props) {
  const { user } = useAuth()
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains("dark"))
  const [headingLock, setHeadingLock] = useState(false)
  const [lockFlash, setLockFlash] = useState(false)
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false)
  const positionRef = useRef(position)
  const mapRef = useRef<L.Map | null>(null)
  useEffect(() => { positionRef.current = position }, [position])

  const centerOnUser = () => {
    mapRef.current?.flyTo([positionRef.current.lat, positionRef.current.lng], 16, { duration: 0.9 })
  }

  // Lock gomb piros villanás
  const flashLock = () => {
    setLockFlash(true)
    setTimeout(() => setLockFlash(false), 600)
  }

  const handleToggleHeadingLock = async () => {
    if (!headingLock) {
      const DevOrEvent = DeviceOrientationEvent as any
      if (typeof DevOrEvent.requestPermission === "function") {
        try {
          const res = await DevOrEvent.requestPermission()
          if (res !== "granted") return
        } catch { return }
      }
    }
    setHeadingLock(prev => !prev)
  }

  useEffect(() => {
    const obs = new MutationObserver(() =>
      setIsDark(document.documentElement.classList.contains("dark"))
    )
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => obs.disconnect()
  }, [])

  const bounds = L.latLngBounds(L.latLng(-85, -180), L.latLng(85, 180))
  const coneAngle = heading !== null ? (headingLock ? 0 : heading) : null

  return (
    <div style={{ height: "calc(100dvh - env(safe-area-inset-top, 0px))", width: "100%", position: "relative" }}>
      <MapContainer
        center={[position.lat, position.lng]}
        zoom={15} minZoom={5} maxZoom={18}
        maxBounds={bounds} maxBoundsViscosity={1.0}
        worldCopyJump={false} zoomControl={false}
        rotate={true} bearing={0}
        rotateControl={false}
        style={{ height: "100%", width: "100%" }}
        ref={mapRef}
      >
        <TileLayer
          key={isDark ? "dark" : "light"}
          attribution="&copy; OpenStreetMap contributors"
          url={isDark
            ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          }
        />

        <MapController
          position={position}
          heading={heading}
          headingLock={headingLock}
          onLockedDragAttempt={() => {
            flashLock()
            toast.warning("A kamera zárolva van", {
              description: "A térkép mozgatásához kapcsold ki a zárolást.",
              duration: 2500,
            })
          }}
        />

        <Marker icon={createUserIcon(coneAngle)} position={[position.lat, position.lng]}>
          <Popup closeButton={false} className="custom-popup">
            <div className="w-60 rounded-xl border border-border bg-card p-4 space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Itt vagy te</span>
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

        <NavigationPanel currentPosition={position} onOpenMobile={() => setMobileSheetOpen(true)} />
        <RouteLayer />
        <LocateButton
          position={position}
          heading={heading}
          headingLock={headingLock}
          lockFlash={lockFlash}
          onToggleHeadingLock={handleToggleHeadingLock}
        />
      </MapContainer>

      <NavigationPreviewPanel centerOnUser={centerOnUser} />
      <NavigationMobileSheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen} currentPosition={position} />
    </div>
  )
}

// ─── MapController ────────────────────────────────────────────────────────────
function MapController({ position, heading, headingLock, onLockedDragAttempt }: {
  position: { lat: number; lng: number }
  heading: number | null
  headingLock: boolean
  onLockedDragAttempt: () => void
}) {
  const map = useMap()
  const refs = useRef({ position, heading, headingLock, lastBearing: 0 })
  const toastShownRef = useRef(false)

  useEffect(() => { refs.current.position = position }, [position])
  useEffect(() => { refs.current.heading = heading }, [heading])
  useEffect(() => { refs.current.headingLock = headingLock }, [headingLock])

  // Drag blokkolás lock esetén
  useMapEvents({
    mousedown: () => {
      if (!refs.current.headingLock) return
      // Ha lock be, megakadályozzuk a dragot a dragging handler letiltásával
    },
    dragstart: () => {
      if (!refs.current.headingLock) return
      // Drag elkezdődött lock közben → azonnal visszaállítjuk a pozíciót
      map.panTo([refs.current.position.lat, refs.current.position.lng], { animate: false })
      // Toast csak egyszer jelenjen meg egymás után
      if (!toastShownRef.current) {
        toastShownRef.current = true
        onLockedDragAttempt()
        setTimeout(() => { toastShownRef.current = false }, 3000)
      }
    },
  })

  // RAF: bearing + pozíció követés lock esetén
  useEffect(() => {
    let rafId: number
    const tick = () => {
      const { headingLock, heading, position, lastBearing } = refs.current
      if (headingLock && heading !== null) {
        const diff = Math.abs(((heading - lastBearing) + 180) % 360 - 180)
        if (diff > 1) {
          map.setBearing(359 - heading)
          refs.current.lastBearing = heading
        }
        const center = map.getCenter()
        if (
          Math.abs(center.lat - position.lat) > 0.00005 ||
          Math.abs(center.lng - position.lng) > 0.00005
        ) {
          map.panTo([position.lat, position.lng], { animate: true, duration: 0.3 })
        }
      }
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [map])

  // Lock váltás
  useEffect(() => {
    if (!headingLock) {
      map.setBearing(0)
      refs.current.lastBearing = 0
      return
    }
    const { lat, lng } = refs.current.position
    map.flyTo([lat, lng], map.getZoom(), { duration: 0.5 })
    if (refs.current.heading !== null) {
      map.setBearing(359 - refs.current.heading)
      refs.current.lastBearing = refs.current.heading
    }
  }, [headingLock, map])

  return null
}
