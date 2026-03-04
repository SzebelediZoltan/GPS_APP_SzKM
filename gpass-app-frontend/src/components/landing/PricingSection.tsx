import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DELIVERY } from "./landing-data"

function StateBadge({ state }: { state: "Popular" | "New" | "Hot" }) {
  if (state === "Popular") {
    return <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">Popular</Badge>
  }

  if (state === "New") {
    return <Badge variant="secondary">New</Badge>
  }

  return <Badge variant="outline">Hot</Badge>
}

export default function PricingSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16" id="status">
      <div className="space-y-2">
        <Badge variant="outline" className="w-fit border-border/70">
          Kiemelt funkciok
        </Badge>
        <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Amit a kozosseg napi szinten hasznal
        </h2>
        <p className="max-w-2xl text-muted-foreground">
          Nincs tulbonyolitva: gyors jelzes, gyors utvonal, gyors dontes.
        </p>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {DELIVERY.map((item) => (
          <Card
            key={item.title}
            className="rounded-2xl border-border/70 bg-card/70 shadow-sm backdrop-blur"
          >
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <StateBadge state={item.state} />
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="mt-0.5 text-primary">{item.icon}</span>
                <span>{item.desc}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
