import { useMap } from "react-leaflet"
import { LocateFixed } from "lucide-react"

type Props = {
    position: { lat: number; lng: number }
}

export default function LocateButton({ position }: Props) {
    const map = useMap()

    const handleClick = () => {
        map.flyTo([position.lat, position.lng], 17, {
            duration: 0.8,
        })
    }

    return (
        <div className="leaflet-top leaflet-right pointer-events-none">
            <div className="m-4 pointer-events-auto">
                <button
                    onClick={handleClick}
                    className="
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
                    "
                >
                    <LocateFixed className="w-5 h-5 text-primary" />
                </button>
            </div>
        </div>
    )
}