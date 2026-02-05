import { createFileRoute } from "@tanstack/react-router"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const Route = createFileRoute("/map")({
  component: MapPage,
})

function MapPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="mb-6 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Térkép</h1>
        <p className="text-muted-foreground">
          Itt lesz majd a tényleges térkép nézet (pl. Leaflet/Google Maps), útvonal és navigáció.
        </p>
      </div>

      <Card className="rounded-2xl border-border/60 bg-card/60 backdrop-blur">
        <CardHeader>
          <CardTitle>Map placeholder</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid h-105 place-items-center rounded-xl border border-border/70 bg-background/50 text-sm text-muted-foreground">
            Térkép komponens helye
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
