import React from "react"
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import {
  ShieldCheck,
  Shield,
  Mail,
  MapPin,
  Users,
  Flag,
  Crown,
  Compass,
  UserPlus,
  Pen,
  Pencil,
  UserX,
  UserCheck,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/useAuth"
import axios from "axios"
import { useMutation, useQuery } from "@tanstack/react-query"
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
  receive_id: string
}

const getPendingRequests = (id: string) => {
  return axios.get<FriendRelation[]>("/api/friends-with/pending/" + id)
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

  const { data: pendingRequests, isLoading: pendingRequestsIsLoading } = useQuery({
    queryKey: ["pendingRequests", params.userID],
    queryFn: () => getPendingRequests(params.userID)
  })

  const { data: currentUser, isLoading: userIsLoading } = useQuery({
    queryKey: ["currentUser", params.userID],
    queryFn: () => getUser(params.userID),
    enabled: !user,
  })

  const { mutate: add } = useMutation({
    mutationFn: ({ sender_id, receiver_id }: { sender_id: string, receiver_id: string }) => addFriend(sender_id, receiver_id),
    onSuccess: () => {
      toast.success("Barátkérelem elküldve!", {
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
        position: "bottom-right"
      })
    },
    onError: () => {
      toast.error("Barátkérelem elküldése sikertlen!", {
        position: "bottom-right",
      })
    }
  })


  if (userIsLoading || pendingRequestsIsLoading) {
    return <LoadingPage />
  }

  if (!currentUser || !pendingRequests) {
    return <ServerErrorPage />
  }

  if (!user) {
    return <>
      <NotLoggedIn />
    </>
  }

  const isReceiver = pendingRequests.data.some((e) => e.sender_id === user.userID)
  const isSender = pendingRequests.data.some((e) => e.receive_id === user.userID)


  const isOthersProfile = currentUser.data.ID !== user.userID

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
            isReceiver ?
              <Button className="rounded-xl" onClick={() => add({ sender_id: user.userID, receiver_id: currentUser.data.ID })}>
                <UserX />
                Barátkérelem törlése
              </Button>
              :
              isSender ?
                <>
                  <Button className="rounded-xl" onClick={() => add({ sender_id: user.userID, receiver_id: currentUser.data.ID })}>
                    <UserCheck />
                    Elfogadás
                  </Button>
                  <Button className="rounded-xl" onClick={() => add({ sender_id: user.userID, receiver_id: currentUser.data.ID })}>
                    <UserX />
                    Elutasítás
                  </Button>
                </>
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
