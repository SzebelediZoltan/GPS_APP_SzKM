import { createFileRoute } from "@tanstack/react-router"
import {
  ShieldCheck,
  Shield,
  Mail,
  Compass,
  UserPlus,
  Pencil,
  UserX,
  UserCheck,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"

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
  status: string
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
    queryKey: ["pendingRequests"],
    queryFn: () => getPendingRequests(params.userID),
    enabled: !!user,
  })

  const { data: currentUser, isLoading: userIsLoading } = useQuery({
    queryKey: ["currentUser", params.userID],
    queryFn: () => getUser(params.userID),
    enabled: !!user,
  })

  const { data: acceptedRequests, isLoading: acceptedRequestsIsLoading } = useQuery({
    queryKey: ["acceptedRequests"],
    queryFn: () => getAcceptedRequests(params.userID),
    enabled: !!user,
  })

  const { mutate: terminateRequest } = useMutation({
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

  const { mutate: add } = useMutation({
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

  const { mutate: accept } = useMutation({
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

  if (userIsLoading || pendingRequestsIsLoading || acceptedRequestsIsLoading) {
    return <LoadingPage />
  }

  if (!user) {
    return <>
      <NotLoggedIn />
    </>
  }

  if (!currentUser || !pendingRequests || !acceptedRequests) {
    return <ServerErrorPage />
  }

  const isOthersProfile = currentUser.data.ID !== user.userID

  const theirRelation
    = pendingRequests.data.find((e) => {
      if (e.receiver_id === user.userID || e.sender_id === user.userID) {
        return true
      }
    })
    || acceptedRequests.data.find((e) => {
      if (e.receiver_id === user.userID || e.sender_id === user.userID) {
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
            <Button className="rounded-xl">
              <Pencil />
              Szerkesztés
            </Button>}

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


              <div className="rounded-2xl border border-border/60 bg-background/40 p-3">
                <p className="text-xs text-muted-foreground">
                  Status: Ide jöhet majd amit ki akar írni a felhasználó magáról.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Toaster />
    </main>
  )
}
