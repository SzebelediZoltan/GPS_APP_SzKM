import React from "react"
import { createFileRoute, Link } from "@tanstack/react-router"
import {
  ShieldCheck,
  Shield,
  Mail,
  MapPin,
  Users,
  Flag,
  Crown,
  Compass,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/useAuth"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import NotLoggedIn from "@/components/NotLoggedIn"
import LoadingPage from "@/components/LoadingPage"
import ServerErrorPage from "@/components/ServerErrorPage"

export const Route = createFileRoute("/profile/")({
  component: ProfileDashboard,
})


type Friend = {
  id: string
  username: string
  isAdmin: boolean
  avatarUrl?: string
}

type Trip = {
  id: string
  name: string
  dateText: string
  status: "Tervezett" | "Folyamatban" | "Befejezve"
}

type Clan = {
  clan_id: string
  user_id: string
  joined_at: string
  clan: {
    id: string
    name: string
    leader_id: string
  }
}

const getFriends = (userID: string) => {
  return axios.get<Friend[]>("/api/friends-with/accepted/" + userID)
}
const getClans = (userID: string) => {
  return axios.get<Clan[]>("/api/clan-members/by-user/" + userID)
}
const getTrips = (userID: string) => {
  return axios.get<Trip[]>("/api/trips/by-user/" + userID)
}


function ProfileDashboard() {

  const { user } = useAuth()


  const { data: friends, isLoading: friendIsLoading, isError: friendError } = useQuery({
    queryKey: ["friends"],
    queryFn: () => getFriends(user?.userID!),
    enabled: !!user?.userID, // ⬅️ NAGYON FONTOS
  })

  const { data: clans, isLoading: clansIsLoading, isError: clanError } = useQuery({
    queryKey: ["clans"],
    queryFn: () => getClans(user?.userID!),
    enabled: !!user?.userID, // ⬅️ NAGYON FONTOS
  })


  const { data: trips, isLoading: tripsIsLoading, isError: tripError } = useQuery({
    queryKey: ["trips"],
    queryFn: () => getTrips(user?.userID!),
    enabled: !!user?.userID, // ⬅️ NAGYON FONTOS
  })

  if (!user) {
    return <>
      <NotLoggedIn />
    </>
  }

  if (!friends || !trips || !clans || friendError || clanError || tripError) {
    return <ServerErrorPage />
  }

  if (friendIsLoading || clansIsLoading || tripsIsLoading) {
    return <LoadingPage />
  }

  return (
    <main className="min-h-[calc(100vh-64px)] bg-background text-foreground">
      {/* background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-44 left-1/2 h-130 w-130 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.14),transparent_60%)] blur-2xl" />
        <div className="absolute -bottom-48 -right-30 h-130 w-130 rounded-full bg-[radial-gradient(circle_at_center,hsl(var(--ring)/0.16),transparent_60%)] blur-2xl" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        {/* Header row */}
        <div className="mb-6 flex items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-3 py-1 text-xs text-muted-foreground">
              <Compass className="h-3.5 w-3.5" />
              Profil
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight">Fiók áttekintés</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Itt később a profil, tripek, barátok és klánok adatai jelennek meg.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" className="rounded-xl" asChild>
              <Link to="/profile">Barátok</Link>
            </Button>
            <Button className="rounded-xl">Szerkesztés</Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left: profile card */}
          <Card className="rounded-2xl border-border/60 bg-card/60 shadow-xl backdrop-blur lg:col-span-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Profil</CardTitle>
              <CardDescription>Adatok</CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-16 w-16 rounded-2xl ring-1 ring-border/60">
                    <AvatarImage alt={user?.username} />
                    <AvatarFallback className="rounded-2xl">
                      {user?.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  {/* subtle glow */}
                  <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[28px] bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.18),transparent_60%)] blur-2xl" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate text-xl font-semibold">{user?.username}</h2>
                    <Badge
                      variant={user?.isAdmin ? "default" : "secondary"}
                      className={cn(
                        "rounded-full",
                        user?.isAdmin && "bg-primary text-primary-foreground"
                      )}
                    >
                      {user?.isAdmin ? (
                        <span className="inline-flex items-center gap-1">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1">
                          <Shield className="h-3.5 w-3.5" />
                          User
                        </span>
                      )}
                    </Badge>
                  </div>

                  <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{user?.email}</span>
                  </div>
                </div>
              </div>

              <Separator className="bg-border/70" />

              {/* Quick stats placeholders */}
              <div className="grid grid-cols-3 gap-3">
                <StatBox icon={<MapPin className="h-4 w-4" />} label="Tripek" value={"" + trips.data.length} />
                <StatBox icon={<Users className="h-4 w-4" />} label="Barátok" value={"" + friends.data.length} />
                <StatBox icon={<Flag className="h-4 w-4" />} label="Klánok" value={"" + clans.data.length} />
              </div>

              <div className="rounded-2xl border border-border/60 bg-background/40 p-3">
                <p className="text-xs text-muted-foreground">
                  Status: Ide jöhet majd amit ki akar írni a felhasználó magáról.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Right: dashboard cards */}
          <div className="grid gap-6 lg:col-span-8">
            {/* Trips */}
            <Card className="rounded-2xl border-border/60 bg-card/60 shadow-xl backdrop-blur">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Tripek</CardTitle>
                <CardDescription>{trips.data.length === 0 ? "Nem mentett még le utat" : "Utak száma " + trips.data.length}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {trips.data.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-background/40 px-4 py-3 transition hover:bg-accent/30"
                  >
                    <div className="min-w-0">
                      <div className="truncate font-medium">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.dateText}</div>
                    </div>

                    <Badge variant="secondary" className="rounded-full">
                      {t.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Friends preview */}
            <Card className="rounded-2xl border-border/60 bg-card/60 shadow-xl backdrop-blur">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Barátok</CardTitle>
                <CardDescription>{friends.data.length === 0 ? "Még nincsenek barátok :(" : "Barátok száma " + friends.data.length}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                {friends.data.map((f) => (
                  <div
                    key={f.id}
                    className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/40 px-4 py-3"
                  >
                    <Avatar className="h-10 w-10 rounded-xl ring-1 ring-border/60">
                      <AvatarImage src={f.avatarUrl} alt={f.username} />
                      <AvatarFallback className="rounded-xl">
                        {f.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="truncate font-medium">{f.username}</div>
                        {f.isAdmin && (
                          <Badge className="rounded-full" variant="default">
                            Admin
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Clans */}
            <Card className="rounded-2xl border-border/60 bg-card/60 shadow-xl backdrop-blur">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Klánok</CardTitle>
                <CardDescription>{clans.data.length === 0 ? "Még nem csatlakozott klánhoz" : "Klánok száma " + clans.data.length}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {clans.data.map((c) => (
                  <div
                    key={c.clan.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-background/40 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <div className="truncate font-medium">{c.clan.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Szerep: {c.clan.leader_id === user.userID ? "Vezető" : "Tag"}
                      </div>
                      <div className="text-xs text-muted-foreground">Online státust</div>
                    </div>

                    <Badge
                      variant={c.clan.leader_id === user.userID ? "default" : "secondary"}
                      className={cn("rounded-full", c.clan.leader_id === user.userID && "bg-primary")}
                    >
                      {c.clan.leader_id === user.userID ? (
                        <span className="inline-flex items-center gap-1">
                          <Crown className="h-3.5 w-3.5" />
                          Vezető
                        </span>
                      ) : (
                        "Tag"
                      )}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}

function StatBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background/40 px-3 py-3">
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="text-xs">{label}</span>
        <span className="opacity-80">{icon}</span>
      </div>
      <div className="mt-1 text-xl font-semibold">{value}</div>
    </div>
  )
}
