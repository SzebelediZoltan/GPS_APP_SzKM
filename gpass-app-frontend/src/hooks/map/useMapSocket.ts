import { useEffect, useRef, useState, useMemo } from "react"
import { io, Socket } from "socket.io-client"

const SEND_THROTTLE_MS = 3000

// ── Típusok ──

/** Egy online user amit a szervertől kapunk */
type RawOnlineUser = {
  userID: string
  username: string
  lat: number
  lng: number
}

/** Egy klán amiben az illető tag (vagy vezető) */
export type UserClanTag = {
  clanId: number
  clanName: string
}

/** Egy online user teljes relációs adatokkal */
export type TaggedOnlineUser = {
  userID: string
  username: string
  lat: number
  lng: number
  /** Barát-e (accepted friend relation) */
  isFriend: boolean
  /** Melyik közös klánokban van (lehet több) */
  clans: UserClanTag[]
}

/** A hook bemenetéhez szükséges klántagsági info */
export type ClanMemberEntry = {
  /** A klántag userID-je */
  userID: string
  clanId: number
  clanName: string
}

type UseMapSocketOptions = {
  /** Ha false, nem csatlakozik (pl. nincs bejelentkezve) */
  enabled: boolean
  /** Saját GPS pozíció — változáskor throttle-lal elküldi */
  position: { lat: number; lng: number } | null
  /** Elfogadott barátok userID-i */
  friendIDs: Set<string>
  /** Klántagok részletes listája: userID + melyik klánban */
  clanMembers: ClanMemberEntry[]
}

export function useMapSocket({
  enabled,
  position,
  friendIDs,
  clanMembers,
}: UseMapSocketOptions) {
  const socketRef = useRef<Socket | null>(null)
  const lastSentRef = useRef<number>(0)

  // Nyers pozíciók: userID → RawOnlineUser
  const [rawOnline, setRawOnline] = useState<Map<string, RawOnlineUser>>(new Map())

  // Klántag lookup: userID → ClanMemberEntry[]
  const clanMemberMap = useMemo(() => {
    const map = new Map<string, ClanMemberEntry[]>()
    for (const entry of clanMembers) {
      const existing = map.get(entry.userID) ?? []
      map.set(entry.userID, [...existing, entry])
    }
    return map
  }, [clanMembers])

  // Összes releváns userID (barát VAGY klántag)
  const relevantIDs = useMemo(() => {
    const ids = new Set<string>(friendIDs)
    for (const entry of clanMembers) ids.add(entry.userID)
    return ids
  }, [friendIDs, clanMembers])

  // ── Socket kapcsolat ──
  useEffect(() => {
    if (!enabled) return

    const url = import.meta.env.DEV
      ? "http://localhost:8000"
      : window.location.origin

    const socket = io(url, {
      withCredentials: true,  // user_token httpOnly cookie
      transports: ["websocket"],
    })

    socketRef.current = socket

    socket.on("position:update", (data: RawOnlineUser) => {
      // Csak barát vagy klántag pozícióját fogadjuk el
      if (!relevantIDs.has(data.userID)) return

      setRawOnline((prev) => {
        const next = new Map(prev)
        next.set(data.userID, data)
        return next
      })
    })

    socket.on("user:disconnected", ({ userID }: { userID: string }) => {
      setRawOnline((prev) => {
        const next = new Map(prev)
        next.delete(userID)
        return next
      })
    })

    socket.on("connect_error", (err) => {
      console.warn("[socket] kapcsolódási hiba:", err.message)
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
      setRawOnline(new Map())
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled])

  // ── Pozíció küldése throttle-lal ──
  useEffect(() => {
    if (!enabled || !position || !socketRef.current?.connected) return

    const now = Date.now()
    if (now - lastSentRef.current < SEND_THROTTLE_MS) return

    lastSentRef.current = now
    socketRef.current.emit("position:update", {
      lat: position.lat,
      lng: position.lng,
    })
  }, [position, enabled])

  // ── Ha már nem barát/klántag valaki, töröljük a térképről ──
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
  // Minden online userhez hozzárendeljük: barát-e + melyik klánokban van
  const onlineUsers = useMemo<TaggedOnlineUser[]>(() => {
    const result: TaggedOnlineUser[] = []

    for (const raw of rawOnline.values()) {
      const isFriend = friendIDs.has(raw.userID)
      const clans = clanMemberMap.get(raw.userID) ?? []

      // Csak akkor kerül fel ha valóban barát VAGY klántag
      // (duplikáció nem lehetséges mert Map-ben tároljuk)
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
