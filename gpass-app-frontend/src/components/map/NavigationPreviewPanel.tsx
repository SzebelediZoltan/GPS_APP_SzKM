import {
    Route,
    Clock,
    Map,
    ChevronDown,
    X,
    Check,
    Zap
} from "lucide-react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { useNavigation } from "@/context/NavigationContext"

type Props = {
    centerOnUser: () => void
}

export default function NavigationPreviewPanel({ centerOnUser }: Props) {

    const {
        mode,
        routes,
        selectedRouteIndex,
        selectRoute,
        startNavigation,
        cancelPreview
    } = useNavigation()

    const [open, setOpen] = useState(false)

    if (mode !== "preview" || routes.length === 0) return null

    const route = routes[selectedRouteIndex]

    const km = (route.distance / 1000).toFixed(1)
    const minutes = Math.round(route.duration / 60)

    const fastest = Math.min(...routes.map(r => r.duration))

    return (

        <div className="
            absolute bottom-6 left-1/2 -translate-x-1/2
            z-1000
            w-85
            animate-in fade-in slide-in-from-bottom-3 duration-200
            ">

            <Card
                className="
                    rounded-xl
                    border border-border
                    bg-card/95
                    backdrop-blur
                    shadow-xl
                    p-3
                    "
            >

                {/* HEADER */}

                <div className="flex items-center justify-between pb-1">

                    <div className="flex items-center gap-2">

                        <Route className="w-4 h-4 text-primary" />

                        <span className="text-sm font-semibold">
                            Útvonal előnézet
                        </span>

                    </div>

                    <button
                        onClick={() => {
                            cancelPreview()
                            centerOnUser()
                        }}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <X className="w-4 h-4" />
                    </button>

                </div>

                {/* ROUTE SUMMARY */}

                <div className="flex justify-between items-center text-sm">

                    <div className="flex items-center gap-2 text-sm">

                        <Map className="w-4 h-4 text-primary" />

                        <span className="font-medium">
                            {km} km
                        </span>

                    </div>

                    <div className="flex items-center gap-2 text-sm">

                        <Clock className="w-4 h-4 text-primary" />

                        <span className="font-medium">
                            {minutes} perc
                        </span>

                    </div>

                </div>

                {/* ROUTE SELECTOR */}

                <button
                    onClick={() => setOpen(!open)}
                    className="
                        w-full
                        flex items-center justify-between
                        rounded-lg
                        border border-border
                        px-3 py-1.5
                        text-sm
                        hover:bg-muted
                        transition
                        "
                >

                    <span>Alternatív útvonalak</span>

                    <ChevronDown
                        className={`w-4 h-4 transition ${open ? "rotate-180" : ""}`}
                    />

                </button>

                {/* ROUTE LIST */}

                {open && (

                    <div className="space-y-2">

                        {routes.map((r, index) => {

                            const km = (r.distance / 1000).toFixed(1)
                            const min = Math.round(r.duration / 60)

                            const isFastest = r.duration === fastest

                            return (

                                <Card
                                    key={index}
                                    onClick={() => selectRoute(index)}
                                    className={`
                                        cursor-pointer
                                        p-3 px-3
                                        border
                                        transition
                                        ${index === selectedRouteIndex
                                            ? "border-primary bg-accent"
                                            : "border-border hover:bg-muted"}
                                    `}
                                >

                                    <div className="flex items-center justify-between">

                                        <div className="flex items-center justify-between">

                                            <span className="font-medium mr-2">Útvonal {index + 1}</span>

                                            {isFastest && (
                                                <Badge variant="secondary" className="bg-primary text-foreground text-xs gap-1">

                                                    <Zap className="w-3 h-3" />

                                                    Leggyorsabb

                                                </Badge>
                                            )}

                                        </div>



                                    </div>

                                    <div className="flex gap-2">
                                        <div className="text-xs text-muted-foreground">
                                            {km} km
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {min} perc
                                        </div>
                                    </div>

                                </Card>

                            )

                        })}

                    </div>

                )}

                {/* ACTIONS */}

                <div className="flex gap-2">

                    <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                            cancelPreview()
                            centerOnUser()
                        }}
                    >
                        Mégse
                    </Button>

                    <Button
                        className="flex-1"
                        onClick={startNavigation}
                    >

                        <Check className="w-4 h-4 mr-2" />

                        Indulás

                    </Button>

                </div>

            </Card>

        </div>

    )
}