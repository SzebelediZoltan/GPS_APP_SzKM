import { cn } from "@/lib/utils"

type LoadingSpinnerProps = {
  className?: string
  size?: "sm" | "md"
}

export default function LoadingSpinner({
  className,
  size = "md",
}: LoadingSpinnerProps) {
  const sizes = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
  }

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        sizes[size],
        className
      )}
      role="status"
      aria-busy="true"
    >
      {/* ripple kör */}
      <span className="absolute inset-0 rounded-full border border-primary/40 animate-[gpass-ripple_1.25s_ease-out_infinite]" />
      <span className="absolute inset-0 rounded-full border border-primary/40 animate-[gpass-ripple_1.25s_ease-out_infinite] [animation-delay:0.35s]" />

      {/* középső pont */}
      <span className="h-2 w-2 rounded-full bg-primary shadow-sm" />

      <style>{`
        @keyframes gpass-ripple {
          0% {
            transform: scale(0.25);
            opacity: 0.9;
          }
          70% {
            opacity: 0.3;
          }
          100% {
            transform: scale(1.2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
