import { createFileRoute, Link } from "@tanstack/react-router"
import { Search, User, Users, ShieldCheck } from "lucide-react"

import { Card, CardContent} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/hooks/useAuth"
import NotLoggedIn from "@/components/NotLoggedIn"

export const Route = createFileRoute("/profile/friends")({
  component: FriendsPage,
})

type Friend = {
  id: string
  name: string
  isAdmin: boolean
  avatarUrl?: string
}

function FriendsPage() {
  // TODO: ide jön majd a lekérés

  const {user} = useAuth()

  const friendRequestsCount = 2

  const friends: Friend[] = [
    { id: "f1", name: "Miskolczi Levente", isAdmin: false, avatarUrl: "" },
    { id: "f2", name: "Kiss Dominik", isAdmin: true, avatarUrl: "" },
    { id: "f3", name: "Szebeledi Zoltán", isAdmin: false, avatarUrl: "" },
    { id: "f4", name: "RandomUser21", isAdmin: false, avatarUrl: "" },
  ]

    if (!user) {
      return <>
        <NotLoggedIn />
      </>
    }

  return (
    <main className="min-h-[calc(100vh-64px)] bg-background text-foreground">
      {/* glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-44 left-1/2 h-130 w-130 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.14),transparent_60%)] blur-2xl" />
        <div className="absolute -bottom-48 -right-30 h-130 w-130 rounded-full bg-[radial-gradient(circle_at_center,hsl(var(--ring)/0.16),transparent_60%)] blur-2xl" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        {/* Top header */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-3 py-1 text-xs text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              Barátok
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight">Barátlista</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Itt később keresés, kérések és részletes profilok lesznek.
            </p>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Button variant="outline" className="rounded-xl">
              Barát kérelmek
              <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground">
                {friendRequestsCount}
              </span>
            </Button>

            <Button variant="outline" className="rounded-xl">
              <Search className="mr-2 h-4 w-4" />
              Barát keresése
            </Button>

            <Button asChild className="rounded-xl">
              <Link to="/profile">Vissza</Link>
            </Button>
          </div>
        </div>

        <Card className="rounded-2xl border-border/60 bg-card/60 shadow-xl backdrop-blur">
          <CardContent className="space-y-3">
            {friends.map((f, idx) => (
              <div key={f.id}>
                <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-background/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  {/* Left: avatar + name */}
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 rounded-xl ring-1 ring-border/60">
                      <AvatarImage src={f.avatarUrl} alt={f.name} />
                      <AvatarFallback className="rounded-xl">
                        {f.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="truncate font-medium">{f.name}</div>
                        {f.isAdmin && (
                          <Badge className="rounded-full">
                            <span className="inline-flex items-center gap-1">
                              <ShieldCheck className="h-3.5 w-3.5" />
                              Admin
                            </span>
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Státusz / utolsó aktivitás (placeholder)
                      </div>
                    </div>
                  </div>

                  {/* Right: action */}
                  <div className="flex justify-end sm:justify-start">
                    <Button variant="outline" className="rounded-xl">
                      <User className="mr-2 h-4 w-4" />
                      Profil megtekintése
                    </Button>
                  </div>
                </div>

                {idx !== friends.length - 1 && (
                  <Separator className="my-3 bg-border/60" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
