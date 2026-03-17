import { useEffect, useState } from "react"

type Position = {
  lat: number
  lng: number
}

export function useGeolocation() {
  const [position, setPosition] = useState<Position | null>(null)
  const [heading, setHeading] = useState<number | null>(null)
  const [speed, setSpeed] = useState<number | null>(null)   // m/s, GPS-ből
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
        setSpeed(pos.coords.speed)   // null ha nem elérhető
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
      const ios = (e as any).webkitCompassHeading
      if (typeof ios === "number" && !isNaN(ios)) {
        setHeading(ios)
        return
      }
      if (e.alpha !== null) {
        setHeading((360 - e.alpha) % 360)
      }
    }

    window.addEventListener("deviceorientationabsolute", handleOrientation as EventListener, true)
    window.addEventListener("deviceorientation", handleOrientation as EventListener, true)

    return () => {
      window.removeEventListener("deviceorientationabsolute", handleOrientation as EventListener, true)
      window.removeEventListener("deviceorientation", handleOrientation as EventListener, true)
    }
  }, [])

  return { position, heading, speed, error, loading }
}
