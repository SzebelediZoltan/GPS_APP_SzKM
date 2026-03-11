import { createFileRoute, Link, redirect } from "@tanstack/react-router"
import { Map, Users, Navigation, Gauge, ChevronRight, FlaskConical, Layout, UserPlus, MonitorSmartphone } from "lucide-react"

export const Route = createFileRoute("/dev/")({
  beforeLoad: () => {
    if (import.meta.env.PROD) throw redirect({ to: "/" })
  },
  component: DevIndexPage,
})

const PREVIEWS = [
  {
    to: "/dev/ui-prev",
    icon: MonitorSmartphone,
    title: "UI Components",
    desc: "Header (belépve/vendég/admin/mobil), ThemeSwitch",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/20",
    group: "Közös",
  },
  {
    to: "/dev/shared-prev",
    icon: Layout,
    title: "Shared Components",
    desc: "NotLoggedIn, LoadingPage, ServerErrorPage, OfflinePage, StatBox",
    color: "text-slate-400",
    bg: "bg-slate-500/10 border-slate-500/20",
    group: "Közös",
  },
  {
    to: "/dev/friends-prev",
    icon: UserPlus,
    title: "Friends Components",
    desc: "FriendRequestsDialog, UserSearchDialog — barátkérelem és felhasználókereső",
    color: "text-pink-400",
    bg: "bg-pink-500/10 border-pink-500/20",
    group: "Közös",
  },
  {
    to: "/dev/friend-prev",
    icon: Users,
    title: "Friend Markers",
    desc: "FriendMarkers + FriendsListPanel — barát/klán markerek, popup, lista sheet",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
    group: "Térkép",
  },
  {
    to: "/dev/navigation-prev",
    icon: Navigation,
    title: "Navigation Panels",
    desc: "TurnByTurnPanel, NavigationPreviewPanel — navigáció közbeni HUD és útvonal előnézet",
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
    group: "Térkép",
  },
  {
    to: "/dev/speed-prev",
    icon: Gauge,
    title: "Speed Display",
    desc: "SpeedDisplay — sebesség kijelző, sebességhatár, gyorshajtás jelzés",
    color: "text-green-400",
    bg: "bg-green-500/10 border-green-500/20",
    group: "Térkép",
  },
  {
    to: "/dev/markers-prev",
    icon: Map,
    title: "Map Markers",
    desc: "MarkerLayer — globális térképes markerek típusonként (rendőr, veszély, lezárás...)",
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
    group: "Térkép",
  },
]

function DevIndexPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-background text-foreground">
      <div className="mx-auto max-w-2xl px-4 py-10 space-y-8">

        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-3 py-1 text-xs text-muted-foreground mb-3">
            <FlaskConical className="h-3.5 w-3.5" />
            Csak fejlesztői módban elérhető
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Dev Previews</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Komponens preview-k mock adatokkal — production buildben nem elérhetők.
          </p>
        </div>

        <div className="space-y-6">
          {["Közös", "Térkép"].map((group) => (
            <div key={group} className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-1">{group}</p>
              {PREVIEWS.filter((p) => p.group === group).map((p) => (
                <Link
                  key={p.to}
                  to={p.to}
                  className="flex items-center gap-4 rounded-xl border border-border/60 bg-card/60 px-4 py-4 hover:bg-accent/60 transition group"
                >
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${p.bg}`}>
                    <p.icon className={`w-5 h-5 ${p.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{p.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{p.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition shrink-0" />
                </Link>
              ))}
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
