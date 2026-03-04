import { createContext, useContext, useState } from "react"
import type { ReactNode } from "react"

export type RouteData = {
  geometry: number[][]
  distance: number
  duration: number
}

type NavigationMode = "idle" | "preview" | "navigating"

type NavigationContextType = {
  mode: NavigationMode
  routes: RouteData[]
  selectedRouteIndex: number

  setPreview: (routes: RouteData[]) => void
  selectRoute: (index: number) => void
  startNavigation: () => void
  cancelPreview: () => void
  stopNavigation: () => void
}

const NavigationContext = createContext<NavigationContextType | null>(null)

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<NavigationMode>("idle")
  const [routes, setRoutes] = useState<RouteData[]>([])
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0)

  const setPreview = (routesData: RouteData[]) => {
    setRoutes(routesData)
    setSelectedRouteIndex(0)
    setMode("preview")
  }

  const selectRoute = (index: number) => {
    setSelectedRouteIndex(index)
  }

  const startNavigation = () => {
    setMode("navigating")
  }

  const cancelPreview = () => {
    setRoutes([])
    setSelectedRouteIndex(0)
    setMode("idle")
  }

  const stopNavigation = () => {
    setRoutes([])
    setSelectedRouteIndex(0)
    setMode("idle")
  }


  return (
    <NavigationContext.Provider
      value={{
        mode,
        routes,
        selectedRouteIndex,
        setPreview,
        selectRoute,
        startNavigation,
        cancelPreview,
        stopNavigation,
      }}
    >
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error("useNavigation must be used inside NavigationProvider")
  }
  return context
}