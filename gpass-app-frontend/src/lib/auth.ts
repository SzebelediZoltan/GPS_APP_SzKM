import axios from "axios"

export type User = {
  userID: string
  username: string
  isAdmin: boolean
}

export const getUser = async (): Promise<User | null> => {
  try {
    const res = await axios.get<User>("http://localhost:4000/api/auth/status", {
      withCredentials: true,
    })
    return res.data
  } catch (err: any) {
    // ha nincs session/cookie -> nem error UI, csak nincs user
    if (axios.isAxiosError(err) && err.response?.status === 401) {
      return null
    }
    throw err
  }
}
