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
import { Users, UserCheck, UserX } from "lucide-react"
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
        (r) => r.receiver_id === user?.userID
    )

    const sent = requests.filter(
        (r) => r.sender_id === user?.userID
    )

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="rounded-xl">
                    <Users className="mr-2 h-4 w-4" />
                    Barátkérelmek
                    {requests.length > 0 && (
                        <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground">
                            {requests.length}
                        </span>
                    )}
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Barátkérelmek</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">

                    {/* RECEIVED */}
                    <div>
                        <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                            Kapott kérelmek
                        </h3>

                        {received.length === 0 && (
                            <div className="text-sm text-muted-foreground">
                                Nincs kapott kérelmed.
                            </div>
                        )}

                        <div className="space-y-3">
                            {received.map((r) => (
                                <div
                                    key={r.id}
                                    className={`flex items-center justify-between rounded-xl border p-3 transition-all duration-300 ${removingId === r.id
                                            ? "opacity-0 scale-95 translate-x-4"
                                            : "opacity-100 scale-100"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarFallback>
                                                {r.sender.username.slice(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="font-medium">
                                            {r.sender.username}
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            className="rounded-lg"
                                            onClick={() => handleAction(r.id, accept)}
                                        >
                                            <UserCheck className="h-4 w-4 mr-1" />
                                            Elfogad
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            className="rounded-lg"
                                            onClick={() => handleAction(r.id, terminateRequest)}
                                        >
                                            <UserX className="h-4 w-4 mr-1" />
                                            Elutasít
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    {/* SENT */}
                    <div>
                        <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                            Küldött kérelmek
                        </h3>

                        {sent.length === 0 && (
                            <div className="text-sm text-muted-foreground">
                                Nincs elküldött kérelmed.
                            </div>
                        )}

                        <div className="space-y-3">
                            {sent.map((r) => (
                                <div
                                    key={r.id}
                                    className="flex items-center justify-between rounded-xl border p-3"
                                >
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarFallback>
                                                {r.receiver.username.slice(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="font-medium">
                                            {r.receiver.username}
                                        </div>
                                    </div>

                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        className="rounded-lg"
                                        onClick={() => handleAction(r.id, terminateRequest)}
                                    >
                                        <UserX className="h-4 w-4 mr-1" />
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