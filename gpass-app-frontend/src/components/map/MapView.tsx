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

// heading: a kúp szöge amit kapjon
// null → nincs kúp
function createUserIcon(coneAngle: number | null): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `
      <div style="position:relative;width:40px;height:40px;display:flex;align-items:center;justify-content:center;">
        ${coneAngle !== null ? `
          <div style="
            position:absolute;
            width:0;height:0;
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
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  )
  const [headingLock, setHeadingLock] = useState(false)
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false)
  const [centerOnUser, setCenterOnUser] = useState<() => void>(() => () => { })

  const requestCompassPermission = async () => {
    const DevOrEvent = DeviceOrientationEvent as any
    if (typeof DevOrEvent.requestPermission === "function") {
      try {
        const result = await DevOrEvent.requestPermission()
        if (result !== "granted") return false
      } catch { return false }
    }
    return true
  }

  const handleToggleHeadingLock = async () => {
    if (!headingLock) {
      const ok = await requestCompassPermission()
      if (!ok) return
    }
    setHeadingLock(prev => !prev)
  }

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"))
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

  const bounds = L.latLngBounds(L.latLng(-85, -180), L.latLng(85, 180))

  // Lock ki: kúp = heading (statikus térkép, kúp forog)
  // Lock be: kúp = 0   (térkép forog heading-re, kúp fix "előre")
  const coneAngle = heading !== null
    ? (headingLock ? 0 : heading)
    : null

  const userIcon = createUserIcon(coneAngle)

  return (
    <div style={{
      height: "calc(100dvh - env(safe-area-inset-top, 0px))",
      width: "100%",
      position: "relative",
    }}>
      <MapContainer
        center={[position.lat, position.lng]}
        zoom={15}
        minZoom={5}
        maxZoom={18}
        maxBounds={bounds}
        maxBoundsViscosity={1.0}
        worldCopyJump={false}
        zoomControl={false}
        rotate={true}
        bearing={0}
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

        <MapController
          position={position}
          heading={heading}
          headingLock={headingLock}
          onDrag={() => setHeadingLock(false)}
          setCenterFn={setCenterOnUser}
        />

        <ConeUpdater coneAngle={coneAngle} />

        <Marker icon={userIcon} position={[position.lat, position.lng]}>
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

        <NavigationPanel
          currentPosition={position}
          onOpenMobile={() => setMobileSheetOpen(true)}
        />
        <RouteLayer />
        <LocateButton
          position={position}
          heading={heading}
          headingLock={headingLock}
          onToggleHeadingLock={handleToggleHeadingLock}
        />
      </MapContainer>

      <NavigationPreviewPanel centerOnUser={centerOnUser} />
      <NavigationMobileSheet
        open={mobileSheetOpen}
        onOpenChange={setMobileSheetOpen}
        currentPosition={position}
      />
    </div>
  )
}

// DOM-on direkt frissíti a kúpot – Leaflet nem regenerálja az ikont minden rendernél
function ConeUpdater({ coneAngle }: { coneAngle: number | null }) {
  useEffect(() => {
    const cone = document.querySelector(".leaflet-marker-icon .gps-cone") as HTMLElement | null
      ?? document.getElementById("gps-cone-el")

    // querySelector fallback – keressük a cone div-et a marker ikonban
    const allMarkers = document.querySelectorAll(".leaflet-marker-icon div[style*='border-bottom']")
    const coneEl = allMarkers[0] as HTMLElement | undefined

    if (!coneEl) return

    if (coneAngle === null) {
      coneEl.style.display = "none"
    } else {
      coneEl.style.display = "block"
      coneEl.style.transform = `rotate(${coneAngle}deg)`
    }
  }, [coneAngle])

  return null
}

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
  const lastBearingRef = useRef<number>(0)

  useEffect(() => { headingRef.current = heading }, [heading])
  useEffect(() => { lockRef.current = headingLock }, [headingLock])
  useEffect(() => { positionRef.current = position }, [position])

  useEffect(() => {
    setCenterFn(() => () => {
      map.flyTo([position.lat, position.lng], map.getZoom(), { duration: 0.8 })
    })
  }, [map, position, setCenterFn])

  useMapEvents({
    dragstart: () => {
      if (lockRef.current) onDrag()
    },
  })

  useEffect(() => {
    if (!headingLock) {
      map.setBearing(0)
      lastBearingRef.current = 0
      return
    }
    if (heading === null) return

    map.panTo([positionRef.current.lat, positionRef.current.lng], { animate: false })
    map.setBearing(359 - heading)
    lastBearingRef.current = heading

    let rafId: number
    const tick = () => {
      if (!lockRef.current) return
      const current = headingRef.current
      if (current !== null) {
        const diff = Math.abs(((current - lastBearingRef.current) + 180) % 360 - 180)
        if (diff > 1) {
          map.setBearing(359 - current)
          lastBearingRef.current = current
        }
      }
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [headingLock, map])

  return null
}
