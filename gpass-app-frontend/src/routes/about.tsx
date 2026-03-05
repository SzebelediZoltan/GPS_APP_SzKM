import { createFileRoute, Link } from "@tanstack/react-router"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Compass, Mail, MapPinned, ShieldAlert, Users, Copy } from "lucide-react"

export const Route = createFileRoute("/about")({
  component: AboutPage,
})

function AboutPage() {
  return (
    <main className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-44 left-1/2 h-112 w-md -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.16),transparent_70%)] blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 py-16">
        <div className="mb-14 space-y-4 text-center">
          <Badge variant="secondary" className="mx-auto w-fit">
            About GPASS
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            A GPS app, ami a kozosseg erejet is hasznalja
          </h1>
          <p className="mx-auto max-w-3xl text-muted-foreground">
            A GPASS nem csak odavezet. Osszekot, figyelmeztet es segit jobban szervezni az utakat.
          </p>
          <div className="flex justify-center">
            <Button asChild size="lg" className="rounded-xl">
              <Link to="/contact">
                <Mail className="mr-2 h-4 w-4" />
                Lepj velunk kapcsolatba
              </Link>
            </Button>
          </div>
        </div>

        <div className="mb-14 grid gap-4 md:grid-cols-3">
          <Card className="rounded-2xl border-border/70 bg-card/70 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPinned className="h-5 w-5 text-primary" />
                Navigacio ujragondolva
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Gyors utvonaltervezes, alternativ lehetosegek, tiszta elonezet.
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/70 bg-card/70 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-5 w-5 text-primary" />
                Baratok es klanok
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Kovessetek egymast a terkepen, es mozogjatok osszhangban.
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/70 bg-card/70 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldAlert className="h-5 w-5 text-primary" />
                Globalis markerhalozat
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Jelold a rendort, utlezarast vagy veszelyt, hogy masok is keszulhessenek.
            </CardContent>
          </Card>
        </div>

        <Separator className="mb-14" />

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="rounded-2xl border-border/70 bg-card/70 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Compass className="h-5 w-5 text-primary" />
                GPASS elmeny
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="rounded-xl border border-border/70 bg-background/50 p-3">
                Tervezz gyorsabban, donts magabiztosabban.
              </div>
              <div className="rounded-xl border border-border/70 bg-background/50 p-3">
                Latszik, hol vannak a barataid, es merre tart a klanod.
              </div>
              <div className="rounded-xl border border-border/70 bg-background/50 p-3">
                A jelzesekkel egy biztonsagosabb kozos terkeprendszert epitesz.
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/70 bg-card/70 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Copy className="h-5 w-5 text-primary" />
                Gyakori kerdesek
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="a1">
                  <AccordionTrigger>Hogyan mukodik a trip masolas?</AccordionTrigger>
                  <AccordionContent>
                    Elmented a sajat utad, megosztod, masok pedig ugyanazon az utvonalon indulhatnak.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="a2">
                  <AccordionTrigger>Kik latjak a marker jelzeseimet?</AccordionTrigger>
                  <AccordionContent>
                    A globalis terkeprol minden aktiv felhasznalo latja az aktualis jelzeseket.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="a3">
                  <AccordionTrigger>Mire jo a klan funkcio?</AccordionTrigger>
                  <AccordionContent>
                    Klanban konnyebb kozos utakat szervezni, kovetni es egy helyen tartani az informaciot.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
