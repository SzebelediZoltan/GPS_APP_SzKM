import { ArrowRight, Clock, Sparkles, Users, ShieldCheck, Zap } from "lucide-react"
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
              <Sparkles className="h-4 w-4" />
              Új GPASS élmény
            </Badge>

            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              GPASS — navigáció,{" "}
              <span className="relative">
                modern köntösben
                <span className="absolute -inset-x-2 -bottom-1 -z-10 h-3 rounded-full bg-primary/15 blur-[1px]" />
              </span>
            </h1>

            <p className="max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
              Gyors, átlátható és reszponzív GPS app koncepció. Kevesebb zaj, több
              hasznos információ — pont akkor, amikor kell.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button className="group">
                Kezdés
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
              <Button variant="outline">Funkciók</Button>
            </div>

            <div className="grid max-w-xl grid-cols-3 gap-3 pt-2">
              <StatCard value="ETA" label="valós becslés" />
              <StatCard value="1 tap" label="kedvencek" />
              <StatCard value="100%" label="reszponzív" />
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-3xl bg-linear-to-tr from-primary/10 via-transparent to-ring/10 blur-xl" />

            <Card className="overflow-hidden rounded-2xl border-border/60 bg-card/60 shadow-xl backdrop-blur">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">Útvonal előnézet</CardTitle>
                  <Badge variant="outline" className="border-border/70">
                    Mobile / Desktop
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="relative overflow-hidden rounded-xl border border-border/70">
                  <img
                    className="h-70 w-full object-cover sm:h-80"
                    src="https://images.unsplash.com/photo-1524666041070-9d87656c25bb?auto=format&fit=crop&w=1600&q=80"
                    alt="Map placeholder"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-background/70 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="rounded-xl border border-border/70 bg-background/70 p-3 backdrop-blur">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">Budapest → Gödöllő</div>
                        <Badge className="gap-1" variant="secondary">
                          <Clock className="h-3.5 w-3.5" /> 28 perc
                        </Badge>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        Forgalom: közepes • Alternatíva: +3 perc • ETA: 13:42
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <MiniPill icon={<Users className="h-4 w-4" />} label="Megosztás" />
                  <MiniPill icon={<ShieldCheck className="h-4 w-4" />} label="Stabil" />
                  <MiniPill icon={<Zap className="h-4 w-4" />} label="Gyors" />
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
