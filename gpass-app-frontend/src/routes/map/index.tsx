import { createFileRoute } from "@tanstack/react-router"
import MapView from "@/components/map/MapView"
import { useGeolocation } from "@/hooks/useGeolocation"
import LoadingPage from "@/components/LoadingPage"
import { useEffect } from "react"

export const Route = createFileRoute("/map/")({
  component: MapPage,
})

function MapPage() {
  const { position, error, loading } = useGeolocation()

  useEffect(() => {
  document.body.style.overflow = "hidden"
  return () => {
    document.body.style.overflow = "auto"
  }
}, [])

  if (loading) return <LoadingPage />


  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold">
            Nem sikerült lekérni a pozíciót
          </h2>
          <p className="text-muted-foreground mt-2">{error}</p>
        </div>
      </div>
    )
  }

  if (!position) return null

  return <MapView position={position} />
}