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
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        })
        // GPS heading (mozgás alapú – külső eszközön működik)
        if (pos.coords.heading !== null && !isNaN(pos.coords.heading)) {
          setHeading(pos.coords.heading)
        }
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      }
    )

    return () => {
      navigator.geolocation.clearWatch(watcher)
    }
  }, [])

  // DeviceOrientation API – kompasz alapú heading (mobilon pontosabb)
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      // iOS: webkitCompassHeading, Android: 360 - alpha
      const compassHeading =
        (e as any).webkitCompassHeading ??
        (e.alpha !== null ? (360 - e.alpha) % 360 : null)

      if (compassHeading !== null) {
        setHeading(compassHeading)
      }
    }

    // iOS 13+ requires permission
    const requestPermission = async () => {
      const DevOrEvent = DeviceOrientationEvent as any
      if (typeof DevOrEvent.requestPermission === "function") {
        try {
          const result = await DevOrEvent.requestPermission()
          if (result === "granted") {
            window.addEventListener("deviceorientationabsolute", handleOrientation as any, true)
            window.addEventListener("deviceorientation", handleOrientation as any, true)
          }
        } catch {
          // silently ignore – no compass available
        }
      } else {
        window.addEventListener("deviceorientationabsolute", handleOrientation as any, true)
        window.addEventListener("deviceorientation", handleOrientation as any, true)
      }
    }

    requestPermission()

    return () => {
      window.removeEventListener("deviceorientationabsolute", handleOrientation as any, true)
      window.removeEventListener("deviceorientation", handleOrientation as any, true)
    }
  }, [])

  return { position, heading, error, loading }
}
