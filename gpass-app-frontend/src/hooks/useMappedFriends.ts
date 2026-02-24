import { useMemo } from "react"

type FriendRelation = {
  id: string,
  sender_id: string,
  receiver_id: string,
  status: string,
  sender: {
    ID: string,
    username: string,
    isAdmin: boolean
  },
  receiver: {
    ID: string,
    username: string,
    isAdmin: boolean
  }
}

type SimpleUser = {
  ID: string
  username: string
  isAdmin: boolean
  status: string
}

export function useMappedFriends(
  currentUsername: string,
  pendingRequests: FriendRelation[],
  acceptedRequests: FriendRelation[]
) {

  const mappedFriends = useMemo(() => {

    const allRelations = [
      ...pendingRequests,
      ...acceptedRequests
    ]

    const result: SimpleUser[] = []
    const seen = new Set<string>()

    for (let i = 0; i < allRelations.length; i++) {

      const relation = allRelations[i]

      const otherUser =
        relation.receiver.username === currentUsername
          ? relation.sender
          : relation.receiver

      if (!seen.has(otherUser.ID)) {
        seen.add(otherUser.ID)

        result.push({
          ID: otherUser.ID,
          username: otherUser.username,
          isAdmin: otherUser.isAdmin,
          status: relation.status
        })
      }
    }

    return result

  }, [pendingRequests, acceptedRequests, currentUsername])

  return { mappedFriends }
}