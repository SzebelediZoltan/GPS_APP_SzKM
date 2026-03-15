import { useEffect, useRef, useState, useMemo } from "react"
import { io, Socket } from "socket.io-client"

const SEND_THROTTLE_MS = 3000

export type UserClanTag = {
  clanId: number
  clanName: string
}

export type TaggedOnlineUser = {
  userID: string
  username: string
  lat: number
  lng: number
  isFriend: boolean
  clans: UserClanTag[]
}

export type ClanMemberEntry = {
  userID: string
  clanId: number
  clanName: string
}

type RawOnlineUser = {
  userID: string
  username: string
  lat: number
  lng: number
}

type UseMapSocketOptions = {
  enabled: boolean
  position: { lat: number; lng: number } | null
  friendIDs: Set<string>
  clanMembers: ClanMemberEntry[]
}

export function useMapSocket({
  enabled,
  position,
  friendIDs,
  clanMembers,
}: UseMapSocketOptions) {
  const socketRef    = useRef<Socket | null>(null)
  const lastSentRef  = useRef<number>(0)
  const positionRef  = useRef<{ lat: number; lng: number } | null>(null)

  const [rawOnline, setRawOnline] = useState<Map<string, RawOnlineUser>>(new Map())

  useEffect(() => { positionRef.current = position }, [position])

  // clanMemberMap: userID (string) → ClanMemberEntry[]
  const clanMemberMap = useMemo(() => {
    const map = new Map<string, ClanMemberEntry[]>()
    for (const entry of clanMembers) {
      const key = String(entry.userID)
      const existing = map.get(key) ?? []
      map.set(key, [...existing, entry])
    }
    return map
  }, [clanMembers])

  // ── Socket kapcsolat ──
  useEffect(() => {
    if (!enabled) return

    const url = import.meta.env.DEV
      ? "http://localhost:4000"
      : window.location.origin

    const socket = io(url, {
      withCredentials: true,
      transports: ["websocket"],
    })

    socketRef.current = socket

    // Minden beérkező pozíciót eltárolunk — szűrés az onlineUsers useMemo-ban történik
    socket.on("position:update", (data: RawOnlineUser) => {
      setRawOnline((prev) => {
        const next = new Map(prev)
        next.set(String(data.userID), data)
        return next
      })
    })

    socket.on("user:disconnected", ({ userID }: { userID: string }) => {
      setRawOnline((prev) => {
        const key = String(userID)
        if (!prev.has(key)) return prev
        const next = new Map(prev)
        next.delete(key)
        return next
      })
    })

    socket.on("connect", () => {
      const pos = positionRef.current
      if (pos) {
        lastSentRef.current = Date.now()
        socket.emit("position:update", { lat: pos.lat, lng: pos.lng })
      }
      socket.emit("request:online")
    })

    socket.on("online:snapshot", (users: RawOnlineUser[]) => {
      setRawOnline((prev) => {
        const next = new Map(prev)
        for (const u of users) {
          next.set(String(u.userID), u)
        }
        return next
      })
    })

    socket.on("connect_error", (err) => {
      console.warn("[socket] kapcsolódási hiba:", err.message)
    })

    const interval = setInterval(() => {
      const pos = positionRef.current
      if (!pos || !socket.connected) return
      const now = Date.now()
      if (now - lastSentRef.current < SEND_THROTTLE_MS) return
      lastSentRef.current = now
      socket.emit("position:update", { lat: pos.lat, lng: pos.lng })
    }, SEND_THROTTLE_MS)

    return () => {
      clearInterval(interval)
      socket.disconnect()
      socketRef.current = null
      setRawOnline(new Map())
    }
  }, [enabled])

  // Pozíció küldése mozgáskor is
  useEffect(() => {
    if (!enabled || !position) return
    const socket = socketRef.current
    if (!socket?.connected) return
    const now = Date.now()
    if (now - lastSentRef.current < SEND_THROTTLE_MS) return
    lastSentRef.current = now
    socket.emit("position:update", { lat: position.lat, lng: position.lng })
  }, [position, enabled])

  // Ha valaki kikerül a barát/klán listából, töröljük a rawOnline-ból is
  useEffect(() => {
    setRawOnline((prev) => {
      let changed = false
      const next = new Map(prev)
      for (const uid of next.keys()) {
        const isFriend = friendIDs.has(uid)
        const isClanMember = clanMemberMap.has(uid)
        if (!isFriend && !isClanMember) {
          next.delete(uid)
          changed = true
        }
      }
      return changed ? next : prev
    })
  }, [friendIDs, clanMemberMap])

  // ── Tagelt lista összerakása ──
  const onlineUsers = useMemo<TaggedOnlineUser[]>(() => {
    const result: TaggedOnlineUser[] = []
    for (const raw of rawOnline.values()) {
      const uid = String(raw.userID)
      const isFriend = friendIDs.has(uid)
      const clans = clanMemberMap.get(uid) ?? []
      if (!isFriend && clans.length === 0) continue
      result.push({
        userID: uid,
        username: raw.username,
        lat: raw.lat,
        lng: raw.lng,
        isFriend,
        clans: clans.map((c) => ({ clanId: c.clanId, clanName: c.clanName })),
      })
    }
    return result
  }, [rawOnline, friendIDs, clanMemberMap])

  return { onlineUsers }
}
