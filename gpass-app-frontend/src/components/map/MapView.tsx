import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet"
import L from "leaflet"
import "leaflet-rotate"
import { User, MapPin, Compass as CompassIcon, EyeOff } from "lucide-react"
import { Link } from "@tanstack/react-router"
import { useEffect, useState, useRef, useCallback, useMemo } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useNavigation } from "@/context/NavigationContext"
import MapController from "./MapController"
import LocateButton from "./LocateButton"
import NavigationPanel, { NavigationMobileSheet } from "./NavigationPanel"
import NavigationPreviewPanel from "./NavigationPreviewPanel"
import RouteLayer from "./RouteLayer"
import TurnByTurnPanel from "./TurnByTurnPanel"
import SpeedDisplay from "./SpeedDisplay"
import AIPOISearchButton, { POIMarkers, SearchRadiusCircle } from "./AIPOISearch"
import FriendMarkers from "./FriendMarkers"
import FriendsListPanel from "./FriendsListPanel"
import MarkerLayer, { BBoxWatcher } from "./MarkerLayer"
import MarkerPlacementSheet from "./MarkerPlacementSheet"
import NearbyMarkerBanner from "./NearbyMarkerBanner"
import { useMapSocket } from "@/hooks/map/useMapSocket"
import { useMapSocialData } from "@/hooks/map/useMapSocialData"
import { useMarkers } from "@/hooks/map/useMarkers"
import { useNearbyMarker } from "@/hooks/map/useNearbyMarker"
import type { POIResult } from "@/hooks/map/useAIPOISearch"
import type { BBox, MarkerType } from "@/hooks/map/useMarkers"
import { toast } from "sonner"

type Props = {
  position: { lat: number; lng: number }
  heading: number | null
  speed: number | null
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

// ── Longpress figyelő (MapContainer-en belül) ──
function LongPressHandler({
  enabled,
  onLongPress,
}: {
  enabled: boolean
  onLongPress: (latlng: { lat: number; lng: number }) => void
}) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const movedRef = useRef(false)

  useMapEvents({
    mousedown: (e) => {
      if (!enabled) return
      movedRef.current = false
      timerRef.current = setTimeout(() => {
        if (!movedRef.current) onLongPress({ lat: e.latlng.lat, lng: e.latlng.lng })
      }, 600)
    },
    mousemove: () => { movedRef.current = true },
    mouseup: () => { if (timerRef.current) clearTimeout(timerRef.current) },

    // Mobil touch
    contextmenu: (e) => {
      if (!enabled) return
      e.originalEvent.preventDefault()
      onLongPress({ lat: e.latlng.lat, lng: e.latlng.lng })
    },
  })

  return null
}

