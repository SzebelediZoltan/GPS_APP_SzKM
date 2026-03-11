import { createFileRoute, redirect, Link } from "@tanstack/react-router"
import { useState } from "react"
import {
  ShieldAlert, AlertTriangle, Construction, Eye,
  Info, MapPin, X, Map, Plus, Trash2
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

export const Route = createFileRoute("/dev/markers-prev")({
  beforeLoad: () => {
    if (import.meta.env.PROD) throw redirect({ to: "/" })
  },
  component: MarkersPreviewPage,
})

// ── Marker típusok ──
const MARKER_TYPES = [
  { type: "police",       label: "Rendőr",       icon: ShieldAlert,   color: "#3b82f6", bg: "#1d4ed8", emoji: "👮" },
  { type: "danger",       label: "Veszély",       icon: AlertTriangle, color: "#f59e0b", bg: "#b45309", emoji: "⚠️" },
  { type: "roadblock",    label: "Útlezárás",     icon: Construction,  color: "#ef4444", bg: "#b91c1c", emoji: "🚧" },
  { type: "speedcam",     label: "Sebességmérő",  icon: Eye,           color: "#8b5cf6", bg: "#6d28d9", emoji: "📷" },
  { type: "info",         label: "Egyéb info",    icon: Info,          color: "#6b7280", bg: "#374151", emoji: "ℹ️" },
] as const

type MarkerType = typeof MARKER_TYPES[number]["type"]

type MockMarker = {
  id: string
  type: MarkerType
  lat: number
  lng: number
  note?: string
  createdBy: string
  createdAt: string
}

const MOCK_MARKERS: MockMarker[] = [
  { id: "1", type: "police",    lat: 47.4979, lng: 19.0402, note: "Radar az út jobb oldalán", createdBy: "KovácsPéter", createdAt: "2 perce" },
  { id: "2", type: "danger",    lat: 47.501,  lng: 19.048,  note: "Olaj az úttesten",          createdBy: "NagyAnna",    createdAt: "7 perce" },
  { id: "3", type: "roadblock", lat: 47.495,  lng: 19.035,  note: "Teljes lezárás",            createdBy: "SzabóMáté",   createdAt: "15 perce" },
  { id: "4", type: "speedcam",  lat: 47.503,  lng: 19.055,                                     createdBy: "TóthLili",    createdAt: "32 perce" },
  { id: "5", type: "info",      lat: 47.499,  lng: 19.042,  note: "Parkolóhely szabad",        createdBy: "BaloghÁdám",  createdAt: "1 órája" },
]

// ── Marker ikon ──
function MarkerIcon({ type, size = "md" }: { type: MarkerType; size?: "sm" | "md" | "lg" }) {
  const def = MARKER_TYPES.find((m) => m.type === type)!
  const Icon = def.icon
  const sizeMap = { sm: "w-8 h-8", md: "w-11 h-11", lg: "w-14 h-14" }
  const iconSizeMap = { sm: "w-4 h-4", md: "w-5 h-5", lg: "w-6 h-6" }

  return (
    <div
      className={`${sizeMap[size]} rounded-xl flex items-center justify-center shadow-lg shrink-0`}
      style={{ background: def.bg, border: `2px solid ${def.color}`, boxShadow: `0 0 0 3px ${def.color}33` }}
    >
      <Icon className={`${iconSizeMap[size]} text-white`} />
    </div>
  )
}

// ── Marker popup ──
function MarkerPopup({ marker, onClose }: { marker: MockMarker; onClose: () => void }) {
  const def = MARKER_TYPES.find((m) => m.type === marker.type)!

  return (
    <div className="w-56 rounded-xl border border-border bg-card p-3.5 space-y-3 shadow-2xl shadow-black/30">
      {/* Nyíl */}
      <div className="absolute -bottom-[7px] left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-card border-r border-b border-border" />

      <div className="flex items-center gap-2.5">
        <MarkerIcon type={marker.type} size="sm" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">{def.label}</p>
          <p className="text-[11px] text-muted-foreground">{marker.createdAt} · {marker.createdBy}</p>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer transition">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {marker.note && (
        <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg px-2.5 py-2 leading-relaxed">
          "{marker.note}"
        </p>
      )}

      <div className="flex gap-1.5">
        <button className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-primary px-2 py-1.5 text-[11px] font-semibold text-primary-foreground hover:opacity-90 cursor-pointer transition">
          <MapPin className="w-3 h-3" /> Útvonal ide
        </button>
        <button className="w-8 h-7 flex items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 cursor-pointer transition">
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}

