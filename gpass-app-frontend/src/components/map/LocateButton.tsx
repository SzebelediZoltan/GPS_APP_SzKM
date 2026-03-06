import { useMap } from "react-leaflet"
import { Compass, LocateFixed } from "lucide-react"

type Props = {
  position: { lat: number; lng: number }
  heading: number | null
  headingLock: boolean
  lockFlash: boolean
  onToggleHeadingLock: () => void
}

export default function LocateButton({ position, heading, headingLock, lockFlash, onToggleHeadingLock }: Props) {
  const map = useMap()

  const handleLocate = () => {
    map.flyTo([position.lat, position.lng], 17, { duration: 0.8 })
  }

  return (
    <div className="leaflet-top leaflet-right pointer-events-none">
      <div className="m-4 flex flex-col gap-2 pointer-events-auto">

        {/* Recenter gomb */}
        <button
          onClick={handleLocate}
          className="
            w-11 h-11 rounded-xl
            bg-card text-foreground
            border border-border shadow-md
            flex items-center justify-center
            hover:bg-muted active:scale-95 transition cursor-pointer
          "
        >
          <LocateFixed className="w-5 h-5 text-primary" />
        </button>

        {/* Heading lock gomb – csak ha van heading */}
        {heading !== null && (
          <button
            onClick={onToggleHeadingLock}
            className={`
              w-11 h-11 rounded-xl
              border shadow-md
              flex items-center justify-center
              active:scale-95 transition-all cursor-pointer
              ${lockFlash
                ? "bg-red-500/20 border-red-500 text-red-500 animate-pulse"
                : headingLock
                  ? "bg-primary border-primary text-primary-foreground"
                  : "bg-card border-border text-foreground hover:bg-muted"
              }
            `}
          >
            <Compass className="w-5 h-5" />
          </button>
        )}

      </div>
    </div>
  )
}
