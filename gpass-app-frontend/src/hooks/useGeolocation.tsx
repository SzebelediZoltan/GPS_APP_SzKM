import { useEffect, useState } from "react"

type Position = {
  lat: number
  lng: number
}

export function useGeolocation() {
  const [position, setPosition] = useState<Position | null>(null)
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

  return { position, error, loading }
}