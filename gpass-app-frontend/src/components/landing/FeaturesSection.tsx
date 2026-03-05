import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FEATURES } from "./landing-data"

export default function FeaturesSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-24" id="features">
      <style>{`
        @keyframes section-fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Section header */}
      <div className="mb-16 flex flex-col gap-4 max-w-2xl">
        <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary">Főképességek</span>
        <h2 className="text-4xl font-black tracking-tight sm:text-5xl leading-none">
          Egy alkalmazás,{" "}
          <span className="text-muted-foreground/50">ami tényleg</span>{" "}
          segít az utakon
        </h2>
        <p className="text-base text-muted-foreground leading-relaxed">
          A GPASS összeköti a klasszikus navigációt a közösségi terepjelzésekkel.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <Card
            key={f.title}
            className="group relative overflow-hidden rounded-2xl border-border/50 bg-card/60 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30"
          >
            {/* Hover glow */}
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{ background: "radial-gradient(ellipse at top left, hsl(var(--primary)/0.08) 0%, transparent 60%)" }}
            />

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
                <CardTitle className="text-base font-semibold leading-snug pt-1">{f.title}</CardTitle>
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
