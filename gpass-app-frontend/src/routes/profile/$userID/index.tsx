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
import axios from "axios"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import NotLoggedIn from "@/components/NotLoggedIn"
import LoadingPage from "@/components/LoadingPage"
import ServerErrorPage from "@/components/ServerErrorPage"
import { useMappedFriends } from "@/hooks/useMappedFriends"
import { StatBox } from "@/components/StatBox"
import { toast } from "sonner"

export const Route = createFileRoute('/profile/$userID/')({
  component: RouteComponent,
})

type User = {
  ID: string,
  username: string,
  email: string,
  isAdmin: boolean
}

type FriendRelation = {
  id: string,
  sender_id: string,
  receiver_id: string,
  status: string,
  sender: {
    ID: string,
    username: string,
    isAdmin: boolean
  },
  receiver: {
    ID: string,
    username: string,
    isAdmin: boolean
  }
}

const acceptRequest = (id: string) => {
  return axios.put("/api/friends-with/" + id, { status: "accepted" })
}

const getPendingRequests = (id: string) => {
  return axios.get<FriendRelation[]>("/api/friends-with/pending/" + id)
}

const getAcceptedRequests = (id: string) => {
  return axios.get<FriendRelation[]>("/api/friends-with/accepted/" + id)
}

const deleteRequest = (id: string) => {
  return axios.delete("/api/friends-with/" + id)
}

const addFriend = (sender_id: string, receiver_id: string) => {
  return axios.post("/api/friends-with", { sender_id, receiver_id })
}

const getUser = (id: string) => {
  return axios.get<User>("/api/users/" + id)
}

