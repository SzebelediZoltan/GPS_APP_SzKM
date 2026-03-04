import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FEATURES } from "./landing-data"

export default function FeaturesSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16" id="features">
      <div className="flex flex-col gap-3">
        <Badge variant="outline" className="w-fit border-border/70">
          Fokepessegek
        </Badge>
        <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Egy alkalmazas, ami tenyleg segit az utakon
        </h2>
        <p className="max-w-2xl text-muted-foreground">
          GPASS osszekoti a klasszikus navigaciot a kozossegi terepjelzesekkel.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <Card
            key={f.title}
            className="group relative overflow-hidden rounded-2xl border-border/70 bg-card/70 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="pointer-events-none absolute -inset-10 opacity-0 transition duration-300 group-hover:opacity-100">
              <div className="h-full w-full bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.12),transparent_60%)] blur-2xl" />
            </div>

            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl border border-border/70 bg-background/60 text-primary">
                  {f.icon}
                </div>
                <CardTitle className="text-base">{f.title}</CardTitle>
              </div>
            </CardHeader>

            <CardContent className="text-sm text-muted-foreground">{f.desc}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
