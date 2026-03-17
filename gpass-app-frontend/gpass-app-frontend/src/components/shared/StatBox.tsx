export function StatBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-2xl border border-border/60 bg-background/40 px-3 py-4 text-center">
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-xl font-bold leading-none">{value}</span>
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
    </div>
  )
}
