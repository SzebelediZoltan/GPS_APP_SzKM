import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { useEffect, useMemo, useState } from "react"
import { Crown, Users, Trash2, Pencil, UserX, ShieldCheck, ArrowLeft } from "lucide-react"

import { useAuth } from "@/hooks/useAuth"
import { useClans } from "@/hooks/social/useClans"

import NotLoggedIn from "@/components/shared/NotLoggedIn"
import LoadingPage from "@/components/shared/LoadingPage"
import ServerErrorPage from "@/components/shared/ServerErrorPage"

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

/* ================= AVATAR HELPER ================= */

function InitialAvatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const initials = name.slice(0, 2).toUpperCase()
  const colors = [
    "#3b82f6", "#8b5cf6", "#10b981", "#f59e0b",
    "#ef4444", "#06b6d4", "#ec4899", "#84cc16",
  ]
  const color = colors[name.charCodeAt(0) % colors.length]
  const sizeClass = size === "lg" ? "h-12 w-12 text-sm" : size === "sm" ? "h-7 w-7 text-[10px]" : "h-9 w-9 text-xs"

  return (
    <div
      className={`${sizeClass} flex shrink-0 items-center justify-center rounded-xl font-black text-white`}
      style={{ background: color }}
    >
      {initials}
    </div>
  )
}

/* ================= COMPONENT ================= */

