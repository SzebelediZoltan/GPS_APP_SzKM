import { Polyline, useMap } from "react-leaflet"
import { useEffect } from "react"
import { useNavigation } from "@/context/NavigationContext"
import L from "leaflet"

export default function RouteLayer() {
    const { mode, routes, selectedRouteIndex, selectRoute } = useNavigation()
    const map = useMap()

    useEffect(() => {
        if (mode === "preview" && routes.length > 0) {
            const activeRoute = routes[selectedRouteIndex] ?? routes[0]
            const bounds = L.latLngBounds(
                activeRoute.geometry.map(([lat, lng]) =>
                    L.latLng(lat, lng)
                )
            )

            const isMobile = map.getSize().x < 768

            map.fitBounds(bounds, {
                paddingTopLeft: isMobile ? [20, 110] : [60, 60],
                paddingBottomRight: isMobile ? [20, 300] : [60, 60],
            })
        }
    }, [mode, routes, selectedRouteIndex, map])

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
                        eventHandlers={{
                            click: () => selectRoute(index),
                        }}
                        pathOptions={{
                            color:
                                index === selectedRouteIndex
                                    ? "#3b82f6"
                                    : "#64748b",
                            weight:
                                index === selectedRouteIndex
                                    ? 6
                                    : 4,
                            opacity:
                                index === selectedRouteIndex
                                    ? 1
                                    : 0.6,
                        }}
                    />
                )
            })}
        </>
    )
}
