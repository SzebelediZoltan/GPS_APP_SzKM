import { useMemo } from "react"
import { useQueries, useQuery } from "@tanstack/react-query"
import axios from "axios"
import type { ClanMemberEntry } from "@/hooks/map/useMapSocket"

// ── Axios hívások ──

const fetchAcceptedFriends = (userId: string) =>
  axios.get<FriendRelation[]>(`/api/friends-with/accepted/${userId}`)

const fetchClanMemberships = (userId: number) =>
  axios.get<ClanMembership[]>(`/api/clan-members/by-user/${userId}`)

const fetchClanMembers = (clanId: number) =>
  axios.get<RawClanMember[]>(`/api/clan-members/by-clan/${clanId}`)

// ── Típusok ──

type FriendRelation = {
  id: string
  sender_id: string
  receiver_id: string
  status: string
  sender: { ID: string; username: string; isAdmin: boolean }
  receiver: { ID: string; username: string; isAdmin: boolean }
}

type ClanMembership = {
  clan_id: number
  user_id: number
  clan?: {
    name: string
    leader_id: number
    description: string | null
  }
}

type RawClanMember = {
  clan_id: number
  user_id: number
  user?: { username: string; isAdmin: boolean }
}

// ── Hook ──

type Options = {
  userID: string | undefined
  username: string | undefined
  enabled: boolean
}

export function useMapSocialData({ userID, username, enabled }: Options) {

  // 1. Elfogadott barátok
  const friendsQuery = useQuery({
    queryKey: ["acceptedRequests", userID],
    queryFn: () => fetchAcceptedFriends(userID!),
    enabled: enabled && !!userID,
    staleTime: 1000 * 60,
  })

  // 2. Saját klántagságok (ebből tudjuk melyik klánokban vagyunk)
  const membershipsQuery = useQuery({
    queryKey: ["myClanMemberships", Number(userID)],
    queryFn: () => fetchClanMemberships(Number(userID)),
    enabled: enabled && !!userID,
    staleTime: 1000 * 60,
  })

  const myMemberships = membershipsQuery.data?.data ?? []

  // 3. Minden klánhoz párhuzamosan lekérdezzük a tagokat (useQueries)
  const clanMemberQueries = useQueries({
    queries: myMemberships.map((m) => ({
      queryKey: ["clanMembers", m.clan_id],
      queryFn: () => fetchClanMembers(m.clan_id),
      enabled: enabled && myMemberships.length > 0,
      staleTime: 1000 * 60,
    })),
  })

  // ── friendIDs összerakása ──
  const friendIDs = useMemo<Set<string>>(() => {
    const relations = friendsQuery.data?.data ?? []
    const ids = new Set<string>()
    for (const rel of relations) {
      // A másik fél az aki nem én vagyok
      const other = rel.sender.ID === userID ? rel.receiver : rel.sender
      ids.add(other.ID)
    }
    return ids
  }, [friendsQuery.data, userID])

  // ── clanMembers összerakása ──
  // Minden klánból összegyűjtjük a tagokat (magamat kihagyva)
  // és hozzárendeljük a klán nevét
  const clanMembers = useMemo<ClanMemberEntry[]>(() => {
    const entries: ClanMemberEntry[] = []
    const seen = new Set<string>() // userID+clanId kombináció — ne duplikálódjon

    myMemberships.forEach((membership, idx) => {
      const clanName = membership.clan?.name ?? `Klán ${membership.clan_id}`
      const members = clanMemberQueries[idx]?.data?.data ?? []

      for (const member of members) {
        const memberUserID = String(member.user_id)

        // Magamat kihagyom
        if (memberUserID === userID) continue

        const key = `${memberUserID}-${membership.clan_id}`
        if (seen.has(key)) continue
        seen.add(key)

        entries.push({
          userID: memberUserID,
          clanId: membership.clan_id,
          clanName,
        })
      }
    })

    return entries
  }, [myMemberships, clanMemberQueries, userID])

  const isLoading =
    friendsQuery.isLoading ||
    membershipsQuery.isLoading ||
    clanMemberQueries.some((q) => q.isLoading)

  return {
    friendIDs,
    clanMembers,
    isLoading,
  }
}
