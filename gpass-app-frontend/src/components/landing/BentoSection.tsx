import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Bullet } from "./landing-ui"

export default function BentoSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16">
      <div className="grid gap-4 lg:grid-cols-12">
        <Card className="rounded-2xl border-border/70 bg-card/70 shadow-sm backdrop-blur lg:col-span-8">
          <CardHeader>
            <CardTitle className="text-lg">Tobb mint egyszeru utvonaltervezo</CardTitle>
            <p className="text-sm text-muted-foreground">
              GPASS a mindennapi vezetest kozossegi elmenynye emeli.
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border/70 bg-background/50 p-4">
                <div className="text-sm font-medium">Elo barat kovetes</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Latszik, merre haladnak a barataid, igy konnyebb egyutt mozogni.
                </div>
              </div>

              <div className="rounded-xl border border-border/70 bg-background/50 p-4">
                <div className="text-sm font-medium">Klan funkcionalitas</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Klanban szervezett utak, gyors kommunikacio es atlatheto mozgas.
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid gap-3 sm:grid-cols-2">
              <Bullet text="Globalis markerrel egybol jelezheted a rendori ellenorzest." />
              <Bullet text="Baleset, lezaras vagy hiba? Egy koppintas, es mindenki latja." />
              <Bullet text="Indits sajat tripet, mentsd el, majd oszd meg barkivel." />
              <Bullet text="Masok tripjeit lemashatod, es ugyanazon az utvonalon haladhatsz." />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 bg-card/70 shadow-sm backdrop-blur lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-lg">Minden egy helyen</CardTitle>
            <p className="text-sm text-muted-foreground">
              Navigacio, kozosseg, biztonsagi jelzesek.
            </p>
          </CardHeader>

          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="rounded-xl border border-border/70 bg-background/50 p-3">
              Uj utvonal ket lepessel: celpont, majd indulhatsz.
            </div>
            <div className="rounded-xl border border-border/70 bg-background/50 p-3">
              A kozosseg valos idoben segiti egymast marker jelzesekkel.
            </div>
            <div className="rounded-xl border border-border/70 bg-background/50 p-3">
              Sajat es masolt tripjeid barmikor ujraindithatod.
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
