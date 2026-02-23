import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { createFileRoute } from '@tanstack/react-router'
import { Search, Users } from 'lucide-react'
import React from 'react'

export const Route = createFileRoute('/clans/')({
    component: RouteComponent,
})

const user = {
    userID: "u1",
    username: "CsabaDev",
}

const dummyClans = [
    {
        id: "c1",
        name: "Shadow Riders",
        description: "Éjszakai túrák és extrém kihívások kedvelőinek.",
        leader_id: "u2",
        leader_username: "Andris",
        memberCount: 42,
        createdAt: "2024-01-15",
    },
    {
        id: "c2",
        name: "Mountain Kings",
        description: "Hegymászás és természetimádat.",
        leader_id: "u3",
        leader_username: "Petra",
        memberCount: 128,
        createdAt: "2023-11-02",
    },
    {
        id: "c3",
        name: "Urban Explorers",
        description: "Városi kalandok és elhagyatott helyek.",
        leader_id: "u1",
        leader_username: "CsabaDev",
        memberCount: 15,
        createdAt: "2024-02-01",
    },
    {
        id: "c4",
        name: "Trail Masters",
        description: "Tapasztalt túrázók közössége.",
        leader_id: "u5",
        leader_username: "Bence",
        memberCount: 67,
        createdAt: "2024-03-10",
    },
]

function RouteComponent() {
    const [searchTerm, setSearchTerm] = React.useState("")
    const [sortBy, setSortBy] = React.useState("most-members")

    const filteredAndSortedClans = React.useMemo(() => {
        let result = [...dummyClans]

        if (searchTerm) {
            result = result.filter(c =>
                c.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        switch (sortBy) {
            case "newest":
                result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                break
            case "oldest":
                result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                break
            case "most-members":
                result.sort((a, b) => b.memberCount - a.memberCount)
                break
            case "least-members":
                result.sort((a, b) => a.memberCount - b.memberCount)
                break
        }

        return result
    }, [searchTerm, sortBy])

    const topClan = React.useMemo(() => {
        return [...dummyClans].sort((a, b) => b.memberCount - a.memberCount)[0]
    }, [])

    const handleJoin = (id: string) => {
        console.log("Join:", id)
    }

    return (
        <main className="min-h-[calc(100vh-64px)] bg-background text-foreground">
            {/* Glow háttér */}
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-44 left-1/2 h-130 w-130 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.14),transparent_60%)] blur-2xl" />
            </div>

            <div className="mx-auto w-full max-w-6xl px-4 py-8">

                {/* Sticky search + sort */}
                <div className="sticky top-16 z-20 mb-8 rounded-2xl border border-border/60 bg-card/80 backdrop-blur shadow-lg p-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                        <h1 className="text-2xl font-bold">Klánok</h1>

                        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                            <Input
                                placeholder="Klán keresése..."
                                className="rounded-xl w-full sm:w-64"
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
                    </div>
                </div>

                {/* TOP CLAN highlight */}
                {topClan && (
                    <div className="mb-10">
                        <Card className="relative overflow-hidden rounded-2xl border-2 border-primary shadow-2xl bg-linear-to-br from-primary/10 to-background backdrop-blur">

                            <div className="absolute top-4 right-4">
                                <Badge className="rounded-full bg-primary text-primary-foreground">
                                    ⭐ Top Klán
                                </Badge>
                            </div>

                            <CardHeader>
                                <CardTitle className="text-xl">{topClan.name}</CardTitle>
                                <CardDescription>{topClan.description}</CardDescription>
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
                                        <span className="text-sm font-medium">{topClan.memberCount}</span>
                                    </Badge>
                                </div>

                                <Button
                                    className="w-full rounded-xl"
                                    onClick={() => handleJoin(topClan.id)}
                                    disabled={topClan.leader_id === user.userID}
                                >
                                    {topClan.leader_id === user.userID
                                        ? "Te vagy a vezető"
                                        : "Csatlakozás"}
                                </Button>

                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Clan grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredAndSortedClans.filter((clan) => clan.id !== topClan?.id).map((clan) => {
                        const isLeader = clan.leader_id === user.userID

                        return (
                            <Card
                                key={clan.id}
                                className="rounded-2xl border-border/60 bg-card/60 shadow-xl backdrop-blur transition hover:scale-[1.02]"
                            >
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="text-lg">{clan.name}</CardTitle>
                                            <CardDescription className="mt-1">
                                                {clan.description}
                                            </CardDescription>
                                        </div>

                                        <Badge
                                            variant="secondary"
                                            className="rounded-full flex items-center gap-1 px-3 py-1"
                                        >
                                            <Users className="h-3.5 w-3.5" />
                                            <span className="text-xs">{clan.memberCount}</span>
                                        </Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <div className="text-sm text-muted-foreground">
                                        Leader: {clan.leader_username}
                                    </div>

                                    <Separator />

                                    <Button
                                        className="w-full rounded-xl"
                                        disabled={isLeader}
                                        onClick={() => handleJoin(clan.id)}
                                    >
                                        {isLeader ? "Te vagy a vezető" : "Csatlakozás"}
                                    </Button>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>
        </main>
    )
}
