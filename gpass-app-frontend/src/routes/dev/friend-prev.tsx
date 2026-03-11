import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { Users, Shield, UserCheck, Navigation, Wifi, X, Map } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export const Route = createFileRoute("/dev/friend-prev")({
  component: FriendPreviewPage,
})

// ── Mock adatok — minden lehetséges kombináció ──
const MOCK_USERS = [
  {
    userID: "1",
    username: "KovácsPéter",
    lat: 47.4979,
    lng: 19.0402,
    isFriend: true,
    clans: [{ clanId: 1, clanName: "Főváros Riders" }],
  },
  {
    userID: "2",
    username: "NagyAnna",
    lat: 47.501,
    lng: 19.048,
    isFriend: false,
    clans: [
      { clanId: 1, clanName: "Főváros Riders" },
      { clanId: 2, clanName: "Speed Demons" },
    ],
  },
  {
    userID: "3",
    username: "SzabóMáté",
    lat: 47.495,
    lng: 19.035,
    isFriend: true,
    clans: [],
  },
  {
    userID: "4",
    username: "TóthLili",
    lat: 47.503,
    lng: 19.055,
    isFriend: true,
    clans: [{ clanId: 2, clanName: "Speed Demons" }],
  },
]

// ── Segédek ──
type Variant = "friend" | "clan" | "both"

function getVariant(user: typeof MOCK_USERS[0]): Variant {
  if (user.isFriend && user.clans.length > 0) return "both"
  if (user.isFriend) return "friend"
  return "clan"
}

const VARIANT_STYLE: Record<Variant, { avatarBg: string; ring: string; dot: string; label: string }> = {
  friend: { avatarBg: "bg-blue-700",    ring: "ring-blue-500",   dot: "bg-blue-300",   label: "Csak barát" },
  clan:   { avatarBg: "bg-purple-700",  ring: "ring-purple-500", dot: "bg-purple-300", label: "Csak klántag" },
  both:   { avatarBg: "bg-green-700",   ring: "ring-green-500",  dot: "bg-green-300",  label: "Barát & Klántag" },
}

// ── Marker komponens ──
function MarkerBubble({ user }: { user: typeof MOCK_USERS[0] }) {
  const [open, setOpen] = useState(false)
  const variant = getVariant(user)
  const s = VARIANT_STYLE[variant]
  const initials = user.username.slice(0, 2).toUpperCase()

  return (
    <div className="relative flex flex-col items-center gap-2">
      {/* Popup */}
      {open && (
        <div className="absolute bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 z-50 w-56 rounded-xl border border-border bg-card shadow-2xl shadow-black/30 p-3.5 space-y-3 animate-in fade-in-0 zoom-in-95 duration-150">
          {/* Nyílhegy */}
          <div className="absolute -bottom-[7px] left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-card border-r border-b border-border" />

          {/* Header */}
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 ${s.avatarBg}`}>
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground truncate">{user.username}</p>
              <p className={`text-[11px] font-medium ${
                variant === "friend" ? "text-blue-400" :
                variant === "clan"   ? "text-purple-400" : "text-green-400"
              }`}>
                {s.label}
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Tagek */}
          <div className="flex flex-wrap gap-1.5">
            {user.isFriend && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[10px] font-semibold text-blue-400">
                <UserCheck className="w-3 h-3" /> Barátod
              </span>
            )}
            {user.clans.map((clan) => (
              <span
                key={clan.clanId}
                className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 text-[10px] font-semibold text-purple-400"
              >
                <Shield className="w-3 h-3" /> {clan.clanName}
              </span>
            ))}
          </div>

          {/* Gombok */}
          <div className="flex flex-col gap-1.5">
            <button className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 active:scale-95 transition cursor-pointer">
              <Navigation className="w-3.5 h-3.5" /> Útvonaltervezés ide
            </button>
            <button className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent transition cursor-pointer">
              <Users className="w-3.5 h-3.5" /> Profil megtekintése
            </button>
          </div>
        </div>
      )}

      {/* Marker gomb */}
      <button
        onClick={() => setOpen(!open)}
        className="relative w-11 h-11 flex items-center justify-center cursor-pointer group"
        style={{ background: "none", border: "none", padding: 0 }}
      >
        {/* Pulzáló gyűrű */}
        <span className={`absolute inset-0 rounded-full ring-2 ${s.ring} opacity-30 animate-ping`} />
        {/* Avatar */}
        <span className={`relative w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white ${s.avatarBg} ring-2 ${s.ring} shadow-lg`}>
          {initials}
        </span>
        {/* Online dot */}
        <span className={`absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full ${s.dot} border-2 border-background z-10`} />
      </button>

      {/* Username */}
      <span className="text-[11px] font-medium text-muted-foreground">
        {user.username}
      </span>
    </div>
  )
}

// ── Lista sor ──
function ListRow({ user }: { user: typeof MOCK_USERS[0] }) {
  const variant = getVariant(user)
  const s = VARIANT_STYLE[variant]
  const initials = user.username.slice(0, 2).toUpperCase()

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/60 px-3.5 py-3">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 ${s.avatarBg}`}>
        {initials}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{user.username}</p>
        <div className="flex flex-wrap gap-1 mt-1">
          {user.isFriend && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-blue-500/30 text-blue-400 bg-blue-500/10">
              <UserCheck className="w-2.5 h-2.5 mr-0.5" /> Barát
            </Badge>
          )}
          {user.clans.map((clan) => (
            <Badge key={clan.clanId} variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-purple-500/30 text-purple-400 bg-purple-500/10">
              <Shield className="w-2.5 h-2.5 mr-0.5" /> {clan.clanName}
            </Badge>
          ))}
        </div>
      </div>

      <button className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary hover:bg-primary/20 active:scale-95 transition cursor-pointer shrink-0">
        <Navigation className="w-4 h-4" />
      </button>
    </div>
  )
}

