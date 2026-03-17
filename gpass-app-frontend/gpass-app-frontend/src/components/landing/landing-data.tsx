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
  Sparkles
} from "lucide-react"

export type Feature = {
  icon: React.ReactNode
  title: string
  desc: string
  badge?: string
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
    title: "Valós idejű navigáció",
    desc: "Tiszta útvonal-előnézet, távolság és érkezési idő már induláskor.",
  },
  {
    icon: <RouteIcon className="h-5 w-5" />,
    title: "Alternatív útvonalak",
    desc: "Válassz gyors, kényelmes vagy biztonságosabb útvonalak között egy mozdulattal.",
  },
  {
    icon: <Sparkles className="h-5 w-5" />,
    title: "AI asszisztens",
    desc: "Kérdezd meg menetközben az útvonalról, forgalomról — az AI azonnal válaszol.",
  },
  {
    icon: <Users className="h-5 w-5" />,
    title: "Barátok a térképen",
    desc: "Nézd, merre jár a csapatod, és tervezzetek együtt valós időben.",
  },
  {
    icon: <MapPinned className="h-5 w-5" />,
    title: "Klánok és közös mozgás",
    desc: "Szervezzetek közös útvonalakat, és maradjatok egy térképen belül.",
  },
  {
    icon: <ShieldAlert className="h-5 w-5" />,
    title: "Globális markerek",
    desc: "Jelöld a rendőrt, útlezárást vagy veszélyt, hogy mások is időben lássák.",
  },
  {
    icon: <Smartphone className="h-5 w-5" />,
    title: "Mobilra tervezve",
    desc: "Ujjbarát kezelés, gyors panelnyitás és áttekinthető térképélmény.",
  },
]

export const DELIVERY: DeliveryItem[] = [
  {
    icon: <Flag className="h-4 w-4" />,
    title: "Közösségi veszélyjelzés",
    desc: "Egy pillanat alatt rakhatsz markert, amit mások is azonnal látnak a térképen.",
    state: "Popular",
  },
  {
    icon: <Copy className="h-4 w-4" />,
    title: "Trip másolás",
    desc: "Ments el egy utat, oszd meg, és bárki egy érintéssel követheti ugyanazt a nyomvonalat.",
    state: "New",
  },
  {
    icon: <Car className="h-4 w-4" />,
    title: "Klán konvoj mód",
    desc: "Tökéletes választás közös autózásra: egy csapat, egy cél, egy látképi rálátás.",
    state: "Hot",
  },
]
