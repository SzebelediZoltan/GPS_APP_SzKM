import { createFileRoute } from "@tanstack/react-router"
import MapView from "@/components/map/MapView"
import { useGeolocation } from "@/hooks/useGeolocation"
import LoadingPage from "@/components/shared/LoadingPage"
import { useEffect } from "react"

export const Route = createFileRoute("/map/")({
  component: MapPage,
})

function MapPage() {
  const { position, heading, error, loading } = useGeolocation()

  useEffect(() => {
    // Megakadályozza a scroll-t a térkép oldalon
    document.body.style.overflow = "hidden"
    // iOS Safari – megakadályozza a bounce scroll-t ami felcsúsztatja az UI-t
    document.body.style.position = "fixed"
    document.body.style.width = "100%"
    return () => {
      document.body.style.overflow = "auto"
      document.body.style.position = ""
      document.body.style.width = ""
    }
  }, [])

  if (loading) return <LoadingPage />

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Nem sikerült lekérni a pozíciót</h2>
          <p className="text-muted-foreground mt-2">{error}</p>
        </div>
      </div>
    )
  }

  if (!position) return null

  return <MapView position={position} heading={heading} />
}
