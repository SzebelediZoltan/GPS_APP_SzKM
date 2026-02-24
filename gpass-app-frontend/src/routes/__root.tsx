import { createRootRoute, Outlet, useLocation} from "@tanstack/react-router"
import Header from "@/components/Header"
import { ThemeProvider } from "@/lib/ThemeProvider"
import { useAuth } from "@/hooks/useAuth"
import OfflineGuard from "@/components/OfflineGuard"
import { Toaster } from "sonner"

export const Route = createRootRoute({
  component: RootLayout
})

function RootLayout() {
  const location = useLocation()
  const isAuth = location.pathname.startsWith("/auth")

  const hideHeader = isAuth

  const { user } = useAuth()

  return (
    <>
      <Toaster />
      <ThemeProvider>
        <OfflineGuard>
          <div className="min-h-screen bg-background text-foreground">
            {!hideHeader && <Header user={user} />}
            <Outlet />
          </div>
        </OfflineGuard>
      </ThemeProvider>
    </>
  )
}
