import { createFileRoute, redirect, Link } from "@tanstack/react-router"
import { useState } from "react"
import {
  Bell, Send, UserCheck, UserX, Search, ShieldCheck,  Map, Plus, Check, X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export const Route = createFileRoute("/dev/friends-prev")({
  beforeLoad: () => {
    if (import.meta.env.PROD) throw redirect({ to: "/" })
  },
  component: FriendsPreviewPage,
})

// ── Mock adatok ──
const MOCK_PENDING_RECEIVED = [
  { id: "r1", sender: { ID: "10", username: "VargaZsolt",   isAdmin: false } },
  { id: "r2", sender: { ID: "11", username: "FeketeNóra",   isAdmin: true  } },
]

const MOCK_PENDING_SENT = [
  { id: "s1", receiver: { ID: "12", username: "HorváthPéter", isAdmin: false } },
]

const MOCK_SEARCH_RESULTS = [
  { ID: "20", username: "KissBéla",      isAdmin: false },
  { ID: "21", username: "NagyEszter",    isAdmin: true  },
  { ID: "22", username: "SzabóAndrás",  isAdmin: false },
  { ID: "23", username: "TóthKatalin",  isAdmin: false },
]

// ── FriendRequestsDialog mock ──
function FriendRequestsDialogMock() {
  const [received, setReceived] = useState(MOCK_PENDING_RECEIVED)
  const [sent, setSent] = useState(MOCK_PENDING_SENT)
  const [removingId, setRemovingId] = useState<string | null>(null)

  const handleAction = (id: string, action: () => void) => {
    setRemovingId(id)
    setTimeout(() => { action(); setRemovingId(null) }, 300)
  }

  const totalCount = received.length + sent.length

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-xl cursor-pointer gap-2">
          <Bell className="h-4 w-4" />
          Barátkérelmek
          {totalCount > 0 && (
            <Badge className="ml-1 h-5 min-w-5 rounded-full px-1.5 text-xs">
              {totalCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Barátkérelmek</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">

          {/* Kapott */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Bell className="h-3.5 w-3.5 text-muted-foreground" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Kapott kérelmek
              </h3>
              {received.length > 0 && (
                <Badge variant="secondary" className="rounded-full text-xs ml-auto">{received.length}</Badge>
              )}
            </div>

            {received.length === 0 ? (
              <p className="text-sm text-muted-foreground px-1">Nincs kapott kérelmed.</p>
            ) : (
              <div className="space-y-2">
                {received.map((r) => (
                  <div
                    key={r.id}
                    className={`flex items-center justify-between rounded-xl border border-border/60 bg-background/40 p-3 transition-all duration-300 ${
                      removingId === r.id ? "opacity-0 scale-95 translate-x-4" : "opacity-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 rounded-xl">
                        <AvatarFallback className="rounded-xl text-xs font-bold">
                          {r.sender.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{r.sender.username}</span>
                        {r.sender.isAdmin && (
                          <Badge className="rounded-full text-[10px] px-1.5 h-4">
                            <ShieldCheck className="h-2.5 w-2.5 mr-0.5" /> Admin
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="rounded-lg cursor-pointer"
                        onClick={() => handleAction(r.id, () => setReceived(p => p.filter(x => x.id !== r.id)))}>
                        <UserCheck className="h-3.5 w-3.5 mr-1" /> Elfogad
                      </Button>
                      <Button size="sm" variant="destructive" className="rounded-lg cursor-pointer"
                        onClick={() => handleAction(r.id, () => setReceived(p => p.filter(x => x.id !== r.id)))}>
                        <UserX className="h-3.5 w-3.5 mr-1" /> Elutasít
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator className="bg-border/50" />

          {/* Elküldött */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Send className="h-3.5 w-3.5 text-muted-foreground" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Elküldött kérelmek
              </h3>
              {sent.length > 0 && (
                <Badge variant="secondary" className="rounded-full text-xs ml-auto">{sent.length}</Badge>
              )}
            </div>

            {sent.length === 0 ? (
              <p className="text-sm text-muted-foreground px-1">Nincs elküldött kérelmed.</p>
            ) : (
              <div className="space-y-2">
                {sent.map((s) => (
                  <div
                    key={s.id}
                    className={`flex items-center justify-between rounded-xl border border-border/60 bg-background/40 p-3 transition-all duration-300 ${
                      removingId === s.id ? "opacity-0 scale-95" : "opacity-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 rounded-xl">
                        <AvatarFallback className="rounded-xl text-xs font-bold">
                          {s.receiver.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">{s.receiver.username}</span>
                    </div>
                    <Button size="sm" variant="outline" className="rounded-lg cursor-pointer text-destructive border-destructive/30 hover:bg-destructive/10"
                      onClick={() => handleAction(s.id, () => setSent(p => p.filter(x => x.id !== s.id)))}>
                      <X className="h-3.5 w-3.5 mr-1" /> Visszavon
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </DialogContent>
    </Dialog>
  )
}

// ── UserSearchDialog mock ──
function UserSearchDialogMock() {
  const [query, setQuery] = useState("")
  const [added, setAdded] = useState<Set<string>>(new Set())

  const filtered = query.length > 1
    ? MOCK_SEARCH_RESULTS.filter((u) =>
        u.username.toLowerCase().includes(query.toLowerCase())
      )
    : []

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition cursor-pointer">
          <Search className="h-4 w-4 text-muted-foreground" />
          Keresés
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Felhasználó keresése</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              className="pl-9 rounded-xl"
              placeholder="Írj be egy nevet... (pl. Ko)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {query.length > 1 && (
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {filtered.length > 0 ? (
                filtered.map((u) => (
                  <div key={u.ID}
                    className="group flex items-center gap-3 rounded-xl border border-border/60 bg-background/40 p-3 hover:bg-accent hover:border-primary/20 transition"
                  >
                    <Avatar className="h-9 w-9 rounded-xl shrink-0">
                      <AvatarFallback className="rounded-xl text-xs font-bold">
                        {u.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="font-medium text-sm truncate">{u.username}</span>
                      {u.isAdmin && (
                        <Badge className="rounded-full shrink-0 text-[10px] px-1.5">
                          <ShieldCheck className="h-3 w-3 mr-0.5" /> Admin
                        </Badge>
                      )}
                    </div>
                    <button
                      onClick={() => setAdded(p => new Set([...p, u.ID]))}
                      className={`shrink-0 flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold border transition cursor-pointer ${
                        added.has(u.ID)
                          ? "bg-green-500/10 border-green-500/30 text-green-400"
                          : "bg-primary/10 border-primary/20 text-primary hover:bg-primary/20"
                      }`}
                    >
                      {added.has(u.ID)
                        ? <><Check className="w-3 h-3" /> Elküldve</>
                        : <><Plus className="w-3 h-3" /> Kérelem</>
                      }
                    </button>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Search className="h-8 w-8 text-muted-foreground/30 mb-2" />
                  <p className="text-sm text-muted-foreground">Nincs ilyen felhasználó</p>
                </div>
              )}
            </div>
          )}

          {query.length <= 1 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Írj be legalább 2 karaktert a kereséshez.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ── Fő oldal ──
function FriendsPreviewPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-background text-foreground">
      <div className="mx-auto max-w-2xl px-4 py-8 space-y-8">

        {/* Fejléc */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-3 py-1 text-xs text-muted-foreground mb-3">
            <Map className="h-3.5 w-3.5" />
            Dev Preview
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Friends Components</h1>
              <p className="mt-1 text-muted-foreground text-sm">Barátkérelem és felhasználókereső dialógok</p>
            </div>
            <Link to="/dev" className="text-xs text-muted-foreground hover:text-foreground transition">← Vissza</Link>
          </div>
        </div>

        {/* FriendRequestsDialog */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-bold">FriendRequestsDialog</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Mock adatokkal — elfogadás/elutasítás/visszavonás animációval működik
            </p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card/40 p-6 flex items-center gap-4 flex-wrap">
            <FriendRequestsDialogMock />
            <p className="text-xs text-muted-foreground">← kattints a megnyitáshoz</p>
          </div>
        </section>

        <Separator />

        {/* UserSearchDialog */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-bold">UserSearchDialog</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Keresés mock felhasználókra — próbáld: "Ko", "Na", "Sz"
            </p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card/40 p-6 flex items-center gap-4 flex-wrap">
            <UserSearchDialogMock />
            <p className="text-xs text-muted-foreground">← kattints a megnyitáshoz</p>
          </div>
        </section>

      </div>
    </div>
  )
}