// ── Marker bubble ──
function MarkerBubble({ marker }: { marker: MockMarker }) {
  const [open, setOpen] = useState(false)
  const def = MARKER_TYPES.find((m) => m.type === marker.type)!

  return (
    <div className="relative flex flex-col items-center gap-2">
      {open && (
        <div className="absolute bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 z-50">
          <MarkerPopup marker={marker} onClose={() => setOpen(false)} />
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="relative cursor-pointer"
        style={{ background: "none", border: "none", padding: 0 }}
      >
        <span
          className="absolute inset-0 rounded-xl opacity-30 animate-ping"
          style={{ border: `2px solid ${def.color}` }}
        />
        <MarkerIcon type={marker.type} size="md" />
      </button>
      <span className="text-[10px] font-medium text-muted-foreground">{def.label}</span>
    </div>
  )
}

// ── Placement sheet mock ──
function PlacementSheet({ onClose, onPlace }: { onClose: () => void; onPlace: (t: MarkerType) => void }) {
  const [selected, setSelected] = useState<MarkerType | null>(null)
  const [note, setNote] = useState("")

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end"
      onClick={onClose}
    >
      <div
        className="w-full rounded-t-2xl border-t border-border/80 bg-background/95 backdrop-blur p-4 space-y-4 animate-in slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-1 pb-1">
          <div className="w-9 h-1 rounded-full bg-border" />
        </div>

        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-foreground">Marker lerakása</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {MARKER_TYPES.map((m) => (
            <button
              key={m.type}
              onClick={() => setSelected(m.type)}
              className={`flex flex-col items-center gap-1.5 rounded-xl p-2.5 border transition cursor-pointer ${
                selected === m.type ? "border-primary/50 bg-primary/10" : "border-border/60 bg-card/60 hover:bg-accent/60"
              }`}
            >
              <span className="text-xl">{m.emoji}</span>
              <span className="text-[10px] font-semibold text-center text-muted-foreground leading-tight">{m.label}</span>
            </button>
          ))}
        </div>

        {selected && (
          <div className="space-y-2 animate-in fade-in duration-150">
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Megjegyzés (opcionális)..."
              className="w-full rounded-xl border border-border bg-muted/50 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50"
            />
            <button
              onClick={() => { onPlace(selected); onClose() }}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90 active:scale-95 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Marker lerakása
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Fő oldal ──
function MarkersPreviewPage() {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [placedType, setPlacedType] = useState<MarkerType | null>(null)

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background text-foreground">
      <div className="mx-auto max-w-2xl px-4 py-8 space-y-8">

        {/* Fejléc */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-3 py-1 text-xs text-muted-foreground mb-3">
            <Map className="h-3.5 w-3.5" />
            Dev Preview
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Map Markers</h1>
              <p className="mt-1 text-muted-foreground text-sm">Globális térképes markerek típusonként</p>
            </div>
            <Link to="/dev" className="text-xs text-muted-foreground hover:text-foreground transition">← Vissza</Link>
          </div>
        </div>

        {/* Típus lista */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Marker típusok</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {MARKER_TYPES.map((m) => (
              <div key={m.type} className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/60 px-3 py-3">
                <MarkerIcon type={m.type} size="sm" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{m.label}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">{m.type}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Separator />

        {/* Markerek a rácson */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Markerek térképen — kattints a popuphoz</h2>
          <div
            className="rounded-2xl border border-border/60 relative"
            style={{
              background: "repeating-linear-gradient(0deg, transparent, transparent 39px, hsl(var(--border)/0.4) 39px, hsl(var(--border)/0.4) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, hsl(var(--border)/0.4) 39px, hsl(var(--border)/0.4) 40px)",
            }}
          >
            <div className="flex flex-wrap justify-around items-end gap-10 px-8 pt-48 pb-8">
              {MOCK_MARKERS.map((m) => (
                <MarkerBubble key={m.id} marker={m} />
              ))}
            </div>
          </div>
        </section>

        <Separator />

        {/* Lista */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Marker lista</h2>
          <div className="space-y-2">
            {MOCK_MARKERS.map((m) => {
              const def = MARKER_TYPES.find((t) => t.type === m.type)!
              return (
                <div key={m.id} className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/60 px-3.5 py-3">
                  <MarkerIcon type={m.type} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">{def.label}</p>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 text-muted-foreground">
                        {m.createdAt}
                      </Badge>
                    </div>
                    {m.note && <p className="text-xs text-muted-foreground truncate mt-0.5">"{m.note}"</p>}
                    <p className="text-[10px] text-muted-foreground mt-0.5">{m.createdBy}</p>
                  </div>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-red-500/20 bg-red-500/5 text-red-400/60 hover:bg-red-500/10 hover:text-red-400 cursor-pointer transition shrink-0">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )
            })}
          </div>
        </section>

        <Separator />

        {/* Lerakás sheet */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Marker lerakás sheet</h2>
          <div className="rounded-xl border border-border/60 bg-card/40 p-4 space-y-3">
            <p className="text-xs text-muted-foreground">Élesben: hosszú érintés a térképen → megnyílik. Itt gombbal nyitható.</p>
            {placedType && (
              <div className="flex items-center gap-2 rounded-lg bg-green-500/10 border border-green-500/20 px-3 py-2 text-xs text-green-400 font-semibold">
                ✓ Lerakva: {MARKER_TYPES.find((m) => m.type === placedType)?.label}
              </div>
            )}
            <button
              onClick={() => setSheetOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-primary/10 border border-primary/20 px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary/20 active:scale-95 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Marker lerakás szimulálása
            </button>
          </div>
        </section>

      </div>

      {sheetOpen && (
        <PlacementSheet
          onClose={() => setSheetOpen(false)}
          onPlace={(t) => setPlacedType(t)}
        />
      )}
    </div>
  )
}
