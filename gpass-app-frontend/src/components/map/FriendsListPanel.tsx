import { useState} from "react"
import { Users, UserCheck, Shield, Navigation, X} from "lucide-react"
import { useNavigation as useNavigationCtx } from "@/context/NavigationContext"
import { useRouting } from "@/hooks/map/useRouting"
import { useIsMobile } from "@/hooks/ui/useIsMobile"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import type { TaggedOnlineUser } from "@/hooks/map/useMapSocket"

type Props = {
  users: TaggedOnlineUser[]
  currentPosition: { lat: number; lng: number } | null
}

function InitialsAvatar({ name, color }: { name: string; color: string }) {
  return (
    <div
      className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black text-white shrink-0"
      style={{ background: color }}
    >
      {name.slice(0, 2).toUpperCase()}
    </div>
  )
}

const COLORS = ["#3b82f6","#8b5cf6","#10b981","#f59e0b","#ef4444","#06b6d4","#ec4899","#84cc16"]
function colorFor(name: string) { return COLORS[name.charCodeAt(0) % COLORS.length] }

function RelationBadges({ user }: { user: TaggedOnlineUser }) {
  return (
    <div className="flex gap-1 flex-wrap">
      {user.isFriend && (
        <span className="inline-flex items-center gap-0.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-blue-400">
          <UserCheck className="w-2.5 h-2.5" /> Barát
        </span>
      )}
      {user.clans.map((c) => (
        <span key={c.clanId} className="inline-flex items-center gap-0.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-purple-400">
          <Shield className="w-2.5 h-2.5" /> {c.clanName}
        </span>
      ))}
    </div>
  )
}

function UserRow({ user, currentPosition, onNavigate }: {
  user: TaggedOnlineUser
  currentPosition: { lat: number; lng: number } | null
  onNavigate: (u: TaggedOnlineUser) => void
}) {
  return (
    <div className="flex items-center gap-3 py-2.5 px-3">
      <div className="relative shrink-0">
        <InitialsAvatar name={user.username} color={colorFor(user.username)} />
        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-background" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{user.username}</p>
        <RelationBadges user={user} />
      </div>
      {currentPosition && (
        <button
          onClick={() => onNavigate(user)}
          className="shrink-0 w-8 h-8 rounded-lg border border-primary/30 bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition cursor-pointer"
          title="Navigálás ide"
        >
          <Navigation className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}

export default function FriendsListPanel({ users, currentPosition }: Props) {
  const [open, setOpen] = useState(false)
  const isMobile = useIsMobile()
  const { setPreview } = useNavigationCtx()
  const { planRoute } = useRouting()

  const onlineCount = users.length

  const handleNavigate = async (user: TaggedOnlineUser) => {
    if (!currentPosition) return
    const routes = await planRoute({ start: currentPosition, end: { lat: user.lat, lng: user.lng } })
    if (routes.length > 0) {
      setPreview(routes)
      setOpen(false)
    }
  }

  // ── Trigger gomb — ugyanolyan stílusú mint a NavigationPanel ikonja ──
  const triggerBtn = (
    <button
      onClick={() => setOpen(true)}
      className="relative w-11 h-11 rounded-xl bg-card text-foreground border border-border shadow-md flex items-center justify-center hover:bg-muted active:scale-95 transition cursor-pointer"
    >
      <Users className="w-4 h-4 text-primary" />
      {onlineCount > 0 && (
        <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full bg-green-500 border-2 border-background flex items-center justify-center text-[10px] font-black text-white px-1">
          {onlineCount}
        </span>
      )}
    </button>
  )

  // ── Üres állapot ──
  const emptyState = (
    <div className="flex flex-col items-center justify-center py-8 text-center gap-2 px-4">
      <div className="w-10 h-10 rounded-xl border border-border/60 bg-background/40 flex items-center justify-center">
        <Users className="w-5 h-5 text-muted-foreground/40" />
      </div>
      <p className="text-sm text-muted-foreground">Jelenleg senki sem osztja meg a pozícióját</p>
    </div>
  )

  // ── Lista tartalom ──
  const listContent = (
    <div className="divide-y divide-border/40">
      {users.length === 0
        ? emptyState
        : users.map((u) => (
            <UserRow key={u.userID} user={u} currentPosition={currentPosition} onNavigate={handleNavigate} />
          ))
      }
    </div>
  )

  // ── MOBIL: bottom sheet (meglévő stílus) ──
  if (isMobile) {
    return (
      <>
        {/* Gomb: ugyanott ahol desktop-on, safe-area felett */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[999] flex items-end justify-end px-4 pb-[calc(4rem+0.9rem)]">
          <div className="pointer-events-auto">{triggerBtn}</div>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent
            side="bottom"
            className="z-[1200] rounded-t-2xl border-t border-border/80 bg-background/95 backdrop-blur px-0 max-h-[70dvh] overflow-y-auto"
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 1rem)" }}
          >
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-9 h-1 rounded-full bg-border" />
            </div>
            <SheetHeader className="px-4 pb-3">
              <SheetTitle className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Online barátok
                {onlineCount > 0 && (
                  <Badge className="rounded-full bg-green-500/20 text-green-400 border-green-500/30 text-[10px]">
                    {onlineCount} online
                  </Badge>
                )}
              </SheetTitle>
            </SheetHeader>
            {listContent}
          </SheetContent>
        </Sheet>
      </>
    )
  }

  // ── DESKTOP: NavigationPanel-szerű lebegő panel ──
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[999] flex items-end justify-end px-4 pb-[calc(4rem+0.9rem)]">
      <div className="pointer-events-auto flex flex-col items-end gap-2">

        {/* Panel (ha nyitva) */}
        {open && (
          <div className="w-72 rounded-xl border border-border bg-background/95 backdrop-blur shadow-xl overflow-hidden animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 duration-200">
            {/* Fejléc */}
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-border/60">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">Online barátok</span>
                {onlineCount > 0 && (
                  <Badge className="rounded-full bg-green-500/20 text-green-400 border-green-500/30 text-[10px] h-4 px-1.5">
                    {onlineCount}
                  </Badge>
                )}
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-6 h-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Lista */}
            <div className="max-h-72 overflow-y-auto divide-y divide-border/40">
              {users.length === 0 ? emptyState : users.map((u) => (
                <UserRow key={u.userID} user={u} currentPosition={currentPosition} onNavigate={handleNavigate} />
              ))}
            </div>
          </div>
        )}

        {/* Trigger gomb */}
        {triggerBtn}
      </div>
    </div>
  )
}
