import { createFileRoute, Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Compass,
  Mail,
  MapPinned,
  ShieldAlert,
  Users,
  RouteIcon,
  Zap,
  ArrowRight,
  Sparkles,
} from "lucide-react"

export const Route = createFileRoute("/about")({
  component: AboutPage,
})

const features = [
  {
    icon: <MapPinned className="h-5 w-5" />,
    title: "Navigáció újragondolva",
    desc: "Gyors útvonaltervezés, alternatív lehetőségek és tiszta előnézet — minden egyben.",
  },
  {
    icon: <Users className="h-5 w-5" />,
    title: "Barátok és klánok",
    desc: "Kövessétek egymást a térképen, és mozogjatok összhangban valós időben.",
  },
  {
    icon: <ShieldAlert className="h-5 w-5" />,
    title: "Globális markerek",
    desc: "Rendőri ellenőrzés, lezárás, baleset — egy koppintás, és mindenki látja.",
  },
  {
    icon: <Sparkles className="h-5 w-5" />,
    title: "AI asszisztens",
    desc: "Kérdezz az útvonalról, keress benzinkutat, éttermet vagy ATM-et menetközben.",
  },
  {
    icon: <RouteIcon className="h-5 w-5" />,
    title: "Alternatív útvonalak",
    desc: "Válassz a leggyorsabb, legrövidebb vagy legkényelmesebb útvonal között.",
  },
  {
    icon: <Zap className="h-5 w-5" />,
    title: "Valós idejű frissítés",
    desc: "A térkép és a barátaid helyzete folyamatosan frissül, lemaradás nélkül.",
  },
]

const values = [
  { num: "01", title: "Közösség", desc: "Az út jobb, ha nem egyedül teszed meg." },
  { num: "02", title: "Egyszerűség", desc: "Egy tap a jelzéshez. Két tap az útvonalhoz." },
  { num: "03", title: "Átláthatóság", desc: "Semmi felesleges. Csak ami az úton számít." },
]

function AboutPage() {
  return (
    <main className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-background text-foreground">

      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-125 w-175"
          style={{ background: "radial-gradient(ellipse at top, hsl(var(--primary)/0.1) 0%, transparent 65%)", filter: "blur(60px)" }}
        />
      </div>
      <div className="pointer-events-none fixed inset-0 -z-10"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)/0.025) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)/0.025) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="mx-auto w-full max-w-6xl px-4 py-20">

        {/* ── HERO ── */}
        <div className="mb-24 space-y-6 max-w-3xl">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary">Rólunk</span>
          <h1 className="text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl leading-none">
            A GPS app,<br />
            <span className="text-muted-foreground/40">ami a közösség</span><br />
            erejét is használja
          </h1>
          <p className="max-w-xl text-base text-muted-foreground leading-relaxed sm:text-lg">
            A GPASS nem csak odavezet. Összeköt, figyelmeztet és segít jobban szervezni az utakat — közösen.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild size="lg" className="group font-semibold shadow-lg shadow-primary/20">
              <Link to="/map">
                Térkép megnyitása
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-border/60">
              <Link to="/contact">
                <Mail className="mr-2 h-4 w-4" />
                Kapcsolat
              </Link>
            </Button>
          </div>
        </div>

        {/* ── VALUES ── */}
        <div className="mb-24">
          <div className="mb-10 space-y-2">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary">Értékeink</span>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Miben hiszünk</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {values.map((v) => (
              <div
                key={v.num}
                className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/60 p-6 backdrop-blur transition-all duration-300 hover:border-primary/30 hover:bg-card/80"
              >
                <div className="pointer-events-none absolute -right-3 -top-4 text-8xl font-black text-foreground/3 select-none group-hover:text-foreground/5 transition-all duration-300">
                  {v.num}
                </div>
                <p className="mb-1 text-xs font-bold text-primary tracking-widest uppercase">{v.num}</p>
                <h3 className="mb-2 text-xl font-bold">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── FEATURES ── */}
        <div className="mb-24">
          <div className="mb-10 space-y-2">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary">Képességek</span>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Mit tud a GPASS?
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <Card
                key={f.title}
                className="group relative overflow-hidden rounded-2xl border-border/50 bg-card/60 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10"
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: "radial-gradient(ellipse at top left, hsl(var(--primary)/0.07) 0%, transparent 60%)" }}
                />
                <div className="pointer-events-none absolute -right-2 -top-4 text-8xl font-black text-foreground/2.5 select-none">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <CardContent className="relative p-6 space-y-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border/60 bg-background/70 text-primary transition-all duration-300 group-hover:border-primary/40 group-hover:bg-primary/10">
                    {f.icon}
                  </div>
                  <h3 className="font-bold text-base">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* ── STORY ── */}
        <div className="mb-24">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-5">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary">A történet</span>
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl leading-tight">
                Miért született<br />
                <span className="text-muted-foreground/50">a GPASS?</span>
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  A navigációs appok ma már nagyon jók — de mindegyik egyedül használja az embert. Nincs közösség, nincs valós idejű együttműködés, nincs lehetőség arra, hogy <span className="text-foreground font-medium">együtt legyünk az úton</span>.
                </p>
                <p>
                  A GPASS ezt akarja megoldani. Egy olyan platform, ahol a barátaid helyzete látható, a közösség jelzi a veszélyeket, és az AI asszisztens segít a legjobb döntések meghozatalában — mindenki profitál a többiek tudásából.
                </p>
              </div>
            </div>

            {/* Visual accent */}
            <div className="relative hidden lg:flex items-center justify-center">
              <div className="absolute inset-0 rounded-3xl"
                style={{ background: "radial-gradient(ellipse at center, hsl(var(--primary)/0.15) 0%, transparent 65%)", filter: "blur(40px)" }}
              />
              <div className="relative grid grid-cols-2 gap-3 p-6">
                {[
                  { icon: <Compass className="h-6 w-6 text-primary" />, label: "Navigáció" },
                  { icon: <Users className="h-6 w-6 text-primary" />, label: "Közösség" },
                  { icon: <ShieldAlert className="h-6 w-6 text-amber-400" />, label: "Biztonság" },
                  { icon: <Sparkles className="h-6 w-6 text-emerald-400" />, label: "AI" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col items-center gap-3 rounded-2xl border border-border/50 bg-card/70 p-6 backdrop-blur shadow-sm"
                  >
                    {item.icon}
                    <span className="text-sm font-semibold">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── CTA SÁV ── */}
        <div
          className="relative overflow-hidden rounded-3xl border border-primary/20 bg-card/80 px-8 py-14 sm:px-12 backdrop-blur shadow-2xl"
          style={{ boxShadow: "0 0 0 1px hsl(var(--primary)/0.08), 0 24px 48px -12px rgba(0,0,0,0.4)" }}
        >
          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)", filter: "blur(50px)" }}
          />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2 max-w-lg">
              <h3 className="text-2xl font-black sm:text-3xl">
                Készen állsz az útra?
                <span className="block text-primary">Csatlakozz a közösséghez.</span>
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Lépj kapcsolatba, regisztrálj, és indulj el a GPASS-szal.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="group font-semibold shadow-lg shadow-primary/20">
                <Link to="/auth/register">
                  Regisztráció
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-border/60">
                <Link to="/contact">
                  <Mail className="mr-2 h-4 w-4" />
                  Kapcsolat
                </Link>
              </Button>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}
