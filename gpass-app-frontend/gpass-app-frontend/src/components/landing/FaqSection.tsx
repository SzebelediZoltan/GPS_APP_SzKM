import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    q: "Hogyan segít a GPASS a mindennapokban?",
    a: "Gyorsan mutat útvonalat, választhatsz alternatívát, és menet közben is tiszta marad a kép.",
  },
  {
    q: "Mi az a globális marker?",
    a: "Egy közösségi jelzés a térképen, amivel jelezheted például a rendőri ellenőrzést vagy útlezárást.",
  },
  {
    q: "Hogyan működik a trip mentés és másolás?",
    a: "Elmented a saját utadat, megosztod, mások pedig egy koppintással ugyanazt az útvonalat követhetik.",
  },
  {
    q: "Miben különleges a klán rendszer?",
    a: "A klanod tagjaival egy térképen maradtok, és könnyebb együtt utazni vagy találkozni.",
  },
]

export default function FaqSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-24" id="faq">
      <div className="grid gap-16 lg:grid-cols-2 items-start">

        {/* Left: header */}
        <div className="space-y-4 lg:sticky lg:top-28">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary">FAQ</span>
          <h2 className="text-4xl font-black tracking-tight sm:text-5xl leading-none">
            Gyakori<br />
            <span className="text-muted-foreground/50">kérdések</span>
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed max-w-sm">
            Minden, amit érdemes tudni indulás előtt.
          </p>

          {/* Decorative element */}
          <div className="pt-4 hidden lg:block">
            <div className="flex flex-col gap-2">
              {[60, 40, 50].map((w, i) => (
                <div
                  key={i}
                  className="h-1 rounded-full bg-primary/20"
                  style={{ width: `${w}%` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right: accordion */}
        <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur overflow-hidden">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border-b border-border/40 last:border-0 px-6 transition-colors"
              >
                <AccordionTrigger className="py-5 text-sm font-semibold text-left hover:no-underline hover:text-primary transition-colors">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm text-muted-foreground leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

      </div>
    </section>
  )
}
