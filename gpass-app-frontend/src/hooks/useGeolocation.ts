import { useEffect, useState } from "react"

type Position = {
  lat: number
  lng: number
}

export function useGeolocation() {
  const [position, setPosition] = useState<Position | null>(null)
  const [heading, setHeading] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("A böngésző nem támogatja a geolokációt.")
      setLoading(false)
      return
    }

    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    )

    return () => navigator.geolocation.clearWatch(watcher)
  }, [])

  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      // iOS: webkitCompassHeading már helyes észak-alapú fokszám (0-360, CW)
      // Android: alpha = 0 ha észak, de matematikai CCW → 360-alpha adja a CW irányt
      const ios = (e as any).webkitCompassHeading
      if (typeof ios === "number" && !isNaN(ios)) {
        setHeading(ios)
        return
      }
      if (e.alpha !== null) {
        // Android absolute orientation esetén is ez a helyes képlet
        setHeading((360 - e.alpha) % 360)
      }
    }

    const attach = () => {
      // deviceorientationabsolute pontosabb Androidon (gravitációtól független)
      window.addEventListener("deviceorientationabsolute", handleOrientation as EventListener, true)
      window.addEventListener("deviceorientation", handleOrientation as EventListener, true)
    }

    const DevOrEvent = DeviceOrientationEvent as any
    if (typeof DevOrEvent.requestPermission === "function") {
      // iOS 13+ – engedélyt csak user gesture-re lehet kérni,
      // ezt a MapView-ban a heading lock gomb megnyomásakor kell triggerelni
      // itt csak feliratkozunk ha már megvan
      attach()
    } else {
      attach()
    }

    return () => {
      window.removeEventListener("deviceorientationabsolute", handleOrientation as EventListener, true)
      window.removeEventListener("deviceorientation", handleOrientation as EventListener, true)
    }
  }, [])

  return { position, heading, error, loading }
}
