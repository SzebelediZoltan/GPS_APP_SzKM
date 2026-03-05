"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useAuth } from "@/hooks/useAuth"
import { Link } from "@tanstack/react-router"
import { useDebounce } from "@/hooks/useDebounce"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, ShieldCheck, ArrowRight } from "lucide-react"

type User = {
    ID: string
    username: string
    isAdmin: boolean
}

export default function UserSearchDialog() {
    const { user } = useAuth()
    const [query, setQuery] = useState("")

    const debouncedQuery = useDebounce(query, 300)

    const { data } = useQuery({
        queryKey: ["user-search", debouncedQuery],
        queryFn: async () => {
            const res = await axios.get<User[]>(
                `/api/users/search?query=${debouncedQuery}`
            )
            return res.data
        },
        enabled: debouncedQuery.length > 1,
        staleTime: 1000 * 60, // 1 percig nem kér újra
    })

    const filteredUsers =
        data?.filter((u) => u.ID !== user?.userID) ?? []

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors cursor-pointer">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    Keresés
                </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold">Felhasználó keresése</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <Input
                            className="pl-9 rounded-xl"
                            placeholder="Írj be egy nevet..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>

                    {debouncedQuery.length > 1 && (
                        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((u) => (
                                    <Link
                                        key={u.ID}
                                        to="/profile/$userID"
                                        params={{ userID: u.ID }}
                                        className="group flex items-center gap-3 rounded-xl border border-border/60 bg-background/40 p-3 hover:bg-accent hover:border-primary/20 transition-all duration-200"
                                    >
                                        <Avatar className="h-9 w-9 rounded-xl shrink-0">
                                            <AvatarFallback className="rounded-xl text-xs font-bold">
                                                {u.username.slice(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                            <span className="font-medium text-sm truncate">{u.username}</span>
                                            {u.isAdmin && (
                                                <Badge className="rounded-full shrink-0 text-[10px] px-1.5">
                                                    <ShieldCheck className="h-3 w-3 mr-0.5" />
                                                    Admin
                                                </Badge>
                                            )}
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground shrink-0 transition-colors" />
                                    </Link>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <Search className="h-8 w-8 text-muted-foreground/30 mb-2" />
                                    <p className="text-sm text-muted-foreground">Nincs ilyen felhasználó</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
