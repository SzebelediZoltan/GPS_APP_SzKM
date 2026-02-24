import { createFileRoute, Link } from "@tanstack/react-router"
import { Users, ShieldCheck, UserX, User, Search } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/hooks/useAuth"
import { useFriends } from "@/hooks/useFriends"
import { useMappedFriends } from "@/hooks/useMappedFriends"
import NotLoggedIn from "@/components/NotLoggedIn"
import LoadingPage from "@/components/LoadingPage"
import ServerErrorPage from "@/components/ServerErrorPage"
import { useState } from "react"
import UserSearchDialog from "@/components/userSearchDialog"
import FriendRequestsDialog from "@/components/FriendRequestsDialog"

export const Route = createFileRoute("/profile/friends")({
  component: FriendsPage,
})

function FriendsPage() {
  const { user } = useAuth()
  const [removingId, setRemovingId] = useState<string | null>(null)

  const {
    acceptedRequests,
    pendingRequests,
    terminateRequest,
  } = useFriends(user?.userID ?? "", !!user)

  /* SAFE DEFAULTS */
  const accepted = acceptedRequests.data?.data ?? []
  const pending = pendingRequests.data?.data ?? []

  const { mappedFriends: friends } = useMappedFriends(
    user?.username ?? "",
    [],
    accepted
  )

  if (!user) return <NotLoggedIn />

  if (acceptedRequests.isLoading || pendingRequests.isLoading) {
    return <LoadingPage />
  }

  if (!acceptedRequests.data || !pendingRequests.data) {
    return <ServerErrorPage />
  }

  return (
    <main className="min-h-[calc(100vh-64px)] bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl px-4 py-8">

        {/* HEADER */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-3 py-1 text-xs text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              Barátok
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight">
              Barátlista
            </h1>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-2">

            {/* Pending count */}
            <FriendRequestsDialog />

            {/* Search (placeholder) */}
            <UserSearchDialog />

          </div>
        </div>

        {/* FRIEND LIST */}
        <Card className="rounded-2xl border-border/60 bg-card/60 shadow-xl backdrop-blur">
          <CardContent className="space-y-3">

            {friends.length === 0 && (
              <div className="text-sm text-muted-foreground">
                Még nincsenek barátaid.
              </div>
            )}

            {friends.map((f, idx) => (
              <div key={f.ID}>
                <div
                  className={`flex flex-col gap-3 rounded-2xl border border-border/60 bg-background/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between transition-all duration-300 ${removingId === f.relationID
                    ? "opacity-0 scale-95 translate-x-4"
                    : "opacity-100 scale-100"
                    }`}
                >
                  {/* Left: avatar + name */}
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 rounded-xl ring-1 ring-border/60">
                      <AvatarImage src={""} alt={f.username} />
                      <AvatarFallback className="rounded-xl">
                        {f.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <div className="flex items-center gap-2">
                        <div className="font-medium">{f.username}</div>
                        {f.isAdmin && (
                          <Badge className="rounded-full">
                            <span className="inline-flex items-center gap-1">
                              <ShieldCheck className="h-3.5 w-3.5" />
                              Admin
                            </span>
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: actions */}
                  <div className="flex gap-2">

                    <Button
                      asChild
                      variant="outline"
                      className="rounded-xl transition-all duration-200 hover:scale-[1.03] hover:shadow-md active:scale-[0.98]"
                    >
                      <Link
                        to="/profile/$userID"
                        params={{ userID: f.ID }}
                      >
                        <User className="mr-2 h-4 w-4" />
                        Profil
                      </Link>
                    </Button>

                    <Button
                      variant="destructive"
                      className="rounded-xl transition-all duration-200 hover:scale-[1.05] hover:shadow-lg active:scale-[0.95] cursor-pointer"
                      onClick={() => {
                        setRemovingId(f.relationID)
                        setTimeout(() => {
                          terminateRequest(f.relationID)
                        }, 250)
                      }}
                    >
                      <UserX className="mr-2 h-4 w-4" />
                      Törlés
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