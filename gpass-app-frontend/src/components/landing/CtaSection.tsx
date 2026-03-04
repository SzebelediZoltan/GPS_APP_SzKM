import { ArrowRight } from "lucide-react"
import { Link } from "@tanstack/react-router"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function CtaSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-20">
      <Card className="relative overflow-hidden rounded-2xl border-border/70 bg-card/70 shadow-xl backdrop-blur">
        <div className="pointer-events-none absolute -inset-16 opacity-80">
          <div className="h-full w-full bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.16),transparent_60%)] blur-2xl" />
        </div>

        <CardContent className="relative flex flex-col items-start gap-6 p-8 sm:p-10 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <Badge variant="secondary" className="w-fit">
              GPASS
            </Badge>
            <h3 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
              Indulhat az ut, kozossegben?
            </h3>
            <p className="max-w-2xl text-muted-foreground">
              Csatlakozz, jelolj, ments, oszd meg. A GPASS-szal minden ut egy kozos elmeny.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button asChild className="group">
              <Link to="/map/mapPage">
                Terkep megnyitasa
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>

            <Button asChild variant="outline">
              <Link to="/auth/register">Regisztracio</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