export default function MapView({ position, heading, speed }: Props) {
  const { user } = useAuth()
  const { mode, registerCenterOnUser } = useNavigation()

  const [isDark, setIsDark] = useState(document.documentElement.classList.contains("dark"))
  const [headingLock, setHeadingLock] = useState(false)
  const [lockFlash, setLockFlash] = useState(false)
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false)
  const [poiMarkers, setPOIMarkers] = useState<POIResult[]>([])
  const [searchCenter, setSearchCenter] = useState<{ lat: number; lng: number } | null>(null)
  const [searchRadius, setSearchRadius] = useState(5)
  const [activePOI, setActivePOI] = useState<POIResult | null>(null)

  // ── Marker lerakás állapot ──
  const [placementSheetOpen, setPlacementSheetOpen] = useState(false)
  const [pendingLatLng, setPendingLatLng] = useState<{ lat: number; lng: number } | null>(null)
  const [markerBBox, setMarkerBBox] = useState<BBox | null>(null)

  const positionRef = useRef(position)
  const mapRef = useRef<L.Map | null>(null)
  useEffect(() => { positionRef.current = position }, [position])

  // ── Social data ──
  const { friendIDs, clanMembers, isLoading: socialLoading } = useMapSocialData({
    userID: user?.userID,
    username: user?.username,
    enabled: !!user,
  })

  // ── Socket ──
  // Beállítások közvetlen localStorage olvasással
  const mapSettings = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("gpass_map_settings") ?? "{}") } catch { return {} }
  }, [])
  const shareLocation = useMemo(() => {
    try {
      const p = JSON.parse(localStorage.getItem("gpass_privacy_settings") ?? "{}")
      return p.shareLocation !== false
    } catch { return true }
  }, [])

  const visibleUsers: string = mapSettings.visibleUsers ?? "all"

  const visibleFriendIDs = useMemo(() => {
    if (visibleUsers === "none" || visibleUsers === "clan") return new Set<string>()
    return friendIDs
  }, [friendIDs, visibleUsers])

  const visibleClanMembers = useMemo(() => {
    if (visibleUsers === "none" || visibleUsers === "friends") return []
    return clanMembers
  }, [clanMembers, visibleUsers])

  const { onlineUsers } = useMapSocket({
    enabled: !!user && !socialLoading && shareLocation,
    position,
    friendIDs: visibleFriendIDs,
    clanMembers: visibleClanMembers,
  })

  // ── Markerek ──
  const { markers, placeMarker, isPlacing } = useMarkers(!!user, markerBBox)

  // ── Közelség detektor ──
  const nearbyMarker = useNearbyMarker(position, markers)

  // ── User ikon ──
  const coneAngle = useMemo(
    () => heading !== null ? (headingLock ? 0 : Math.round(heading / 5) * 5) : null,
    [heading, headingLock]
  )
  const userIcon = useMemo(() => createUserIcon(coneAngle), [coneAngle])

  const centerOnUser = useCallback(() => {
    mapRef.current?.flyTo([positionRef.current.lat, positionRef.current.lng], 17, { duration: 0.8 })
  }, [])

  useEffect(() => { registerCenterOnUser(centerOnUser) }, [centerOnUser, registerCenterOnUser])

  useEffect(() => {
    if (mode === "navigating") setHeadingLock(true)
    else if (mode === "idle") setHeadingLock(false)
    if (mode === "preview" || mode === "navigating") {
      setPOIMarkers([])
      setSearchCenter(null)
    }
  }, [mode])

  const flashLock = useCallback(() => {
    setLockFlash(true)
    setTimeout(() => setLockFlash(false), 600)
  }, [])

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

  // ── Longpress → marker lerakás ──
  const handleLongPress = useCallback((latlng: { lat: number; lng: number }) => {
    if (!user) {
      toast.error("Bejelentkezés szükséges a jelzés lerakásához.")
      return
    }
    setPendingLatLng(latlng)
    setPlacementSheetOpen(true)
  }, [user])

  const handleMarkerConfirm = useCallback((type: MarkerType) => {
    if (!pendingLatLng || !user) return
    placeMarker(
      { creator_id: user.userID, marker_type: type, lat: pendingLatLng.lat, lng: pendingLatLng.lng },
      {
        onSuccess: () => toast.success("Jelzés sikeresen lerakva!"),
        onError: () => toast.error("Nem sikerült lerakni a jelzést."),
      }
    )
    setPlacementSheetOpen(false)
    setPendingLatLng(null)
  }, [pendingLatLng, user, placeMarker])

  const bounds = L.latLngBounds(L.latLng(-85, -180), L.latLng(85, 180))

  return (
    <div style={{ height: "calc(100dvh - env(safe-area-inset-top, 0px))", width: "100%", position: "relative" }}>
      <TurnByTurnPanel position={position} />

      <MapContainer
        center={[position.lat, position.lng]}
        zoom={15} minZoom={5} maxZoom={18}
        maxBounds={bounds} maxBoundsViscosity={1.0}
        worldCopyJump={false} zoomControl={false}
        rotate={true} bearing={0} rotateControl={false}
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

        {/* Bbox figyelő — markerek lekéréséhez */}
        <BBoxWatcher onBBoxChange={setMarkerBBox} />

        {/* Longpress figyelő — csak idle módban */}
        <LongPressHandler
          enabled={mode === "idle"}
          onLongPress={handleLongPress}
        />

        {/* AI POI Search — aiEnabled beállítás alapján, pozíció a lock gomb meglététől függ */}
        {(mapSettings.aiEnabled !== false) && <AIPOISearchButton
          onSelectPOIs={(pois) => { setPOIMarkers(pois); setActivePOI(null); if (pois.length === 0) setSearchCenter(null) }}
          mapRef={mapRef}
          userPosition={position}
          searchCenter={searchCenter}
          onSearchCenterChange={setSearchCenter}
          searchRadius={searchRadius}
          onSearchRadiusChange={setSearchRadius}
          navigationActive={mode !== "idle"}
          hasLockButton={heading !== null}
        />
        }

        <MapController
          position={position}
          heading={heading}
          headingLock={headingLock}
          onLockedInteraction={flashLock}
        />

        {/* Saját marker */}
        <Marker icon={userIcon} position={[position.lat, position.lng]}>
          <Popup closeButton={false} className="custom-popup">
            <div className="w-60 rounded-xl border border-border bg-card p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">Itt vagy te</span>
                </div>
                {!shareLocation && (
                  <div className="flex items-center gap-1 text-muted-foreground" title="Mások nem látnak a térképen">
                    <EyeOff className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
              {user && (
                <>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4" />
                    <span className="text-muted-foreground">{user.username}</span>
                  </div>
                  <Link
                    to="/profile/$userID"
                    params={{ userID: String(user.userID) }}
                    className="w-full inline-flex justify-center rounded-lg border border-border bg-muted hover:bg-accent py-2 text-sm font-medium"
                  >
                    Profil megnyitása →
                  </Link>
                </>
              )}
            </div>
          </Popup>
        </Marker>

        {/* Közösségi markerek — showMarkers beállítás alapján */}
        {(mapSettings.showMarkers !== false) && (
          <MarkerLayer markers={markers} userID={user?.userID} bbox={markerBBox} />
        )}

        {/* AI POI Markers — csak idle módban */}
        {mode === "idle" && (
          <>
            <POIMarkers pois={poiMarkers} userPosition={position} activePOI={activePOI} />
            {searchCenter && (
              <SearchRadiusCircle center={searchCenter} radiusKm={searchRadius} />
            )}
          </>
        )}

        {/* Barát markerek */}
        {user && <FriendMarkers users={onlineUsers} currentPosition={position} />}

        <NavigationPanel currentPosition={position} onOpenMobile={() => setMobileSheetOpen(true)} />
        <RouteLayer />
        {mode !== "navigating" && (
          <LocateButton
            position={position}
            heading={heading}
            headingLock={headingLock}
            lockFlash={lockFlash}
            onToggleHeadingLock={handleToggleHeadingLock}
          />
        )}
      </MapContainer>

      {mode === "navigating" && (
        <>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-1000 flex items-end justify-end px-4 pb-[calc(4rem+0.9rem)]">
            <div className="pointer-events-auto flex flex-col items-end gap-2">
              {user && (
                <FriendsListPanel users={onlineUsers} currentPosition={position} inlineButton />
              )}
              <button
                onClick={handleToggleHeadingLock}
                className={`w-11 h-11 rounded-xl border shadow-md flex items-center justify-center active:scale-95 transition cursor-pointer ${
                  lockFlash
                    ? "bg-red-500/20 border-red-500 text-red-500 animate-pulse"
                    : headingLock
                      ? "bg-primary border-primary text-primary-foreground"
                      : "bg-card border-border text-foreground hover:bg-muted"
                }`}
              >
                <CompassIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
          {(mapSettings.showSpeedLimit !== false) && <SpeedDisplay position={position} speed={speed} />}
        </>
      )}

      <NavigationPreviewPanel />



      {mode !== "navigating" && user && (
        <FriendsListPanel users={onlineUsers} currentPosition={position} />
      )}

      {/* Közelben lévő marker banner — csak ha markerek látszanak */}
      <div className="pointer-events-none absolute inset-0 z-1050">
        <NearbyMarkerBanner
          marker={(mapSettings.showMarkers !== false) ? nearbyMarker : null}
          userID={user?.userID}
          bbox={markerBBox}
        />
      </div>

      {/* Marker lerakás sheet */}
      <MarkerPlacementSheet
        open={placementSheetOpen}
        onOpenChange={setPlacementSheetOpen}
        onConfirm={handleMarkerConfirm}
        isPlacing={isPlacing}
      />

      <NavigationMobileSheet
        open={mobileSheetOpen}
        onOpenChange={setMobileSheetOpen}
        currentPosition={position}
      />
    </div>
  )
}
