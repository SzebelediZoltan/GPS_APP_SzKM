import { useMap, useMapEvents } from "react-leaflet"
import { useEffect, useRef } from "react"

type Props = {
  position: { lat: number; lng: number }
  heading: number | null
  headingLock: boolean
  onLockedInteraction: () => void
}

export default function MapController({ position, heading, headingLock, onLockedInteraction }: Props) {
  const map = useMap()
  const refs = useRef({ position, heading, headingLock, lastBearing: 0 })
  const toastShownRef = useRef(false)

  useEffect(() => { refs.current.position = position }, [position])
  useEffect(() => { refs.current.heading = heading }, [heading])
  useEffect(() => { refs.current.headingLock = headingLock }, [headingLock])

  // Drag/zoom letiltás lock esetén
  useEffect(() => {
    if (headingLock) {
      map.dragging.disable()
      map.touchZoom.disable()
      map.doubleClickZoom.disable()
      map.scrollWheelZoom.disable()
      map.keyboard.disable()
    } else {
      map.dragging.enable()
      map.touchZoom.enable()
      map.doubleClickZoom.enable()
      map.scrollWheelZoom.enable()
      map.keyboard.enable()
    }
  }, [headingLock, map])

  // Toast ha zárolt térképpel próbál interakcióba lépni
  // touchstart nem létezik a Leaflet típusokban, ezért natív listener
  useEffect(() => {
    const container = map.getContainer()
    const handleTouch = () => {
      if (!refs.current.headingLock || toastShownRef.current) return
      toastShownRef.current = true
      onLockedInteraction()
      setTimeout(() => { toastShownRef.current = false }, 3000)
    }
    container.addEventListener("touchstart", handleTouch, { passive: true })
    return () => container.removeEventListener("touchstart", handleTouch)
  }, [map, onLockedInteraction])

  useMapEvents({
    mousedown: () => {
      if (!refs.current.headingLock || toastShownRef.current) return
      toastShownRef.current = true
      onLockedInteraction()
      setTimeout(() => { toastShownRef.current = false }, 3000)
    },
  })

  // Bearing + pozíció követés animációs loop-ban lock esetén
  useEffect(() => {
    let rafId: number
    const tick = () => {
      const { headingLock, heading, position, lastBearing } = refs.current
      if (headingLock && heading !== null) {
        const diff = Math.abs(((heading - lastBearing) + 180) % 360 - 180)
        if (diff > 1) {
          map.setBearing(359 - heading)
          refs.current.lastBearing = heading
        }
        const center = map.getCenter()
        if (Math.abs(center.lat - position.lat) > 0.00005 || Math.abs(center.lng - position.lng) > 0.00005) {
          map.panTo([position.lat, position.lng], { animate: true, duration: 0.3 })
        }
      }
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [map])

  // Lock bekapcsolásakor flyTo zoom 16-ra, bearing beállítás a flyTo után
  useEffect(() => {
    if (!headingLock) {
      map.setBearing(0)
      refs.current.lastBearing = 0
      return
    }
    
    const targetZoom = Math.max(map.getZoom(), 16)
    map.setZoom(targetZoom)
    setTimeout(() => {
      if (refs.current.heading !== null) {
        map.setBearing(359 - refs.current.heading)
        refs.current.lastBearing = refs.current.heading
      }
    }, 200)
  }, [headingLock, map])

  return null
}
