import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Lock } from "lucide-react"

export default function NotLoggedIn() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4">
      <Card className="w-full max-w-md rounded-2xl border-border/60 bg-card/60 text-center shadow-lg backdrop-blur">
        <CardContent className="space-y-6 py-10">
          <div className="flex justify-center">
            <div className="rounded-full border border-border/60 bg-background/60 p-4">
              <Lock className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-semibold">
              Nem vagy bejelentkezve
            </h2>
            <p className="text-sm text-muted-foreground">
              A folytatáshoz jelentkezz be a fiókodba.
            </p>
          </div>

          <div className="flex justify-center gap-3">
            <Button asChild>
              <Link to="/auth/login">Bejelentkezés</Link>
            </Button>

            <Button variant="outline" asChild>
              <Link to="/">Főoldal</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
