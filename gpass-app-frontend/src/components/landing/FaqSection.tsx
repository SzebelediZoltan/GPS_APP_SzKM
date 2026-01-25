import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function FaqSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16" id="faq">
      <Card className="rounded-2xl border-border/60 bg-card/60 shadow-sm backdrop-blur">
        <CardHeader className="space-y-2">
          <Badge variant="outline" className="w-fit border-border/70">
            FAQ
          </Badge>
          <CardTitle className="text-lg">Gyakori kérdések</CardTitle>
          <p className="text-sm text-muted-foreground">
            Rövid válaszok a legfontosabb dolgokra.
          </p>
        </CardHeader>

        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Milyen eszközökön működik?</AccordionTrigger>
              <AccordionContent>
                Telefonon és asztali böngészőben is kényelmesen használható, reszponzív elrendezéssel.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>Van alternatív útvonal?</AccordionTrigger>
              <AccordionContent>
                Igen, több útvonal opció közül választhatsz, a helyzetedhez igazítva.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>Kapok forgalmi jelzéseket?</AccordionTrigger>
              <AccordionContent>
                Igen, a felület jelzi a fontosabb torlódásokat és a várható késéseket.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>Menthetek kedvenc helyeket?</AccordionTrigger>
              <AccordionContent>
                Igen, a gyakori úti célokat elmentheted, és gyorsan indíthatod a navigációt.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </section>
  )
}
