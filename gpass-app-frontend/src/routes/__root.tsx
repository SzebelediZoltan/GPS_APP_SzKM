import { createRootRoute, Outlet, useLocation } from "@tanstack/react-router"
import Header from "@/components/Header"
import { ThemeProvider } from "@/lib/ThemeProvider"
import { useAuth } from "@/hooks/useAuth"

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  const location = useLocation()
  const isAuth = location.pathname.startsWith("/auth")

  const { user } = useAuth()

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        {!isAuth && <Header user={user} />}
        <Outlet />
      </div>
    </ThemeProvider>
  )
}
