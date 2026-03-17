import type { ManeuverType, ManeuverModifier } from "@/hooks/map/useRouting"

export type ManeuverIconName =
  | "arrow-up" | "arrow-turn-right" | "arrow-turn-left"
  | "arrow-right" | "arrow-left" | "corner-down-right"
  | "corner-down-left" | "rotate-ccw" | "navigation"

export function getManeuverIcon(type: ManeuverType, modifier?: ManeuverModifier): ManeuverIconName {
  if (type === "arrive") return "navigation"
  if (type === "depart") return "navigation"
  if (["roundabout", "rotary", "exit roundabout", "exit rotary"].includes(type)) return "rotate-ccw"
  if (type === "fork") {
    if (modifier === "right" || modifier === "slight right") return "corner-down-right"
    if (modifier === "left" || modifier === "slight left") return "corner-down-left"
    return "arrow-up"
  }
  if (!modifier) return "arrow-up"
  switch (modifier) {
    case "straight":     return "arrow-up"
    case "slight right": return "corner-down-right"
    case "right":        return "arrow-turn-right"
    case "sharp right":  return "arrow-right"
    case "slight left":  return "corner-down-left"
    case "left":         return "arrow-turn-left"
    case "sharp left":   return "arrow-left"
    case "uturn":        return "rotate-ccw"
    default:             return "arrow-up"
  }
}

export function getManeuverLabel(type: ManeuverType, modifier?: ManeuverModifier): string {
  if (type === "arrive") return "Megérkeztél"
  if (type === "depart") return "Indulás"
  if (type === "roundabout" || type === "rotary") return "Körforgalom"
  if (type === "exit roundabout" || type === "exit rotary") return "Körforgalom elhagyása"
  if (type === "merge") return "Beolvadás"
  if (type === "on ramp") return "Ráhajtó"
  if (type === "off ramp") return "Lehajtó"
  if (type === "fork") {
    if (modifier === "right" || modifier === "slight right") return "Tartsd a jobbat"
    if (modifier === "left" || modifier === "slight left") return "Tartsd a balt"
    return "Egyenesen"
  }
  if (type === "end of road") {
    if (modifier === "right") return "Az út végén jobbra"
    if (modifier === "left") return "Az út végén balra"
  }
  switch (modifier) {
    case "straight":     return "Egyenesen"
    case "slight right": return "Kissé jobbra"
    case "right":        return "Jobbra"
    case "sharp right":  return "Élesen jobbra"
    case "slight left":  return "Kissé balra"
    case "left":         return "Balra"
    case "sharp left":   return "Élesen balra"
    case "uturn":        return "Fordulj vissza"
    default:             return "Folytatás"
  }
}

export function formatDistance(meters: number): string {
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`
  if (meters > 200) return `${Math.round(meters / 50) * 50} m`
  return `${Math.round(meters / 10) * 10} m`
}

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function getDistanceToRoute(
  position: { lat: number; lng: number },
  geometry: [number, number][]
): number {
  let minDist = Infinity
  for (const [lat, lng] of geometry) {
    const d = haversineDistance(position.lat, position.lng, lat, lng)
    if (d < minDist) minDist = d
  }
  return minDist
}
