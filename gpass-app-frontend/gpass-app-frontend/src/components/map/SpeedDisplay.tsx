import { useSpeedLimit } from "@/hooks/map/useSpeedLimit"

type Props = {
  position: { lat: number; lng: number } | null
  speed: number | null
}

export default function SpeedDisplay({ position, speed }: Props) {
  const speedLimit = useSpeedLimit(position)

  const kmh = speed !== null ? Math.round(speed * 3.6) : 0
  const isSpeeding = speedLimit !== null && kmh > speedLimit

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-1000 flex items-end justify-between px-4 pb-[calc(4rem+0.9rem)]">
      <div className="pointer-events-auto">
        <div className={`
          relative flex flex-col items-center justify-center
          w-16 h-16 rounded-2xl border-2 shadow-lg shadow-black/30
          transition-colors duration-300
          ${isSpeeding ? "bg-red-500 border-red-400" : "bg-card border-border"}
        `}>
          <span className={`text-2xl font-black leading-none tabular-nums ${isSpeeding ? "text-white" : "text-foreground"}`}>
            {kmh}
          </span>
          <span className={`text-[10px] font-semibold leading-none mt-0.5 ${isSpeeding ? "text-white/80" : "text-muted-foreground"}`}>
            km/h
          </span>

          {speedLimit !== null && (
            <div className={`
              absolute -top-2.5 -right-2.5
              w-6 h-6 rounded-full border-2
              flex items-center justify-center
              text-[9px] font-black
              ${isSpeeding ? "bg-white border-red-400 text-red-500" : "bg-card border-border text-foreground"}
            `}>
              {speedLimit}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
