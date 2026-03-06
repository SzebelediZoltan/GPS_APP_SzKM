import {
  ArrowUp, ArrowRight, ArrowLeft,
  CornerDownRight, CornerDownLeft,
  RotateCcw, Navigation,
} from "lucide-react"
import type { ManeuverIconName } from "@/utils/routeUtils"

type Props = {
  name: ManeuverIconName
  className?: string
}

export default function ManeuverIcon({ name, className = "w-7 h-7" }: Props) {
  const props = { className }
  switch (name) {
    case "arrow-up":          return <ArrowUp {...props} />
    case "arrow-turn-right":  return <ArrowRight {...props} />
    case "arrow-turn-left":   return <ArrowLeft {...props} />
    case "arrow-right":       return <ArrowRight {...props} />
    case "arrow-left":        return <ArrowLeft {...props} />
    case "corner-down-right": return <CornerDownRight {...props} />
    case "corner-down-left":  return <CornerDownLeft {...props} />
    case "rotate-ccw":        return <RotateCcw {...props} />
    case "navigation":        return <Navigation {...props} />
    default:                  return <ArrowUp {...props} />
  }
}
