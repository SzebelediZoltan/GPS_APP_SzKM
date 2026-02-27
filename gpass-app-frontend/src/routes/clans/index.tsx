import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useMemo } from "react"
import { Users, Star, Plus } from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

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

  /* 🔥 HOOK */

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
      case "newest":
        copy.sort((a, b) => b.id - a.id)
        break
      case "oldest":
        copy.sort((a, b) => a.id - b.id)
        break
      case "most-members":
        copy.sort((a, b) => b.member_count - a.member_count)
        break
      case "least-members":
        copy.sort((a, b) => a.member_count - b.member_count)
        break
    }

    return copy
  }, [filtered, sortBy])

  const topClan = sorted.length > 0 ? sorted[0] : null

  const form = useForm<CreateClanValues>({
    resolver: zodResolver(CreateClanSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  /* ================= RENDER GUARDS ================= */

  if (!user) return <NotLoggedIn />
  if (clansQuery.isLoading || membershipsQuery.isLoading)
    return <LoadingPage />
  if (clansQuery.isError) return <ServerErrorPage />

  /* ================= RETURN ================= */

  return (
    <main className="min-h-[calc(100vh-64px)] bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl px-4 py-8">

        {/* ===== HEADER ===== */}
        <div className="mb-8 rounded-2xl border border-border/60 bg-card/80 backdrop-blur shadow-lg p-6 space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold cursor-default">Klánok</h1>
              <p className="text-sm text-muted-foreground cursor-default">
                Fedezd fel vagy hozd létre a saját közösségedet.
              </p>
            </div>

            <div className="lg:ml-auto flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Klán keresése..."
                className="rounded-xl w-full sm:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="rounded-xl w-full sm:w-52 cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest" className="cursor-pointer">Legújabb</SelectItem>
                  <SelectItem value="oldest" className="cursor-pointer">Legrégebbi</SelectItem>
                  <SelectItem value="most-members" className="cursor-pointer">Legtöbb tag</SelectItem>
                  <SelectItem value="least-members" className="cursor-pointer">Legkevesebb tag</SelectItem>
                </SelectContent>
              </Select>

              {/* CREATE DIALOG */}
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="rounded-xl flex items-center gap-2 cursor-pointer">
                    <Plus className="h-4 w-4" />
                    Létrehozás
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Új klán létrehozása</DialogTitle>
                  </DialogHeader>

                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit((values) =>
                        createClan({values, onSuccessCallback: () => {
                          setOpen(false)
                        }})
                      )}
                      className="space-y-4"
                    >
                      <FormField
                        control={form.control}
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
                        control={form.control}
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

                      <Button type="submit" className="w-full rounded-xl cursor-pointer">
                        Létrehozás
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* ===== TOP CLAN ===== */}
        {topClan && (
          <Link
            to="/clans/$clanId"
            params={{ clanId: String(topClan.id) }}
            className="block"
          >
            <Card className="cursor-pointer mb-10 rounded-2xl border-2 border-primary bg-linear-to-br from-primary/10 to-background shadow-2xl transition hover:scale-[1.02]">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{topClan.name}</CardTitle>
                  <Badge className="bg-primary text-primary-foreground">
                    <Star className="h-4 w-4 mr-1" />
                    Top Klán
                  </Badge>
                </div>
                <CardDescription>
                  {topClan.description ?? "Nincs leírás"}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  Vezető: {topClan.leader.username}
                </div>

                <Badge variant="secondary">
                  <Users className="h-4 w-4 mr-1" />
                  {topClan.member_count + 1} tag
                </Badge>

                <Button
                  className="w-full rounded-xl"
                  disabled={
                    topClan.leader_id === Number(user.userID) ||
                    isMember(topClan.id)
                  }
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
              </CardContent>
            </Card>
          </Link>
        )}

        {/* ===== GRID ===== */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sorted
            .filter((c) => c.id !== topClan?.id)
            .map((clan) => (
              <Link
                key={clan.id}
                to="/clans/$clanId"
                params={{ clanId: String(clan.id) }}
                className="block"
              >
                <Card className="cursor-pointer rounded-2xl border-border/60 bg-card/60 shadow-xl transition hover:scale-[1.02]">
                  <CardHeader>
                    <CardTitle>{clan.name}</CardTitle>
                    <CardDescription>
                      {clan.description ?? "Nincs leírás"}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      Vezető: {clan.leader.username}
                    </div>

                    <Badge variant="secondary">
                      <Users className="h-4 w-4 mr-1" />
                      {clan.member_count + 1} tag
                    </Badge>

                    <Separator />

                    <Button
                      className="w-full rounded-xl"
                      disabled={
                        clan.leader_id === Number(user.userID) ||
                        isMember(clan.id)
                      }
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