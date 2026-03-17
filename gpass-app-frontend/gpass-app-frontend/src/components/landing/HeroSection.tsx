import { Link } from "@tanstack/react-router"
import { ArrowRight, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HeroSection() {
  return (
    <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden px-4">

      <style>{`
        @keyframes hero-in {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes orb-1 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33%       { transform: translate(40px, -30px) scale(1.08); }
          66%       { transform: translate(-20px, 20px) scale(0.95); }
        }
        @keyframes orb-2 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33%       { transform: translate(-50px, 25px) scale(1.1); }
          66%       { transform: translate(30px, -20px) scale(0.92); }
        }
        @keyframes orb-3 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50%       { transform: translate(20px, -40px) scale(1.05); }
        }
        @keyframes grid-drift {
          0%   { transform: translate(0, 0); }
          100% { transform: translate(32px, 32px); }
        }
        .hero-in-1 { animation: hero-in 0.7s cubic-bezier(.22,1,.36,1) 0.1s both; }
        .hero-in-2 { animation: hero-in 0.7s cubic-bezier(.22,1,.36,1) 0.25s both; }
        .hero-in-3 { animation: hero-in 0.7s cubic-bezier(.22,1,.36,1) 0.4s both; }
        .hero-in-4 { animation: hero-in 0.7s cubic-bezier(.22,1,.36,1) 0.55s both; }
      `}</style>

      {/* ── Háttér: mozgó grid ── */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                            linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
          animation: "grid-drift 8s linear infinite",
        }}
      />

      {/* ── Háttér: lebegő orbok ── */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">

        {/* Nagy centrális glow */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-150 w-150 rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(var(--primary)/0.12) 0%, transparent 65%)",
            filter: "blur(60px)",
          }}
        />

        {/* Orb 1 — bal felső */}
        <div
          className="absolute -top-32 -left-32 h-125 w-125 rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(var(--primary)/0.18) 0%, transparent 60%)",
            filter: "blur(80px)",
            animation: "orb-1 14s ease-in-out infinite",
          }}
        />

        {/* Orb 2 — jobb alsó */}
        <div
          className="absolute -bottom-40 -right-40 h-130 w-130 rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(var(--primary)/0.14) 0%, transparent 60%)",
            filter: "blur(90px)",
            animation: "orb-2 18s ease-in-out infinite",
          }}
        />

        {/* Orb 3 — jobb felső, kisebb, gyorsabb */}
        <div
          className="absolute top-0 right-1/4 h-75 w-75 rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(var(--primary)/0.08) 0%, transparent 60%)",
            filter: "blur(50px)",
            animation: "orb-3 10s ease-in-out infinite",
          }}
        />

        {/* Finom noise overlay */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "128px 128px",
          }}
        />
      </div>

      {/* ── Tartalom — középre igazítva ── */}
      <div className="relative z-10 flex flex-col items-center text-center gap-6 max-w-3xl mx-auto">

        {/* Badge */}
        <div className="hero-in-1 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-4 py-1.5 text-xs font-bold text-primary tracking-widest uppercase">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          Valós idejű GPS navigáció
        </div>

        {/* Főcím */}
        <h1 className="hero-in-2 text-5xl font-black tracking-tight leading-[1.05] sm:text-6xl lg:text-7xl xl:text-8xl">
          Navigálj,
          <br />
          <span className="text-primary">jelezz,</span>{" "}
          <span
            className="text-accent-foreground bg-clip-text"
            style={{ backgroundImage: "linear-gradient(135deg, hsl(var(--foreground)/0.5) 0%, hsl(var(--foreground)/0.2) 100%)" }}
          >
            haladj együtt.
          </span>
        </h1>

        {/* Leírás */}
        <p className="hero-in-3 text-base text-muted-foreground leading-relaxed sm:text-lg max-w-xl">
          A GPASS összeköti a valós idejű navigációt a közösségi élménnyel.
          Barátok, klánok, markerek — minden egy helyen, minden alkalomra.
        </p>

        {/* CTA gombok */}
        <div className="hero-in-4 flex flex-wrap items-center justify-center gap-3">
          <Link to="/map">
            <Button size="lg" className="rounded-xl gap-2 cursor-pointer font-bold px-6">
              <Navigation className="h-4 w-4" />
              Térkép megnyitása
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/about">
            <Button size="lg" variant="outline" className="rounded-xl gap-2 cursor-pointer px-6">
              Tudj meg többet
            </Button>
          </Link>
        </div>

        {/* Scroll hint */}
        <div
          className="hero-in-4 mt-4 flex flex-col items-center gap-2 opacity-40"
          style={{ animationDelay: "0.8s" }}
        >
          <div className="h-8 w-5 rounded-full border border-foreground/30 flex items-start justify-center p-1">
            <div
              className="h-1.5 w-1 rounded-full bg-foreground/60"
              style={{ animation: "hero-in 1.2s ease-in-out infinite alternate" }}
            />
          </div>
        </div>

      </div>

      {/* ── Alap vignette ── */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 -z-10"
        style={{ background: "linear-gradient(to top, hsl(var(--background)) 0%, transparent 100%)" }}
      />
    </section>
  )
}
