import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Check } from "lucide-react"
import { PLANS } from "./landing-data"

export default function PricingSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16" id="pricing">
      <div className="space-y-2">
        <Badge variant="outline" className="w-fit border-border/70">
          Csomagok
        </Badge>
        <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Válassz a számodra megfelelő csomagot
        </h2>
        <p className="max-w-2xl text-muted-foreground">
          Egyszerű csomagok, amik lefedik a hétköznapi és a haladó igényeket is.
        </p>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {PLANS.map((p) => (
          <Card
            key={p.name}
            className={[
              "relative overflow-hidden rounded-2xl border-border/60 bg-card/60 shadow-sm backdrop-blur",
              p.highlight ? "shadow-xl" : "",
            ].join(" ")}
          >
            {p.highlight && (
              <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-primary/60 via-ring/50 to-primary/60" />
            )}

            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{p.name}</CardTitle>
                {p.highlight ? (
                  <Badge className="gap-1" variant="secondary">
                    <Sparkles className="h-3.5 w-3.5" /> Ajánlott
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-border/70">
                    Standard
                  </Badge>
                )}
              </div>
              <div className="text-3xl font-semibold tracking-tight">{p.price}</div>
            </CardHeader>

            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-muted-foreground">
                {p.items.map((it) => (
                  <li key={it} className="flex items-start gap-2">
                    <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-md border border-border/70 bg-background/60">
                      <Check className="h-3.5 w-3.5 text-foreground" />
                    </span>
                    <span>{it}</span>
                  </li>
                ))}
              </ul>

              <Button className="w-full" variant={p.highlight ? "default" : "outline"}>
                Kezdés
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
