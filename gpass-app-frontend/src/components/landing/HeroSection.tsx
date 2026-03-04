import { ArrowRight, Bell, Compass, Copy, ShieldAlert } from "lucide-react"
import { Link } from "@tanstack/react-router"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MiniPill, StatCard } from "./landing-ui"

export default function HeroSection() {
  return (
    <section className="relative">
      <div className="mx-auto w-full max-w-6xl px-4 pt-16 sm:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <Badge className="gap-2" variant="secondary">
              <Bell className="h-4 w-4" />
              Uj generacios GPS platform
            </Badge>

            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              GPASS
              <span className="block text-primary">A navigacio, ami kozossegeben gondolkodik</span>
            </h1>

            <p className="max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
              Tervezz utvonalat, nezd az elo baratokat, csatlakozz a klanodhoz, es jelolj
              globalis markerrel minden fontos helyzetet az utakon.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild className="group">
                <Link to="/map/mapPage">
                  Probald ki most
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>

              <Button asChild variant="outline">
                <Link to="/about">Mi a GPASS?</Link>
              </Button>
            </div>

            <div className="grid max-w-xl grid-cols-3 gap-3 pt-2">
              <StatCard value="Live" label="barat kovetes" />
              <StatCard value="Global" label="marker halozat" />
              <StatCard value="Trip" label="mentes + masolas" />
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-3xl bg-linear-to-tr from-primary/12 via-transparent to-ring/10 blur-xl" />
            <Card className="overflow-hidden rounded-2xl border-border/70 bg-card/70 shadow-xl backdrop-blur">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">Miert szeretik a GPASS-t?</CardTitle>
                  <Badge variant="outline" className="border-border/70">
                    Mindig mozgásban
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="rounded-xl border border-border/70 bg-background/60 p-4">
                  <div className="grid gap-3">
                    <MiniPill icon={<Compass className="h-4 w-4" />} label="Elo utvonaldontes" />
                    <MiniPill icon={<ShieldAlert className="h-4 w-4" />} label="Rendor + veszely marker" />
                    <MiniPill icon={<Copy className="h-4 w-4" />} label="Trip masolas egy koppintasra" />
                  </div>
                </div>

                <div className="rounded-xl border border-border/70 bg-background/40 p-3 text-sm text-muted-foreground">
                  A cel egyszeru: biztonsagosabb, gyorsabb es sokkal kozossegibb kozlekedes.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="pt-10">
          <Separator className="bg-border/70" />
        </div>
      </div>
    </section>
  )
}
