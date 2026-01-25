import React from "react"
import {
  Route as RouteIcon,
  Clock,
  ShieldCheck,
  Smartphone,
  MapPinned,
  Zap,
  ParkingCircle,
  CloudSun,
  Volume2,
  AlertTriangle,
  Fuel,
  Navigation,
} from "lucide-react"

export type Feature = {
  icon: React.ReactNode
  title: string
  desc: string
}

export type Plan = {
  name: string
  price: string
  highlight?: boolean
  items: string[]
}

export const FEATURES: Feature[] = [
  {
    icon: <Navigation className="h-5 w-5" />,
    title: "Valós idejű navigáció",
    desc: "Tiszta útmutatás, jól olvasható instrukciók – telefonon és gépen is.",
  },
  {
    icon: <RouteIcon className="h-5 w-5" />,
    title: "Alternatív útvonalak",
    desc: "Gyors, rövid vagy kényelmes: válassz a helyzethez illően.",
  },
  {
    icon: <Clock className="h-5 w-5" />,
    title: "ETA és érkezési idő",
    desc: "Megbízható becslések, hogy tudd, mikor érsz oda.",
  },
  {
    icon: <AlertTriangle className="h-5 w-5" />,
    title: "Forgalmi figyelmeztetések",
    desc: "Jelzések torlódásról, lezárásról és várható késésekről.",
  },
  {
    icon: <MapPinned className="h-5 w-5" />,
    title: "Kedvenc helyek",
    desc: "Mentsd el a gyakori úti célokat, és indíts 1 gombnyomással.",
  },
  {
    icon: <ParkingCircle className="h-5 w-5" />,
    title: "Parkolás megjegyzése",
    desc: "Emlékezz, hol hagytad az autót – gyors visszatalálás.",
  },
  {
    icon: <Volume2 className="h-5 w-5" />,
    title: "Hangutasítások",
    desc: "Kéz nélküli navigáció: a lényeg mindig hallható marad.",
  },
  {
    icon: <Fuel className="h-5 w-5" />,
    title: "Költségbecslés",
    desc: "Becsült fogyasztás és költség az útvonal alapján.",
  },
  {
    icon: <CloudSun className="h-5 w-5" />,
    title: "Időjárás jelzések",
    desc: "Egyszerű előrejelzés az út során – készülj fel előre.",
  },
  {
    icon: <Smartphone className="h-5 w-5" />,
    title: "Reszponzív élmény",
    desc: "Ujjbarát felület mobilon, tágas elrendezés desktopon.",
  },
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    title: "Stabil és átlátható",
    desc: "Modern UI, konzisztens komponensek, könnyen követhető felület.",
  },
  {
    icon: <Zap className="h-5 w-5" />,
    title: "Gyors és könnyű",
    desc: "Letisztult design, finom animáció-érzet és gyors visszajelzések.",
  },
]

export const PLANS: Plan[] = [
  {
    name: "Free",
    price: "0 Ft",
    items: ["Alap navigáció", "Kedvenc helyek", "ETA és értesítések"],
  },
  {
    name: "Pro",
    price: "1 990 Ft / hó",
    highlight: true,
    items: [
      "Haladó útvonal opciók",
      "Parkolás megjegyzése",
      "Költségbecslés",
      "Prioritás támogatás",
    ],
  },
  {
    name: "Team",
    price: "Egyedi",
    items: ["Csapat funkciók", "Megosztott helyek", "Admin felület", "SLA opciók"],
  },
]
