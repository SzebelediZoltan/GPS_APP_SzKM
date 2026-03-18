import { useState, useEffect } from "react"

const MAP_SETTINGS_KEY = "gpass_map_settings"
const PRIVACY_SETTINGS_KEY = "gpass_privacy_settings"

export type MapSettings = {
  aiEnabled: boolean
  visibleUsers: "all" | "friends" | "clan" | "none"
  showSpeedLimit: boolean
  showMarkers: boolean
}

export type PrivacySettings = {
  shareLocation: boolean
}

const MAP_DEFAULTS: MapSettings = {
  aiEnabled: true,
  visibleUsers: "all",
  showSpeedLimit: true,
  showMarkers: true,
}

const PRIVACY_DEFAULTS: PrivacySettings = {
  shareLocation: true,
}

function load<T>(key: string, defaults: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return defaults
    return { ...defaults, ...JSON.parse(raw) }
  } catch {
    return defaults
  }
}

// Storage event-re frissít — ha settings oldalon változtatnak,
// a térkép oldalon is azonnal érvényes lesz
export function useMapSettings() {
  const [settings, setSettings] = useState<MapSettings>(() => load(MAP_SETTINGS_KEY, MAP_DEFAULTS))
  const [privacy, setPrivacy] = useState<PrivacySettings>(() => load(PRIVACY_SETTINGS_KEY, PRIVACY_DEFAULTS))

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === MAP_SETTINGS_KEY) {
        setSettings(load(MAP_SETTINGS_KEY, MAP_DEFAULTS))
      }
      if (e.key === PRIVACY_SETTINGS_KEY) {
        setPrivacy(load(PRIVACY_SETTINGS_KEY, PRIVACY_DEFAULTS))
      }
    }
    window.addEventListener("storage", handler)
    return () => window.removeEventListener("storage", handler)
  }, [])

  return { settings, privacy }
}
