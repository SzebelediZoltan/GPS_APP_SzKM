import { useQuery } from "@tanstack/react-query"
import { getUser } from "@/lib/auth"

export function useAuth() {
  const query = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    retry: false,                 // ne próbálkozzon sokat ha nincs cookie
    refetchOnWindowFocus: false,  // ne csattogjon feleslegesen
  })

  return {
    user: query.data ?? null,
    isAuthLoading: query.isLoading,
    isAuthError: query.isError,
    refetchUser: query.refetch,
  }
}
