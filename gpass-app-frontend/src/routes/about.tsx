import { createFileRoute, Link } from "@tanstack/react-router"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { MapPin, Compass, Star, Mail } from "lucide-react"
import CountUp from "@/components/CountUp"

export const Route = createFileRoute("/about")({
  component: AboutPage,
})

function AboutPage() {
  return (
    <main className="relative min-h-[calc(100vh-64px)] bg-background text-foreground overflow-hidden">

      {/* Glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.15),transparent_70%)] blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 py-16">

        {/* HERO */}
        <div className="mb-16 text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Navigáció egyszerűen.
          </h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            A GPASS célja, hogy a navigáció gyors és átlátható élmény legyen.
          </p>

          <Button asChild size="lg" className="rounded-xl">
            <Link to="/contact">
              <Mail className="mr-2 h-4 w-4" />
              Kapcsolat
            </Link>
          </Button>
        </div>

        <Separator className="mb-16" />

        {/* FEATURES */}
        <div className="grid gap-6 md:grid-cols-3 mb-20">
          <Card className="rounded-2xl bg-card/60 backdrop-blur hover:shadow-lg transition">
            <CardContent className="p-6 space-y-3">
              <MapPin className="h-6 w-6 text-primary" />
              <h3 className="font-semibold">Gyors navigáció</h3>
              <p className="text-sm text-muted-foreground">
                Egyértelmű útvonalak, gyors döntéshozatal.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl bg-card/60 backdrop-blur hover:shadow-lg transition">
            <CardContent className="p-6 space-y-3">
              <Star className="h-6 w-6 text-primary" />
              <h3 className="font-semibold">Kedvencek</h3>
              <p className="text-sm text-muted-foreground">
                Gyakori helyek mentése egy kattintással.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl bg-card/60 backdrop-blur hover:shadow-lg transition">
            <CardContent className="p-6 space-y-3">
              <Compass className="h-6 w-6 text-primary" />
              <h3 className="font-semibold">Modern design</h3>
              <p className="text-sm text-muted-foreground">
                Letisztult felület mobilon és desktopon.
              </p>
            </CardContent>
          </Card>
        </div>

        <Separator className="mb-16" />

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Gyakori kérdések
          </h2>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                Ingyenes a GPASS?
              </AccordionTrigger>
              <AccordionContent>
                Igen, a jelenlegi verzió bemutató jellegű és teljesen ingyenes.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>
                Hogyan menthetek el egy helyet?
              </AccordionTrigger>
              <AccordionContent>
                A navigáció során egyetlen gombnyomással hozzáadhatod
                a kedvencekhez.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>
                Lesz mobil alkalmazás is?
              </AccordionTrigger>
              <AccordionContent>
                A későbbi fejlesztések között szerepel a mobil optimalizáció
                és akár natív alkalmazás készítése is.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

      </div>
    </main>
  )
}