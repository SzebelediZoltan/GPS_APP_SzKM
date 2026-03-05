import { useMap, useMapEvents } from "react-leaflet"
import { LocateFixed, Compass } from "lucide-react"

type Props = {
    position: { lat: number; lng: number }
    heading: number | null
    headingLock: boolean
    onToggleHeadingLock: () => void
}

export default function LocateButton({ position, heading, headingLock, onToggleHeadingLock }: Props) {
    const map = useMap()

    // Ha a user nyúl a térképhez, heading lock kikapcsol
    useMapEvents({
        dragstart: () => {
            if (headingLock) onToggleHeadingLock()
        },
    })

    const handleLocate = () => {
        map.flyTo([position.lat, position.lng], 17, {
            duration: 0.8,
        })
    }

    const btnClass = `
        w-11 h-11
        rounded-xl
        bg-card
        text-foreground
        border border-border
        shadow-md
        flex items-center justify-center
        hover:bg-muted
        active:scale-95
        transition
        cursor-pointer
    `

    return (
        <div className="leaflet-top leaflet-right pointer-events-none">
            <div className="m-4 flex flex-col gap-2 pointer-events-auto">

                {/* Recenter gomb */}
                <button onClick={handleLocate} className={btnClass}>
                    <LocateFixed className="w-5 h-5 text-primary" />
                </button>

                {/* Heading lock gomb – csak ha van compass */}
                {heading !== null && (
                    <button
                        onClick={onToggleHeadingLock}
                        className={`${btnClass} ${headingLock
                            ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                            : ""
                        }`}
                    >
                        <Compass className={`w-5 h-5 ${headingLock ? "text-primary-foreground" : "text-primary"}`} />
                    </button>
                )}

            </div>
        </div>
    )
}
