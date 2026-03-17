import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FEATURES } from "./landing-data"

export default function FeaturesSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-24" id="features">
      {/* Section header */}
      <div className="mb-16 flex flex-col gap-4 max-w-2xl">
        <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary">Főképességek</span>
        <h2 className="text-4xl font-black tracking-tight sm:text-5xl leading-none">
          Egy alkalmazás,{" "}
          <span className="text-muted-foreground/50">ami tényleg</span>{" "}
          segít az utakon
        </h2>
        <p className="text-base text-muted-foreground leading-relaxed">
          A GPASS összeköti a klasszikus navigációt a közösségi terepjelzésekkel és az AI erejével.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <Card
            key={f.title}
            className="group relative overflow-hidden rounded-2xl border-border/50 bg-card/60 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30"
          >
            {/* Hover glow */}
            <div
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{ background: "radial-gradient(ellipse at top left, hsl(var(--primary)/0.08) 0%, transparent 60%)" }}
            />

            {/* AI kártya extra glow */}
            {f.badge && (
              <div
                className="pointer-events-none absolute inset-0"
                style={{ background: "radial-gradient(ellipse at top right, hsl(var(--primary)/0.06) 0%, transparent 55%)" }}
              />
            )}

            {/* Number watermark */}
            <div
              className="pointer-events-none absolute -right-2 -top-4 text-8xl font-black text-foreground/3 select-none transition-all duration-300 group-hover:text-foreground/6"
              aria-hidden
            >
              {String(i + 1).padStart(2, "0")}
            </div>

            <CardHeader className="pb-3 relative">
              <div className="flex items-start gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-border/60 bg-background/70 text-primary shadow-sm transition-all duration-300 group-hover:border-primary/40 group-hover:bg-primary/10 group-hover:shadow-primary/20">
                  {f.icon}
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-base font-semibold leading-snug">{f.title}</CardTitle>
                    {f.badge && (
                      <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                        {f.badge}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="relative text-sm text-muted-foreground leading-relaxed">
              {f.desc}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