function RouteComponent() {
  const { user } = useAuth()
  const params = Route.useParams()
  const queryClient = useQueryClient()

  const { data: pendingRequests, isLoading: pendingRequestsIsLoading } = useQuery({
    queryKey: ["pendingRequests", params.userID],
    queryFn: () => getPendingRequests(params.userID),
    enabled: !!user,
  })

  const { data: currentUser, isLoading: userIsLoading } = useQuery({
    queryKey: ["currentUser", params.userID],
    queryFn: () => getUser(params.userID),
    enabled: !!user,
  })

  const { data: acceptedRequests, isLoading: acceptedRequestsIsLoading } = useQuery({
    queryKey: ["acceptedRequests", params.userID],
    queryFn: () => getAcceptedRequests(params.userID),
    enabled: !!user,
  })

  const { mutate: terminateRequest, isPending: isTerminating } = useMutation({
    mutationFn: (id: string) => deleteRequest(id),
    onSuccess: () => {
      toast.success("Barátkérelem törölve!", {
        position: "bottom-right"
      })
      queryClient.invalidateQueries({ queryKey: ["pendingRequests"] })
      queryClient.invalidateQueries({ queryKey: ["acceptedRequests"] })
    },
    onError: () => {
      toast.error("Barátkérelem törlése sikertlen!", {
        position: "bottom-right",
      })
    }
  })

  const { mutate: add, isPending: isAdding } = useMutation({
    mutationFn: ({ sender_id, receiver_id }: { sender_id: string, receiver_id: string }) => addFriend(sender_id, receiver_id),
    onSuccess: () => {
      toast.success("Barátkérelem elküldve!", {
        position: "bottom-right"
      })
      queryClient.invalidateQueries({ queryKey: ["pendingRequests"] })
      queryClient.invalidateQueries({ queryKey: ["acceptedRequests"] })
    },
    onError: () => {
      toast.error("Barátkérelem elküldése sikertlen!", {
        position: "bottom-right",
      })
    }
  })

  const { mutate: accept, isPending: isAccepting } = useMutation({
    mutationFn: (id: string) => acceptRequest(id),
    onSuccess: () => {
      toast.success("Barátkérelem elfogadva!", {
        position: "bottom-right"
      })
      queryClient.invalidateQueries({ queryKey: ["pendingRequests"] })
      queryClient.invalidateQueries({ queryKey: ["acceptedRequests"] })
    },
    onError: () => {
      toast.error("Barátkérelem elfogadása sikertlen!", {
        position: "bottom-right",
      })
    }
  })

  const { mappedFriends: friends } = useMappedFriends(
    currentUser?.data.username ?? "",
    pendingRequests?.data ?? [],
    acceptedRequests?.data ?? []
  )


  if (userIsLoading || pendingRequestsIsLoading || acceptedRequestsIsLoading || isTerminating || isAdding || isAccepting) {
    return <LoadingPage />
  }

  if (!user) {
    return <>
      <NotLoggedIn />
    </>
  }

  if (!currentUser || !pendingRequests || !acceptedRequests || currentUser.status !== 200 || pendingRequests.status !== 200 || acceptedRequests.status !== 200) {
    return <ServerErrorPage />
  }


  const isOthersProfile = currentUser.data.ID !== user.userID

  const theirRelation
    = pendingRequests.data.find((e) => {
      if ((e.receiver_id === user.userID || e.sender_id === user.userID) && isOthersProfile) {
        return true
      }
    })
    || acceptedRequests.data.find((e) => {
      if ((e.receiver_id === user.userID || e.sender_id === user.userID) && isOthersProfile) {
        return true
      }
    })


  const isReceiver = theirRelation?.receiver_id === currentUser.data.ID

  return (
    <main className="min-h-[calc(100vh-64px)] bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        {/* Header row */}
        <div className="mb-6 flex items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-3 py-1 text-xs text-muted-foreground">
              <Compass className="h-3.5 w-3.5" />
              Profil
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight">Fiók áttekintése</h1>
          </div>

          {isOthersProfile ?
            theirRelation ?
              theirRelation.status == "sent" ?
                isReceiver ?
                  <Button className="rounded-xl" onClick={() => terminateRequest(theirRelation.id)}>
                    <UserX />
                    Barátkérelem törlése
                  </Button>
                  :
                  <div>
                    <Button className="rounded-xl mr-2 bg-green-500" onClick={() => accept(theirRelation.id)}>
                      <UserCheck />
                      Elfogadás
                    </Button>
                    <Button className="rounded-xl bg-red-400" onClick={() => terminateRequest(theirRelation.id)}>
                      <UserX />
                      Elutasítás
                    </Button>
                  </div>
                :
                <Button className="rounded-xl" onClick={() => terminateRequest(theirRelation?.id)}>
                  <UserX />
                  Barát törlése
                </Button>
              :
              <Button className="rounded-xl" onClick={() => add({ sender_id: user.userID, receiver_id: currentUser.data.ID })}>
                <UserPlus />
                Barátnak jelölés
              </Button>
            :
            <div>
              <Button variant={"outline"} className="rounded-xl mr-2">
                <Users />
                Barátok
              </Button>
              <Button className="rounded-xl">
                <Pencil />
                Szerkesztés
              </Button>
            </div>
          }

        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left: profile card */}
          <Card className="rounded-2xl border-border/60 bg-card/60 shadow-xl backdrop-blur lg:col-span-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Adatok</CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-16 w-16 rounded-2xl ring-1 ring-border/60">
                    <AvatarImage alt={currentUser.data.username} />
                    <AvatarFallback className="rounded-2xl">
                      {currentUser.data.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  {/* subtle glow */}
                  <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[28px] bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.18),transparent_60%)] blur-2xl" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate text-xl font-semibold">{currentUser.data.username}</h2>
                    <Badge
                      variant={currentUser.data.isAdmin ? "default" : "secondary"}
                      className={cn(
                        "rounded-full",
                        currentUser.data.isAdmin && "bg-primary text-primary-foreground"
                      )}
                    >
                      {currentUser.data.isAdmin ? (
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
                    <span className="truncate">{currentUser.data.email}</span>
                  </div>
                </div>
              </div>

              <Separator className="bg-border/70" />

              {/* Quick stats placeholders */}
              <div className="grid grid-cols-3 gap-3">
                <StatBox icon={<MapPin className="h-4 w-4" />} label="Tripek" value={"" + 0} />
                <StatBox icon={<Users className="h-4 w-4" />} label="Barátok" value={"" + friends.length} />
                <StatBox icon={<Flag className="h-4 w-4" />} label="Klánok" value={"" + 0} />
              </div>


              <div className="rounded-2xl border border-border/60 bg-background/40 p-3">
                <p className="text-xs text-muted-foreground">
                  Status: Ide jöhet majd amit ki akar írni a felhasználó magáról.
                </p>
              </div>
            </CardContent>
          </Card>
          <div className="grid gap-6 lg:col-span-8">
            {/* Trips */}
            {/* <Card className="rounded-2xl border-border/60 bg-card/60 shadow-xl backdrop-blur">
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
            </Card> */}

            {/* Friends preview */}
            <Card className="rounded-2xl border-border/60 bg-card/60 shadow-xl backdrop-blur">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Barátok</CardTitle>
                <CardDescription>{friends.filter((f) => f.status === "accepted").length === 0 ? "Még nincsenek barátok :(" : "Barátok száma " + friends.filter((f) => f.status === "accepted").length}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                {friends.filter((f) => f.status === "accepted").map((f) => (
                  <Link
                    key={f.ID}
                    to="/profile/$userID"
                    params={{ userID: f.ID }}
                    className="flex cursor-pointer items-center gap-3 rounded-2xl border border-border/60 bg-background/40 px-4 py-3 hover:bg-muted/50 transition"
                  >
                    <Avatar className="h-10 w-10 rounded-xl ring-1 ring-border/60">
                      <AvatarImage src={""} alt={f.username} />
                      <AvatarFallback className="rounded-xl">
                        {"MA".toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="truncate font-medium">{f.username}</div>
                        {f.isAdmin && (
                          <Badge className="rounded-full" variant="default">
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

            {/* Clans */}
            {/* <Card className="rounded-2xl border-border/60 bg-card/60 shadow-xl backdrop-blur">
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
            </Card> */}
          </div>
        </div>
      </div>
    </main>
  )
}
