import axios from "axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

// ── Típusok ──

export type UpdateProfilePayload = {
  userID: string
  username: string
  email: string
  status: string | null
  isAdmin: boolean
}

export type UpdatePasswordPayload = {
  userID: string
  username: string
  email: string
  password: string
  isAdmin: boolean
}

// ── API hívások ──

const updateProfile = ({ userID, username, email, status, isAdmin }: UpdateProfilePayload) =>
  axios.put(`/api/users/${userID}`, { username, email, status, isAdmin })

const updatePassword = ({ userID, username, email, password, isAdmin }: UpdatePasswordPayload) =>
  axios.put(`/api/users/${userID}`, { username, email, password, isAdmin })

// ── Hook ──

export function useSettings() {
  const queryClient = useQueryClient()

  const profileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] })
      toast.success("Profil sikeresen frissítve!", { position: "bottom-right" })
    },
    onError: () => {
      toast.error("Nem sikerült menteni a profilt.", { position: "bottom-right" })
    },
  })

  const passwordMutation = useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      toast.success("Jelszó sikeresen megváltoztatva!", { position: "bottom-right" })
    },
    onError: () => {
      toast.error("Nem sikerült megváltoztatni a jelszót.", { position: "bottom-right" })
    },
  })

  return {
    updateProfile: profileMutation.mutate,
    isProfileSaving: profileMutation.isPending,
    updatePassword: passwordMutation.mutate,
    isPasswordSaving: passwordMutation.isPending,
  }
}
