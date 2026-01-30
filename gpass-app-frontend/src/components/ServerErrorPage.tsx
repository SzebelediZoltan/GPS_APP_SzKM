import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"
import { Link } from "@tanstack/react-router"

export default function ServerError() {
  return (
    <div className="flex w-full justify-center px-4 py-12">
      <Card className="w-full max-w-md rounded-2xl border-border/60 bg-card/60 shadow-lg backdrop-blur">
        <CardContent className="space-y-6 py-10 text-center">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="rounded-full border border-border/60 bg-background/60 p-4">
              <AlertTriangle className="h-7 w-7 text-destructive" />
            </div>
          </div>

          {/* Text */}
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">
              Szerver hiba történt
            </h2>
            <p className="text-sm text-muted-foreground">
              A szerver jelenleg nem érhető el, kérjük próbáld meg később.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-3">
            <Button onClick={() => window.location.reload()}>
              Újratöltés
            </Button>

            <Button variant="outline" asChild>
              <Link to="/">Főoldal</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
