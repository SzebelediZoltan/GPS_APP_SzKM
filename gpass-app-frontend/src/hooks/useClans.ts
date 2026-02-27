import axios, { AxiosError } from "axios"
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { toast } from "sonner"

/* ================= TYPES ================= */

export type Clan = {
  id: number
  name: string
  description: string | null
  leader_id: number
  member_count: number
  leader: {
    username: string
    isAdmin?: boolean
  }
}

export type ClanMember = {
  clan_id: number
  user_id: number
  user?: {
    username: string
    isAdmin: boolean
  }
}

/* ================= AXIOS ================= */

const fetchClans = async (): Promise<Clan[]> => {
  const { data } = await axios.get("/api/clans")
  return data
}

const fetchClan = async (clanId: number): Promise<Clan> => {
  const { data } = await axios.get(`/api/clans/${clanId}`)
  return data
}

const fetchMemberships = async (
  userId: number
): Promise<ClanMember[]> => {
  const { data } = await axios.get(
    `/api/clan-members/by-user/${userId}`
  )
  return data
}

const fetchClanMembers = async (
  clanId: number
): Promise<ClanMember[]> => {
  const { data } = await axios.get(
    `/api/clan-members/by-clan/${clanId}`
  )
  return data
}

const joinClanRequest = (
  clanId: number,
  userId: number
) =>
  axios.post("/api/clan-members", {
    clan_id: clanId,
    user_id: userId,
  })

const leaveClanRequest = (
  clanId: number,
  userId: number
) =>
  axios.delete(`/api/clan-members/${clanId}/${userId}`)

const createClanRequest = (
  values: { name: string; description?: string },
  leaderId: number
) =>
  axios.post("/api/clans", {
    name: values.name,
    description: values.description ?? null,
    leader_id: leaderId,
  })

const deleteClanRequest = (clanId: number) =>
  axios.delete(`/api/clans/${clanId}`)

const updateClanRequest = (
  clanId: number,
  values: { name: string; description?: string }
) =>
  axios.put(`/api/clans/${clanId}`, values)

/* ================= HOOK ================= */

export function useClans(userId?: number, clanId?: number) {
  const queryClient = useQueryClient()

  /* ===== CLANS LIST ===== */

  const clansQuery = useQuery({
    queryKey: ["clans"],
    queryFn: fetchClans,
  })

  /* ===== SINGLE CLAN ===== */

  const clanQuery = useQuery({
    queryKey: ["clan", clanId],
    queryFn: () => fetchClan(Number(clanId)),
    enabled: !!clanId,
  })

  /* ===== USER MEMBERSHIPS ===== */

  const membershipsQuery = useQuery({
    queryKey: ["myClanMemberships", userId],
    queryFn: () => fetchMemberships(Number(userId)),
    enabled: !!userId,
  })

  /* ===== CLAN MEMBERS ===== */

  const clanMembersQuery = useQuery({
    queryKey: ["clanMembers", clanId],
    queryFn: () => fetchClanMembers(Number(clanId)),
    enabled: !!clanId,
  })

  /* ===== JOIN ===== */

  const joinMutation = useMutation({
    mutationFn: (clanId: number) =>
      joinClanRequest(clanId, Number(userId)),
    onSuccess: () => {
      toast.success("Sikeres csatlakozás!")
      queryClient.invalidateQueries({ queryKey: ["clans"] })
      queryClient.invalidateQueries({
        queryKey: ["myClanMemberships"],
      })
      queryClient.invalidateQueries({
        queryKey: ["clanMembers"],
      })
    }
  })

  /* ===== LEAVE ===== */

  const leaveMutation = useMutation({
    mutationFn: ({clanId, userId}: {clanId: number, userId: number}) =>
      leaveClanRequest(clanId, userId),
    onSuccess: () => {
      toast.success("Kiléptél a klánból")
      queryClient.invalidateQueries({ queryKey: ["clans"] })
      queryClient.invalidateQueries({
        queryKey: ["myClanMemberships"],
      })
      queryClient.invalidateQueries({
        queryKey: ["clanMembers"],
      })
    },
  })

  /* ===== CREATE ===== */

  const createMutation = useMutation<
    unknown,
    AxiosError<{ message: string }>,
    { values: {name: string; description?: string}; onSuccessCallback?: () => void }
  >({
    mutationFn: (values) =>
      createClanRequest(values.values, Number(userId)),
    onSuccess: (_, variables) => {
      toast.success("Klán létrehozva!")
      queryClient.invalidateQueries({ queryKey: ["clans"] })
      variables.onSuccessCallback?.()
    },
    onError: (error) => {
      toast.error(error.response?.data.message)
    }
  })

  /* ===== DELETE ===== */

  const deleteMutation = useMutation({
    mutationFn: (clanId: number) =>
      deleteClanRequest(clanId),
    onSuccess: () => {
      toast.success("Klán törölve")
      queryClient.invalidateQueries({ queryKey: ["clans"] })
    },
  })

  /* ===== UPDATE ===== */

  const updateMutation = useMutation<
    unknown,
    AxiosError<{ message: string }>,
    { clanId: number; values: { name: string; description?: string }; onSuccessCallback?: () => void }
  >({
    mutationFn: ({ clanId, values }) =>
      updateClanRequest(clanId, values),

    onSuccess: (_, variables) => {
      toast.success("Klán frissítve")

      queryClient.invalidateQueries({
        queryKey: ["clan", variables.clanId],
      })

      queryClient.invalidateQueries({
        queryKey: ["clans"],
      })

      variables.onSuccessCallback?.()
    },


    onError: (error) => {
      toast.error(error.response?.data.message)
    },
  })

  return {
    clansQuery,
    clanQuery,
    membershipsQuery,
    clanMembersQuery,
    joinClan: joinMutation.mutate,
    leaveClan: leaveMutation.mutate,
    createClan: createMutation.mutate,
    deleteClan: deleteMutation.mutate,
    updateClan: updateMutation.mutate,
    updateClanLoading: updateMutation.isPending,
  }
}