import axios from "axios"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

type User = {
  ID: string
  username: string
  email: string
  isAdmin: boolean
}

type FriendRelation = {
  id: string
  sender_id: string
  receiver_id: string
  status: string
  sender: {
    ID: string
    username: string
    isAdmin: boolean
  }
  receiver: {
    ID: string
    username: string
    isAdmin: boolean
  }
}

/* -------------------- AXIOS -------------------- */

const acceptRequest = (id: string) =>
  axios.put("/api/friends-with/" + id, { status: "accepted" })

const getPendingRequests = (id: string) =>
  axios.get<FriendRelation[]>("/api/friends-with/pending/" + id)

const getAcceptedRequests = (id: string) =>
  axios.get<FriendRelation[]>("/api/friends-with/accepted/" + id)

const deleteRequest = (id: string) =>
  axios.delete("/api/friends-with/" + id)

const addFriend = (sender_id: string, receiver_id: string) =>
  axios.post("/api/friends-with", { sender_id, receiver_id })

const getUser = (id: string) =>
  axios.get<User>("/api/users/" + id)

/* -------------------- HOOK -------------------- */

export const useFriends = (userID: string, enabled: boolean) => {
  const queryClient = useQueryClient()

  /* -------- Queries -------- */

  const pendingRequests = useQuery({
    queryKey: ["pendingRequests", userID],
    queryFn: () => getPendingRequests(userID),
    enabled,
  })

  const acceptedRequests = useQuery({
    queryKey: ["acceptedRequests", userID],
    queryFn: () => getAcceptedRequests(userID),
    enabled,
  })

  const currentUser = useQuery({
    queryKey: ["currentUser", userID],
    queryFn: () => getUser(userID),
    enabled,
  })

  /* -------- Mutations -------- */

  const { mutate: terminateRequest, isPending: isTerminating } =
    useMutation({
      mutationFn: (id: string) => deleteRequest(id),
      onSuccess: () => {
        toast.success("Barát törölve!", { position: "bottom-right" })
        queryClient.invalidateQueries({ queryKey: ["pendingRequests"] })
        queryClient.invalidateQueries({ queryKey: ["acceptedRequests"] })
      },
      onError: () => {
        toast.error("Barát törlése sikertlen!", {
          position: "bottom-right",
        })
      },
    })

  const { mutate: add, isPending: isAdding } = useMutation({
    mutationFn: ({
      sender_id,
      receiver_id,
    }: {
      sender_id: string
      receiver_id: string
    }) => addFriend(sender_id, receiver_id),
    onSuccess: () => {
      toast.success("Barátkérelem elküldve!", { position: "bottom-right" })
      queryClient.invalidateQueries({ queryKey: ["pendingRequests"] })
      queryClient.invalidateQueries({ queryKey: ["acceptedRequests"] })
    },
    onError: () => {
      toast.error("Barátkérelem elküldése sikertlen!", {
        position: "bottom-right",
      })
    },
  })

  const { mutate: accept, isPending: isAccepting } = useMutation({
    mutationFn: (id: string) => acceptRequest(id),
    onSuccess: () => {
      toast.success("Barátkérelem elfogadva!", { position: "bottom-right" })
      queryClient.invalidateQueries({ queryKey: ["pendingRequests"] })
      queryClient.invalidateQueries({ queryKey: ["acceptedRequests"] })
    },
    onError: () => {
      toast.error("Barátkérelem elfogadása sikertlen!", {
        position: "bottom-right",
      })
    },
  })

  return {
    /* queries */
    pendingRequests,
    acceptedRequests,
    currentUser,

    /* mutations */
    terminateRequest,
    add,
    accept,

    /* loading states */
    isTerminating,
    isAdding,
    isAccepting,
  }
}