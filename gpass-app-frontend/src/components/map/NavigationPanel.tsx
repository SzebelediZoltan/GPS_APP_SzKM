import { useState } from "react"
import { MapPin, Route } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useNavigation } from "@/context/NavigationContext"
import { useRouting } from "@/hooks/useRouting"

type Props = {
    currentPosition: { lat: number; lng: number }
}

export default function NavigationPanel({ currentPosition }: Props) {
    const { mode, setPreview } = useNavigation()
    const { planRoute, loading } = useRouting()

    const [isOpen, setIsOpen] = useState(false)
    const [to, setTo] = useState("")

    if (mode !== "idle") return null

    const handlePlan = async () => {
        if (!to.trim()) return

        // Ideiglenes cél (később geokód)
        const destination = {
            lat: 47.4979,
            lng: 19.0402,
        }

        const routes = await planRoute(currentPosition, destination)

        if (routes.length > 0) {
            setPreview(routes)
            setIsOpen(false)
        }
    }

    return (
        <div className="absolute top-4 left-4 z-1000">

            {!isOpen && (
                <Button
                    onClick={() => setIsOpen(true)}
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
                    <Route className="w-4 h-4 text-primary" />
                </Button>
            )}

            {isOpen && (
                <div
                    className="
                        w-80
                        rounded-xl
                        border border-border
                        bg-background
                        shadow-xl
                        p-4
                        space-y-4
                        relative
                        animate-in
                        fade-in-0
                        zoom-in-95
                        duration-200
                        "
                >
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                        <Input
                            className="pl-9"
                            placeholder="Hova szeretnél menni?"
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                        />
                    </div>

                    <Button
                        onClick={handlePlan}
                        disabled={loading}
                        className="w-full"
                    >
                        {loading ? "Tervezés..." : "Tervezés"}
                    </Button>
                </div>
            )}
        </div>
    )
}