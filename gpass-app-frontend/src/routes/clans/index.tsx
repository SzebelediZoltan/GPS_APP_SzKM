import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useMemo } from "react"
import { Crown, Users, Check, Star } from "lucide-react"

import { useAuth } from "@/hooks/useAuth"
import NotLoggedIn from "@/components/NotLoggedIn"

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
import { Separator } from "@/components/ui/separator"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select"
import { CreateClanDialog } from "@/components/CreateClanDialog"

export const Route = createFileRoute("/clans/")({
    component: ClanPage,
})

/* ================= TYPES ================= */

type Clan = {
    id: number
    name: string
    description: string
    leader_id: number
    leader_username: string
    memberCount: number
}

/* ================= DUMMY DATA ================= */

const dummyClans: Clan[] = [
    {
        id: 1,
        name: "Night Riders",
        description: "Éjszakai túrák és hosszú utak mesterei.",
        leader_id: 2,
        leader_username: "Miki",
        memberCount: 12,
    },
    {
        id: 2,
        name: "GP Legends",
        description: "Versenyorientált, profi közösség.",
        leader_id: 1,
        leader_username: "Csabi",
        memberCount: 28,
    },
    {
        id: 3,
        name: "Urban Explorers",
        description: "Városi felfedezések és spontán utak.",
        leader_id: 4,
        leader_username: "Zoli",
        memberCount: 7,
    },
    {
        id: 4,
        name: "Mountain Crew",
        description: "Hegyi túrák és kihívások.",
        leader_id: 5,
        leader_username: "Andris",
        memberCount: 19,
    },
]

/* ================= COMPONENT ================= */

function ClanPage() {
    const { user } = useAuth()


    const [searchTerm, setSearchTerm] = useState("")
    const [sortBy, setSortBy] = useState("most-members")

    /* -------- FILTER -------- */

    const filteredClans = useMemo(() => {
        return dummyClans.filter((clan) =>
            clan.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [searchTerm])

    /* -------- SORT -------- */

    const sortedClans = useMemo(() => {
        const copy = [...filteredClans]

        switch (sortBy) {
            case "newest":
                copy.sort((a, b) => b.id - a.id)
                break
            case "oldest":
                copy.sort((a, b) => a.id - b.id)
                break
            case "most-members":
                copy.sort((a, b) => b.memberCount - a.memberCount)
                break
            case "least-members":
                copy.sort((a, b) => a.memberCount - b.memberCount)
                break
        }

        return copy
    }, [filteredClans, sortBy])

    /* -------- TOP CLAN -------- */

    const topClan =
        sortedClans.length > 0
            ? [...sortedClans].sort(
                (a, b) => b.memberCount - a.memberCount
            )[0]
            : null

    /* ================================================= */
    if (!user) return <NotLoggedIn />

    return (
        <main className="min-h-[calc(100vh-64px)] bg-background text-foreground">
            {/* Glow */}
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-44 left-1/2 h-130 w-130 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.14),transparent_60%)] blur-2xl" />
            </div>

            <div className="mx-auto w-full max-w-6xl px-4 py-8">

                {/* HEADER */}
                <div className="sticky top-16 z-20 mb-8 rounded-2xl border border-border/60 bg-card/80 backdrop-blur shadow-lg p-6 space-y-5">

                    {/* Title */}
                    <div>
                        <h1 className="text-2xl font-bold">Klánok</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Fedezd fel vagy hozd létre a saját közösségedet.
                        </p>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col lg:flex-row gap-3 lg:items-center">

                        {/* Left controls */}
                        <div className="flex flex-col sm:flex-row gap-3 flex-1">
                            <Input
                                placeholder="Klán keresése..."
                                className="rounded-xl w-full sm:w-72"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />

                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="rounded-xl w-full sm:w-52">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="newest">Legújabb</SelectItem>
                                    <SelectItem value="oldest">Legrégebbi</SelectItem>
                                    <SelectItem value="most-members">Legtöbb tag</SelectItem>
                                    <SelectItem value="least-members">Legkevesebb tag</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Right action */}
                        <div className="lg:ml-auto">
                            <CreateClanDialog />
                        </div>

                    </div>
                </div>

                {/* TOP CLAN */}
                {topClan && (
                    <div className="mb-10">
                        <Card className="relative overflow-hidden rounded-2xl border-2 border-primary shadow-2xl bg-gradient-to-br from-primary/10 to-background backdrop-blur">

                            <div className="absolute top-4 right-4">
                                <Badge className="rounded-full bg-primary text-primary-foreground flex items-center gap-1">
                                    <Star className="h-4 w-4" />
                                    Top Klán
                                </Badge>
                            </div>

                            <CardHeader>
                                <CardTitle>{topClan.name}</CardTitle>
                                <CardDescription>
                                    {topClan.description}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-muted-foreground">
                                        Leader: {topClan.leader_username}
                                    </div>

                                    <Badge
                                        variant="secondary"
                                        className="rounded-full flex items-center gap-1 px-3 py-1"
                                    >
                                        <Users className="h-4 w-4" />
                                        {topClan.memberCount}
                                    </Badge>
                                </div>

                                <Link to="/clans/$clanId" params={{ clanId: String(topClan.id) }}>
                                    <Button className="w-full rounded-xl">
                                        Megtekintés
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* GRID */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {sortedClans
                        .filter((c) => c.id !== topClan?.id)
                        .map((clan) => {
                            const isLeader = clan.leader_id === Number(user.userID)
                            const isMember = clan.id === 3 // dummy joined state

                            return (
                                <Card
                                    key={clan.id}
                                    className="rounded-2xl border-border/60 bg-card/60 shadow-xl backdrop-blur transition hover:scale-[1.02] hover:shadow-2xl"
                                >
                                    <CardHeader>
                                        <CardTitle>{clan.name}</CardTitle>
                                        <CardDescription>
                                            {clan.description}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm text-muted-foreground">
                                                Leader: {clan.leader_username}
                                            </div>

                                            <div className="flex gap-2">
                                                {isLeader && (
                                                    <Badge className="rounded-full bg-primary text-primary-foreground flex items-center gap-1">
                                                        <Crown className="h-4 w-4" />
                                                        Vezető
                                                    </Badge>
                                                )}

                                                {!isLeader && isMember && (
                                                    <Badge
                                                        variant="secondary"
                                                        className="rounded-full flex items-center gap-1"
                                                    >
                                                        <Check className="h-4 w-4" />
                                                        Csatlakozva
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        <Separator />

                                        <Link to="/clans/$clanId" params={{ clanId: String(clan.id) }}>
                                            <Button
                                                variant="outline"
                                                className="w-full rounded-xl"
                                            >
                                                Megtekintés
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            )
                        })}
                </div>
            </div>
        </main>
    )
}