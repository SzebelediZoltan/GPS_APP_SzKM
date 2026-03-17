import { ArrowRight, MapPin, Users, Copy, Navigation, ShieldAlert } from "lucide-react"
import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"

// Avatar komponens kezdőbetűkkel
function Avatar({ initials, color }: { initials: string; color: string }) {
  return (
    <div
      className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-black text-white ring-2 ring-background shrink-0"
      style={{ background: color }}
    >
      {initials}
    </div>
  )
}

const friends = [
  { initials: "ÁK", color: "#3b82f6", name: "Ádám K.", status: "8 km-re", active: true },
  { initials: "NB", color: "#8b5cf6", name: "Nóra B.", status: "2 km-re", active: true },
  { initials: "PT", color: "#10b981", name: "Péter T.", status: "Offline", active: false },
]

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden">
      <style>{`
        @keyframes hero-fade-up {
          from { opacity: 0; transform: translateY(22px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes hero-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes ping-dot {
          0% { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(2.8); opacity: 0; }
        }
        @keyframes dash-move {
          to { stroke-dashoffset: -18; }
        }
        @keyframes float-card {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-7px); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .hf1 { animation: hero-fade-up 0.55s 0.00s ease forwards; opacity: 0; }
        .hf2 { animation: hero-fade-up 0.55s 0.10s ease forwards; opacity: 0; }
        .hf3 { animation: hero-fade-up 0.55s 0.20s ease forwards; opacity: 0; }
        .hf4 { animation: hero-fade-up 0.55s 0.30s ease forwards; opacity: 0; }
        .hf5 { animation: hero-fade-up 0.55s 0.40s ease forwards; opacity: 0; }
        .hfr  { animation: hero-fade-in 0.8s 0.55s ease forwards; opacity: 0; }
        .card-float { animation: float-card 5s ease-in-out infinite; }
        .route-anim { animation: dash-move 1.4s linear infinite; }
        .live-blink { animation: blink 2s ease-in-out infinite; }
      `}</style>

      {/* Subtle grid */}
      <div className="pointer-events-none fixed inset-0 -z-10"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)/0.025) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)/0.025) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow */}
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-125 w-175"
          style={{ background: "radial-gradient(ellipse at top, hsl(var(--primary)/0.12) 0%, transparent 65%)", filter: "blur(60px)" }}
        />
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 pt-16 pb-16">
        <div className="grid items-center gap-16 lg:grid-cols-2">

          {/* ── LEFT ── */}
          <div className="space-y-7">
            <div className="hf1">
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-4 py-1.5 text-xs font-semibold text-foreground/60 tracking-widest uppercase backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70" style={{ animation: "ping-dot 2s ease-out infinite" }} />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                Új generációs GPS platform
              </span>
            </div>

            <div className="hf2 space-y-2">
              <h1 className="text-6xl font-black tracking-tight sm:text-7xl lg:text-8xl leading-none">
                GPASS
              </h1>
              <p className="text-xl font-medium text-muted-foreground sm:text-2xl leading-snug">
                A navigáció, ami{" "}
                <span className="text-foreground font-bold">közösségben gondolkodik</span>
              </p>
            </div>

            <p className="hf3 max-w-lg text-base text-muted-foreground leading-relaxed">
              Tervezz útvonalat, nézd az élő barátokat, csatlakozz a klanodhoz, és jelölj
              globális markerrel minden fontos helyzetet az utakon.
            </p>

            <div className="hf4 flex flex-wrap gap-3">
              <Button asChild size="lg" className="group px-8 font-semibold shadow-lg shadow-primary/20">
                <Link to="/map">
                  Próbáld ki most
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-border/60 hover:bg-accent/50">
                <Link to="/auth/register">Regisztráció</Link>
              </Button>
            </div>

            <div className="hf5 flex flex-wrap gap-3 pt-1">
              {[
                { icon: <Users className="h-3.5 w-3.5" />, label: "Élő barát követés" },
                { icon: <MapPin className="h-3.5 w-3.5" />, label: "Globális markerek" },
                { icon: <Copy className="h-3.5 w-3.5" />, label: "Trip másolás" },
              ].map((s) => (
                <span key={s.label} className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-card/50 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur">
                  <span className="text-primary">{s.icon}</span>
                  {s.label}
                </span>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Kártya ── */}
          <div className="hfr hidden lg:block">
            <div className="card-float relative">
              {/* Outer glow */}
              <div className="absolute -inset-6 rounded-3xl opacity-40"
                style={{ background: "radial-gradient(ellipse at center, hsl(var(--primary)/0.3) 0%, transparent 65%)", filter: "blur(28px)" }}
              />

              <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/95 shadow-2xl backdrop-blur-xl"
                style={{ boxShadow: "0 0 0 1px hsl(var(--primary)/0.1), 0 32px 64px -16px rgba(0,0,0,0.5)" }}
              >

                {/* ── Header ── */}
                <div className="flex items-center justify-between border-b border-border/40 bg-background/60 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Navigation className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs font-bold tracking-wider uppercase text-foreground/80">Aktív útvonal</span>
                  </div>
                  <div className="flex items-center gap-1.5 live-blink">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[11px] font-semibold text-emerald-400">LIVE</span>
                  </div>
                </div>

                {/* ── Térkép vizuál ── */}
                <div className="relative h-40 overflow-hidden"
                  style={{ background: "linear-gradient(160deg, hsl(220,22%,9%) 0%, hsl(222,18%,12%) 100%)" }}
                >
                  {/* Grid */}
                  <svg className="absolute inset-0 w-full h-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="hgrid" width="36" height="36" patternUnits="userSpaceOnUse">
                        <path d="M 36 0 L 0 0 0 36" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.8"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#hgrid)" />
                  </svg>

                  {/* Utcák */}
                  <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 0 100 Q 100 60 180 80 T 420 72" stroke="hsl(var(--foreground)/0.08)" strokeWidth="10" fill="none" strokeLinecap="round"/>
                    <path d="M 80 0 Q 100 50 110 100 T 130 165" stroke="hsl(var(--foreground)/0.06)" strokeWidth="7" fill="none" strokeLinecap="round"/>
                    <path d="M 260 0 L 270 165" stroke="hsl(var(--foreground)/0.05)" strokeWidth="5" fill="none"/>
                    {/* Aktív route */}
                    <path
                      d="M 48 138 Q 120 60 230 78 T 390 66"
                      stroke="hsl(var(--primary))"
                      strokeWidth="2.5"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray="9 5"
                      className="route-anim"
                    />
                    {/* Route glow */}
                    <path
                      d="M 48 138 Q 120 60 230 78 T 390 66"
                      stroke="hsl(var(--primary)/0.25)"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>

                  {/* Start pin */}
                  <div className="absolute bottom-6 left-10 flex flex-col items-center gap-1">
                    <div className="rounded-md bg-background/80 px-2 py-0.5 text-[9px] font-bold backdrop-blur border border-border/40 text-foreground/70">START</div>
                    <div className="h-6 w-6 rounded-full bg-primary shadow-lg shadow-primary/50 flex items-center justify-center ring-2 ring-primary/30">
                      <MapPin className="h-3 w-3 text-primary-foreground" />
                    </div>
                  </div>

                  {/* Cél pin */}
                  <div className="absolute top-4 right-14 flex flex-col items-center gap-1">
                    <div className="h-6 w-6 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50 flex items-center justify-center ring-2 ring-emerald-500/30">
                      <MapPin className="h-3 w-3 text-white" />
                    </div>
                    <div className="rounded-md bg-background/80 px-2 py-0.5 text-[9px] font-bold backdrop-blur border border-border/40 text-foreground/70">CÉL</div>
                  </div>

                  {/* Danger marker */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="relative h-5 w-5 rounded-full bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/40">
                      <ShieldAlert className="h-2.5 w-2.5 text-white" />
                      <span className="absolute inset-0 rounded-full border border-amber-400/50 animate-ping" style={{ animationDuration: "2.5s" }} />
                    </div>
                  </div>
                </div>

                {/* ── Barátok a térképen ── */}
                <div className="border-t border-border/40 px-4 py-3">
                  <p className="mb-2.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Barátok most</p>
                  <div className="space-y-2">
                    {friends.map((f) => (
                      <div key={f.initials} className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <Avatar initials={f.initials} color={f.color} />
                          <span className="text-xs font-medium">{f.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {f.active && (
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          )}
                          <span className={`text-[11px] ${f.active ? "text-emerald-400" : "text-muted-foreground/40"}`}>
                            {f.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Értesítés ── */}
                <div className="border-t border-border/40 px-4 py-3">
                  <div className="flex items-center gap-2.5 rounded-xl bg-amber-500/8 border border-amber-500/20 px-3 py-2">
                    <ShieldAlert className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                    <span className="text-xs text-foreground/80">Rendőri ellenőrzés — Hungária krt.</span>
                    <span className="ml-auto text-[10px] text-muted-foreground shrink-0">2p</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
