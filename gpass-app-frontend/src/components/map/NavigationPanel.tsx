import { useState } from "react"
import { MapPin, Route } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useNavigation } from "@/context/NavigationContext"
import { useRouting } from "@/hooks/useRouting"

type Props = {
  currentPosition: { lat: number; lng: number }
}

export default function NavigationPanel({ currentPosition }: Props) {
  const { mode, setPreview } = useNavigation()
  const { planRoute, loading } = useRouting()

  const [isDesktopOpen, setIsDesktopOpen] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [to, setTo] = useState("")

  if (mode !== "idle") return null

  const handlePlan = async () => {
    if (!to.trim()) return

    // Temporary destination until geocoding is wired in.
    const destination = {
      lat: 47.4979,
      lng: 19.0402,
    }

    const routes = await planRoute(currentPosition, destination)

    if (routes.length > 0) {
      setPreview(routes)
      setIsDesktopOpen(false)
      setIsMobileOpen(false)
    }
  }

  return (
    <>
      <div className="absolute top-4 left-4 z-1000 hidden md:block">
        {!isDesktopOpen && (
          <Button
            onClick={() => setIsDesktopOpen(true)}
            className="
              w-11 h-11
              rounded-xl
              bg-card
              text-foreground
              border border-border
              shadow-md
              flex items-center justify-center
              hover:bg-muted
              active:scale-95
              transition
              cursor-pointer
            "
          >
            <Route className="w-4 h-4 text-primary" />
          </Button>
        )}

        {isDesktopOpen && (
          <div
            className="
              w-[min(20rem,calc(100vw-2rem))]
              rounded-xl
              border border-border
              bg-background/95
              backdrop-blur
              shadow-xl
              p-4
              space-y-4
              relative
              animate-in
              fade-in-0
              zoom-in-95
              duration-200
            "
          >
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Hova szeretnél menni?"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>

            <Button onClick={handlePlan} disabled={loading} className="w-full">
              {loading ? "Tervezés..." : "Tervezés"}
            </Button>
          </div>
        )}
      </div>

      <div className="absolute top-5 left-1/2 z-1000 -translate-x-1/2 md:hidden">
        <Button
          onClick={() => setIsMobileOpen(true)}
          className="rounded-full border border-border bg-card/95 px-4 text-foreground shadow-lg backdrop-blur hover:bg-muted"
        >
          <Route className="mr-2 h-4 w-4 text-primary" />
          Útvonaltervezés
        </Button>
      </div>

      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent
          side="bottom"
          className="z-1200 md:hidden rounded-t-2xl border-t border-border/80 bg-background/95 px-0 pb-[max(env(safe-area-inset-bottom),1rem)] backdrop-blur"
        >
          <SheetHeader className="pb-2">
            <SheetTitle>Útvonaltervezés</SheetTitle>
            <SheetDescription>Adj meg egy célt, és tervezünk útvonalat.</SheetDescription>
          </SheetHeader>

          <div className="space-y-3 px-4">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                autoFocus
                className="pl-9"
                placeholder="Hova szeretnél menni?"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>

            <Button onClick={handlePlan} disabled={loading} className="w-full">
              {loading ? "Tervezés..." : "Tervezés"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