// ── Fő oldal ──
function FriendPreviewPage() {
  const [panelOpen, setPanelOpen] = useState(false)

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-4 py-8 space-y-10">

        {/* Fejléc */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-3 py-1 text-xs text-muted-foreground mb-3">
            <Map className="h-3.5 w-3.5" />
            Dev Preview
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Friend Markers Preview</h1>
          <p className="mt-1 text-muted-foreground text-sm">
            Mock adatokkal — kattints a markerre a popup megnyitásához
          </p>
        </div>

        {/* Jelmagyarázat */}
        <div className="flex flex-wrap gap-4 rounded-xl border border-border/60 bg-card/60 p-4">
          {(["friend", "clan", "both"] as Variant[]).map((v) => (
            <div key={v} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${VARIANT_STYLE[v].avatarBg}`} />
              <span className="text-xs font-medium text-muted-foreground">
                {v === "friend" ? "🔵 Csak barát" : v === "clan" ? "🟣 Csak klántag" : "🟢 Barát & Klántag"}
              </span>
            </div>
          ))}
        </div>

        {/* ── 1. szekció: Markerek ── */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold">Térképes markerek</h2>
          <div className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur p-8">
            {/* Rácsos térkép háttér — overflow visible hogy a popup ne vágódjon le */}
            <div
              className="rounded-xl relative"
              style={{
                background: "repeating-linear-gradient(0deg, transparent, transparent 39px, hsl(var(--border)/0.5) 39px, hsl(var(--border)/0.5) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, hsl(var(--border)/0.5) 39px, hsl(var(--border)/0.5) 40px)",
              }}
            >
              {/* Extra padding top hogy legyen hely a popupoknak */}
              <div className="flex flex-wrap justify-around items-end gap-12 px-10 pt-52 pb-10">
                {MOCK_USERS.map((user) => (
                  <MarkerBubble key={user.userID} user={user} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* ── 2. szekció: Lista panel ── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">FriendsListPanel (Sheet)</h2>
            {/* Lebegő gomb szimulálva */}
            <button
              onClick={() => setPanelOpen(true)}
              className="relative w-11 h-11 rounded-xl bg-card border border-border shadow-md flex items-center justify-center hover:bg-muted active:scale-95 transition cursor-pointer"
            >
              <Users className="w-4 h-4 text-primary" />
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full bg-green-500 border-2 border-background text-[9px] font-bold text-white flex items-center justify-center px-0.5">
                {MOCK_USERS.length}
              </span>
            </button>
          </div>

          {/* Inline lista preview */}
          <div className="rounded-2xl border border-border/60 bg-card/60 shadow-xl backdrop-blur p-4 space-y-2">
            <div className="flex items-center gap-2 pb-2 border-b border-border/60">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold">Online barátok & klántagok</span>
              <span className="ml-auto flex items-center gap-1 text-xs font-semibold text-green-400">
                <Wifi className="w-3.5 h-3.5" /> {MOCK_USERS.length} online
              </span>
            </div>
            <div className="space-y-2 pt-1">
              {MOCK_USERS.map((user) => (
                <ListRow key={user.userID} user={user} />
              ))}
            </div>
          </div>
        </section>

      </div>

      {/* ── Sheet overlay szimuláció ── */}
      {panelOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end"
          onClick={() => setPanelOpen(false)}
        >
          <div
            className="w-full max-h-[70vh] rounded-t-2xl border-t border-border/80 bg-background/95 backdrop-blur overflow-y-auto animate-in slide-in-from-bottom-4 duration-300"
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 1rem)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-9 h-1 rounded-full bg-border" />
            </div>

            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/60">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-foreground">Online barátok & klántagok</span>
              <span className="ml-auto flex items-center gap-1 text-xs font-semibold text-green-400">
                <Wifi className="w-3.5 h-3.5" /> {MOCK_USERS.length} online
              </span>
            </div>

            <div className="p-4 space-y-2">
              {MOCK_USERS.map((user) => (
                <ListRow key={user.userID} user={user} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
