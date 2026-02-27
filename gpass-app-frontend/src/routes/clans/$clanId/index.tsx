import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { useEffect, useMemo, useState } from "react"
import { Crown, Shield, Users, Trash2, Pencil, UserX } from "lucide-react"

import { useAuth } from "@/hooks/useAuth"
import { useClans } from "@/hooks/useClans"

import NotLoggedIn from "@/components/NotLoggedIn"
import LoadingPage from "@/components/LoadingPage"
import ServerErrorPage from "@/components/ServerErrorPage"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"

export const Route = createFileRoute("/clans/$clanId/")({
  component: ClanDetailPage,
})

/* ================= ZOD ================= */

const EditClanSchema = z.object({
  name: z.string().min(3).max(30),
  description: z.string().max(50).optional(),
})

type EditClanValues = z.infer<typeof EditClanSchema>

/* ================= COMPONENT ================= */

function ClanDetailPage() {
  const { clanId } = Route.useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [confirmName, setConfirmName] = useState("")
  const [editOpen, setEditOpen] = useState(false)

  /* 🔥 HOOK */

  const {
    clanQuery,
    clanMembersQuery,
    membershipsQuery,
    joinClan,
    leaveClan,
    deleteClan,
    updateClan,
    updateClanLoading,
  } = useClans(Number(user?.userID), Number(clanId))

  const clan = clanQuery.data
  const members = clanMembersQuery.data ?? []
  const memberships = membershipsQuery.data ?? []

  const isMember = useMemo(() => {
    return memberships.some(
      (m: any) => m.clan_id === Number(clanId)
    )
  }, [memberships, clanId])

  const isLeader = clan?.leader_id === Number(user?.userID)

  /* ===== EDIT FORM ===== */

  const editForm = useForm<EditClanValues>({
    resolver: zodResolver(EditClanSchema),
    defaultValues: {
      name: clan?.name ?? "",
      description: clan?.description ?? "",
    },
  })

  useEffect(() => {
    if (clan) {
      editForm.reset({
        name: clan.name ?? "",
        description: clan.description ?? "",
      })
    }
  }, [clan])


  /* ================= GUARDS ================= */

  if (!user) return <NotLoggedIn />

  if (
    clanQuery.isLoading ||
    clanMembersQuery.isLoading ||
    membershipsQuery.isLoading
  )
    return <LoadingPage />

  if (clanQuery.isError) return <ServerErrorPage />

  /* ================= RENDER ================= */

  return (
    <main className="min-h-[calc(100vh-64px)] bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-8 grid gap-8 lg:grid-cols-12">

        {/* LEFT SIDE */}
        <div className="lg:col-span-4 space-y-6">

          <Card>
            <CardHeader className="cursor-default">
              <CardTitle>{clan?.name}</CardTitle>
              <CardDescription>
                {clan?.description ?? "Nincs leírás"}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">

              <Badge variant="secondary">
                <Users className="h-4 w-4 mr-1" />
                {members.length + 1} tag
              </Badge>

              <Separator />

              {isLeader ? (
                <div className="space-y-2">
                  <Button
                    variant="destructive"
                    className="w-full cursor-pointer"
                    onClick={() => setDeleteOpen(true)}
                  >
                    <Trash2 className="w-3 h-3" />
                    Klán törlése
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full cursor-pointer"
                    onClick={() => setEditOpen(true)}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Szerkesztés
                  </Button>
                </div>
              ) : isMember ? (
                <Button
                  variant="outline"
                  className="w-full cursor-pointer"
                  onClick={() => leaveClan({clanId: Number(clanId), userId: Number(user.userID)})}
                >
                  Kilépés
                </Button>
              ) : (
                <Button
                  className="w-full cursor-pointer"
                  onClick={() => joinClan(Number(clanId))}
                >
                  Csatlakozás
                </Button>
              )}

            </CardContent>
          </Card>

          {/* LEADER */}
          <Card>
            <CardHeader>
              <CardTitle>Vezető</CardTitle>
            </CardHeader>
            <CardContent>
              <Link
                to="/profile/$userID"
                params={{ userID: String(clan?.leader_id) }}
                className="flex items-center justify-between p-3 rounded-xl border hover:bg-muted cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-yellow-500" />
                  {clan?.leader.username}
                </div>

                <div className="flex gap-2">
                  <Badge>Vezető</Badge>
                  {clan?.leader.isAdmin && (
                    <Badge variant="secondary">
                      <Shield className="h-3 w-3 mr-1" />
                      Admin
                    </Badge>
                  )}
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT SIDE - MEMBERS */}
        <div className="lg:col-span-8">
          <Card>
            <CardHeader>
              <CardTitle>Tagok</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">

              {members.length === 0 && (
                <div className="text-sm text-muted-foreground text-center py-6">
                  Még nincs tag a klánban.
                </div>
              )}

              {members.map((member) => (
                <Link
                  to="/profile/$userID"
                  params={{ userID: String(member.user_id) }}
                >
                  <div
                    key={member.user_id}
                    className="flex items-center justify-between p-3 rounded-xl border hover:bg-muted"
                  >
                    {member.user?.username}

                    {isLeader && (
                      <Button
                        size="sm"
                        variant="destructive"
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          leaveClan({clanId: Number(clanId), userId: Number(member.user_id)})
                        }}
                      >
                        <UserX className="h-3 w-3" />
                        Kirúgás
                      </Button>
                    )}
                  </div>
                </Link>
              ))}

            </CardContent>
          </Card>
        </div>
      </div>

      {/* DELETE DIALOG */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="border-2 border-red-500 animate-pulse">
          <DialogHeader>
            <DialogTitle>Klán törlése</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Írd be pontosan a klán nevét:
            </p>

            <div className="font-semibold">
              {clan?.name}
            </div>

            <Input
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
            />

            <Button
              variant="destructive"
              className="w-full cursor-pointer"
              disabled={confirmName !== clan?.name}
              onClick={() => {
                deleteClan(Number(clanId))
                navigate({ to: "/clans" })
              }}
            >
              Végleges törlés
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* EDIT DIALOG */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Klán szerkesztése</DialogTitle>
          </DialogHeader>

          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit((values) =>
                updateClan({
                  clanId: Number(clanId),
                  values,
                  onSuccessCallback: () => {
                    setEditOpen(false)
                  }
                })
              )}
              className="space-y-4 mt-4"
            >
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Név</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Leírás</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full mt-2 cursor-pointer"
                disabled={updateClanLoading}
              >
                Mentés
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

    </main>
  )
}