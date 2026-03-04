import React from "react"
import {
  Navigation,
  Route as RouteIcon,
  Users,
  ShieldAlert,
  Smartphone,
  MapPinned,
  Flag,
  Copy,
  Car,
} from "lucide-react"

export type Feature = {
  icon: React.ReactNode
  title: string
  desc: string
}

export type DeliveryItem = {
  icon: React.ReactNode
  title: string
  desc: string
  state: "Popular" | "New" | "Hot"
}

export const FEATURES: Feature[] = [
  {
    icon: <Navigation className="h-5 w-5" />,
    title: "Valos ideju navigacio",
    desc: "Tiszta utvonalelonezet, tavolsag es erkezesi ido mar indulaskor.",
  },
  {
    icon: <RouteIcon className="h-5 w-5" />,
    title: "Alternativ utvonalak",
    desc: "Valassz gyors, kenyelmes vagy biztonsagosabb utvonalak kozott egy mozdulattal.",
  },
  {
    icon: <Smartphone className="h-5 w-5" />,
    title: "Mobilra tervezve",
    desc: "Ujjbarat kezeles, gyors panelnyitas es attekintheto terkepelmeny.",
  },
  {
    icon: <Users className="h-5 w-5" />,
    title: "Baratok a terkepen",
    desc: "Nezd, merre jar a csapatod, es tervezzetek egyutt valos idoben.",
  },
  {
    icon: <MapPinned className="h-5 w-5" />,
    title: "Klanok es kozos mozgas",
    desc: "Szervezzetek kozos utvonalakat, es maradjatok egy terkepen belul.",
  },
  {
    icon: <ShieldAlert className="h-5 w-5" />,
    title: "Globalis markerek",
    desc: "Jelold a rendort, utlezarast vagy veszelyt, hogy masok is idoben lassak.",
  },
]

export const DELIVERY: DeliveryItem[] = [
  {
    icon: <Flag className="h-4 w-4" />,
    title: "Kozossegi veszelyjelzes",
    desc: "Egy pillanat alatt rakhatsz markert, amit masok is azonnal latnak a terkepen.",
    state: "Popular",
  },
  {
    icon: <Copy className="h-4 w-4" />,
    title: "Trip masolas",
    desc: "Ments el egy utat, oszd meg, es barki egy erintessel kovetheti ugyanazt a nyomvonalat.",
    state: "New",
  },
  {
    icon: <Car className="h-4 w-4" />,
    title: "Klan konvoj mod",
    desc: "Tokeletes valasztas kozos autozasra: egy csapat, egy cel, egy latkep.",
    state: "Hot",
  },
]
