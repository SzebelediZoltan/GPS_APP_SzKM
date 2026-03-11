import { useState } from "react"
import { Users, Navigation, UserCheck, Shield, Wifi, WifiOff } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { useNavigation } from "@/context/NavigationContext"
import { useRouting } from "@/hooks/map/useRouting"
import type { TaggedOnlineUser } from "@/hooks/map/useMapSocket"

type Props = {
  users: TaggedOnlineUser[]
  currentPosition: { lat: number; lng: number }
}

export default function FriendsListPanel({ users, currentPosition }: Props) {
  const [open, setOpen] = useState(false)
  const { setPreview } = useNavigation()
  const { planRoute } = useRouting()

  const handleNavigateTo = async (target: { lat: number; lng: number }) => {
    const routes = await planRoute({ start: currentPosition, end: target })
    if (routes.length > 0) {
      setPreview(routes)
      setOpen(false)
    }
  }

  const onlineCount = users.length

  return (
    <>
      {/* Lebegő gomb — jobb oldalon a LocateButton felett */}
      <div className="absolute bottom-[calc(4rem+5rem)] right-4 z-1000">
        <button
          onClick={() => setOpen(true)}
          className="relative w-11 h-11 rounded-xl bg-card border border-border shadow-md flex items-center justify-center hover:bg-muted active:scale-95 transition cursor-pointer"
        >
          <Users className="w-4 h-4 text-primary" />
          {/* Online badge */}
          {onlineCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full bg-green-500 border-2 border-background text-[9px] font-bold text-white flex items-center justify-center px-0.5">
              {onlineCount}
            </span>
          )}
        </button>
      </div>

      {/* Sheet panel */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="z-1200 rounded-t-2xl border-t border-border/80 bg-background/95 px-0 backdrop-blur max-h-[70vh]"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 1rem)" }}
        >
          <SheetHeader className="px-4 pb-3">
            <SheetTitle className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Online barátok & klántagok
              {onlineCount > 0 ? (
                <span className="ml-auto flex items-center gap-1 text-xs font-normal text-green-400">
                  <Wifi className="w-3.5 h-3.5" />
                  {onlineCount} online
                </span>
              ) : (
                <span className="ml-auto flex items-center gap-1 text-xs font-normal text-muted-foreground">
                  <WifiOff className="w-3.5 h-3.5" />
                  Senki nincs online
                </span>
              )}
            </SheetTitle>
          </SheetHeader>

          <div className="overflow-y-auto px-4 space-y-2">
            {users.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2 text-center">
                <div className="w-12 h-12 rounded-2xl border border-border/60 bg-card/40 flex items-center justify-center">
                  <Users className="w-5 h-5 text-muted-foreground/40" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Jelenleg senki sem osztja meg a pozícióját.
                </p>
              </div>
            ) : (
              users.map((user) => {
                const variant =
                  user.isFriend && user.clans.length > 0 ? "both" :
                  user.isFriend ? "friend" : "clan"

                return (
                  <div
                    key={user.userID}
                    className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/60 px-3.5 py-3 animate-in fade-in-0 duration-200"
                  >
                    {/* Avatar */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 ${
                      variant === "friend" ? "bg-blue-600" :
                      variant === "clan"   ? "bg-purple-700" :
                                             "bg-green-700"
                    }`}>
                      {user.username.slice(0, 2).toUpperCase()}
                    </div>

                    {/* Infó */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {user.username}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {user.isFriend && (
                          <Badge
                            variant="outline"
                            className="text-[10px] px-1.5 py-0 h-4 border-blue-500/30 text-blue-400 bg-blue-500/10"
                          >
                            <UserCheck className="w-2.5 h-2.5 mr-0.5" />
                            Barát
                          </Badge>
                        )}
                        {user.clans.map((clan) => (
                          <Badge
                            key={clan.clanId}
                            variant="outline"
                            className="text-[10px] px-1.5 py-0 h-4 border-purple-500/30 text-purple-400 bg-purple-500/10"
                          >
                            <Shield className="w-2.5 h-2.5 mr-0.5" />
                            {clan.clanName}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Navigáció gomb */}
                    <button
                      onClick={() => handleNavigateTo({ lat: user.lat, lng: user.lng })}
                      className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary hover:bg-primary/20 active:scale-95 transition cursor-pointer shrink-0"
                    >
                      <Navigation className="w-4 h-4" />
                    </button>
                  </div>
                )
              })
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
