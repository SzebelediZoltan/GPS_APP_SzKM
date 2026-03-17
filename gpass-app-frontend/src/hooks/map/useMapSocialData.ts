import { useMemo } from "react"
import { useQueries, useQuery } from "@tanstack/react-query"
import axios from "axios"
import type { ClanMemberEntry } from "@/hooks/map/useMapSocket"

// ── Típusok ──

type FriendRelation = {
  id: string
  sender_id: string
  receiver_id: string
  status: string
  sender: { ID: string; username: string; isAdmin: boolean }
  receiver: { ID: string; username: string; isAdmin: boolean }
}

type ClanItem = {
  id: number
  name: string
  leader_id: number
}

type ClanMembership = {
  clan_id: number
  user_id: number
}

type RawClanMember = {
  clan_id: number
  user_id: number
}

// ── Axios — mintát követi a meglévő useClans hook-ot ──
// fetchMemberships destructurálja a data-t, ezért .data maga az array

const fetchFriends = async (userID: string): Promise<FriendRelation[]> => {
  const { data } = await axios.get(`/api/friends-with/accepted/${userID}`)
  return data
}

const fetchMemberships = async (userID: string): Promise<ClanMembership[]> => {
  const { data } = await axios.get(`/api/clan-members/by-user/${userID}`)
  return data
}

const fetchAllClans = async (): Promise<ClanItem[]> => {
  const { data } = await axios.get(`/api/clans`)
  return data
}

const fetchClanMembers = async (clanId: number): Promise<RawClanMember[]> => {
  const { data } = await axios.get(`/api/clan-members/by-clan/${clanId}`)
  return data
}

// ── Hook ──

type Options = {
  userID: string | undefined
  username: string | undefined
  enabled: boolean
}

export function useMapSocialData({ userID, enabled }: Options) {
  const isEnabled = enabled && !!userID

  // 1. Elfogadott barátok
  const friendsQuery = useQuery({
    queryKey: ["mapFriends", userID],
    queryFn: () => fetchFriends(userID!),
    enabled: isEnabled,
    staleTime: 1000 * 60,
  })

  // 2. Klántagságok (ahol tag vagyok — leader NEM szerepel itt)
  const membershipsQuery = useQuery({
    queryKey: ["mapMemberships", userID],
    queryFn: () => fetchMemberships(userID!),
    enabled: isEnabled,
    staleTime: 1000 * 60,
  })

  // 3. Összes klán — ebből tudjuk meg hol vagyok leader
  const allClansQuery = useQuery({
    queryKey: ["mapAllClans"],
    queryFn: fetchAllClans,
    enabled: isEnabled,
    staleTime: 1000 * 60,
  })

  // 4. Saját klánok összerakása (tagság + leader) — STABIL queryKey-ek kellenek
  const myClans = useMemo<{ clan_id: number; clan_name: string }[]>(() => {
    if (!userID) return []
    const memberships = membershipsQuery.data ?? []
    const allClans = allClansQuery.data ?? []

    const result: { clan_id: number; clan_name: string }[] = []
    const seen = new Set<number>()

    // Tagságok
    for (const m of memberships) {
      if (!seen.has(m.clan_id)) {
        seen.add(m.clan_id)
        const clan = allClans.find((c) => c.id === m.clan_id)
        result.push({ clan_id: m.clan_id, clan_name: clan?.name ?? `Klán ${m.clan_id}` })
      }
    }

    // Leader klánok (ahol leader_id === én)
    for (const clan of allClans) {
      if (String(clan.leader_id) === String(userID) && !seen.has(clan.id)) {
        seen.add(clan.id)
        result.push({ clan_id: clan.id, clan_name: clan.name })
      }
    }

    return result
  }, [membershipsQuery.data, allClansQuery.data, userID])

  // 5. Minden saját klán tagjainak lekérése — a queryKey stabil (csak clan_id-tól függ)
  const clanMemberQueries = useQueries({
    queries: myClans.map((c) => ({
      queryKey: ["mapClanMembers", c.clan_id],
      queryFn: () => fetchClanMembers(c.clan_id),
      enabled: isEnabled,
      staleTime: 1000 * 60,
    })),
  })

  // ── friendIDs ──
  const friendIDs = useMemo<Set<string>>(() => {
    const ids = new Set<string>()
    for (const rel of friendsQuery.data ?? []) {
      const other = String(rel.sender_id) === String(userID) ? rel.receiver : rel.sender
      ids.add(String(other.ID))
    }
    return ids
  }, [friendsQuery.data, userID])

  // ── clanMembers ──
  // Tagok + a leader (aki nincs a clan_members táblában)
  const clanMembers = useMemo<ClanMemberEntry[]>(() => {
    const entries: ClanMemberEntry[] = []
    const seen = new Set<string>()

    myClans.forEach((clan, idx) => {
      const members = clanMemberQueries[idx]?.data ?? []

      // Tagok
      for (const member of members) {
        const uid = String(member.user_id)
        if (uid === String(userID)) continue
        const key = `${uid}-${clan.clan_id}`
        if (seen.has(key)) continue
        seen.add(key)
        entries.push({ userID: uid, clanId: clan.clan_id, clanName: clan.clan_name })
      }

      // Leader — a by-clan endpoint nem adja vissza, külön kezeljük
      const allClans = allClansQuery.data ?? []
      const clanData = allClans.find((c) => c.id === clan.clan_id)
      if (clanData) {
        const leaderID = String(clanData.leader_id)
        if (leaderID !== String(userID)) {
          const key = `${leaderID}-${clan.clan_id}`
          if (!seen.has(key)) {
            seen.add(key)
            entries.push({ userID: leaderID, clanId: clan.clan_id, clanName: clan.clan_name })
          }
        }
      }
    })

    return entries
  }, [myClans, clanMemberQueries, allClansQuery.data, userID])

  const isLoading =
    friendsQuery.isLoading ||
    membershipsQuery.isLoading ||
    allClansQuery.isLoading

  return { friendIDs, clanMembers, isLoading }
}
