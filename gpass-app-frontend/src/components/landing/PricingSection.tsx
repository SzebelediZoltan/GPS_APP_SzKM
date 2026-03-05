import { Card, CardContent } from "@/components/ui/card"
import { DELIVERY } from "./landing-data"

function StateBadge({ state }: { state: "Popular" | "New" | "Hot" }) {
  if (state === "Popular") return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-bold text-emerald-400 ring-1 ring-emerald-500/30">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
      Popular
    </span>
  )
  if (state === "New") return (
    <span className="inline-flex items-center rounded-full bg-primary/15 px-2.5 py-1 text-xs font-bold text-primary ring-1 ring-primary/30">
      New
    </span>
  )
  return (
    <span className="inline-flex items-center rounded-full bg-orange-500/15 px-2.5 py-1 text-xs font-bold text-orange-400 ring-1 ring-orange-500/30">
      Hot
    </span>
  )
}

export default function PricingSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-24" id="status">
      {/* Header */}
      <div className="mb-16 max-w-2xl space-y-4">
        <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary">Kiemelt funkciók</span>
        <h2 className="text-4xl font-black tracking-tight sm:text-5xl leading-none">
          Amit a közösség{" "}
          <br />
          <span className="text-muted-foreground/50">napi szinten használ</span>
        </h2>
        <p className="text-base text-muted-foreground">
          Nincs túlbonyolítva: gyors jelzés, gyors útvonal, gyors döntés.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {DELIVERY.map((item, i) => (
          <Card
            key={item.title}
            className="group relative overflow-hidden rounded-2xl border-border/50 bg-card/60 backdrop-blur shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30"
          >
            {/* Glow on hover */}
            <div
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{ background: "radial-gradient(ellipse at top, hsl(var(--primary)/0.09) 0%, transparent 65%)" }}
            />

            {/* Large number bg */}
            <div
              className="pointer-events-none absolute -right-3 -top-5 text-9xl font-black select-none transition-all duration-300 text-foreground/2.5 group-hover:text-foreground/5"
              aria-hidden
            >
              {i + 1}
            </div>

            <CardContent className="relative p-6 space-y-4">
              {/* Top row: icon + badge */}
              <div className="flex items-start justify-between gap-2">
                <div className="grid h-12 w-12 place-items-center rounded-xl border border-border/60 bg-background/70 text-primary shadow-sm transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-primary/20 group-hover:bg-primary/10">
                  {item.icon}
                </div>
                <StateBadge state={item.state} />
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold">{item.title}</h3>

              {/* Desc */}
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>

              {/* Bottom accent line */}
              <div className="h-px w-full bg-border/30 group-hover:bg-primary/20 transition-colors duration-300" />
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
