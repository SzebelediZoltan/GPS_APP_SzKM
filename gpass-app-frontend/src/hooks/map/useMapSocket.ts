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
  const socketRef   = useRef<Socket | null>(null)
  const lastSentRef = useRef<number>(0)
  const positionRef = useRef<{ lat: number; lng: number } | null>(null)
  // Ref-ben tartjuk hogy a socket event handler mindig a friss értéket lássa
  const relevantRef = useRef<Set<string>>(new Set())

  const [rawOnline, setRawOnline] = useState<Map<string, RawOnlineUser>>(new Map())

  // Frissítjük a pozíció ref-et minden renderkor
  useEffect(() => { positionRef.current = position }, [position])

  // Klan lookup map
  const clanMemberMap = useMemo(() => {
    const map = new Map<string, ClanMemberEntry[]>()
    for (const entry of clanMembers) {
      const existing = map.get(entry.userID) ?? []
      map.set(entry.userID, [...existing, entry])
    }
    return map
  }, [clanMembers])

  // Releváns ID-k (barát VAGY klántag) — ref-ben is frissítjük
  const relevantIDs = useMemo(() => {
    const ids = new Set<string>(friendIDs)
    for (const entry of clanMembers) ids.add(entry.userID)
    return ids
  }, [friendIDs, clanMembers])

  useEffect(() => {
    relevantRef.current = relevantIDs
  }, [relevantIDs])

  // ── Socket kapcsolat ──
  useEffect(() => {
    if (!enabled) return

    const url = import.meta.env.DEV
      ? "http://localhost:8000"
      : window.location.origin

    const socket = io(url, {
      withCredentials: true,
      transports: ["websocket"],
    })

    socketRef.current = socket

    // Segédfüggvény: pozíció küldése ha van és nem túl korán
    const sendPosition = () => {
      const pos = positionRef.current
      if (!pos || !socket.connected) return
      const now = Date.now()
      if (now - lastSentRef.current < SEND_THROTTLE_MS) return
      lastSentRef.current = now
      socket.emit("position:update", { lat: pos.lat, lng: pos.lng })
    }

    // position:update — ref-en keresztül nézzük a relevantIDs-t
    socket.on("position:update", (data: RawOnlineUser) => {
      if (!relevantRef.current.has(data.userID)) return
      setRawOnline((prev) => {
        const next = new Map(prev)
        next.set(data.userID, data)
        return next
      })
    })

    socket.on("user:disconnected", ({ userID }: { userID: string }) => {
      setRawOnline((prev) => {
        if (!prev.has(userID)) return prev
        const next = new Map(prev)
        next.delete(userID)
        return next
      })
    })

    // Csatlakozás után: azonnal küldjük a pozíciót + kérjük az online listát
    socket.on("connect", () => {
      // Azonnali pozíció küldés (throttle bypass — ez az első küldés)
      const pos = positionRef.current
      if (pos && socket.connected) {
        lastSentRef.current = Date.now()
        socket.emit("position:update", { lat: pos.lat, lng: pos.lng })
      }
      socket.emit("request:online")
    })

    // Szerver küldi az összes jelenleg online usert egyszerre
    socket.on("online:snapshot", (users: RawOnlineUser[]) => {
      setRawOnline((prev) => {
        const next = new Map(prev)
        for (const u of users) {
          if (relevantRef.current.has(u.userID)) {
            next.set(u.userID, u)
          }
        }
        return next
      })
    })

    socket.on("connect_error", (err) => {
      console.warn("[socket] kapcsolódási hiba:", err.message)
    })

    // Intervallum alapú pozíció küldés — nem csak pozíció változáskor
    const interval = setInterval(sendPosition, SEND_THROTTLE_MS)

    return () => {
      clearInterval(interval)
      socket.disconnect()
      socketRef.current = null
      setRawOnline(new Map())
    }
  // Csak enabled változásakor csatlakozik újra
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled])

  // ── Pozíció küldése mozgáskor is (throttle-lal) ──
  useEffect(() => {
    if (!enabled || !position) return
    const socket = socketRef.current
    if (!socket?.connected) return

    const now = Date.now()
    if (now - lastSentRef.current < SEND_THROTTLE_MS) return
    lastSentRef.current = now
    socket.emit("position:update", { lat: position.lat, lng: position.lng })
  }, [position, enabled])

  // ── Ha már nem barát/klántag valaki, töröljük ──
  useEffect(() => {
    setRawOnline((prev) => {
      let changed = false
      const next = new Map(prev)
      for (const uid of next.keys()) {
        if (!relevantIDs.has(uid)) {
          next.delete(uid)
          changed = true
        }
      }
      return changed ? next : prev
    })
  }, [relevantIDs])

  // ── Tagelt lista összerakása ──
  const onlineUsers = useMemo<TaggedOnlineUser[]>(() => {
    const result: TaggedOnlineUser[] = []
    for (const raw of rawOnline.values()) {
      const isFriend = friendIDs.has(raw.userID)
      const clans    = clanMemberMap.get(raw.userID) ?? []
      if (!isFriend && clans.length === 0) continue
      result.push({
        userID: raw.userID,
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
