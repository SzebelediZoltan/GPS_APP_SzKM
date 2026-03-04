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
      <Card className="rounded-2xl border-border/70 bg-card/70 shadow-sm backdrop-blur">
        <CardHeader className="space-y-2">
          <Badge variant="outline" className="w-fit border-border/70">
            FAQ
          </Badge>
          <CardTitle className="text-lg">Gyakori kerdesek</CardTitle>
          <p className="text-sm text-muted-foreground">
            Minden, amit erdemes tudni indulas elott.
          </p>
        </CardHeader>

        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Hogyan segit a GPASS a mindennapokban?</AccordionTrigger>
              <AccordionContent>
                Gyorsan mutat utvonalat, valaszthatsz alternativat, es menet kozben is tiszta marad a kep.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>Mi az a globalis marker?</AccordionTrigger>
              <AccordionContent>
                Egy kozossegi jelzes a terkepen, amivel jelezheted peldaul a rendori ellenorzest vagy utlezarast.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>Hogyan mukodik a trip mentes es masolas?</AccordionTrigger>
              <AccordionContent>
                Elmented a sajat utadat, megosztod, masok pedig egy koppintassal ugyanazt az utvonalat kovethetik.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>Miben kulonleges a klan rendszer?</AccordionTrigger>
              <AccordionContent>
                A klanod tagjaival egy terkepen maradtok, es konnyebb egyutt utazni vagy talalkozni.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </section>
  )
}
