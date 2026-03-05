import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Users, Flag, Copy, AlertTriangle, Route } from "lucide-react"

const highlights = [
  { icon: <Flag className="h-4 w-4 text-amber-400" />, text: "Globális markerrel egyből jelezheted a rendőri ellenőrzést." },
  { icon: <AlertTriangle className="h-4 w-4 text-red-400" />, text: "Baleset, lezárás vagy hiba? Egy koppintás, és mindenki látja." },
  { icon: <Route className="h-4 w-4 text-primary" />, text: "Indíts saját tripet, mentsd el, majd oszd meg bárkivel." },
  { icon: <Copy className="h-4 w-4 text-emerald-400" />, text: "Mások tripjeit lemásolhatod, és ugyanazon az útvonalon haladhatsz." },
]

export default function BentoSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-24">
      <div className="grid gap-4 lg:grid-cols-12">

        {/* Main wide card */}
        <Card className="group relative overflow-hidden rounded-2xl border-border/50 bg-card/60 shadow-sm backdrop-blur lg:col-span-8 hover:border-primary/25 transition-colors duration-300">
          <div
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: "radial-gradient(ellipse at top right, hsl(var(--primary)/0.06) 0%, transparent 60%)" }}
          />

          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-xl font-bold">Több mint egyszerű útvonaltervező</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  A GPASS a mindennapi vezetést közösségi élménnyé emeli.
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Two feature boxes */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="group/box relative overflow-hidden rounded-xl border border-border/50 bg-background/50 p-4 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5">
                <div className="mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <div className="text-sm font-semibold">Élő barát követés</div>
                </div>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  Látszik, merre haladnak a barátaid, így könnyebb együtt mozogni.
                </div>
              </div>

              <div className="group/box relative overflow-hidden rounded-xl border border-border/50 bg-background/50 p-4 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5">
                <div className="mb-2 flex items-center gap-2">
                  <Flag className="h-4 w-4 text-primary" />
                  <div className="text-sm font-semibold">Klán funkcionalitás</div>
                </div>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  Klánban szervezett utak, gyors kommunikáció és áttekinthető mozgás.
                </div>
              </div>
            </div>

            {/* Divider with label */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border/40" />
              <span className="text-xs text-muted-foreground/60 uppercase tracking-widest">Funkciók</span>
              <div className="h-px flex-1 bg-border/40" />
            </div>

            {/* Highlight bullets */}
            <div className="grid gap-2.5 sm:grid-cols-2">
              {highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl border border-border/30 bg-background/30 px-3 py-2.5 text-sm text-muted-foreground">
                  <span className="mt-0.5 shrink-0">{h.icon}</span>
                  <span className="leading-relaxed">{h.text}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Side narrow card */}
        <Card className="group relative overflow-hidden rounded-2xl border-border/50 bg-card/60 shadow-sm backdrop-blur lg:col-span-4 hover:border-primary/25 transition-colors duration-300">
          <div
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: "radial-gradient(ellipse at bottom left, hsl(var(--primary)/0.07) 0%, transparent 60%)" }}
          />

          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold">Minden egy helyen</CardTitle>
            <p className="text-sm text-muted-foreground">
              Navigáció, közösség, biztonsági jelzések.
            </p>
          </CardHeader>

          <CardContent className="space-y-3">
            {[
              { num: "01", text: "Új útvonal két lépéssel: célpont, majd indulhatsz." },
              { num: "02", text: "A közösség valós időben segíti egymást marker jelzésekkel." },
              { num: "03", text: "Saját és másolt tripjeid bármikor újraindíthatod." },
            ].map((item) => (
              <div
                key={item.num}
                className="flex items-start gap-3 rounded-xl border border-border/40 bg-background/40 p-4 transition-all duration-200 hover:border-primary/25 hover:bg-primary/5"
              >
                <span className="text-xs font-black text-primary/40 mt-0.5 shrink-0 font-mono">{item.num}</span>
                <span className="text-sm text-muted-foreground leading-relaxed">{item.text}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
