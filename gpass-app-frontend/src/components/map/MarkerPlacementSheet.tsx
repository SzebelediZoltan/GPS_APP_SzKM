import { useState } from "react"
import {
  ShieldAlert, Car, AlertTriangle, Construction,
  Camera, CircleAlert, HelpCircle, X
} from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { MarkerType } from "@/hooks/map/useMarkers"

// ── Marker típus opciók ──

const MARKER_OPTIONS: {
  type: MarkerType
  label: string
  desc: string
  color: string
  icon: React.ReactNode
}[] = [
  { type: "police",    label: "Rendőri ellenőrzés", desc: "Traffipax, igazoltatás",    color: "#3b82f6", icon: <ShieldAlert className="h-5 w-5" /> },
  { type: "accident",  label: "Baleset",            desc: "Ütközés, sérültek",         color: "#ef4444", icon: <Car className="h-5 w-5" /> },
  { type: "danger",    label: "Veszély",            desc: "Csúszós út, törmelék",      color: "#f97316", icon: <AlertTriangle className="h-5 w-5" /> },
  { type: "roadblock", label: "Útlezárás",          desc: "Lezárt út, terelés",        color: "#eab308", icon: <Construction className="h-5 w-5" /> },
  { type: "speedtrap", label: "Sebességmérő",       desc: "Fix vagy mobil kamera",     color: "#8b5cf6", icon: <Camera className="h-5 w-5" /> },
  { type: "traffic",   label: "Forgalomtorlódás",   desc: "Lassú haladás, dugó",       color: "#f59e0b", icon: <CircleAlert className="h-5 w-5" /> },
  { type: "other",     label: "Egyéb",              desc: "Más figyelmet igénylő dolog", color: "#64748b", icon: <HelpCircle className="h-5 w-5" /> },
]

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
  onConfirm: (type: MarkerType) => void
  isPlacing: boolean
}

export default function MarkerPlacementSheet({ open, onOpenChange, onConfirm, isPlacing }: Props) {
  const [selected, setSelected] = useState<MarkerType | null>(null)

  const handleConfirm = () => {
    if (!selected) return
    onConfirm(selected)
    setSelected(null)
  }

  const handleClose = () => {
    setSelected(null)
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className="z-1200 rounded-t-2xl border-t border-border/80 bg-background/95 backdrop-blur px-0"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 1rem)" }}
      >
        {/* Húzó sáv */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-9 h-1 rounded-full bg-border" />
        </div>

        <SheetHeader className="px-4 pb-3">
          <SheetTitle className="flex items-center justify-between">
            <span>Milyen jelzést raksz le?</span>
            <button
              onClick={handleClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </SheetTitle>
        </SheetHeader>

        {/* Típus választó grid */}
        <div className="px-4 grid grid-cols-2 gap-2 max-h-[50dvh] overflow-y-auto pb-1">
          {MARKER_OPTIONS.map((opt) => (
            <button
              key={opt.type}
              onClick={() => setSelected(opt.type)}
              className={cn(
                "flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all cursor-pointer",
                selected === opt.type
                  ? "border-primary/50 bg-primary/10"
                  : "border-border/60 bg-card/60 hover:bg-accent"
              )}
            >
              <span
                className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
                style={{
                  background: selected === opt.type ? `${opt.color}22` : "hsl(var(--background)/0.6)",
                  border: `2px solid ${selected === opt.type ? opt.color : "hsl(var(--border)/0.6)"}`,
                  color: opt.color,
                }}
              >
                {opt.icon}
              </span>
              <div className="min-w-0">
                <p className={cn(
                  "text-sm font-semibold leading-tight",
                  selected === opt.type ? "text-primary" : "text-foreground"
                )}>
                  {opt.label}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                  {opt.desc}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Megerősítés gomb */}
        <div className="px-4 pt-3">
          <Button
            className="w-full rounded-xl cursor-pointer"
            disabled={!selected || isPlacing}
            onClick={handleConfirm}
          >
            {isPlacing ? "Lerakás..." : "Jelzés lerakása"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
