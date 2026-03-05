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
import { Search } from "lucide-react"

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
                <button className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm hover:bg-muted transition">
                    <Search className="h-4 w-4" />
                    Keresés
                </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Felhasználó keresése</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <Input
                        placeholder="Írj be egy nevet..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />

                    {debouncedQuery.length > 1 && (
                        <div className="space-y-2 max-h-80 overflow-y-auto">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((u) => (
                                    <Link
                                        key={u.ID}
                                        to="/profile/$userID"
                                        params={{ userID: u.ID }}
                                        className="flex items-center gap-3 rounded-xl border p-3 hover:bg-muted transition"
                                    >
                                        <Avatar>
                                            <AvatarFallback>
                                                {u.username.slice(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="font-medium">{u.username}</div>
                                    </Link>
                                ))
                            ) : (
                                <div className="text-center text-sm text-muted-foreground py-1">
                                    Nincs ilyen felhasználó
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}