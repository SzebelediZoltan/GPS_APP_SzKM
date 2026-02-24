import { createFileRoute, Link } from "@tanstack/react-router"
import {
  ShieldCheck,
  Shield,
  Mail,
  Compass,
  UserPlus,
  Pencil,
  UserX,
  UserCheck,
  MapPin,
  Users,
  Flag
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/useAuth"
import { useFriends } from "@/hooks/useFriends"
import { useMappedFriends } from "@/hooks/useMappedFriends"
import NotLoggedIn from "@/components/NotLoggedIn"
import LoadingPage from "@/components/LoadingPage"
import ServerErrorPage from "@/components/ServerErrorPage"
import { StatBox } from "@/components/StatBox"

export const Route = createFileRoute("/profile/$userID/")({
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = useAuth()
  const params = Route.useParams()

  const {
    pendingRequests,
    acceptedRequests,
    currentUser,
    terminateRequest,
    add,
    accept,
    isTerminating,
    isAdding,
    isAccepting,
  } = useFriends(params.userID, !!user)

  /* 🔥 SAFE DEFAULTS */
  const userData = currentUser.data?.data
  const pending = pendingRequests.data?.data ?? []
  const accepted = acceptedRequests.data?.data ?? []

  /* ✅ MINDIG FUT */
  const { mappedFriends: friends } = useMappedFriends(
    userData?.username ?? "",
    pending,
    accepted
  )

  /* ---------------- NOT LOGGED ---------------- */

  if (!user) return <NotLoggedIn />

  /* ---------------- LOADING ---------------- */

  if (
    currentUser.isLoading ||
    pendingRequests.isLoading ||
    acceptedRequests.isLoading ||
    isTerminating ||
    isAdding ||
    isAccepting
  ) {
    return <LoadingPage />
  }

  /* ---------------- ERROR ---------------- */

  if (
    !currentUser.data ||
    !pendingRequests.data ||
    !acceptedRequests.data ||
    !userData || 
    currentUser.data.status !== 200 ||
    pendingRequests.data.status !== 200 ||
    acceptedRequests.data.status !== 200
  ) {
    return <ServerErrorPage />
  }

  const isOthersProfile = userData.ID !== user.userID

  const theirRelation =
    pending.find(
      (e) =>
        (e.receiver_id === user.userID || e.sender_id === user.userID) &&
        isOthersProfile
    ) ||
    accepted.find(
      (e) =>
        (e.receiver_id === user.userID || e.sender_id === user.userID) &&
        isOthersProfile
    )

  const isReceiver = theirRelation?.receiver_id === userData.ID
  /* ============================================================ */

  return (
    <main className="min-h-[calc(100vh-64px)] bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl px-4 py-8">

        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-3 py-1 text-xs text-muted-foreground">
              <Compass className="h-3.5 w-3.5" />
              Profil
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight">
              Fiók áttekintése
            </h1>
          </div>

          {/* ACTION BUTTONS */}

          {isOthersProfile ? (
            theirRelation ? (
              theirRelation.status === "sent" ? (
                isReceiver ? (
                  <Button
                    className="rounded-xl"
                    onClick={() => terminateRequest(theirRelation.id)}
                  >
                    <UserX />
                    Barátkérelem törlése
                  </Button>
                ) : (
                  <div>
                    <Button
                      className="rounded-xl mr-2 bg-green-500"
                      onClick={() => accept(theirRelation.id)}
                    >
                      <UserCheck />
                      Elfogadás
                    </Button>
                    <Button
                      className="rounded-xl bg-red-400"
                      onClick={() => terminateRequest(theirRelation.id)}
                    >
                      <UserX />
                      Elutasítás
                    </Button>
                  </div>
                )
              ) : (
                <Button
                  className="rounded-xl"
                  onClick={() => terminateRequest(theirRelation.id)}
                >
                  <UserX />
                  Barát törlése
                </Button>
              )
            ) : (
              <Button
                className="rounded-xl"
                onClick={() =>
                  add({
                    sender_id: user.userID,
                    receiver_id: userData.ID,
                  })
                }
              >
                <UserPlus />
                Barátnak jelölés
              </Button>
            )
          ) : (
            <div>
              <Link to="/profile/friends">
                <Button variant="outline" className="rounded-xl mr-2">
                  <Users />
                  Barátok
                </Button>
              </Link>
              <Button className="rounded-xl">
                <Pencil />
                Szerkesztés
              </Button>
            </div>
          )}
        </div>

        {/* Layout */}
        <div className="grid gap-6 lg:grid-cols-12">

          {/* LEFT CARD */}
          <Card className="rounded-2xl border-border/60 bg-card/60 shadow-xl backdrop-blur lg:col-span-4">
            <CardHeader>
              <CardTitle className="text-lg">Adatok</CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 rounded-2xl ring-1 ring-border/60">
                  <AvatarImage alt={userData.username} />
                  <AvatarFallback className="rounded-2xl">
                    {userData.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold">
                      {userData.username}
                    </h2>
                    <Badge
                      variant={userData.isAdmin ? "default" : "secondary"}
                      className={cn(
                        "rounded-full",
                        userData.isAdmin && "bg-primary text-primary-foreground"
                      )}
                    >
                      {userData.isAdmin ? (
                        <>
                          <ShieldCheck className="h-3.5 w-3.5" />
                          Admin
                        </>
                      ) : (
                        <>
                          <Shield className="h-3.5 w-3.5" />
                          User
                        </>
                      )}
                    </Badge>
                  </div>

                  <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {userData.email}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-3 gap-3">
                <StatBox icon={<MapPin className="h-4 w-4" />} label="Tripek" value="0" />
                <StatBox icon={<Users className="h-4 w-4" />} label="Barátok" value={"" + friends.filter((e) => e.status === "accepted").length} />
                <StatBox icon={<Flag className="h-4 w-4" />} label="Klánok" value="0" />
              </div>
            </CardContent>
          </Card>

          {/* FRIENDS CARD */}
          <div className="grid gap-6 lg:col-span-8">
            <Card className="rounded-2xl border-border/60 bg-card/60 shadow-xl backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg">Barátok</CardTitle>
                <CardDescription>
                  {friends.filter((f) => f.status === "accepted").length === 0
                    ? "Még nincsenek barátok :("
                    : "Barátok száma " +
                    friends.filter((f) => f.status === "accepted").length}
                </CardDescription>
              </CardHeader>

              <CardContent className="grid gap-3 sm:grid-cols-2">
                {friends
                  .filter((f) => f.status === "accepted")
                  .map((f) => (
                    <Link
                      key={f.ID}
                      to="/profile/$userID"
                      params={{ userID: f.ID }}
                      className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/40 px-4 py-3 hover:bg-muted/50 transition"
                    >
                      <Avatar className="h-10 w-10 rounded-xl ring-1 ring-border/60">
                        <AvatarFallback className="rounded-xl">
                          {f.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <div className="flex items-center gap-2">
                          <div className="font-medium">{f.username}</div>
                          {f.isAdmin && (
                            <Badge className="rounded-full">
                              <ShieldCheck className="h-3.5 w-3.5" />
                              Admin
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}