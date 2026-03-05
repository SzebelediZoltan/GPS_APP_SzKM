import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useMemo } from "react"
import { Users, Star, Plus, Search, Crown, TrendingUp } from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { useAuth } from "@/hooks/useAuth"
import { useClans } from "@/hooks/useClans"

import NotLoggedIn from "@/components/shared/NotLoggedIn"
import LoadingPage from "@/components/shared/LoadingPage"
import ServerErrorPage from "@/components/shared/ServerErrorPage"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"

/* ================= ROUTE ================= */

export const Route = createFileRoute("/clans/")({
  component: ClanPage,
})

/* ================= ZOD ================= */

const CreateClanSchema = z.object({
  name: z.string().min(3).max(30),
  description: z.string().max(50).optional(),
})

type CreateClanValues = z.infer<typeof CreateClanSchema>

/* ================= COMPONENT ================= */

function ClanPage() {
  const { user } = useAuth()

  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("most-members")
  const [open, setOpen] = useState(false)

  const {
    clansQuery,
    membershipsQuery,
    joinClan,
    createClan,
  } = useClans(Number(user?.userID))

  const clans = clansQuery.data ?? []
  const memberships = membershipsQuery.data ?? []

  const isMember = (clanId: number) =>
    memberships.some((m) => m.clan_id === clanId)

  const filtered = useMemo(() => {
    return clans.filter((c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm, clans])

  const sorted = useMemo(() => {
    const copy = [...filtered]
    switch (sortBy) {
      case "newest":       copy.sort((a, b) => b.id - a.id); break
      case "oldest":       copy.sort((a, b) => a.id - b.id); break
      case "most-members": copy.sort((a, b) => b.member_count - a.member_count); break
      case "least-members":copy.sort((a, b) => a.member_count - b.member_count); break
    }
    return copy
  }, [filtered, sortBy])

  const topClan = sorted.length > 0 ? sorted[0] : null

  const form = useForm<CreateClanValues>({
    resolver: zodResolver(CreateClanSchema),
    defaultValues: { name: "", description: "" },
  })

  /* ================= GUARDS ================= */

  if (!user) return <NotLoggedIn />
  if (clansQuery.isLoading || membershipsQuery.isLoading) return <LoadingPage />
  if (clansQuery.isError) return <ServerErrorPage />

  /* ================= RENDER ================= */

  return (
    <main className="min-h-[calc(100vh-64px)] bg-background text-foreground">

      {/* Subtle grid bg */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
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

      <div className="mx-auto w-full max-w-6xl px-4 py-10">

        {/* ===== PAGE HEADER ===== */}
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary">Közösség</span>
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl leading-none">Klánok</h1>
            <p className="text-sm text-muted-foreground">
              Fedezd fel vagy hozd létre a saját közösségedet.
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-2" />
              <Input
                placeholder="Klán keresése..."
                className="rounded-xl pl-9 w-full sm:w-60 bg-card/60 border-border/60 backdrop-blur"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="rounded-xl w-full sm:w-52 cursor-pointer bg-card/60 border-border/60 backdrop-blur">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest" className="cursor-pointer">Legújabb</SelectItem>
                <SelectItem value="oldest" className="cursor-pointer">Legrégebbi</SelectItem>
                <SelectItem value="most-members" className="cursor-pointer">Legtöbb tag</SelectItem>
                <SelectItem value="least-members" className="cursor-pointer">Legkevesebb tag</SelectItem>
              </SelectContent>
            </Select>

            {/* Create dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-xl gap-2 cursor-pointer shadow-lg shadow-primary/20">
                  <Plus className="h-4 w-4" />
                  Létrehozás
                </Button>
              </DialogTrigger>

              <DialogContent className="rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-black">Új klán létrehozása</DialogTitle>
                </DialogHeader>
                <div className="h-px bg-border/40 -mx-6" />
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit((values) =>
                      createClan({ values, onSuccessCallback: () => setOpen(false) })
                    )}
                    className="space-y-5 pt-1"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Név</FormLabel>
                          <FormControl>
                            <Input {...field} className="rounded-xl bg-background/60 border-border/60" placeholder="Klán neve..." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Leírás</FormLabel>
                          <FormControl>
                            <Textarea {...field} className="rounded-xl bg-background/60 border-border/60 resize-none" placeholder="Rövid leírás..." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full rounded-xl cursor-pointer font-semibold">
                      Létrehozás
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* ===== TOP CLAN ===== */}
        {topClan && (
          <Link
            to="/clans/$clanId"
            params={{ clanId: String(topClan.id) }}
            className="block mb-6"
          >
            <div className="group relative overflow-hidden rounded-2xl border border-primary/30 bg-card/70 backdrop-blur shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-primary/20 hover:shadow-2xl"
              style={{ boxShadow: "0 0 0 1px hsl(var(--primary)/0.15), 0 20px 40px -10px rgba(0,0,0,0.3)" }}
            >
              {/* Glow bg */}
              <div className="pointer-events-none absolute inset-0"
                style={{ background: "radial-gradient(ellipse at top left, hsl(var(--primary)/0.1) 0%, transparent 60%)" }}
              />
              {/* Number watermark */}
              <div className="pointer-events-none absolute -right-4 -top-6 text-[120px] font-black text-foreground/3 select-none leading-none">1</div>

              <div className="relative flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 border border-primary/30">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-black">{topClan.name}</h2>
                        <Badge className="bg-primary/15 text-primary border border-primary/30 hover:bg-primary/20">
                          <Star className="h-3 w-3 mr-1" />
                          Top klán
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {topClan.description ?? "Nincs leírás"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground pl-1">
                    <span className="flex items-center gap-1.5">
                      <Crown className="h-3.5 w-3.5 text-amber-400" />
                      {topClan.leader.username}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-primary" />
                      {topClan.member_count + 1} tag
                    </span>
                  </div>
                </div>

                <Button
                  className="shrink-0 rounded-xl min-w-32 font-semibold"
                  disabled={topClan.leader_id === Number(user.userID) || isMember(topClan.id)}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    joinClan(topClan.id)
                  }}
                >
                  {topClan.leader_id === Number(user.userID)
                    ? "Vezető vagy"
                    : isMember(topClan.id)
                    ? "Csatlakozva"
                    : "Csatlakozás"}
                </Button>
              </div>
            </div>
          </Link>
        )}

        {/* ===== CLAN GRID ===== */}
        {sorted.filter((c) => c.id !== topClan?.id).length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-border/50 bg-card/60">
              <Users className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <p className="font-semibold text-foreground/60">Nincs találat</p>
            <p className="mt-1 text-sm text-muted-foreground">Próbálj más keresési feltételt.</p>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted
            .filter((c) => c.id !== topClan?.id)
            .map((clan, i) => (
              <Link
                key={clan.id}
                to="/clans/$clanId"
                params={{ clanId: String(clan.id) }}
                className="block"
              >
                <Card className="group relative h-full cursor-pointer overflow-hidden rounded-2xl border-border/50 bg-card/60 backdrop-blur shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30">
                  {/* Hover glow */}
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{ background: "radial-gradient(ellipse at top left, hsl(var(--primary)/0.07) 0%, transparent 60%)" }}
                  />
                  {/* Rank watermark */}
                  <div className="pointer-events-none absolute -right-2 -top-4 text-8xl font-black text-foreground/3 select-none leading-none group-hover:text-foreground/5 transition-all duration-300">
                    {i + 2}
                  </div>

                  <CardHeader className="relative pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base font-bold leading-snug">{clan.name}</CardTitle>
                      <Badge variant="secondary" className="shrink-0 text-xs">
                        <Users className="h-3 w-3 mr-1" />
                        {clan.member_count + 1}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs break-all leading-relaxed line-clamp-2">
                      {clan.description ?? "Nincs leírás"}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="relative space-y-3 pt-0">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Crown className="h-3 w-3 text-amber-400 shrink-0" />
                      <span>{clan.leader.username}</span>
                    </div>

                    <Separator className="bg-border/40" />

                    <Button
                      className="w-full rounded-xl text-sm font-semibold"
                      size="sm"
                      disabled={clan.leader_id === Number(user.userID) || isMember(clan.id)}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        joinClan(clan.id)
                      }}
                    >
                      {clan.leader_id === Number(user.userID)
                        ? "Vezető vagy"
                        : isMember(clan.id)
                        ? "Csatlakozva"
                        : "Csatlakozás"}
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
        </div>

      </div>
    </main>
  )
}
