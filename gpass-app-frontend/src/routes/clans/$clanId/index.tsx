import { createFileRoute } from "@tanstack/react-router"
import { Crown, Users, UserPlus, ShieldCheck } from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

/* ================= ROUTE ================= */

export const Route = createFileRoute("/clans/$clanId/")({
  component: ClanDetailPage,
})

/* ================= TYPES ================= */

type Member = {
  name: string
  isAdmin: boolean
}

type Clan = {
  id: number
  name: string
  description: string
  leader_id: number
  leader_name: string
  members: Member[]
}

/* ================= DUMMY DATA ================= */

const dummyClan: Clan = {
  id: 1,
  name: "GP Legends",
  description:
    "Egy elit közösség azoknak, akik komolyan veszik az utazást és a navigációt.",
  leader_id: 1,
  leader_name: "Csabi",
  members: [
    { name: "Csabi", isAdmin: true },
    { name: "Miki", isAdmin: false },
    { name: "Zoli", isAdmin: false },
    { name: "Andris", isAdmin: true },
    { name: "Levi", isAdmin: false },
    { name: "Dominik", isAdmin: false },
  ],
}

/* ================= COMPONENT ================= */

function ClanDetailPage() {
  const clan = dummyClan
  const memberCount = clan.members.length

  return (
    <main className="min-h-[calc(100vh-64px)] bg-background text-foreground">
      {/* Glow háttér */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-44 left-1/2 h-130 w-130 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.14),transparent_60%)] blur-2xl" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 py-10 space-y-10">

        {/* ======= HEADER CARD ======= */}
        <Card className="rounded-2xl border-border/60 bg-card/60 shadow-2xl backdrop-blur">
          <CardHeader className="space-y-4">

            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <CardTitle className="text-3xl">
                  {clan.name}
                </CardTitle>
                <CardDescription className="mt-2 max-w-2xl">
                  {clan.description}
                </CardDescription>
              </div>

              <Button className="rounded-xl flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Csatlakozás
              </Button>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <Badge
                variant="secondary"
                className="rounded-full flex items-center gap-1 px-3 py-1"
              >
                <Users className="h-4 w-4" />
                {memberCount} tag
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* ======= LEADER SECTION ======= */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Crown className="h-5 w-5 text-primary" />
            Vezető
          </h2>

          <Card className="rounded-2xl border-2 border-primary bg-primary/5 backdrop-blur shadow-xl transition hover:scale-[1.01]">
            <CardContent className="flex items-center gap-4 p-6">

              <Avatar className="h-14 w-14 rounded-xl ring-2 ring-primary/40">
                <AvatarFallback className="rounded-xl text-lg font-semibold">
                  {clan.leader_name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="text-lg font-semibold">
                    {clan.leader_name}
                  </div>

                  <Badge className="rounded-full bg-primary text-primary-foreground flex items-center gap-1">
                    <Crown className="h-3.5 w-3.5" />
                    Leader
                  </Badge>
                </div>

                <div className="text-sm text-muted-foreground">
                  A klán alapítója és irányítója.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* ======= MEMBERS SECTION ======= */}
        <div>
          <h2 className="text-xl font-semibold mb-6">
            Tagok
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">

            {clan.members.map((member, index) => {
              const isLeader =
                member.name === clan.leader_name

              if (isLeader) return null

              return (
                <Card
                  key={index}
                  className="rounded-2xl border-border/60 bg-card/60 shadow-lg backdrop-blur transition hover:scale-[1.03] hover:shadow-2xl cursor-pointer"
                >
                  <CardContent className="flex items-center gap-4 p-5">

                    <Avatar className="h-12 w-12 rounded-xl ring-1 ring-border/60">
                      <AvatarFallback className="rounded-xl font-semibold">
                        {member.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="font-medium">
                          {member.name}
                        </div>

                        {member.isAdmin && (
                          <Badge
                            variant="secondary"
                            className="rounded-full flex items-center gap-1"
                          >
                            <ShieldCheck className="h-3.5 w-3.5" />
                            Admin
                          </Badge>
                        )}
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Klántag
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </main>
  )
}