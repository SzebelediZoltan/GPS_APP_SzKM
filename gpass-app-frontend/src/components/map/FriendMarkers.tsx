import { useMemo } from "react"
import { Marker, Popup } from "react-leaflet"
import L from "leaflet"
import { renderToStaticMarkup } from "react-dom/server"
import { Users, Shield, UserCheck, Navigation } from "lucide-react"
import { Link } from "@tanstack/react-router"
import { useNavigation } from "@/context/NavigationContext"
import { useRouting } from "@/hooks/map/useRouting"
import type { TaggedOnlineUser } from "@/hooks/map/useMapSocket"

// ── Marker ikon gyártó ──
// barát = kék, csak klántag = lila, mindkettő = zöld

type MarkerVariant = "friend" | "clan" | "both"

function createFriendIcon(variant: MarkerVariant, username: string): L.DivIcon {
  const colors: Record<MarkerVariant, { ring: string; bg: string; dot: string }> = {
    friend: { ring: "#3b82f6", bg: "#1d4ed8", dot: "#93c5fd" },   // kék
    clan:   { ring: "#a855f7", bg: "#7e22ce", dot: "#d8b4fe" },   // lila
    both:   { ring: "#22c55e", bg: "#15803d", dot: "#86efac" },   // zöld
  }
  const c = colors[variant]
  const initials = username.slice(0, 2).toUpperCase()

  const html = renderToStaticMarkup(
    <div style={{
      position: "relative",
      width: 40,
      height: 40,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      {/* Pulzáló gyűrű */}
      <div style={{
        position: "absolute",
        inset: 0,
        borderRadius: "50%",
        border: `2px solid ${c.ring}`,
        opacity: 0.4,
        animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite",
      }} />
      {/* Avatar kör */}
      <div style={{
        width: 34,
        height: 34,
        borderRadius: "50%",
        background: c.bg,
        border: `2.5px solid ${c.ring}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: `0 0 0 3px ${c.ring}33`,
        fontSize: 12,
        fontWeight: 700,
        color: "#fff",
        letterSpacing: "0.03em",
        zIndex: 1,
      }}>
        {initials}
      </div>
      {/* Kis státusz dot alul */}
      <div style={{
        position: "absolute",
        bottom: 1,
        right: 1,
        width: 10,
        height: 10,
        borderRadius: "50%",
        background: c.dot,
        border: "2px solid #0f172a",
        zIndex: 2,
      }} />
    </div>
  )

  return L.divIcon({
    className: "",
    html,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -22],
  })
}

// ── Popup tartalom ──

function FriendPopup({
  user,
  onNavigate,
}: {
  user: TaggedOnlineUser
  onNavigate: () => void
}) {
  const variant: MarkerVariant = user.isFriend && user.clans.length > 0
    ? "both"
    : user.isFriend
    ? "friend"
    : "clan"

  return (
    <div className="w-56 rounded-xl border border-border bg-card p-3.5 space-y-3">

      {/* Fejléc */}
      <div className="flex items-center gap-2.5">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 ${
          variant === "friend" ? "bg-blue-600" :
          variant === "clan"   ? "bg-purple-700" :
                                 "bg-green-700"
        }`}>
          {user.username.slice(0, 2).toUpperCase()}
        </div>
        <p className="text-sm font-semibold text-foreground truncate">{user.username}</p>
      </div>

      {/* Kapcsolat tagek */}
      <div className="flex flex-wrap gap-1.5">
        {user.isFriend && (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[10px] font-semibold text-blue-400">
            <UserCheck className="w-3 h-3" />
            Barátod
          </span>
        )}
        {user.clans.map((clan) => (
          <span
            key={clan.clanId}
            className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 text-[10px] font-semibold text-purple-400"
          >
            <Shield className="w-3 h-3" />
            {clan.clanName}
          </span>
        ))}
      </div>

      {/* Gombok */}
      <div className="flex flex-col gap-1.5">
        <button
          onClick={onNavigate}
          className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 active:scale-95 transition cursor-pointer"
        >
          <Navigation className="w-3.5 h-3.5" />
          Útvonaltervezés ide
        </button>
        <Link
          to="/profile/$userID"
          params={{ userID: user.userID }}
          className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent transition"
        >
          <Users className="w-3.5 h-3.5" />
          Profil megtekintése
        </Link>
      </div>

    </div>
  )
}

// ── Fő komponens ──

type Props = {
  users: TaggedOnlineUser[]
  currentPosition: { lat: number; lng: number }
}

export default function FriendMarkers({ users, currentPosition }: Props) {
  const { setPreview } = useNavigation()
  const { planRoute } = useRouting()

  const handleNavigateTo = async (target: { lat: number; lng: number }) => {
    const routes = await planRoute({ start: currentPosition, end: target })
    if (routes.length > 0) setPreview(routes)
  }

  // Ikonokat memoizáljuk hogy ne gyártsunk minden rendernél új DOM-ot
  const icons = useMemo(() => {
    return new Map(
      users.map((u) => {
        const variant: MarkerVariant =
          u.isFriend && u.clans.length > 0 ? "both" :
          u.isFriend ? "friend" : "clan"
        return [u.userID, createFriendIcon(variant, u.username)]
      })
    )
  }, [users])

  return (
    <>
      {users.map((user) => (
        <Marker
          key={user.userID}
          position={[user.lat, user.lng]}
          icon={icons.get(user.userID)}
        >
          <Popup closeButton={false} className="custom-popup">
            <FriendPopup
              user={user}
              onNavigate={() => handleNavigateTo({ lat: user.lat, lng: user.lng })}
            />
          </Popup>
        </Marker>
      ))}
    </>
  )
}
