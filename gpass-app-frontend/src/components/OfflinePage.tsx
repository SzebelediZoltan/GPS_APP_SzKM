import { WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full border border-border/60 bg-card/60 p-6 shadow-lg">
            <WifiOff className="h-10 w-10 text-muted-foreground" />
          </div>
        </div>

        <h1 className="text-2xl font-bold tracking-tight">
          Nincs internetkapcsolat
        </h1>

        <p className="text-sm text-muted-foreground">
          Úgy tűnik, jelenleg offline vagy.  
          Ellenőrizd az internetkapcsolatod, majd próbáld újra.
        </p>

        <Button
          onClick={() => window.location.reload()}
          className="rounded-xl"
        >
          Újrapróbálás
        </Button>
      </div>
    </main>
  )
}
