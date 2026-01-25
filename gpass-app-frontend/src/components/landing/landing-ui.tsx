import React from "react"
import { Check } from "lucide-react"

export function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card/50 p-3 shadow-sm backdrop-blur">
      <div className="text-xl font-semibold tracking-tight">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  )
}

export function MiniPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-xl border border-border/70 bg-background/50 px-3 py-2 text-xs text-muted-foreground">
      <span className="text-foreground">{icon}</span>
      <span>{label}</span>
    </div>
  )
}

export function Bullet({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-md border border-border/70 bg-background/60">
        <Check className="h-3.5 w-3.5 text-foreground" />
      </span>
      <span className="text-sm text-muted-foreground">{text}</span>
    </div>
  )
}
