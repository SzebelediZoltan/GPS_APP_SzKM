import { cn } from "@/lib/utils"

type LoadingPageProps = {
  className?: string
  label?: string
  fullscreen?: boolean
}

export default function LoadingPage({
  className,
  label = "Betöltés...",
  fullscreen = true,
}: LoadingPageProps) {
  return (
    <div
      className={cn(
        fullscreen ? "min-h-[calc(100vh-0px)]" : "w-full",
        "grid place-items-center bg-background text-foreground",
        className
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-4">
        {/* Ripple */}
        <div className="relative h-16 w-16">
          <span className="absolute inset-0 rounded-full border-2 border-primary/35 animate-[gpass-ripple_1.25s_ease-out_infinite]" />
          <span className="absolute inset-0 rounded-full border-2 border-primary/35 animate-[gpass-ripple_1.25s_ease-out_infinite] [animation-delay:0.35s]" />
          <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-sm" />
        </div>

        {/* Optional label */}
        {label ? (
          <p className="text-sm text-muted-foreground">{label}</p>
        ) : null}
      </div>

      {/* Local keyframes (nem kell külön CSS fájlba) */}
      <style>{`
        @keyframes gpass-ripple {
          0% {
            transform: scale(0.2);
            opacity: 0.9;
          }
          70% {
            opacity: 0.25;
          }
          100% {
            transform: scale(1.15);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
