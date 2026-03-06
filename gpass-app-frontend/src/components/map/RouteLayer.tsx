import { Polyline, useMap } from "react-leaflet"
import { useEffect, useRef } from "react"
import { useNavigation } from "@/context/NavigationContext"
import L from "leaflet"

export default function RouteLayer() {
    const { mode, routes, selectedRouteIndex, selectRoute } = useNavigation()
    const map = useMap()
    const prevMode = useRef(mode)

    // Preview megjelenésekor fitBounds
    useEffect(() => {
        if (mode === "preview" && routes.length > 0) {
            const activeRoute = routes[selectedRouteIndex] ?? routes[0]
            const bounds = L.latLngBounds(
                activeRoute.geometry.map(([lat, lng]) => L.latLng(lat, lng))
            )
            const isMobile = map.getSize().x < 768
            map.fitBounds(bounds, {
                paddingTopLeft: isMobile ? [20, 110] : [60, 60],
                paddingBottomRight: isMobile ? [20, 300] : [60, 60],
                animate: true,
                duration: 0.8,
            })
        }
    }, [mode, routes, selectedRouteIndex, map])

    // Preview → idle (kilépés): zoom vissza a userre
    // A MapView átadja a centerOnUser-t a NavigationPreviewPanel-nek,
    // de a RouteLayer is tudja érzékelni a mode változást és visszazoomolni
    useEffect(() => {
        if (prevMode.current === "preview" && mode === "idle") {
            // Kis delay hogy a cancel animáció ne ütközzön
            setTimeout(() => {
                map.flyTo(map.getCenter(), 15, { duration: 1.0 })
            }, 100)
        }
        prevMode.current = mode
    }, [mode, map])

    if (mode === "idle" || routes.length === 0) return null

    return (
        <>
            {routes.map((route, index) => {
                const positions = route.geometry.map(
                    ([lat, lng]) => L.latLng(lat, lng)
                )
                return (
                    <Polyline
                        key={index}
                        positions={positions}
                        eventHandlers={{ click: () => selectRoute(index) }}
                        pathOptions={{
                            color: index === selectedRouteIndex ? "#3b82f6" : "#64748b",
                            weight: index === selectedRouteIndex ? 6 : 4,
                            opacity: index === selectedRouteIndex ? 1 : 0.6,
                        }}
                    />
                )
            })}
        </>
    )
}
