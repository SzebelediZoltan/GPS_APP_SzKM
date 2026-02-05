import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"


export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md space-y-6 text-center">
        <h1 className="bg-linear-to-r from-primary via-sky-500 to-indigo-500 bg-clip-text text-7xl font-extrabold tracking-tight text-transparent">
          404
        </h1>

        <p className="text-lg font-semibold">
          Az oldal nem található
        </p>

        <p className="text-sm text-muted-foreground">
          Lehet, hogy rossz címet adtál meg, vagy az oldal már nem létezik.
        </p>

        <div className="flex justify-center gap-3">
          <Button asChild>
            <Link to="/">Főoldal</Link>
          </Button>

          <Button variant="outline" asChild>
            <Link to="/map">Térkép</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}