import { ArrowRight, Zap } from "lucide-react"
import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"

export default function CtaSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-24">
      <div
        className="group relative overflow-hidden rounded-3xl border border-primary/20 bg-card/80 shadow-2xl backdrop-blur"
        style={{ boxShadow: "0 0 0 1px hsl(var(--primary)/0.1), 0 25px 60px -15px rgba(0,0,0,0.4)" }}
      >
        <style>{`
          @keyframes pulse-glow-cta {
            0%, 100% { opacity: 0.2; transform: scale(1); }
            50% { opacity: 0.35; transform: scale(1.08); }
          }
        `}</style>

        {/* Background glows */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full"
            style={{ background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)", filter: "blur(60px)", animation: "pulse-glow-cta 5s ease-in-out infinite", opacity: 0.25 }}
          />
          <div className="absolute -right-32 -bottom-32 h-80 w-80 rounded-full"
            style={{ background: "radial-gradient(circle, hsl(var(--primary)/0.6) 0%, transparent 70%)", filter: "blur(50px)", animation: "pulse-glow-cta 7s ease-in-out infinite reverse", opacity: 0.15 }}
          />
          <div className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)", backgroundSize: "40px 40px" }}
          />
        </div>

        <div className="relative px-8 py-16 sm:px-12 sm:py-20">
          <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">

            <div className="max-w-xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary tracking-widest uppercase">
                <Zap className="h-3 w-3" />
                GPASS
              </div>
              <h3 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl leading-tight">
                Indulhat az út,
                <span className="block text-primary">közösségben?</span>
              </h3>
              <p className="text-base text-muted-foreground leading-relaxed">
                Csatlakozz, jelölj, ments, oszd meg. A GPASS-szal minden út egy közös élmény.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button asChild size="lg" className="group px-8 font-bold shadow-lg shadow-primary/30 text-base">
                <Link to="/map">
                  Térkép megnyitása
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-border/60 hover:bg-accent/50 font-semibold text-base">
                <Link to="/auth/register">Regisztráció</Link>
              </Button>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
