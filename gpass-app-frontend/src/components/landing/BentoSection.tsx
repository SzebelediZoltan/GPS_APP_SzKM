import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bullet } from "./landing-ui"

export default function BentoSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16">
      <div className="grid gap-4 lg:grid-cols-12">
        <Card className="relative overflow-hidden rounded-2xl border-border/60 bg-card/60 shadow-sm backdrop-blur lg:col-span-7">
          <CardHeader>
            <CardTitle className="text-lg">Tiszta útvonal, gyors döntések</CardTitle>
            <p className="text-sm text-muted-foreground">
              A lényeg mindig látható: merre, mennyi idő, mi változott.
            </p>
          </CardHeader>
          <CardContent>
            <div className="relative overflow-hidden rounded-xl border border-border/70">
              <img
                className="h-65 w-full object-cover sm:h-80"
                src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1600&q=80"
                alt="App placeholder"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-linear-to-t from-background/70 via-transparent to-transparent" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60 bg-card/60 shadow-sm backdrop-blur lg:col-span-5">
          <CardHeader>
            <CardTitle className="text-lg">Miért GPASS?</CardTitle>
            <p className="text-sm text-muted-foreground">
              Letisztult felület, erős alapok, modern megjelenés.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <Bullet text="Átlátható információk menet közben is." />
            <Bullet text="Könnyű váltás alternatív útvonalak között." />
            <Bullet text="Hasznos jelzések, minimális vizuális zaj." />
            <Bullet text="Konzisztens dizájn tokenekre építve." />
            <Button variant="secondary" className="mt-2 w-full">
              Tudj meg többet
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
