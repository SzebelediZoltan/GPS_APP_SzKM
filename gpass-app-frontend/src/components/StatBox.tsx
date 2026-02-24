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
    <div className="rounded-2xl border border-border/60 bg-background/40 px-3 py-3">
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="text-xs">{label}</span>
        <span className="opacity-80">{icon}</span>
      </div>
      <div className="mt-1 text-xl font-semibold">{value}</div>
    </div>
  )
}
