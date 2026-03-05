"use client"

import { useAuth } from "@/hooks/useAuth"
import { useFriends } from "@/hooks/useFriends"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { UserCheck, UserX, Bell, Send } from "lucide-react"
import { useState } from "react"

export default function FriendRequestsDialog() {
    const { user } = useAuth()
    const [removingId, setRemovingId] = useState<string | null>(null)

    const handleAction = (
        id: string,
        action: (id: string) => void
    ) => {
        setRemovingId(id)
        setTimeout(() => {
            action(id)
        }, 250)
    }

    const {
        pendingRequests,
        accept,
        terminateRequest,
    } = useFriends(user?.userID ?? "", !!user)

    const requests = pendingRequests.data?.data ?? []

    const received = requests.filter(
        (r) => r.receiver_id == user?.userID
    )

    const sent = requests.filter(
        (r) => r.sender_id == user?.userID
    )

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="rounded-xl cursor-pointer gap-2">
                    <Bell className="h-4 w-4" />
                    Barátkérelmek
                    {requests.length > 0 && (
                        <Badge className="ml-1 h-5 min-w-5 rounded-full px-1.5 text-xs">
                            {requests.length}
                        </Badge>
                    )}
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold">Barátkérelmek</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">

                    {/* RECEIVED */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Bell className="h-3.5 w-3.5 text-muted-foreground" />
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Kapott kérelmek
                            </h3>
                            {received.length > 0 && (
                                <Badge variant="secondary" className="rounded-full text-xs ml-auto">
                                    {received.length}
                                </Badge>
                            )}
                        </div>

                        {received.length === 0 && (
                            <p className="text-sm text-muted-foreground px-1">Nincs kapott kérelmed.</p>
                        )}

                        <div className="space-y-2">
                            {received.map((r) => (
                                <div
                                    key={r.id}
                                    className={`flex items-center justify-between rounded-xl border border-border/60 bg-background/40 p-3 transition-all duration-300 ${
                                        removingId === r.id
                                            ? "opacity-0 scale-95 translate-x-4"
                                            : "opacity-100 scale-100"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9 rounded-xl">
                                            <AvatarFallback className="rounded-xl text-xs font-bold">
                                                {r.sender.username.slice(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium text-sm">{r.sender.username}</span>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            className="rounded-lg cursor-pointer"
                                            onClick={() => handleAction(r.id, accept)}
                                        >
                                            <UserCheck className="h-3.5 w-3.5 mr-1" />
                                            Elfogad
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            className="rounded-lg cursor-pointer"
                                            onClick={() => handleAction(r.id, terminateRequest)}
                                        >
                                            <UserX className="h-3.5 w-3.5 mr-1" />
                                            Elutasít
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator className="bg-border/50" />

                    {/* SENT */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Send className="h-3.5 w-3.5 text-muted-foreground" />
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Küldött kérelmek
                            </h3>
                            {sent.length > 0 && (
                                <Badge variant="secondary" className="rounded-full text-xs ml-auto">
                                    {sent.length}
                                </Badge>
                            )}
                        </div>

                        {sent.length === 0 && (
                            <p className="text-sm text-muted-foreground px-1">Nincs elküldött kérelmed.</p>
                        )}

                        <div className="space-y-2">
                            {sent.map((r) => (
                                <div
                                    key={r.id}
                                    className={`flex items-center justify-between rounded-xl border border-border/60 bg-background/40 p-3 transition-all duration-300 ${
                                        removingId === r.id
                                            ? "opacity-0 scale-95 translate-x-4"
                                            : "opacity-100 scale-100"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9 rounded-xl">
                                            <AvatarFallback className="rounded-xl text-xs font-bold">
                                                {r.receiver.username.slice(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium text-sm">{r.receiver.username}</span>
                                    </div>

                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="rounded-lg cursor-pointer border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                        onClick={() => handleAction(r.id, terminateRequest)}
                                    >
                                        <UserX className="h-3.5 w-3.5 mr-1" />
                                        Törlés
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    )
}
