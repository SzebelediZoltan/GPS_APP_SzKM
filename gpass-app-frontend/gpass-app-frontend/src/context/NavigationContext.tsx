import { createContext, useContext, useState, useRef } from "react"
import type { ReactNode } from "react"
import type { RouteStep } from "@/hooks/map/useRouting"

export type RouteData = {
  geometry: number[][]
  distance: number
  duration: number
  steps: RouteStep[]
}

type NavigationMode = "idle" | "preview" | "navigating"

type NavigationContextType = {
  mode: NavigationMode
  routes: RouteData[]
  selectedRouteIndex: number
  currentStepIndex: number
  setPreview: (routes: RouteData[]) => void
  selectRoute: (index: number) => void
  startNavigation: () => void
  cancelPreview: () => void
  stopNavigation: () => void
  advanceStep: () => void
  registerCenterOnUser: (fn: () => void) => void
}

const NavigationContext = createContext<NavigationContextType | null>(null)

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<NavigationMode>("idle")
  const [routes, setRoutes] = useState<RouteData[]>([])
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const centerOnUserRef = useRef<(() => void) | null>(null)

  const registerCenterOnUser = (fn: () => void) => {
    centerOnUserRef.current = fn
  }

  const flyToUser = () => setTimeout(() => centerOnUserRef.current?.(), 100)

  const setPreview = (routesData: RouteData[]) => {
    setRoutes(routesData)
    setSelectedRouteIndex(0)
    setCurrentStepIndex(0)
    setMode("preview")
  }

  const selectRoute = (index: number) => {
    setSelectedRouteIndex(index)
    setCurrentStepIndex(0)
  }

  const startNavigation = () => {
    setCurrentStepIndex(0)
    setMode("navigating")
    flyToUser()
  }

  const cancelPreview = () => {
    setRoutes([])
    setSelectedRouteIndex(0)
    setCurrentStepIndex(0)
    setMode("idle")
    flyToUser()
  }

  const stopNavigation = () => {
    setRoutes([])
    setSelectedRouteIndex(0)
    setCurrentStepIndex(0)
    setMode("idle")
    flyToUser()
  }

  const advanceStep = () => {
    const steps = routes[selectedRouteIndex]?.steps ?? []
    setCurrentStepIndex((prev) => Math.min(prev + 1, steps.length - 1))
  }

  return (
    <NavigationContext.Provider value={{
      mode, routes, selectedRouteIndex, currentStepIndex,
      setPreview, selectRoute, startNavigation, cancelPreview,
      stopNavigation, advanceStep, registerCenterOnUser,
    }}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const ctx = useContext(NavigationContext)
  if (!ctx) throw new Error("useNavigation must be used inside NavigationProvider")
  return ctx
}
