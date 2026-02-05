import { createFileRoute } from "@tanstack/react-router"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export const Route = createFileRoute("/about")({
  component: AboutPage,
})

function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="mb-6 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Rólunk</h1>
        <p className="text-muted-foreground">
          Pár szó a GPASS-ról, hogy mit ad és miért készült.
        </p>
      </div>

      <Card className="rounded-2xl border-border/60 bg-card/60 backdrop-blur">
        <CardHeader>
          <CardTitle>Mi az a GPASS?</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 text-sm text-muted-foreground">
          <p>
            A GPASS egy egyszerűen használható, modern felületű GPS alkalmazás, amelynek célja,
            hogy a navigáció gyors és átlátható legyen. A fejlesztés során arra törekedtünk, hogy
            a felhasználó csak a legfontosabb információkat lássa: merre menjen, mennyi idő van hátra,
            és van-e jobb útvonal.
          </p>

          <p>
            A GPASS a hétköznapi használatra készült: legyen szó munkába járásról, iskoláról, edzésről,
            vagy egy új hely felfedezéséről. Kedvenc helyeket el lehet menteni, így a gyakori úticélokhoz
            egyetlen kattintással indítható a navigáció.
          </p>

          <Separator className="bg-border/70" />

          <div className="space-y-2">
            <h3 className="text-base font-semibold text-foreground">Amit kiemelten fontosnak tartunk</h3>
            <ul className="list-disc space-y-1 pl-5">
              <li>Letisztult, modern megjelenés mobilon és gépen is.</li>
              <li>Átlátható útvonalak és könnyen értelmezhető jelzések.</li>
              <li>Egyszerű funkciók, gyors kezelhetőség, minimális “zaj”.</li>
              <li>Rugalmas alap: később könnyen bővíthető új funkciókkal.</li>
            </ul>
          </div>

          <p>
            A GPASS jelenlegi formájában egy bemutató jellegű alkalmazás, ahol a cél a struktúra,
            a felület és a felhasználói élmény demonstrálása. A későbbi fejlesztések során a térkép,
            útvonaltervezés és profil funkciók tovább bővíthetők.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