function ClanDetailPage() {
  const { clanId } = Route.useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [confirmName, setConfirmName] = useState("")
  const [editOpen, setEditOpen] = useState(false)

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
    return memberships.some((m: any) => m.clan_id === Number(clanId))
  }, [memberships, clanId])

  const isLeader = clan?.leader_id === Number(user?.userID)

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
  if (clanQuery.isLoading || clanMembersQuery.isLoading || membershipsQuery.isLoading)
    return <LoadingPage />
  if (clanQuery.isError) return <ServerErrorPage />

  /* ================= RENDER ================= */

  return (
    <main className="min-h-[calc(100vh-64px)] bg-background text-foreground">

      {/* Subtle grid bg */}
      <div className="pointer-events-none fixed inset-0 -z-10"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)/0.025) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)/0.025) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-100 w-150"
          style={{ background: "radial-gradient(ellipse at top, hsl(var(--primary)/0.08) 0%, transparent 65%)", filter: "blur(60px)" }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10">

        {/* Back link */}
        <Link to="/clans" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Vissza a klánokhoz
        </Link>

        <div className="grid gap-6 lg:grid-cols-12">

          {/* ── LEFT SIDEBAR ── */}
          <div className="lg:col-span-4 space-y-4">

            {/* Clan info card */}
            <div
              className="relative rounded-2xl border border-border/50 bg-card/70 backdrop-blur shadow-xl"
              style={{ boxShadow: "0 0 0 1px hsl(var(--primary)/0.1), 0 20px 40px -10px rgba(0,0,0,0.4)" }}
            >

              {/* Avatar sits here, outside the banner div, overlapping via negative margin */}
              <div className="px-6">
                <div className="relative -mt-7 mb-3 inline-block">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-background shadow-xl ring-2 ring-background/60 text-white font-black text-lg"
                    style={{ background: `hsl(${((clan?.name?.charCodeAt(0) ?? 65) * 47) % 360}, 60%, 40%)` }}
                  >
                    {(clan?.name ?? "?").slice(0, 2).toUpperCase()}
                  </div>
                </div>

                {/* Name + desc */}
                <div className="mb-4">
                  <h1 className="text-xl font-black leading-tight truncate">{clan?.name}</h1>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed wrap-break-word">
                    {clan?.description ?? "Nincs leírás megadva."}
                  </p>
                </div>

                {/* Stat row */}
                <div className="flex items-center gap-2 rounded-xl border border-border/40 bg-background/40 px-4 py-3 mb-4">
                  <Users className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm font-semibold">{members.length + 1} tag</span>
                  <Separator orientation="vertical" className="h-4 mx-1 bg-border/60" />
                  <span className="text-xs text-muted-foreground">összesen a klánban</span>
                </div>

                {/* Leader row */}
                <Link
                  to="/profile/$userID"
                  params={{ userID: String(clan?.leader_id) }}
                  className="flex items-center gap-3 rounded-xl border border-border/40 bg-background/40 px-4 py-3 transition-all duration-200 hover:bg-accent/60 hover:border-primary/25 cursor-pointer group mb-4"
                >
                  <InitialAvatar name={clan?.leader.username ?? "?"} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Klánvezető</p>
                    <p className="text-sm font-semibold truncate">{clan?.leader.username}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Crown className="h-3.5 w-3.5 text-amber-400" />
                    {clan?.leader.isAdmin && (
                      <Badge className="text-[10px] px-1.5 py-0.5 gap-1 bg-primary/15 text-primary border border-primary/30">
                        <ShieldCheck className="h-2.5 w-2.5" />
                        Admin
                      </Badge>
                    )}
                  </div>
                </Link>

                <Separator className="bg-border/40 mb-4" />

                {/* Action buttons */}
                <div className="space-y-2 pb-6">
                  {isLeader ? (
                    <>
                      <Button
                        variant="outline"
                        className="w-full cursor-pointer border-border/60 font-semibold"
                        onClick={() => setEditOpen(true)}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Klán szerkesztése
                      </Button>
                      <Button
                        variant="destructive"
                        className="w-full cursor-pointer font-semibold opacity-80 hover:opacity-100"
                        onClick={() => setDeleteOpen(true)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Klán törlése
                      </Button>
                    </>
                  ) : isMember ? (
                    <Button
                      variant="outline"
                      className="w-full cursor-pointer border-border/60"
                      onClick={() => leaveClan({ clanId: Number(clanId), userId: Number(user.userID) })}
                    >
                      Kilépés a klánból
                    </Button>
                  ) : (
                    <Button
                      className="w-full cursor-pointer font-semibold shadow-lg shadow-primary/20"
                      onClick={() => joinClan(Number(clanId))}
                    >
                      Csatlakozás
                    </Button>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* ── RIGHT: MEMBERS ── */}
          <div className="lg:col-span-8">
            <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur overflow-hidden shadow-sm">

              {/* Header */}
              <div className="flex items-center justify-between border-b border-border/40 bg-background/40 px-6 py-4">
                <div>
                  <h2 className="font-bold text-base">Tagok</h2>
                </div>
              </div>

              {/* Members list */}
              <div className="p-4 space-y-2">
                {members.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-border/50 bg-card/60">
                      <Users className="h-7 w-7 text-muted-foreground/40" />
                    </div>
                    <p className="font-semibold text-sm text-foreground/60">Még nincs tag a klánban</p>
                    <p className="mt-1 text-xs text-muted-foreground">Hívj meg barátokat!</p>
                  </div>
                ) : (
                  members.map((member) => (
                    <Link
                      key={member.user_id}
                      to="/profile/$userID"
                      params={{ userID: String(member.user_id) }}
                      className="block"
                    >
                      <div className="group flex items-center justify-between rounded-xl border border-border/40 bg-background/40 px-4 py-3 transition-all duration-200 hover:bg-accent/60 hover:border-primary/25 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <InitialAvatar name={member.user?.username ?? "?"} size="sm" />
                          <div>
                            <p className="text-sm font-medium">{member.user?.username}</p>
                            <p className="text-xs text-muted-foreground">Tag</p>
                          </div>
                        </div>

                        {isLeader && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              leaveClan({ clanId: Number(clanId), userId: Number(member.user_id) })
                            }}
                          >
                            <UserX className="h-4 w-4 mr-1.5" />
                            Kirúgás
                          </Button>
                        )}
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── DELETE DIALOG ── */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="rounded-2xl border-destructive/40">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-destructive">Klán törlése</DialogTitle>
          </DialogHeader>
          <div className="h-px bg-border/40 -mx-6" />
          <div className="space-y-4 pt-1">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ez a művelet <span className="font-semibold text-destructive">visszafordíthatatlan</span>. A klán és minden adata törlésre kerül.
            </p>
            <div className="rounded-xl border border-border/50 bg-background/60 px-4 py-3">
              <p className="text-xs text-muted-foreground mb-1">Klán neve a megerősítéshez:</p>
              <p className="font-black text-sm">{clan?.name}</p>
            </div>
            <Input
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
              placeholder="Írd be a klán nevét..."
              className="rounded-xl bg-background/60 border-border/60"
            />
            <Button
              variant="destructive"
              className="w-full cursor-pointer font-semibold"
              disabled={confirmName !== clan?.name}
              onClick={() => {
                deleteClan(Number(clanId))
                navigate({ to: "/clans" })
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Végleges törlés
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── EDIT DIALOG ── */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-black">Klán szerkesztése</DialogTitle>
          </DialogHeader>
          <div className="h-px bg-border/40 -mx-6" />
          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit((values) =>
                updateClan({
                  clanId: Number(clanId),
                  values,
                  onSuccessCallback: () => setEditOpen(false),
                })
              )}
              className="space-y-5 pt-1"
            >
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Név</FormLabel>
                    <FormControl>
                      <Input {...field} className="rounded-xl bg-background/60 border-border/60" />
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
                    <FormLabel className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Leírás</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="rounded-xl bg-background/60 border-border/60 resize-none" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full cursor-pointer font-semibold"
                disabled={updateClanLoading}
              >
                {updateClanLoading ? "Mentés..." : "Változások mentése"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

    </main>
  )
}
